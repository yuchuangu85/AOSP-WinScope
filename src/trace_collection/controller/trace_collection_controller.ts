/*
 * Copyright (C) 2025 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {removeDirFromFileName} from '@common/io';
import {Timer} from '@common/time/timer';
import {getLogger, Logger} from '@compat/logging';
import {ProgressListener} from '@messaging/progress_listener';
import {UserNotifier} from '@services/user_notifier';
import {AdbConnectionType} from '@trace_collection/adb_connection_type';
import {AdbDeviceConnection} from '@trace_collection/adb_device_connection';
import {AdbHostConnection} from '@trace_collection/adb_host_connection';
import {ConnectionState} from '@trace_collection/connection_state';
import {ConnectionStateListener} from '@trace_collection/connection_state_listener';
import {MockAdbHostConnection} from '@trace_collection/mock/mock_adb_host_connection';
import {UiTraceTarget} from '@trace_collection/ui_trace_target';
import {UserRequest} from '@trace_collection/user_request';
import {makeWarningProxyTracingWarnings} from '@trace_collection/warnings';
import {WinscopeProxyHostConnection} from '@trace_collection/winscope_proxy/winscope_proxy_host_connection';

import {PerfettoSessionModerator} from './perfetto_session_moderator';
import {TracingSession} from './tracing_session';
import {UserRequestParser} from './user_request_parser';
import {WINSCOPE_BACKUP_DIR} from './winscope_backup_dir';

const PERFETTO_ONLY_TRACE_TARGETS = new Map<UiTraceTarget, string>([
  [UiTraceTarget.INPUT, 'android.input.inputevent'],
]);

export class TraceCollectionController {
  private activeTracingSessions: TracingSession[] = [];
  private host: AdbHostConnection;

  constructor(
    connectionType: string,
    private listener: ConnectionStateListener & ProgressListener,
    private readonly logger: Logger = getLogger('TraceCollectionController'),
  ) {
    if (connectionType === AdbConnectionType.MOCK) {
      this.host = new MockAdbHostConnection(listener);
    } else {
      this.host = new WinscopeProxyHostConnection(listener);
    }
  }

  getConnectionType(): AdbConnectionType {
    return this.host.connectionType;
  }

  async restartConnection(): Promise<void> {
    await this.host.restart();
  }

  setSecurityToken(token: string) {
    this.host.setSecurityToken(token);
  }

  getDevices(): AdbDeviceConnection[] {
    return this.host.getDevices();
  }

  cancelDeviceRequests() {
    this.host.cancelDeviceRequests();
  }

  async requestDevices() {
    this.host.requestDevices();
  }

  async updateAvailableTraces(device: AdbDeviceConnection) {
    await device.updateAvailableTraces();

    const perfettoModerator = new PerfettoSessionModerator(device, false);
    const available: UiTraceTarget[] = [];
    const unavailable: UiTraceTarget[] = [];
    for (const [target, dataSource] of PERFETTO_ONLY_TRACE_TARGETS) {
      const destination = (await perfettoModerator.isDataSourceAvailable(
        dataSource,
      ))
        ? available
        : unavailable;
      destination.push(target);
    }
    this.listener.onAvailableTracesChange(available, unavailable);
  }

  async onDestroy(device: AdbDeviceConnection) {
    for (const session of this.activeTracingSessions) {
      await session.onDestroy(device);
    }
    this.host.onDestroy();
  }

  async startTrace(
    device: AdbDeviceConnection,
    requestedTraces: UserRequest[],
  ): Promise<void> {
    const perfettoModerator = new PerfettoSessionModerator(device, false);
    const sessions = await this.getSessions(perfettoModerator, requestedTraces);
    this.activeTracingSessions = [];
    if (sessions.length === 0) {
      return;
    }
    await this.prepareDevice(device, perfettoModerator);
    for (const session of sessions) {
      await session.start(device);
      this.activeTracingSessions.push(session);
    }
    // TODO(b/330118129): identify source of additional start latency that affects some traces
    await new Timer(1000).sleepMs(); // 1s timeout ensures SR fully started
  }

  async endTrace(device: AdbDeviceConnection) {
    await this.stopActiveTraces(device);
    this.listener.onOperationFinished(true);
  }

  async endTraceAndFetch(
    device: AdbDeviceConnection,
    deleteAfterFetch = false,
  ): Promise<File[]> {
    try {
      await this.stopActiveTraces(device);
      await this.listener.onConnectionStateChange(
        ConnectionState.LOADING_DATA,
      );
      const files = await this.fetchLastSessionFiles(device);
      if (deleteAfterFetch && files.length > 0) {
        await this.tryDeleteRecoveryCaptureFiles(device);
      }
      this.listener.onOperationFinished(true);
      return files;
    } catch (error) {
      this.listener.onOperationFinished(false);
      throw error;
    }
  }

  private async stopActiveTraces(device: AdbDeviceConnection) {
    for (const [index, session] of this.activeTracingSessions.entries()) {
      await session.stop(device);
      this.listener.onProgressUpdate(
        'Ending trace...',
        (100 * index) / this.activeTracingSessions.length,
      );
    }
    await this.moveFiles(device, this.activeTracingSessions);
    this.activeTracingSessions = [];
  }

  async dumpState(
    device: AdbDeviceConnection,
    requestedDumps: UserRequest[],
  ): Promise<void> {
    const perfettoModerator = new PerfettoSessionModerator(device, true);
    const sessions = await this.getSessions(perfettoModerator, requestedDumps);
    if (sessions.length === 0) {
      return;
    }
    await this.prepareDevice(device, perfettoModerator);
    for (const [index, session] of sessions.entries()) {
      await session.dump(device);
      this.listener.onProgressUpdate(
        'Dumping state...',
        (100 * index) / this.activeTracingSessions.length,
      );
    }
    await this.moveFiles(device, sessions);
    this.listener.onOperationFinished(true);
  }

  async fetchLastSessionData(
    device: AdbDeviceConnection,
    deleteAfterFetch = false,
  ): Promise<File[]> {
    const files = await this.fetchLastSessionFiles(device);
    if (deleteAfterFetch && files.length > 0) {
      await this.tryDeleteRecoveryCaptureFiles(device);
    }
    this.listener.onOperationFinished(true);
    return files;
  }

  async deleteLastSessionData(device: AdbDeviceConnection): Promise<void> {
    try {
      await this.deleteRecoveryCaptureFiles(device);
      this.listener.onOperationFinished(true);
    } catch (error) {
      UserNotifier.add(
        makeWarningProxyTracingWarnings([
          'Recovery Capture could not be deleted. It may still remain on the device.',
        ]),
      ).notify();
      this.listener.onOperationFinished(false);
      throw error;
    }
  }

  private async fetchLastSessionFiles(
    device: AdbDeviceConnection,
  ): Promise<File[]> {
    const adbData: File[] = [];
    const paths = await device.findFiles(`${WINSCOPE_BACKUP_DIR}*`, []);
    for (const [index, filepath] of paths.entries()) {
      this.logger.debug(
        `Fetching Recovery Capture file ${index + 1} of ${paths.length}`,
      );
      const data = await device.pullFile(filepath);
      const filename = removeDirFromFileName(filepath);
      adbData.push(new File([data], filename));
      this.listener.onProgressUpdate(
        'Fetching files...',
        (100 * index) / paths.length,
      );
      this.logger.debug(
        `Fetched Recovery Capture file ${index + 1} of ${paths.length}`,
      );
    }
    return adbData;
  }

  private async deleteRecoveryCaptureFiles(device: AdbDeviceConnection) {
    const marker = 'WINSCOPE_RECOVERY_CAPTURE_DELETED';
    const output = await device.runShellCommand(
      `rm -rf ${WINSCOPE_BACKUP_DIR} && echo ${marker}`,
    );
    if (!output.includes(marker)) {
      throw new Error('Recovery Capture deletion was not confirmed');
    }
  }

  private async tryDeleteRecoveryCaptureFiles(device: AdbDeviceConnection) {
    try {
      await this.deleteRecoveryCaptureFiles(device);
    } catch {
      UserNotifier.add(
        makeWarningProxyTracingWarnings([
          'Privacy mode could not delete the Recovery Capture after transfer. It may still remain on the device.',
        ]),
      );
    }
  }

  private async getSessions(
    perfettoModerator: PerfettoSessionModerator,
    req: UserRequest[],
  ): Promise<TracingSession[]> {
    const sessions = await new UserRequestParser()
      .setPerfettoModerator(perfettoModerator)
      .setRequests(req)
      .parse();

    if (sessions.length === 0) {
      UserNotifier.add(
        makeWarningProxyTracingWarnings([
          'None of the requested targets are available on this device.',
        ]),
      ).notify();
      await this.host.restart();
      return [];
    }
    return sessions;
  }

  private async prepareDevice(
    device: AdbDeviceConnection,
    perfettoModerator: PerfettoSessionModerator,
  ) {
    await perfettoModerator.tryStopCurrentPerfettoSession();
    await perfettoModerator.clearPreviousConfigFiles();
    this.logger.trace('Clearing previous tracing session files from device');
    await device.runShellCommand(`rm -rf ${WINSCOPE_BACKUP_DIR}`);
    this.logger.trace('Cleared previous tracing session files from device');
    await device.runShellCommand(`mkdir ${WINSCOPE_BACKUP_DIR}`);
    this.logger.trace('Created new backup directory on device');
  }

  private async moveFiles(
    device: AdbDeviceConnection,
    sessions: TracingSession[],
  ) {
    for (const [index, session] of sessions.entries()) {
      await session.moveFiles(device);
      this.listener.onProgressUpdate(
        'Moving files...',
        (100 * index) / sessions.length,
      );
    }
  }
}
