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

import {HttpRequestHeaderType, HttpResponse} from '@common/http_request';
import {getLogger} from '@compat/logging';
import {AdbConnectionType} from '@trace_collection/adb_connection_type';
import {AdbHostConnection} from '@trace_collection/adb_host_connection';
import {ConnectionState} from '@trace_collection/connection_state';

import {Endpoint} from './endpoint';
import {getFromProxy} from './utils';
import {WinscopeProxyDeviceConnection, WinscopeProxyDeviceConnectionResponse,} from './winscope_proxy_device_connection';

/**
 * A connection to the Winscope Proxy server.
 */
export class WinscopeProxyHostConnection extends AdbHostConnection<WinscopeProxyDeviceConnection> {
  readonly connectionType = AdbConnectionType.WINSCOPE_PROXY;

  private refreshDevicesWorker: number | undefined;
  private cancelDeviceRequest = false;

  protected override destroyHost() {
    this.cancelDeviceRequests();
  }

  override setSecurityToken(_: string) {
    // The launcher injects its session credential only on the private proxy hop.
    // Browser-provided credentials are intentionally ignored.
  }

  override cancelDeviceRequests() {
    this.cancelDeviceRequest = true;
    if (this.refreshDevicesWorker !== undefined) {
      window.clearInterval(this.refreshDevicesWorker);
      this.refreshDevicesWorker = undefined;
    }
  }

  override async requestDevices() {
    this.cancelDeviceRequest = false;
    await getFromProxy(
      Endpoint.DEVICES,
      this.makeSecurityTokenHeader(),
      (resp: HttpResponse) => this.onSuccessParseDevices(resp),
      (newState, errorText) => this.setState(newState, errorText),
    );
  }

  private async onSuccessParseDevices(resp: HttpResponse) {
    try {
      const devices: WinscopeProxyDeviceConnectionResponse[] = JSON.parse(
        resp.text,
      );
      const curDevs = new Map<string, WinscopeProxyDeviceConnectionResponse>(
        devices.map((d) => [d.id, d]),
      );
      this.devices = this.devices.filter((d) => curDevs.has(d.id));

      for (const [id, devJson] of curDevs.entries()) {
        const existingDevice = this.devices.find((d) => d.id === id);
        if (existingDevice !== undefined) {
          await existingDevice.updateProperties(devJson);
        } else {
          const newDevice = new WinscopeProxyDeviceConnection(
            id,
            this.listener,
            this.makeSecurityTokenHeader(),
          );
          await newDevice.updateProperties(devJson);
          this.devices.push(newDevice);
        }
      }
      this.listener.onDevicesChange(this.devices);
      if (
        this.refreshDevicesWorker === undefined &&
        !this.cancelDeviceRequest
      ) {
        this.refreshDevicesWorker = window.setInterval(
          () => this.requestDevices(),
          1000,
        );
      }
      this.setState(ConnectionState.IDLE);
    } catch (err) {
      getLogger('WinscopeProxyHostConnection').error(
        'Could not find devices',
        err,
      );
      this.setState(
        ConnectionState.ERROR,
        `Could not find devices. Received:\n${resp.text}`,
      );
    }
  }

  private makeSecurityTokenHeader(): HttpRequestHeaderType {
    return [['Winscope-Token', '']];
  }
}
