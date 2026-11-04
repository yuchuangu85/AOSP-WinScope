/*
 * Copyright (C) 2022 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {ClipboardModule} from '@angular/cdk/clipboard';
import {CommonModule} from '@angular/common';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {Component, input, output, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {Title} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Mediator} from '@app/mediator';
import {AngularViewer} from '@app/shared/angular_viewer';
import {MatDrawer, MatDrawerContainer, MatDrawerContent,} from '@app/shared/bottomnav/bottom_drawer_component';
import {TimelineComponent} from '@app/shared/timeline/timeline_component';
import {CollectTracesComponent} from '@app/trace_collection/collect_traces_component';
import {WarningDialogComponent, WarningDialogResult} from '@app/trace_collection/warning_dialog_component';
import {WdpSetupComponent} from '@app/trace_collection/wdp_setup_component';
import {WinscopeProxySetupComponent} from '@app/trace_collection/winscope_proxy_setup_component';
import {UploadTracesComponent} from '@app/trace_loading/upload_traces_component';
import {assertDefined} from '@common/assert';
import {translate} from '@common/i18n';
import {waitToBeCalled} from '@common/spy_utils';
import {setPersistenceEnabledForTest} from '@common/store/persistent_store';
import {Store} from '@common/store/store';
import {DOMTestHelper} from '@common/testing/dom_test_helpers';
import {makeConverterNoRteOffsets, makeConverterZeroRteOffsets, makeElapsedTimestamp, makeRealTimestamp,} from '@common/time/testing/test_helpers';
import {Timestamp} from '@common/time/time';
import {TimestampConverter} from '@common/time/timestamp_converter';
import {UserTimestamp} from '@common/time/user_timestamp';
import {UTCOffset} from '@common/time/utc_offset';
import {RequestData} from '@cross_tool/g3_proxy';
import {TestFileReaderAndParserBuilder} from '@legacy_file_readers/testing/test_file_reader_and_parser_builder';
import {TestFileReaderBuilder} from '@legacy_file_readers/testing/test_file_reader_builder';
import {WinscopeEvent} from '@messaging/winscope_event';
import {EmitEvent} from '@messaging/winscope_event_emitter';
import {TraceGeometryData} from '@parsers/helpers/trace_geometry_data';
import {DesktopFiles} from '@services/desktop_files';
import {UserNotifier} from '@services/user_notifier';
import {FilesSource} from '@trace_api/files_source';
import {TraceBuilder} from '@trace_api/testing/trace_builder';
import {TracesBuilder} from '@trace_api/testing/traces_builder';
import {TracePositionUpdate, TraceSearchRequest} from '@trace_api/trace_events';
import {TraceFile} from '@trace_api/trace_file';
import {TracePosition} from '@trace_api/trace_position';
import {TraceType} from '@trace_api/trace_type';
import {Traces} from '@trace_api/traces';
import {AppRefreshDumpsRequest, AppResetRequest,} from '@ui/shared/events/app_events';
import {BookmarksChanged, BugreportFileSelected, BugreportFileSelectionRequest, DarkModeToggled,} from '@ui/shared/events/misc_events';
import {TabbedViewSwitchRequest} from '@ui/shared/events/tabbed_view_events';
import {ViewType} from '@ui/shared/viewers/viewer';
import {TimelineData} from '@ui/timeline/timeline_data';
import {LoadedFileData} from '@ui/trace_loading/loaded_file_data';
import {ParsingErrorType} from '@ui/trace_loading/parsing_error_type';
import {makeWarningFailedToInitializeTimelineData, makeWarningNoValidFiles,} from '@ui/trace_loading/warnings';
import {firstValueFrom} from 'rxjs';

import {AppComponent} from './app_component';
import {TraceViewComponent} from './trace_view_component';
import {ViewersLoaded, ViewersUnloaded} from './viewers_events';

@Component({
  selector: 'trace-view',
  template: '',
  standalone: true,
  providers: [
    {provide: TraceViewComponent, useExisting: MockTraceViewComponent},
  ],
})
class MockTraceViewComponent {
  viewers = input.required<AngularViewer[]>();
  store = input.required<Store>();
  traceTypesWithParsingErrors = input<TraceType[]>();
  setEmitEvent(_: EmitEvent) {}
  async onWinscopeEvent(_: WinscopeEvent) {}
}

@Component({
  selector: 'timeline',
  template: '',
  standalone: true,
  providers: [{provide: TimelineComponent, useExisting: MockTimelineComponent}],
})
class MockTimelineComponent {
  timelineData = input.required<TimelineData>();
  allTraces = input.required<Traces>();
  store = input.required<Store>();
  initialTabTraceType = input<TraceType>();
  bookmarks: Timestamp[] = [];
  setEmitEvent(_: EmitEvent) {}
  async onWinscopeEvent(_: WinscopeEvent) {}
}

@Component({
  selector: 'collect-traces',
  template: '',
  standalone: true,
  providers: [
    {provide: CollectTracesComponent, useExisting: MockCollectTracesComponent},
  ],
})
class MockCollectTracesComponent {
  store = input.required<Store>();
  setEmitEvent(_: EmitEvent) {}
  async onWinscopeEvent(_: WinscopeEvent) {}
}

@Component({
  selector: 'upload-traces',
  template:
    '<button class="download-btn" (click)="downloadTracesClick.emit()"></button>',
  standalone: true,
  providers: [
    {provide: UploadTracesComponent, useExisting: MockUploadTracesComponent},
  ],
})
class MockUploadTracesComponent {
  isLoadingFiles = false;
  viewersLoading = signal(false);
  storage = input.required<Store>();
  loadedFileReaders = input.required<FileReader[]>();
  downloadTracesClick = output<void>();
  removeTrace = output<FileReader>();
  removeAllTraces = output<void>();
  setEmitEvent(_: EmitEvent) {}
  async onWinscopeEvent(_: WinscopeEvent) {}
}
@Component({
  selector: 'mat-drawer',
  template: '<ng-content></ng-content>',
  providers: [{provide: MatDrawer, useExisting: MockMatDrawer}],
  standalone: true,
})
class MockMatDrawer {
  mode = input<'push' | 'overlay'>('overlay');
  baseHeight = input(0);
}

@Component({
  selector: 'mat-drawer-container',
  template: '<ng-content></ng-content>',
  providers: [
    {provide: MatDrawerContainer, useExisting: MockMatDrawerContainer},
  ],
  standalone: true,
})
class MockMatDrawerContainer {}

@Component({
  selector: 'mat-drawer-content',
  template: '<ng-content></ng-content>',
  standalone: true,
})
class MockMatDrawerContent {}

describe('AppComponent', () => {
  const reader = new TestFileReaderBuilder().setTimestamps([]).build();
  const converter = makeConverterZeroRteOffsets();

  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let downloadTracesSpy: jasmine.Spy;
  let dom: DOMTestHelper<AppComponent>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatToolbarModule,
        MatTooltipModule,
        MatMenuModule,
        MatListModule,
        MatTabsModule,
        MatSelectModule,
        MatSliderModule,
        MatCheckboxModule,
        ClipboardModule,
        MatSnackBarModule,
        WinscopeProxySetupComponent,
        WdpSetupComponent,
        AppComponent,
      ],
      providers: [Title, provideHttpClient(withInterceptorsFromDi())],
    })
      .overrideComponent(AppComponent, {
        remove: {
          imports: [
            MatDrawer,
            MatDrawerContainer,
            MatDrawerContent,
            TraceViewComponent,
            TimelineComponent,
            CollectTracesComponent,
            UploadTracesComponent,
          ],
        },
        add: {
          imports: [
            MockMatDrawer,
            MockMatDrawerContainer,
            MockMatDrawerContent,
            MockTraceViewComponent,
            MockTimelineComponent,
            MockCollectTracesComponent,
            MockUploadTracesComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    // Spy on prototype to capture all instances
    spyOn(LoadedFileData.prototype, 'getTraces').and.returnValue(new Traces());
    spyOn(LoadedFileData.prototype, 'getLoadedFileReaders').and.returnValue([]);
    spyOn(
      LoadedFileData.prototype,
      'getDownloadArchiveFilename',
    ).and.returnValue('winscope');
    spyOn(LoadedFileData.prototype, 'getLostPerfettoPackets').and.returnValue(
      0,
    );
    spyOn(
      LoadedFileData.prototype,
      'getTraceTypesWithParsingErrors',
    ).and.returnValue(new Map());
    spyOn(TimelineData.prototype, 'getTimestampConverter').and.returnValue(
      converter,
    );
    spyOn(TimelineData.prototype, 'hasTimestamps').and.returnValue(false);

    downloadTracesSpy = jasmine.createSpy('fromUrl');
    component.downloadRequest = (url: string, fileName: string) => {
      downloadTracesSpy(url, fileName);
    };
    dom = new DOMTestHelper(fixture, fixture.nativeElement);

    const dialog = fixture.debugElement.injector.get(MatDialog);
    spyOn(dialog, 'open').and.callThrough();
    matDialogSpy = dialog as jasmine.SpyObj<MatDialog>;

    await dom.detectChangesAndWaitStable();
  });

  it('can be created', () => {
    expect(component).toBeTruthy();
  });

  describe('desktop File menu', () => {
    let bridge: jasmine.SpyObj<DesktopFiles>;
    let upload: jasmine.Spy;
    const desktopWindow = window as Window & {winscopeFiles?: DesktopFiles};
    const batch = {token: 'native-selection', files: [{name: 'layers.trace', size: 3, lastModified: 123}]};

    beforeEach(() => {
      bridge = jasmine.createSpyObj('DesktopFiles', ['onOpen', 'readChunk', 'complete', 'remember']);
      bridge.readChunk.and.resolveTo(new Uint8Array([1, 2, 3]));
      desktopWindow.winscopeFiles = bridge;
      upload = spyOn(component.mediator, 'onWinscopeEvent').and.resolveTo();
    });

    afterEach(() => { delete desktopWindow.winscopeFiles; });

    function loadFiles(files: File[], archive = false): void {
      const traceFiles = files.map((file) => new TraceFile(archive ? new File([], 'extracted.trace') : file, archive ? file : undefined));
      (component.loadedFileData.getLoadedFileReaders as jasmine.Spy).and.returnValue(
        traceFiles.map((trace) => new TestFileReaderBuilder().setTimestamps([]).setTraceFile(trace).build()),
      );
    }

    it('records only successfully parsed local inputs, including their parent archives', async () => {
      const valid = new File([], 'traces.zip');
      const invalid = new File([], 'unsupported.txt');
      loadFiles([valid], true);
      await component.onFilesUploaded([valid, invalid]);
      expect(bridge.remember).toHaveBeenCalledOnceWith([valid]);
    });

    it('does not record failed or unsupported uploads', async () => {
      loadFiles([]);
      await component.onFilesUploaded([new File([], 'unsupported.txt')]);
      expect(bridge.remember).not.toHaveBeenCalled();
      upload.and.rejectWith(new Error('Parse failure'));
      await expectAsync(component.onFilesUploaded([new File([], 'bad.trace')])).toBeRejected();
      expect(bridge.remember).not.toHaveBeenCalled();
    });

    it('opens native files through the same parser and acknowledges only successful indexes', async () => {
      upload.and.callFake(async (event) => {
        const files = (event as unknown as {files: File[]}).files;
        loadFiles(files);
      });
      await component.openDesktopFiles(batch);
      expect(bridge.readChunk).toHaveBeenCalledOnceWith('native-selection', 0, 0);
      expect(upload).toHaveBeenCalledTimes(1);
      expect(bridge.complete).toHaveBeenCalledOnceWith('native-selection', [0]);
      expect(bridge.remember).not.toHaveBeenCalled();
    });

    it('does not reset the current trace when reading a missing or changed file fails', async () => {
      component.dataLoaded = true;
      const reset = spyOn(component, 'resetTraceData');
      bridge.readChunk.and.rejectWith(new Error('File moved'));
      const notify = spyOn(UserNotifier, 'add').and.callThrough();
      await component.openDesktopFiles(batch);
      expect(reset).not.toHaveBeenCalled();
      expect(upload).not.toHaveBeenCalled();
      expect(bridge.complete).toHaveBeenCalledOnceWith('native-selection', []);
      expect(notify).toHaveBeenCalled();
    });

    it('does not start a second open while a reset confirmation is active', async () => {
      component.confirmingTraceReset = true;
      await component.openDesktopFiles(batch);
      expect(bridge.readChunk).not.toHaveBeenCalled();
      expect(bridge.complete).toHaveBeenCalledOnceWith('native-selection', []);
    });
  });

  describe('AI timeline query API', () => {
    async function loadQueryTraces() {
      const trace = new TraceBuilder()
        .setType(TraceType.SURFACE_FLINGER)
        .setEntries([{layer: 'first', alpha: 0}, {layer: 'second', alpha: 1}, {layer: 'third', alpha: 0.5}])
        .setTimestamps([1n, 2n, 3n].map((seconds) => makeElapsedTimestamp(seconds * 1_000_000_000n)))
        .build();
      const traces = new Traces();
      traces.addTrace(trace);
      (component.loadedFileData.getTraces as jasmine.Spy).and.returnValue(traces);
      (component.timelineData.getTimestampConverter as jasmine.Spy).and.returnValue(makeConverterNoRteOffsets());
      (component.timelineData.hasTimestamps as jasmine.Spy).and.callThrough();
      component.timelineData = new TimelineData();
      await component.timelineData.initialize(traces, undefined, makeConverterNoRteOffsets());
      component.timelineData.setPosition(TracePosition.fromTraceEntry(trace.getEntry(1)));
      return {trace, traces};
    }

    it('reads the manual position afresh without moving the timeline', async () => {
      const {trace} = await loadQueryTraces();
      const position = component.timelineData.getCurrentPosition();
      const snapshot = await component.queryAiTraceData();
      expect(snapshot.mode).toBe('current');
      expect(snapshot.requestedTimestampNs).toBe('2000000000');
      expect(snapshot.entries[0].index).toBe(1);
      expect(JSON.stringify(snapshot.entries[0].data)).toContain('second');
      expect(component.timelineData.getCurrentPosition()).toBe(position);
      component.timelineData.setPosition(TracePosition.fromTraceEntry(trace.getEntry(2)));
      expect((await component.queryAiTraceData()).entries[0].index).toBe(2);
    });

    it('returns bounded neighboring entries, time range and clock metadata without moving the timeline', async () => {
      await loadQueryTraces();
      const position = component.timelineData.getCurrentPosition();
      const neighbors = await component.queryAiTraceData({before: 1, after: 1, traceTypes: ['SURFACE_FLINGER']});
      expect(neighbors.entries.map((entry) => entry.timestampNs).sort()).toEqual(['1000000000', '2000000000', '3000000000']);
      expect(JSON.stringify(neighbors)).toContain('ELAPSED');
      const range = await component.queryAiTraceData({time: '1s', endTime: '3s', limit: 2, traceTypes: ['SURFACE_FLINGER']});
      expect(range.entries.length).toBe(2);
      expect(range.entries.map((entry) => entry.timestampNs)).toEqual(['1000000000', '2000000000']);
      expect(component.timelineData.getCurrentPosition()).toBe(position);
    });

    it('rejects invalid range/filter options before querying local data', async () => {
      await loadQueryTraces();
      for (const query of [{time: '3s', endTime: '1s'}, {before: 3}, {time: '1s', endTime: '2s', after: 1}, {traceTypes: ['bad']}]) {
        await expectAsync(component.queryAiTraceData(query)).toBeRejected();
      }
    });

    it('includes WindowManager data aligned to the current or requested time without moving the viewer', async () => {
      const {traces} = await loadQueryTraces();
      traces.addTrace(new TraceBuilder().setType(TraceType.WINDOW_MANAGER)
        .setEntries([{focusedWindow: 'app.first'}, {focusedWindow: 'app.second'}])
        .setTimestamps([makeElapsedTimestamp(800_000_000n), makeElapsedTimestamp(1_800_000_000n)]).build());
      const position = component.timelineData.getCurrentPosition();
      for (const query of [{}, {time: '2s'}]) {
        const snapshot = await component.queryAiTraceData(query);
        const wm = snapshot.windowManager!;
        expect(wm.status).toBe('available');
        expect(wm.entries[0].requestedTimestampNs).toBe('2000000000');
        expect(wm.entries[0].timestampNs).toBe('1800000000');
        expect(wm.entries[0].deltaNs).toBe('-200000000');
        const data = snapshot.entries.find((entry) => entry.traceType === 'WINDOW_MANAGER')!.data;
        expect(JSON.stringify(data)).toContain('app.second');
      }
      expect(component.timelineData.getCurrentPosition()).toBe(position);
    });

    for (const time of ['1s500ms', '1500000000 ns', '1500000000']) {
      it(`queries ${time} with the same active-trace mapping without changing selection`, async () => {
        const {trace} = await loadQueryTraces();
        const position = component.timelineData.getCurrentPosition();
        const expected = component.timelineData.makePositionFromActiveTrace(makeElapsedTimestamp(1_500_000_000n));
        const snapshot = await component.queryAiTraceData({time});
        expect(snapshot.mode).toBe('timestamp');
        expect(snapshot.requestedTimestampNs).toBe('1500000000');
        expect(snapshot.entries[0].index).toBe(expected.entry!.getIndex());
        expect(snapshot.entries[0].timestampNs).toBe(trace.getEntry(snapshot.entries[0].index).getTimestamp().getValueNs().toString());
        expect(component.timelineData.getCurrentPosition()).toBe(position);
      });
    }

    it('rejects missing traces, invalid times and out-of-range times without moving selection', async () => {
      await expectAsync(component.queryAiTraceData()).toBeRejectedWithError('No WinScope traces are loaded.');
      await loadQueryTraces();
      const position = component.timelineData.getCurrentPosition();
      for (const time of ['', 'yesterday', '-1ns', '10s', '0ns']) {
        await expectAsync(component.queryAiTraceData({time})).toBeRejected();
      }
      expect(component.timelineData.getCurrentPosition()).toBe(position);
    });

    it('accepts full timestamps, current-date shorthand and preserves absolute nanosecond precision', async () => {
      const timestamp = 1_793_621_012_123_456_789n;
      const realConverter = makeConverterZeroRteOffsets();
      const trace = new TraceBuilder().setType(TraceType.SURFACE_FLINGER)
        .setEntries([{alpha: 0}, {alpha: 1}])
        .setTimestamps([realConverter.makeTimestampFromRealNs(timestamp), realConverter.makeTimestampFromRealNs(timestamp + 2_000_000_000n)]).build();
      const traces = new Traces();
      traces.addTrace(trace);
      (component.loadedFileData.getTraces as jasmine.Spy).and.returnValue(traces);
      (component.timelineData.getTimestampConverter as jasmine.Spy).and.returnValue(realConverter);
      (component.timelineData.hasTimestamps as jasmine.Spy).and.callThrough();
      component.timelineData = new TimelineData();
      await component.timelineData.initialize(traces, undefined, realConverter);
      component.timelineData.setPosition(TracePosition.fromTraceEntry(trace.getEntry(0)));
      const exact = await component.queryAiTraceData({time: `${timestamp} ns`});
      expect(exact.requestedTimestampNs).toBe(timestamp.toString());
      const fullTime = new Date(Number(timestamp / 1_000_000_000n) * 1000)
        .toISOString().replace('.000Z', '.123456789Z');
      expect((await component.queryAiTraceData({time: fullTime})).requestedTimestampNs).toBe(timestamp.toString());
      const timeOnly = new UserTimestamp(fullTime).extractTime()!;
      expect((await component.queryAiTraceData({time: timeOnly})).requestedTimestampNs).toBe(timestamp.toString());
    });

    it('invalidates the panel query capability when loaded traces change', async () => {
      const {trace, traces} = await loadQueryTraces();
      component.dataLoaded = true;
      await component.openAiPanel();
      const query = component.aiTraceQuery!;
      expect((await query({})).entries[0].index).toBe(1);
      traces.deleteTrace(trace);
      await expectAsync(query({})).toBeRejectedWithError('The loaded traces have changed.');
    });

    it('converts elapsed strings through the real trace boot offset with exact bigint arithmetic', async () => {
      const offset = 1_793_621_000_000_000_000n;
      const realConverter = makeConverterZeroRteOffsets();
      // A distinct converter is needed because offsets are immutable once set.
      const bootConverter = new TimestampConverter(undefined, offset);
      const trace = new TraceBuilder().setType(TraceType.SURFACE_FLINGER)
        .setEntries([{alpha: 0}, {alpha: 1}])
        .setTimestamps([bootConverter.makeTimestampFromBootTimeNs(1_000_000_000n), bootConverter.makeTimestampFromBootTimeNs(3_000_000_000n)]).build();
      const traces = new Traces();
      traces.addTrace(trace);
      (component.loadedFileData.getTraces as jasmine.Spy).and.returnValue(traces);
      (component.timelineData.getTimestampConverter as jasmine.Spy).and.returnValue(bootConverter);
      (component.timelineData.hasTimestamps as jasmine.Spy).and.callThrough();
      component.timelineData = new TimelineData();
      await component.timelineData.initialize(traces, undefined, realConverter);
      const elapsed = await component.queryAiTraceData({time: '1s200ms1ns'});
      const numeric = await component.queryAiTraceData({time: '1200000001 ns'});
      expect(elapsed.requestedTimestampNs).toBe((offset + 1_200_000_001n).toString());
      expect(numeric.requestedTimestampNs).toBe(elapsed.requestedTimestampNs);
    });

    it('keeps explicit UTC range endpoints exact when the trace uses UTC+08:00', async () => {
      const start = BigInt(Date.parse('2026-11-04T20:00:00Z')) * 1_000_000n;
      const offset = new UTCOffset();
      offset.initialize(8n * 60n * 60n * 1_000_000_000n);
      const realConverter = new TimestampConverter();
      realConverter.setUTCOffset(offset);
      const trace = new TraceBuilder().setType(TraceType.WINDOW_MANAGER)
        .setEntries([{visible: true}, {visible: false}])
        .setTimestamps([realConverter.makeTimestampFromRealNs(start), realConverter.makeTimestampFromRealNs(start + 1_000_000_000n)]).build();
      const traces = new Traces();
      traces.addTrace(trace);
      (component.loadedFileData.getTraces as jasmine.Spy).and.returnValue(traces);
      (component.timelineData.getTimestampConverter as jasmine.Spy).and.returnValue(realConverter);
      (component.timelineData.hasTimestamps as jasmine.Spy).and.callThrough();
      component.timelineData = new TimelineData();
      await component.timelineData.initialize(traces, undefined, realConverter);
      const snapshot = await component.queryAiTraceData({time: '2026-11-04T20:00:00Z', endTime: '2026-11-04T20:00:01Z'});
      expect(snapshot.requestedTimestampNs).toBe(start.toString());
      expect(snapshot.entries.map((entry) => entry.timestampNs)).toEqual([start.toString(), (start + 1_000_000_000n).toString()]);
      const shorthand = await component.queryAiTraceData({time: '20:00:00Z', endTime: '20:00:01Z'});
      expect(shorthand.requestedTimestampNs).toBe(start.toString());
      expect(shorthand.entries.map((entry) => entry.timestampNs)).toEqual(snapshot.entries.map((entry) => entry.timestampNs));
    });
  });

  describe('display size preference', () => {
    let savedScale: string | null;
    let originalZoom: string;

    beforeEach(() => {
      fixture.destroy();
      savedScale = localStorage.getItem('display-scale');
      originalZoom = document.documentElement.style.getPropertyValue('zoom');
      localStorage.removeItem('display-scale');
    });

    afterEach(() => {
      fixture.destroy();
      setPersistenceEnabledForTest(true);
      if (savedScale === null) localStorage.removeItem('display-scale');
      else localStorage.setItem('display-scale', savedScale);
      if (originalZoom) document.documentElement.style.setProperty('zoom', originalZoom);
      else document.documentElement.style.removeProperty('zoom');
    });

    function createApp(): void {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
    }

    it('defaults to 100% and restores a saved display size', () => {
      createApp();
      expect(component.displayScale).toBe(100);
      expect(document.documentElement.style.getPropertyValue('zoom')).toBe('1');
      expect(localStorage.getItem('display-scale')).toBeNull();
      fixture.destroy();
      localStorage.setItem('display-scale', '120');
      createApp();
      expect(component.displayScale).toBe(120);
      expect(document.documentElement.style.getPropertyValue('zoom')).toBe('1.2');
    });

    it('immediately applies and persists size without modifying theme or AI selection', () => {
      createApp();
      const defaults = component.aiDefaults;
      const theme = component.themeMode;
      component.setDisplayScale(140);
      expect(component.displayScale).toBe(140);
      expect(document.documentElement.style.getPropertyValue('zoom')).toBe('1.4');
      expect(localStorage.getItem('display-scale')).toBe('140');
      expect(component.aiDefaults).toBe(defaults);
      expect(component.themeMode).toBe(theme);
      component.setDisplayScale(100);
      expect(document.documentElement.style.getPropertyValue('zoom')).toBe('1');
      expect(localStorage.getItem('display-scale')).toBe('100');
    });

    it('rejects unsupported runtime sizes and safely defaults invalid saved values', () => {
      localStorage.setItem('display-scale', 'invalid');
      createApp();
      expect(component.displayScale).toBe(100);
      for (const scale of [NaN, Infinity, 0, 79, 85, 141]) component.setDisplayScale(scale);
      expect(component.displayScale).toBe(100);
      expect(document.documentElement.style.getPropertyValue('zoom')).toBe('1');
      expect(localStorage.getItem('display-scale')).toBe('invalid');
    });

    it('ignores saved sizes and never persists choices in privacy mode', () => {
      localStorage.setItem('display-scale', '130');
      setPersistenceEnabledForTest(false);
      createApp();
      expect(component.displayScale).toBe(100);
      component.setDisplayScale(80);
      expect(component.displayScale).toBe(80);
      expect(document.documentElement.style.getPropertyValue('zoom')).toBe('0.8');
      expect(localStorage.getItem('display-scale')).toBe('130');
    });

    it('keeps the in-memory size if browser storage rejects the preference', () => {
      createApp();
      spyOn(component.persistentStore, 'add').and.throwError('Storage denied');
      expect(() => component.setDisplayScale(120)).not.toThrow();
      expect(component.displayScale).toBe(120);
      expect(document.documentElement.style.getPropertyValue('zoom')).toBe('1.2');
    });

    it('notifies layout consumers after scaling and cancels pending work on destroy', () => {
      const schedule = spyOn(window, 'requestAnimationFrame').and.returnValue(42);
      const cancel = spyOn(window, 'cancelAnimationFrame');
      const dispatch = spyOn(window, 'dispatchEvent').and.callThrough();
      createApp();
      component.setDisplayScale(120);
      expect(cancel).toHaveBeenCalledWith(42);
      schedule.calls.mostRecent().args[0](0);
      expect(dispatch).toHaveBeenCalledWith(jasmine.any(Event));
      expect(dispatch.calls.mostRecent().args[0].type).toBe('resize');
      component.setDisplayScale(80);
      fixture.destroy();
      expect(cancel.calls.count()).toBeGreaterThanOrEqual(2);
      expect(document.documentElement.style.getPropertyValue('zoom')).toBe(originalZoom);
    });
  });

  describe('theme preference', () => {
    let savedMode: string | null;
    let savedDark: string | null;
    let savedBodyDark: boolean;
    let systemDark: boolean;
    let media: MediaQueryList;

    beforeEach(() => {
      savedMode = localStorage.getItem('theme-mode');
      savedDark = localStorage.getItem('dark-mode');
      savedBodyDark = document.body.classList.contains('dark-mode');
      fixture.destroy();
      localStorage.removeItem('theme-mode');
      localStorage.removeItem('dark-mode');
      systemDark = false;
      media = new EventTarget() as MediaQueryList;
      Object.defineProperty(media, 'matches', {get: () => systemDark});
      spyOn(window, 'matchMedia').and.returnValue(media);
    });

    afterEach(() => {
      fixture.destroy();
      setPersistenceEnabledForTest(true);
      if (savedMode === null) localStorage.removeItem('theme-mode');
      else localStorage.setItem('theme-mode', savedMode);
      if (savedDark === null) localStorage.removeItem('dark-mode');
      else localStorage.setItem('dark-mode', savedDark);
      document.body.classList.toggle('dark-mode', savedBodyDark);
    });

    function createApp(): void {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
    }

    function changeSystem(dark: boolean): void {
      systemDark = dark;
      media.dispatchEvent(new MediaQueryListEvent('change', {matches: dark}));
    }

    it('defaults to system and follows live changes while keeping the preference', () => {
      createApp();
      expect(component.themeMode).toBe('system');
      expect(component.isDarkModeOn).toBeFalse();
      const notify = spyOn(component.mediator, 'onWinscopeEvent').and.resolveTo();
      changeSystem(true);
      expect(component.themeMode).toBe('system');
      expect(component.isDarkModeOn).toBeTrue();
      expect(document.body.classList.contains('dark-mode')).toBeTrue();
      expect(localStorage.getItem('theme-mode')).toBe('system');
      expect(localStorage.getItem('dark-mode')).toBe('true');
      expect(component.getLogoUrl()).toContain('logo_dark_mode.svg');
      expect(notify).toHaveBeenCalledWith(jasmine.any(DarkModeToggled));
      changeSystem(false);
      expect(component.isDarkModeOn).toBeFalse();
      expect(localStorage.getItem('theme-mode')).toBe('system');
      expect(localStorage.getItem('dark-mode')).toBe('false');
    });

    it('keeps fixed modes independent of system and resumes following immediately', async () => {
      createApp();
      await component.setThemeMode('dark');
      changeSystem(false);
      expect(component.isDarkModeOn).toBeTrue();
      expect(localStorage.getItem('theme-mode')).toBe('dark');
      await component.setThemeMode('light');
      changeSystem(true);
      expect(component.isDarkModeOn).toBeFalse();
      expect(localStorage.getItem('theme-mode')).toBe('light');
      await component.setThemeMode('system');
      expect(component.isDarkModeOn).toBeTrue();
      expect(localStorage.getItem('theme-mode')).toBe('system');
    });

    for (const [legacy, expected] of [['true', 'dark'], ['false', 'light']] as const) {
      it(`preserves legacy ${legacy} as fixed ${expected}`, () => {
        localStorage.setItem('dark-mode', legacy);
        systemDark = legacy !== 'true';
        createApp();
        expect(component.themeMode).toBe(expected);
        expect(component.isDarkModeOn).toBe(legacy === 'true');
        expect(localStorage.getItem('theme-mode')).toBe(expected);
      });
    }

    it('restores system mode even when the last resolved dark value is saved', () => {
      localStorage.setItem('theme-mode', 'system');
      localStorage.setItem('dark-mode', 'true');
      createApp();
      expect(component.themeMode).toBe('system');
      expect(component.isDarkModeOn).toBeFalse();
    });

    it('falls back safely for invalid saved values', () => {
      localStorage.setItem('theme-mode', 'unknown');
      localStorage.setItem('dark-mode', 'invalid');
      systemDark = true;
      createApp();
      expect(component.themeMode).toBe('system');
      expect(component.isDarkModeOn).toBeTrue();
    });

    it('ignores stored themes and never writes them in privacy mode', async () => {
      localStorage.setItem('theme-mode', 'dark');
      localStorage.setItem('dark-mode', 'true');
      setPersistenceEnabledForTest(false);
      createApp();
      expect(component.themeMode).toBe('system');
      expect(component.isDarkModeOn).toBeFalse();
      await component.setThemeMode('light');
      changeSystem(true);
      expect(component.isDarkModeOn).toBeFalse();
      expect(localStorage.getItem('theme-mode')).toBe('dark');
      expect(localStorage.getItem('dark-mode')).toBe('true');
    });

    it('removes the system listener on destroy', () => {
      const remove = spyOn(media, 'removeEventListener').and.callThrough();
      createApp();
      fixture.destroy();
      expect(remove).toHaveBeenCalledWith('change', jasmine.any(Function));
      changeSystem(true);
      expect(component.isDarkModeOn).toBeFalse();
    });
  });

  it('has the expected title', () => {
    expect(component.title).toBe('winscope');
  });

  it('shows permanent header items on homepage', () => {
    checkPermanentHeaderItems();
  });

  it('displays correct elements when no data loaded', () => {
    component.dataLoaded = false;
    component.showDataLoadedElements = false;
    dom.detectChanges();
    checkHomepage();
  });

  it('places the welcome message in the bottom homepage bar', () => {
    const content = dom.get('.landing-content').getHTMLElement();
    const bar = dom.get('.landing-status-bar').getHTMLElement();
    expect(content.lastElementChild).toBe(bar);
    expect(bar.querySelector('.welcome-info')?.textContent).toContain(
      'Welcome to Winscope',
    );
    expect(dom.findAll('.welcome-info').length).toBe(1);
  });

  it('displays correct elements when data loaded', async () => {
    await goToTraceView();
    checkTraceViewPage();

    spyOn(component, 'allTracesAreDumps').and.returnValue(true);
    dom.detectChanges();
    expect(dom.find('.refresh-dumps')).toBeTruthy();
  });

  it('returns to homepage on upload new button click', async () => {
    await goToTraceView();
    checkTraceViewPage();
    await dom.clickAndWaitStable('.upload-new');
    await dom.detectChangesAndWaitStable();
    checkHomepage();
  });

  describe('toolbar trace reset', () => {
    it('is always present, labeled, and disabled without trace data', async () => {
      const reset: HTMLButtonElement = fixture.nativeElement.querySelector('.reset-traces-button');
      expect(reset).not.toBeNull();
      expect(reset.disabled).toBeTrue();
      expect(reset.getAttribute('aria-label')).toBe(translate('Reset trace data'));
      expect(reset.querySelector('mat-icon')?.textContent?.trim()).toBe('restart_alt');
      const event = spyOn(component.mediator, 'onWinscopeEvent');
      await component.resetTraceData();
      expect(event).not.toHaveBeenCalled();
    });

    it('clears loaded viewers and returns to collection without clearing saved preferences', async () => {
      await goToTraceView();
      const oldFiles = component.loadedFileData;
      const destroy = spyOn(oldFiles, 'onDestroy').and.callThrough();
      const clear = spyOn(component.persistentStore, 'clear').and.callThrough();
      const savedPreferences = ['language', 'theme-mode', 'display-scale'].map(
        (key) => component.persistentStore.get(key),
      );
      const defaults = component.aiDefaults;
      component.viewers = [jasmine.createSpyObj<AngularViewer>('viewer', ['onDestroy'])];
      component.initialTimelineTabTraceType = TraceType.SURFACE_FLINGER;
      component.currentTimestamp = makeRealTimestamp(123n);
      component.collapsedTimelineHeight = 100;
      component.filenameFormControl.setValue('old-trace');
      component.isEditingFilename = true;
      component.aiEvidence = {trace: 'old evidence'};
      component.aiPanelOpen = true;
      component.settingsOpen = true;

      await component.resetTraceData();
      await dom.detectChangesAndWaitStable();
      checkHomepage();
      expect(destroy).toHaveBeenCalledOnceWith();
      expect(component.loadedFileData).not.toBe(oldFiles);
      expect(component.loadedFileData.getLoadedFileReaders()).toEqual([]);
      expect(component.viewers).toEqual([]);
      expect(component.initialTimelineTabTraceType).toBeUndefined();
      expect(component.currentTimestamp).toBeUndefined();
      expect(component.collapsedTimelineHeight).toBe(0);
      expect(component.filenameFormControl.value).toBe('winscope');
      expect(component.isEditingFilename).toBeFalse();
      expect(component.aiEvidence).toBeUndefined();
      expect(component.aiPanelOpen).toBeFalse();
      expect(component.settingsOpen).toBeFalse();
      expect(component.resettingTraces).toBeFalse();
      expect(component.traceResetDisabled).toBeTrue();
      expect(component.aiDefaults).toBe(defaults);
      expect(clear).toHaveBeenCalledOnceWith('treeView');
      expect(['language', 'theme-mode', 'display-scale'].map(
        (key) => component.persistentStore.get(key),
      )).toEqual(savedPreferences);
    });

    it('also clears files staged on the upload and collection page', async () => {
      const oldFiles = component.loadedFileData;
      (LoadedFileData.prototype.getLoadedFileReaders as jasmine.Spy).and.callFake(
        function(this: LoadedFileData) { return this === oldFiles ? [reader] : []; },
      );
      expect(component.dataLoaded).toBeFalse();
      component.confirmTraceReset = false;
      dom.detectChanges();
      expect(component.traceResetDisabled).toBeFalse();
      await dom.clickAndWaitStable('.reset-traces-button');
      await dom.detectChangesAndWaitStable();
      expect(component.loadedFileData).not.toBe(oldFiles);
      expect(component.loadedFileData.getLoadedFileReaders()).toEqual([]);
      expect(component.traceResetDisabled).toBeTrue();
      checkHomepage();
    });

    it('ignores duplicate clicks and stays disabled while exporting', async () => {
      await goToTraceView();
      let finish!: () => void;
      const event = spyOn(component.mediator, 'onWinscopeEvent').and.returnValue(
        new Promise<void>((resolve) => { finish = resolve; }),
      );
      component.downloadProgress = 50;
      await component.resetTraceData();
      expect(event).not.toHaveBeenCalled();
      component.downloadProgress = undefined;
      const pending = component.resetTraceData();
      expect(component.resettingTraces).toBeTrue();
      await component.resetTraceData();
      expect(event).toHaveBeenCalledOnceWith(new AppResetRequest());
      finish();
      await pending;
      expect(component.resettingTraces).toBeFalse();
    });

    it('reenables reset if cleanup reports a failure', async () => {
      await goToTraceView();
      spyOn(component.mediator, 'onWinscopeEvent').and.rejectWith(new Error('Reset failed'));
      await expectAsync(component.resetTraceData()).toBeRejectedWithError('Reset failed');
      expect(component.resettingTraces).toBeFalse();
      expect(component.traceResetDisabled).toBeFalse();
      expect(component.dataLoaded).toBeTrue();
    });
  });

  describe('trace reset confirmation', () => {
    let savedPreference: string | null;

    beforeEach(() => {
      savedPreference = localStorage.getItem('confirm-trace-reset');
      localStorage.removeItem('confirm-trace-reset');
      component.confirmTraceReset = true;
    });

    afterEach(() => {
      setPersistenceEnabledForTest(true);
      if (savedPreference === null) localStorage.removeItem('confirm-trace-reset');
      else localStorage.setItem('confirm-trace-reset', savedPreference);
    });

    function resetDialog(): MatDialogRef<WarningDialogComponent, WarningDialogResult> {
      return matDialogSpy.open.calls.mostRecent().returnValue as MatDialogRef<WarningDialogComponent, WarningDialogResult>;
    }

    it('asks before clearing data and configures Cancel as the initial focus', async () => {
      await goToTraceView();
      const files = component.loadedFileData;
      const reset = spyOn(component, 'resetTraceData').and.callThrough();
      const pending = component.requestTraceReset();
      await dom.whenStable();
      const dialog = resetDialog();
      await firstValueFrom(dialog.afterOpened(), {defaultValue: undefined});
      expect(dialog.componentInstance.data.title).toBe('Reset trace data?');
      expect(dialog.componentInstance.data.options).toEqual(['Do not ask again']);
      expect(dialog.disableClose).toBeFalse();
      expect(component.confirmingTraceReset).toBeTrue();
      expect(component.traceResetDisabled).toBeTrue();
      expect(component.loadedFileData).toBe(files);
      expect(component.dataLoaded).toBeTrue();
      expect(reset).not.toHaveBeenCalled();
      expect(matDialogSpy.open.calls.mostRecent().args[1]?.autoFocus)
        .toBe('.warning-action-buttons .not-last');
      dialog.close({closeActionText: 'Reset', selectedOptions: []});
      await pending;
      expect(reset).toHaveBeenCalledOnceWith();
      expect(component.dataLoaded).toBeFalse();
      expect(component.confirmTraceReset).toBeTrue();
      expect(localStorage.getItem('confirm-trace-reset')).toBeNull();
    });

    for (const action of ['Cancel', undefined]) {
      it(`preserves data and the preference when dismissed with ${action ?? 'Escape or backdrop'}`, async () => {
        await goToTraceView();
        const files = component.loadedFileData;
        const reset = spyOn(component, 'resetTraceData').and.callThrough();
        const pending = component.requestTraceReset();
        const dialog = resetDialog();
        dialog.componentInstance.updateSelectedOptions('Do not ask again');
        dialog.close(action ? {closeActionText: action, selectedOptions: ['Do not ask again']} : undefined);
        await pending;
        expect(reset).not.toHaveBeenCalled();
        expect(component.loadedFileData).toBe(files);
        expect(component.dataLoaded).toBeTrue();
        expect(component.confirmTraceReset).toBeTrue();
        expect(component.confirmingTraceReset).toBeFalse();
        expect(localStorage.getItem('confirm-trace-reset')).toBeNull();
      });
    }

    it('remembers Do not ask again only after a successful confirmed reset and then skips the dialog', async () => {
      await goToTraceView();
      const pending = component.requestTraceReset();
      resetDialog().close({closeActionText: 'Reset', selectedOptions: ['Do not ask again']});
      await pending;
      expect(component.confirmTraceReset).toBeFalse();
      expect(localStorage.getItem('confirm-trace-reset')).toBe('false');
      const dialogCount = matDialogSpy.open.calls.count();
      await goToTraceView();
      await component.requestTraceReset();
      expect(matDialogSpy.open.calls.count()).toBe(dialogCount);
      expect(component.dataLoaded).toBeFalse();
    });

    it('re-enables prompting from the General settings checkbox', async () => {
      component.setConfirmTraceReset(false);
      component.openApplicationSettings();
      await dom.detectChangesAndWaitStable();
      const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('.confirm-trace-reset input[type="checkbox"]');
      expect(checkbox.checked).toBeFalse();
      checkbox.click();
      await dom.detectChangesAndWaitStable();
      expect(component.confirmTraceReset).toBeTrue();
      expect(localStorage.getItem('confirm-trace-reset')).toBe('true');
      component.closeApplicationSettings();
      await goToTraceView();
      const pending = component.requestTraceReset();
      expect(matDialogSpy.open).toHaveBeenCalled();
      resetDialog().close({closeActionText: 'Cancel', selectedOptions: []});
      await pending;
      expect(component.dataLoaded).toBeTrue();
    });

    it('prevents duplicate confirmations and rechecks whether exporting started before approval', async () => {
      await goToTraceView();
      const pending = component.requestTraceReset();
      await component.requestTraceReset();
      expect(matDialogSpy.open).toHaveBeenCalledTimes(1);
      component.downloadProgress = 50;
      resetDialog().close({closeActionText: 'Reset', selectedOptions: ['Do not ask again']});
      await pending;
      expect(component.dataLoaded).toBeTrue();
      expect(component.confirmTraceReset).toBeTrue();
      expect(component.confirmingTraceReset).toBeFalse();
    });

    it('does not suppress future warnings when cleanup fails', async () => {
      await goToTraceView();
      spyOn(component.mediator, 'onWinscopeEvent').and.rejectWith(new Error('Reset failed'));
      const pending = component.requestTraceReset();
      const rejected = expectAsync(pending).toBeRejectedWithError('Reset failed');
      resetDialog().close({closeActionText: 'Reset', selectedOptions: ['Do not ask again']});
      await rejected;
      expect(component.confirmTraceReset).toBeTrue();
      expect(component.confirmingTraceReset).toBeFalse();
      expect(localStorage.getItem('confirm-trace-reset')).toBeNull();
    });

    it('cancels an outstanding confirmation when the trace workspace is replaced', async () => {
      await goToTraceView();
      const pending = component.requestTraceReset();
      await component.onWinscopeEvent(new ViewersUnloaded());
      await pending;
      expect(component.confirmingTraceReset).toBeFalse();
      expect(component.confirmTraceReset).toBeTrue();
      expect(localStorage.getItem('confirm-trace-reset')).toBeNull();
    });

    it('cancels an outstanding confirmation when the application is destroyed', async () => {
      await goToTraceView();
      const reset = spyOn(component, 'resetTraceData').and.callThrough();
      const pending = component.requestTraceReset();
      fixture.destroy();
      await pending;
      expect(reset).not.toHaveBeenCalled();
      expect(localStorage.getItem('confirm-trace-reset')).toBeNull();
    });

    it('restores false, defaults unsupported stored values to true, and never persists in privacy mode', async () => {
      for (const [value, expected] of [['false', false], ['true', true], ['invalid', true]] as const) {
        fixture.destroy();
        localStorage.setItem('confirm-trace-reset', value);
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        expect(component.confirmTraceReset).toBe(expected);
      }
      fixture.destroy();
      localStorage.setItem('confirm-trace-reset', 'false');
      setPersistenceEnabledForTest(false);
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      expect(component.confirmTraceReset).toBeTrue();
      component.setConfirmTraceReset(false);
      component.setConfirmTraceReset(true);
      expect(localStorage.getItem('confirm-trace-reset')).toBe('false');
    });

    it('keeps prompting if storage cannot be read and honors in-memory changes when saving fails', () => {
      fixture.destroy();
      spyOn(Storage.prototype, 'getItem').and.callFake((key: string) => {
        if (key === 'confirm-trace-reset') throw new Error('Storage denied');
        return null;
      });
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      expect(component.confirmTraceReset).toBeTrue();
      spyOn(component.persistentStore, 'add').and.throwError('Storage denied');
      expect(() => component.setConfirmTraceReset(false)).not.toThrow();
      expect(component.confirmTraceReset).toBeFalse();
    });
  });

  it('sends event on refresh dumps button click', async () => {
    spyOn(component, 'allTracesAreDumps').and.returnValue(true);
    await goToTraceView();
    checkTraceViewPage();

    const winscopeEventSpy = spyOn(
      Mediator.prototype,
      'onWinscopeEvent',
    ).and.callThrough();
    await dom.clickAndWaitStable('.refresh-dumps');
    expect(winscopeEventSpy).toHaveBeenCalledWith(new AppResetRequest());
    await dom.detectChangesAndWaitStable();
    checkHomepage();
    expect(winscopeEventSpy).toHaveBeenCalledWith(new AppRefreshDumpsRequest());
  });

  it('shows download progress bar', () => {
    showDataLoadedElements();
    expect(
      dom.find('.download-files-section mat-progress-bar'),
    ).toBeUndefined();

    component.onProgressUpdate('Progress update', 10);
    dom.detectChanges();
    expect(dom.find('.download-files-section mat-progress-bar')).toBeTruthy();

    component.onOperationFinished(true);
    dom.detectChanges();
    expect(
      dom.find('.download-files-section mat-progress-bar'),
    ).toBeUndefined();
  });

  it('downloads traces on download button click and shows download progress bar', async () => {
    showDataLoadedElements();
    clickDownloadTracesButton();
    expect(dom.find('.download-files-section mat-progress-bar')).toBeTruthy();
    await waitToBeCalled(downloadTracesSpy);
  });

  it('downloads traces after valid file name change', async () => {
    showDataLoadedElements();
    clickEditFilenameButton();
    updateFilenameInputAndDownloadTraces('Winscope2', true);
    await waitToBeCalled(downloadTracesSpy);
    expect(downloadTracesSpy).toHaveBeenCalledOnceWith(
      jasmine.any(String),
      'Winscope2.zip',
    );

    downloadTracesSpy.calls.reset();

    // check it works twice in a row
    clickEditFilenameButton();
    updateFilenameInputAndDownloadTraces('win_scope', true);
    await waitToBeCalled(downloadTracesSpy);
    expect(downloadTracesSpy).toHaveBeenCalledOnceWith(
      jasmine.any(String),
      'win_scope.zip',
    );
  });

  it('changes page title based on archive name', async () => {
    const pageTitle = TestBed.inject(Title);
    await component.onWinscopeEvent(new ViewersUnloaded());
    expect(pageTitle.getTitle()).toBe('Winscope');

    const traces = new Traces();
    component.timelineData.initialize(traces, undefined, converter);
    component.loadedFileData.getDownloadArchiveFilename = jasmine
      .createSpy()
      .and.returnValue('test_archive');
    await sendOnViewersLoadedEvent();
    expect(pageTitle.getTitle()).toBe('Winscope | test_archive');
  });

  it('handles ViewersUnloaded event', async () => {
    const loadedFileData = component.loadedFileData;
    const timelineData = component.timelineData;
    const mediator = component.mediator;
    const spy = spyOn(component.loadedFileData, 'onDestroy');

    await component.onWinscopeEvent(new ViewersUnloaded());
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.loadedFileData).not.toBe(loadedFileData);
    expect(component.timelineData).not.toBe(timelineData);
    expect(component.mediator).not.toBe(mediator);
  });

  it('handles removeTrace from upload traces component - files still remaining', () => {
    const loadedFileData = component.loadedFileData;
    (
      LoadedFileData.prototype.getLoadedFileReaders as jasmine.Spy
    ).and.returnValue([reader]);
    const removeReaderSpy = spyOn(loadedFileData, 'removeFileReader');
    const onDestroySpy = spyOn(loadedFileData, 'onDestroy');
    const mediatorSpy = spyOn(
      component.mediator,
      'setLoadedFileData',
    ).and.callThrough();

    component.uploadTracesComponent()?.removeTrace.emit(reader);
    dom.detectChanges();

    expect(removeReaderSpy).toHaveBeenCalledOnceWith(reader);
    expect(onDestroySpy).not.toHaveBeenCalled();
    expect(component.loadedFileData).toBe(loadedFileData);
    expect(mediatorSpy).not.toHaveBeenCalled();
  });

  it('handles removeTrace from upload traces component - all files removed', () => {
    (
      LoadedFileData.prototype.getLoadedFileReaders as jasmine.Spy
    ).and.returnValue([]);
    const loadedFileData = component.loadedFileData;
    const removeReaderSpy = spyOn(loadedFileData, 'removeFileReader');
    const onDestroySpy = spyOn(loadedFileData, 'onDestroy');
    const mediatorSpy = spyOn(
      component.mediator,
      'setLoadedFileData',
    ).and.callThrough();

    component.uploadTracesComponent()?.removeTrace.emit(reader);
    dom.detectChanges();

    expect(removeReaderSpy).toHaveBeenCalledOnceWith(reader);
    expect(onDestroySpy).toHaveBeenCalledTimes(1);
    expect(component.loadedFileData).not.toBe(loadedFileData);
    expect(mediatorSpy).toHaveBeenCalledOnceWith(component.loadedFileData);
  });

  it('handles removeAllTraces from upload traces component', () => {
    const loadedFileData = component.loadedFileData;
    const spyLoadedFileData = spyOn(loadedFileData, 'onDestroy');
    const spyMediator = spyOn(
      component.mediator,
      'setLoadedFileData',
    ).and.callThrough();

    component.uploadTracesComponent()?.removeAllTraces.emit();
    dom.detectChanges();
    expect(spyLoadedFileData).toHaveBeenCalledTimes(1);
    expect(component.loadedFileData).not.toBe(loadedFileData);
    expect(spyMediator).toHaveBeenCalledOnceWith(component.loadedFileData);
  });

  it('does not download traces if invalid file name chosen', () => {
    showDataLoadedElements();
    clickEditFilenameButton();
    updateFilenameInputAndDownloadTraces('w?n$cope', false);
    expect(downloadTracesSpy).not.toHaveBeenCalled();
  });

  it('behaves as expected when entering valid then invalid then valid file names', async () => {
    showDataLoadedElements();
    clickEditFilenameButton();
    updateFilenameInputAndDownloadTraces('Winscope2', true);
    await waitToBeCalled(downloadTracesSpy);
    expect(downloadTracesSpy).toHaveBeenCalledOnceWith(
      jasmine.any(String),
      'Winscope2.zip',
    );
    downloadTracesSpy.calls.reset();

    clickEditFilenameButton();
    updateFilenameInputAndDownloadTraces('w?n$cope', false);
    expect(downloadTracesSpy).not.toHaveBeenCalled();

    updateFilenameInputAndDownloadTraces('win.scope', true);
    await waitToBeCalled(downloadTracesSpy);
    expect(downloadTracesSpy).toHaveBeenCalledOnceWith(
      jasmine.any(String),
      'win.scope.zip',
    );
  });

  it('validates filename on enter key, escape key or focus out', () => {
    const spy = spyOn(component, 'trySubmitFilename');
    showDataLoadedElements();
    clickEditFilenameButton();
    const inputField = dom.get('.file-name-input-field');
    inputField.get('input').updateValue('valid_file_name');

    inputField.keydownEnter();
    expect(spy).toHaveBeenCalledTimes(1);

    inputField.keydownEsc();
    expect(spy).toHaveBeenCalledTimes(2);

    inputField.focusOut();
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('downloads traces from upload traces section', () => {
    (
      component.loadedFileData.getLoadedFileReaders as jasmine.Spy
    ).and.returnValue([reader]);
    dom.detectChanges();
    const downloadButtonClickSpy = spyOn(
      component,
      'onDownloadTracesButtonClick',
    );
    dom.findAndClick('upload-traces .download-btn');
    expect(downloadButtonClickSpy).toHaveBeenCalledOnceWith(
      component.uploadTracesComponent(),
    );
  });

  it('shows cross tool sync button', async () => {
    showDataLoadedElements();
    const fileDescriptor = dom.get('.file-descriptor');
    expect(fileDescriptor.find('.cross-tool-sync-button')).toBeUndefined();

    spyOn(
      component.crossToolProtocol,
      'isAllowedTimestampSync',
    ).and.returnValue(true);
    dom.detectChanges();
    const syncButton = fileDescriptor.get('.cross-tool-sync-button');
    await syncButton.checkTooltip('Cross Tool Sync OFF (Click to turn ON)');
    syncButton.checkClassName('mat-accent', true);
    syncButton.checkClassName('mat-primary', false);

    syncButton.click();
    await syncButton.checkTooltip('Cross Tool Sync ON (Click to turn OFF)');
    syncButton.checkClassName('mat-primary', true);
    syncButton.checkClassName('mat-accent', false);

    syncButton.click();
    await syncButton.checkTooltip('Cross Tool Sync OFF (Click to turn ON)');
    syncButton.checkClassName('mat-accent', true);
    syncButton.checkClassName('mat-primary', false);
  });

  it('shows warning icon for packet loss', async () => {
    showDataLoadedElements();
    const fileDescriptor = dom.get('.file-descriptor');
    fileDescriptor.checkClassName('file-warning', false);
    expect(fileDescriptor.find('.warning-icon')).toBeUndefined();

    const spy = component.loadedFileData.getLostPerfettoPackets as jasmine.Spy;
    spy.and.returnValue(1);
    dom.detectChanges();
    fileDescriptor.checkClassName('file-warning', true);
    const warningIcon = fileDescriptor.get('.warning-icon');
    await warningIcon.checkTooltip(
      '1 Perfetto packet lost during tracing - data may be incomplete',
    );

    spy.and.returnValue(4);
    dom.detectChanges();
    await warningIcon.checkTooltip(
      '4 Perfetto packets lost during tracing - data may be incomplete',
    );
  });

  it('shows warning icon for trace processor errors', async () => {
    showDataLoadedElements();
    const fileDescriptor = dom.get('.file-descriptor');
    fileDescriptor.checkClassName('file-warning', false);
    expect(fileDescriptor.find('.warning-icon')).toBeUndefined();

    const spy = component.loadedFileData
      .getTraceTypesWithParsingErrors as jasmine.Spy;
    spy.and.returnValue(
      new Map([[TraceType.PROTO_LOG, ParsingErrorType.DATA_INCOMPLETE]]),
    );
    dom.detectChanges();
    fileDescriptor.checkClassName('file-warning', true);
    const warningIcon = fileDescriptor.get('.warning-icon');
    await warningIcon.checkTooltip(
      'Trace processor errors occurred - data may be incomplete',
    );

    spy.and.returnValue(
      new Map([
        [TraceType.INPUT_METHOD_CLIENTS, ParsingErrorType.DATA_INCORRECT],
        [TraceType.PROTO_LOG, ParsingErrorType.DATA_INCOMPLETE],
      ]),
    );
    dom.detectChanges();
    await warningIcon.checkTooltip(
      'Trace processor errors occurred - data may be incorrect',
    );
  });

  it('shows combined warning message for incorrect data', async () => {
    showDataLoadedElements();
    const fileDescriptor = dom.get('.file-descriptor');
    fileDescriptor.checkClassName('file-warning', false);
    expect(fileDescriptor.find('.warning-icon')).toBeUndefined();

    const spy1 = component.loadedFileData
      .getTraceTypesWithParsingErrors as jasmine.Spy;
    spy1.and.returnValue(
      new Map([[TraceType.PROTO_LOG, ParsingErrorType.DATA_INCORRECT]]),
    );

    const spy2 = component.loadedFileData.getLostPerfettoPackets as jasmine.Spy;
    spy2.and.returnValue(1);

    dom.detectChanges();

    fileDescriptor.checkClassName('file-warning', true);
    const warningIcon = fileDescriptor.get('.warning-icon');
    await warningIcon.checkTooltip(
      '1 Perfetto packet lost during tracing and trace processor errors occurred - data may be incorrect',
    );
  });

  it('shows combined warning message for incomplete data', async () => {
    showDataLoadedElements();
    const fileDescriptor = dom.get('.file-descriptor');
    fileDescriptor.checkClassName('file-warning', false);
    expect(fileDescriptor.find('.warning-icon')).toBeUndefined();

    const spy1 = component.loadedFileData
      .getTraceTypesWithParsingErrors as jasmine.Spy;
    spy1.and.returnValue(
      new Map([[TraceType.PROTO_LOG, ParsingErrorType.DATA_INCOMPLETE]]),
    );

    const spy2 = component.loadedFileData.getLostPerfettoPackets as jasmine.Spy;
    spy2.and.returnValue(1);

    dom.detectChanges();

    fileDescriptor.checkClassName('file-warning', true);
    const warningIcon = fileDescriptor.get('.warning-icon');
    await warningIcon.checkTooltip(
      '1 Perfetto packet lost during tracing and trace processor errors occurred - data may be incomplete',
    );
  });

  it('opens shortcuts panel via dialog', () => {
    component.openShortcutsPanel();
    expect(matDialogSpy.open).toHaveBeenCalled();
  });

  it('sets snackbar opener to global user notifier', () => {
    expect(dom.findInDocument('snack-bar')).toBeUndefined();
    UserNotifier.add(makeWarningNoValidFiles());
    UserNotifier.notify();
    expect(dom.findInDocument('snack-bar')).toBeTruthy();
  });

  it('does not open new snackbar until existing snackbar has been dismissed', async () => {
    expect(dom.findInDocument('snack-bar')).toBeUndefined();
    const firstMessage = makeWarningNoValidFiles();
    UserNotifier.add(firstMessage);
    UserNotifier.notify();
    await dom.detectChangesAndRenderingDone();
    let snackbar = dom.getSnackBar();
    snackbar.checkText(firstMessage.message);

    const secondMessage = makeWarningFailedToInitializeTimelineData();
    UserNotifier.add(secondMessage);
    UserNotifier.notify();
    await dom.detectChangesAndRenderingDone();
    snackbar = dom.getSnackBar();
    snackbar.checkText(firstMessage.message);

    snackbar.findAndClick('.snack-bar-actions .close-button');

    // Wait for the second snackbar to appear
    // We cannot use dom.whenStable() because it waits for the snackbar duration timer (5s)
    for (let i = 0; i < 50; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      dom.detectChanges();
      if (
        document
          .querySelector('snack-bar')
          ?.textContent?.includes(secondMessage.message)
      ) {
        break;
      }
    }

    // The previous snackbar might still be animating out, or the new one animating in.
    snackbar = dom.getSnackBar();
    snackbar.checkText(secondMessage.message);
  });

  it('shows bugreport selection dialog', async () => {
    expect(dom.findInDocument('warning-dialog')).toBeUndefined();
    let eventHandled = false;
    component
      .onWinscopeEvent(new BugreportFileSelectionRequest(['f1', 'f2']))
      .then(() => {
        eventHandled = true;
      });
    await dom.whenStable();
    const dialog = dom.getInDocument('warning-dialog');
    expect(eventHandled).toBeFalse();

    dialog
      .get('.warning-message')
      .checkTextExact('Multiple Perfetto traces found. Select one to process:');

    const [option1, option2] = dialog.findAll(
      '.warning-action-boxes mat-checkbox',
    );
    option1.checkTextExact('f1');
    option2.checkTextExact('f2');
    option2.dispatchEvent(new Event('change'));
    await dom.whenStable();
    expect(eventHandled).toBeFalse();

    const mediatorSpy = spyOn(component.mediator, 'onWinscopeEvent');
    const actions = dialog.findAll('.warning-action-buttons button');
    expect(actions.length).toBe(1);
    actions[0].click();
    await dom.whenStable();
    expect(eventHandled).toBeTrue();
    expect(mediatorSpy).toHaveBeenCalledOnceWith(
      new BugreportFileSelected('f2'),
    );
    expect(dom.findInDocument('warning-dialog')).toBeUndefined();
  });

  it('previews and exports privacy-safe diagnostics', async () => {
    dom.findAndClick('.export-diagnostics');
    await dom.whenStable();

    const dialog = dom.getInDocument('warning-dialog');
    dialog.get('.warning-message').checkText(
      'Excludes trace bytes, filenames, paths, tokens, commands, device serials, and device identity.',
    );
    const actions = dialog.findAll('.warning-action-buttons button');
    actions.at(-1)?.click();
    await dom.whenStable();

    expect(downloadTracesSpy).toHaveBeenCalledTimes(1);
    expect(downloadTracesSpy.calls.mostRecent().args[1]).toEqual(
      'aosp-winscope-diagnostics.json',
    );
  });

  describe('settings button', () => {
    let isInsideWinscopeProxyFrameSpy: jasmine.Spy;
    let getReportedParentOriginSpy: jasmine.Spy;
    let isSupportedParentOriginSpy: jasmine.Spy;

    beforeEach(() => {
      isInsideWinscopeProxyFrameSpy = spyOn(
        component,
        'isInsideWinscopeProxyFrame',
      ).and.returnValue(false);
      getReportedParentOriginSpy = spyOn(
        component,
        'getReportedParentOrigin',
      ).and.returnValue(null);
      isSupportedParentOriginSpy = spyOn(
        component,
        'isSupportedReportedParentOrigin',
      ).and.returnValue(false);
    });

    it('opens independent settings from the toolbar without creating an AI panel', () => {
      const open = spyOn(component, 'openApplicationSettings').and.callThrough();
      dom.detectChanges();
      expect(dom.find('.toolbar .settings-button')).toBeTruthy();
      expect(dom.find('.toolbar select')).toBeUndefined();
      expect(dom.find('.language-selector')).toBeUndefined();
      dom.findAndClick('.settings-button');
      dom.detectChanges();
      expect(open).toHaveBeenCalledOnceWith();
      expect(component.aiPanelOpen).toBeFalse();
      expect(dom.find('ai-panel')).toBeUndefined();
      expect(dom.find('app-settings')).toBeTruthy();
      expect(dom.find('.settings-menu')).toBeTruthy();
      expect(dom.find('.interface-language-select')).toBeTruthy();
    });

    it('keeps only the selected provider when applying settings with old multi-provider defaults', () => {
      component.applyApplicationSettings({
        selection: {agentId: 'display-anomaly', providerId: 'claude', modelId: 'claude-selected', customModel: '', reasoningLevel: 'high'},
        providerSelections: {
          codex: {modelId: 'old-codex', customModel: '', reasoningLevel: 'low'},
          claude: {modelId: 'stale-claude', customModel: '', reasoningLevel: 'low'},
        },
      });
      expect(Object.keys(component.aiDefaults.providerSelections)).toEqual(['claude']);
      expect(component.aiDefaults.providerSelections['claude']).toEqual({modelId: 'claude-selected', customModel: '', reasoningLevel: 'high'});
    });

    it('opens AI settings beside an existing workspace and preserves the same draft on close', () => {
      component.aiPanelOpen = true;
      dom.detectChanges();
      const panel = assertDefined(component.aiPanelComponent());
      panel.prompt = 'Keep the current conversation draft';
      panel.selectedModel = 'current-model';
      component.openApplicationSettings('ai');
      dom.detectChanges();
      expect(component.settingsSelection.modelId).toBe('current-model');
      expect(component.aiPanelComponent()).toBe(panel);
      expect(panel.suspended).toBeTrue();
      expect(dom.find('ai-panel app-settings')).toBeUndefined();
      component.closeApplicationSettings();
      dom.detectChanges();
      expect(component.aiPanelComponent()).toBe(panel);
      expect(panel.suspended).toBeFalse();
      expect(panel.prompt).toBe('Keep the current conversation draft');
    });

    it('updates a pending settings snapshot after restoring the conversation', () => {
      component.aiPanelOpen = true;
      dom.detectChanges();
      const panel = assertDefined(component.aiPanelComponent());
      panel.loading = true;
      component.openApplicationSettings('ai');
      expect(component.waitingForAiSelection).toBeTrue();
      const selection = {...panel.modelSelection, modelId: 'restored-model'};
      component.onAiSelectionReady(selection);
      expect(component.settingsSelection).toEqual(selection);
      expect(component.waitingForAiSelection).toBeFalse();
      component.closeApplicationSettings();
      component.onAiSelectionReady({...selection, modelId: 'late-model'});
      expect(component.settingsSelection.modelId).toBe('restored-model');
    });

    it('is not shown if not in winscope proxy iframe', () => {
      isInsideWinscopeProxyFrameSpy.and.returnValue(false);
      dom.detectChanges();
      expect(dom.find('.iframe-settings')).toBeUndefined();
    });

    it('is shown if in winscope proxy iframe', () => {
      isInsideWinscopeProxyFrameSpy.and.returnValue(true);
      dom.detectChanges();
      expect(dom.find('.iframe-settings')).toBeTruthy();
    });

    it('sends message to parent on click', () => {
      const parentOrigin = 'https://allowed.origin';
      isInsideWinscopeProxyFrameSpy.and.returnValue(true);
      getReportedParentOriginSpy.and.returnValue(parentOrigin);
      isSupportedParentOriginSpy.and.returnValue(true);
      dom.detectChanges();
      const postMessageSpy: jasmine.Spy<
        (
          message: string,
          targetOrigin: string,
          transfer?: Transferable[],
        ) => void
      > = spyOn(window.parent, 'postMessage');
      dom.findAndClick('.iframe-settings');
      expect(postMessageSpy).toHaveBeenCalledOnceWith(
        JSON.stringify({action: 'openSettings'}),
        parentOrigin,
      );
    });
  });

  describe('share button', () => {
    let isInsideWinscopeProxyFrameSpy: jasmine.Spy;
    let getReportedParentOriginSpy: jasmine.Spy;
    let getReportedRequestSpy: jasmine.Spy;

    beforeEach(() => {
      isInsideWinscopeProxyFrameSpy = spyOn(
        component,
        'isInsideWinscopeProxyFrame',
      ).and.returnValue(false);
      getReportedParentOriginSpy = spyOn(
        component,
        'getReportedParentOrigin',
      ).and.returnValue(null);
      getReportedRequestSpy = spyOn(
        component,
        'getReportedRequest',
      ).and.returnValue(undefined);
    });

    it('is always shown', () => {
      dom.detectChanges();
      expect(dom.find('.share-btn')).toBeTruthy();
    });

    describe('when not in winscope proxy iframe', () => {
      beforeEach(() => {
        isInsideWinscopeProxyFrameSpy.and.returnValue(false);
        dom.detectChanges();
      });

      it('is disabled', () => {
        const shareButton = dom.get('.share-btn');
        shareButton.checkDisabled(true);
      });

      it('shows tooltip explaining why it is disabled', async () => {
        const shareButtonWrapper = dom.get('.share-btn-wrapper');
        await shareButtonWrapper.checkTooltip(
          'Share functionality is not available for the provided traces',
        );
      });
    });

    describe('when in winscope proxy iframe', () => {
      const parentOrigin = 'https://winscope.corp.google.com';
      const request: RequestData = {
        artifacts: [{name: 'artifact', invocationId: '123'}],
      };

      beforeEach(() => {
        isInsideWinscopeProxyFrameSpy.and.returnValue(true);
        getReportedParentOriginSpy.and.returnValue(parentOrigin);
        getReportedRequestSpy.and.returnValue(request);
        dom.detectChanges();
      });

      it('is enabled', () => {
        const shareButton = dom.get('.share-btn');
        shareButton.checkDisabled(false);
      });

      it('shows "Share" tooltip', async () => {
        const shareButton = dom.get('.share-btn');
        await shareButton.checkTooltip('Share');
      });

      it('generates correct share link and shows it in menu', async () => {
        component.updateShareLink();
        dom.detectChanges();

        const params = new URLSearchParams();
        params.set(
          'request',
          btoa(JSON.stringify({artifacts: request.artifacts})),
        );
        const expectedLink = `${parentOrigin}?${params.toString()}`;
        expect(component.generatedShareLink).toEqual(expectedLink);

        dom.findAndClick('.share-btn');
        await dom.whenStable();

        const shareInputElement = document.querySelector(
          '.share-link-field input',
        ) as HTMLInputElement;
        assertDefined(shareInputElement);
        expect(shareInputElement.value).toEqual(expectedLink);

        const copyButton = dom.getInDocument('.share-link-container button');
        copyButton.checkDisabled(false);
      });

      it('generates correct share link with no artifacts', async () => {
        const request: RequestData = {
          artifacts: [],
        };
        getReportedRequestSpy.and.returnValue(request);

        component.updateShareLink();
        dom.detectChanges();

        const params = new URLSearchParams();
        params.set('request', btoa(JSON.stringify({artifacts: []})));
        const expectedLink = `${parentOrigin}?${params.toString()}`;
        expect(component.generatedShareLink).toEqual(expectedLink);

        dom.findAndClick('.share-btn');
        await dom.whenStable();

        const shareInputElement = document.querySelector(
          '.share-link-field input',
        ) as HTMLInputElement;
        assertDefined(shareInputElement);
        expect(shareInputElement.value).toEqual(expectedLink);
      });

      it('generates correct share link when original request is undefined', async () => {
        getReportedRequestSpy.and.returnValue(undefined);

        component.updateShareLink();
        dom.detectChanges();

        const params = new URLSearchParams();
        params.set('request', btoa(JSON.stringify({artifacts: []})));
        const expectedLink = `${parentOrigin}?${params.toString()}`;
        expect(component.generatedShareLink).toEqual(expectedLink);

        dom.findAndClick('.share-btn');
        await dom.whenStable();

        const shareInputElement = document.querySelector(
          '.share-link-field input',
        ) as HTMLInputElement;
        assertDefined(shareInputElement);
        expect(shareInputElement.value).toEqual(expectedLink);
      });

      it('disables copy button when no link is generated', async () => {
        dom.findAndClick('.share-btn');
        await dom.whenStable();

        component.generatedShareLink = '';
        dom.detectChanges();

        const copyButton = dom.getInDocument('.share-link-container button');
        copyButton.checkDisabled(true);
      });
    });
  });

  describe('processRequestData', () => {
    let getReportedRequestSpy: jasmine.Spy;
    let onWinscopeEventSpy: jasmine.Spy;

    beforeEach(async () => {
      await buildTraces();
      component.dataLoaded = true;
      component.showDataLoadedElements = true;
      getReportedRequestSpy = spyOn(
        component,
        'getReportedRequest',
      ).and.returnValue(undefined);
      onWinscopeEventSpy = spyOn(
        component.mediator,
        'onWinscopeEvent',
      ).and.callThrough();
    });

    it('processes bookmarks', async () => {
      component.timelineData.initialize(new Traces(), undefined, converter);
      dom.detectChanges();
      const request: RequestData = {
        artifacts: [],
        bookmarks: ['10', '20'],
      };
      getReportedRequestSpy.and.returnValue(request);
      await sendOnViewersLoadedEvent();

      const bookmarksChangedEvent = onWinscopeEventSpy.calls
        .all()
        .find((call) => call.args[0] instanceof BookmarksChanged)
        ?.args[0] as BookmarksChanged;
      expect(bookmarksChangedEvent).toBeInstanceOf(BookmarksChanged);
      expect(bookmarksChangedEvent.bookmarks.length).toEqual(2);
      expect(bookmarksChangedEvent.bookmarks[0].getValueNs()).toEqual(10n);
      expect(bookmarksChangedEvent.bookmarks[1].getValueNs()).toEqual(20n);
      expect(component.timelineComponent()?.bookmarks.length).toEqual(2);
    });

    it('processes timestamp', async () => {
      const traces = new TracesBuilder()
        .setTimestamps(TraceType.SURFACE_FLINGER, [
          converter.makeTimestampFromNs(10n),
        ])
        .build();
      component.timelineData.initialize(traces, undefined, converter);
      dom.detectChanges();
      component.timelineData.trySetActiveTrace(
        assertDefined(traces.getTrace(TraceType.SURFACE_FLINGER)),
      );

      const request: RequestData = {
        artifacts: [],
        timestamp: '15',
      };
      getReportedRequestSpy.and.returnValue(request);

      await sendOnViewersLoadedEvent();

      const tracePositionUpdateEvent = onWinscopeEventSpy.calls
        .all()
        .find((call) => call.args[0] instanceof TracePositionUpdate)
        ?.args[0] as TracePositionUpdate;
      expect(tracePositionUpdateEvent).toBeInstanceOf(TracePositionUpdate);
      expect(tracePositionUpdateEvent.position.timestamp.getValueNs()).toEqual(
        15n,
      );
      expect(tracePositionUpdateEvent.updateTimeline).toBeTrue();
    });

    it('processes search queries', async () => {
      spyOn(component.loadedFileData, 'tryCreateSearchTrace').and.resolveTo(
        undefined,
      );
      spyOn(UserNotifier, 'add');
      component.timelineData.initialize(new Traces(), undefined, converter);
      dom.detectChanges();
      const request: RequestData = {
        artifacts: [],
        searchQueries: ['query1', 'query2'],
      };
      getReportedRequestSpy.and.returnValue(request);

      await sendOnViewersLoadedEvent();

      const searchRequests = onWinscopeEventSpy.calls
        .all()
        .filter((call) => call.args[0] instanceof TraceSearchRequest);
      expect(searchRequests.length).toEqual(2);
      expect(searchRequests[0].args[0].query).toEqual('query1');
      expect(searchRequests[1].args[0].query).toEqual('query2');
      expect(
        component.loadedFileData.tryCreateSearchTrace,
      ).toHaveBeenCalledTimes(2);
      expect(
        component.loadedFileData.tryCreateSearchTrace,
      ).toHaveBeenCalledWith('query1');
      expect(
        component.loadedFileData.tryCreateSearchTrace,
      ).toHaveBeenCalledWith('query2');
    });

    it('processes trace type to switch view', async () => {
      const traces = new TracesBuilder()
        .setEntries(TraceType.SURFACE_FLINGER, [])
        .build();
      const trace = assertDefined(traces.getTrace(TraceType.SURFACE_FLINGER));
      const spy = component.loadedFileData.getTraces as jasmine.Spy;
      spy.and.returnValue(traces);

      component.timelineData.initialize(traces, undefined, converter);
      dom.detectChanges();
      const request: RequestData = {
        artifacts: [],
        traceType: TraceType.SURFACE_FLINGER,
      };
      getReportedRequestSpy.and.returnValue(request);

      const mockViewer: AngularViewer = {
        getTraces: () => [trace],
        onWinscopeEvent: jasmine.createSpy(),
        setEmitEvent: jasmine.createSpy(),
        getTitle: () => 'Mock View',
        onDestroy: () => {},
        getViewType: () => ViewType.TRACE_TAB,
        setComponentRef: jasmine.createSpy(),
        onShow: () => {},
        onHide: () => {},
        getComponentType: jasmine.createSpy(),
      };

      await sendOnViewersLoadedEvent([mockViewer]);

      const switchRequest = onWinscopeEventSpy.calls
        .all()
        .find((call) => call.args[0] instanceof TabbedViewSwitchRequest)
        ?.args[0] as TabbedViewSwitchRequest;
      expect(switchRequest).toBeInstanceOf(TabbedViewSwitchRequest);
      expect(switchRequest.newActiveTrace.type).toEqual(
        TraceType.SURFACE_FLINGER,
      );
    });
  });

  async function goToTraceView() {
    await buildTraces();
    component.timelineData.initialize(new Traces(), undefined, converter);
    component.dataLoaded = true;
    showDataLoadedElements();
    dom.detectChanges();
  }

  function updateFilenameInputAndDownloadTraces(name: string, valid: boolean) {
    dom.findAndDispatchInput('.file-name-input-field', name);
    dom.findAndClick('.check-button');

    const saveButton = dom.get('.save-button');
    if (valid) {
      expect(dom.find('.download-file-info')).toBeTruthy();
      saveButton.checkDisabled(false);
      clickDownloadTracesButton();
    } else {
      expect(dom.find('.download-file-info')).toBeUndefined();
      saveButton.checkDisabled(true);
    }
  }

  function clickDownloadTracesButton() {
    dom.findAndClick('.save-button');
  }

  function clickEditFilenameButton() {
    dom.findAndClick('.edit-button');
  }

  function checkHomepage() {
    expect(dom.find('.landing-status-bar .welcome-info')).toBeTruthy();
    expect(dom.find('.collect-traces-card')).toBeTruthy();
    expect(dom.find('.upload-traces-card')).toBeTruthy();
    expect(dom.find('.viewers')).toBeUndefined();
    expect(dom.find('.upload-new')).toBeUndefined();
    expect(dom.find('timeline')).toBeUndefined();
    checkPermanentHeaderItems();
  }

  function checkTraceViewPage() {
    expect(dom.find('.landing-status-bar')).toBeUndefined();
    expect(dom.find('.welcome-info')).toBeUndefined();
    expect(dom.find('.save-button')).toBeTruthy();
    expect(dom.find('.collect-traces-card')).toBeUndefined();
    expect(dom.find('.upload-traces-card')).toBeUndefined();
    expect(dom.find('.viewers')).toBeTruthy();
    expect(dom.find('.upload-new')).toBeTruthy();
    expect(dom.find('timeline')).toBeTruthy();
    checkPermanentHeaderItems();
  }

  function checkPermanentHeaderItems() {
    expect(dom.find('.app-title')).toBeTruthy();
    expect(dom.find('.shortcuts')).toBeTruthy();
    expect(dom.find('.documentation')).toBeTruthy();
    expect(dom.find('.export-diagnostics')).toBeTruthy();
    expect(dom.find('.dark-mode')).toBeUndefined();
    expect(dom.find('.settings-button')).toBeTruthy();
    expect(dom.find('.reset-traces-button')).toBeTruthy();
  }

  function showDataLoadedElements() {
    component.showDataLoadedElements = true;
    dom.detectChanges();
  }

  async function sendOnViewersLoadedEvent(viewers: AngularViewer[] = []) {
    await buildTraces();
    await component.onWinscopeEvent(new ViewersLoaded(viewers));
  }

  async function buildTraces() {
    component.loadedFileData.addFiles(
      {
        legacy: [],
        nonPerfetto: [
          new TestFileReaderAndParserBuilder()
            .setTimestamps([makeRealTimestamp(1n)])
            .setType(TraceType.SCREEN_RECORDING)
            .build(),
        ],
        perfetto: [],
        lostPerfettoPackets: 0,
        traceTypesWithParsingErrors: new Map(),
        timezoneInfo: undefined,
        traceGeometryData: new TraceGeometryData(),
        warnings: [],
      },
      FilesSource.TEST,
    );
    await component.loadedFileData.buildTraces(false, undefined);
    await component.loadedFileData.buildTraces(false, undefined);
  }
});
