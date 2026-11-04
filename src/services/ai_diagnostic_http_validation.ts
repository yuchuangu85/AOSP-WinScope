import {TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AiPanelComponent} from '@app/ai_panel_component';
import {makeElapsedTimestamp} from '@common/time/testing/test_helpers';
import {TraceBuilder} from '@trace_api/testing/trace_builder';
import {TracePosition} from '@trace_api/trace_position';
import {TraceType} from '@trace_api/trace_type';
import {Traces} from '@trace_api/traces';

import {diagnosticPrompt} from './ai_diagnostic_prompts';
import { queryWinscopeTraceData, WinscopeTraceQuery, } from './winscope_trace_query';

describe('Diagnostic browser gateway integration', () => {
  it('delivers actual ranges, neighbors and IDs to the model without moving the manual position', async () => {
    await TestBed.configureTestingModule({imports: [AiPanelComponent, NoopAnimationsModule]}).compileComponents();
    const traces = new Traces();
    const timestamps = [1n, 2n, 3n].map((seconds) => makeElapsedTimestamp(seconds * 1_000_000_000n));
    const sf = new TraceBuilder().setType(TraceType.SURFACE_FLINGER)
      .setEntries([{layerId: '42', alpha: 0}, {layerId: '42', alpha: 1}, {layerId: '42', alpha: 0.5}])
      .setTimestamps(timestamps).build();
    traces.addTrace(sf);
    traces.addTrace(new TraceBuilder().setType(TraceType.WINDOW_MANAGER)
      .setEntries([{token: 'window-token', visible: false}, {token: 'window-token', visible: true}, {token: 'window-token', visible: true}])
      .setTimestamps(timestamps).build());
    traces.addTrace(new TraceBuilder().setType(TraceType.TRANSACTIONS)
      .setEntries([{transactionId: '1', flags: 0}, {transactionId: '2', flags: 2}, {transactionId: '3', flags: 0}])
      .setTimestamps(timestamps).build());
    traces.addTrace(new TraceBuilder().setType(TraceType.TRANSITION)
      .setEntries([{transitionId: '1', handler: 'shell'}, {transitionId: '2', aborted: false}, {transitionId: '3', finished: true}])
      .setTimestamps(timestamps).build());
    const position = TracePosition.fromTraceEntry(sf.getEntry(1));
    const fixture = TestBed.createComponent(AiPanelComponent);
    const component = fixture.componentInstance;
    const queries: WinscopeTraceQuery[] = [];
    component.endpoint = '/trace-query-fixture/';
    component.traceQuery = async (query) => {
      queries.push(query);
      const {time, endTime, ...options} = query;
      const timestamp = time ? makeElapsedTimestamp(1_000_000_000n) : position.timestamp;
      return queryWinscopeTraceData(traces, time ? TracePosition.fromTimestamp(timestamp) : position,
        time ? 'timestamp' : 'current', {...options,
          ...(endTime ? {endTimestamp: makeElapsedTimestamp(3_000_000_000n)} : {}), clock: {domain: 'ELAPSED'}});
    };
    try {
      fixture.detectChanges();
      for (let i = 0; i < 100 && component.loading; i++) await new Promise((resolve) => setTimeout(resolve, 20));
      expect(component.loading).toBeFalse();
      component.prompt = diagnosticPrompt('black-screen', 'en');
      await component.submit();
      expect(component.error).toBe('');
      expect(component.running).toBeFalse();
      expect(queries.length).toBe(3);
      expect(queries[1].endTime).toBe('3s');
      expect(queries[2].windowId).toBe('window-token');
      expect(component.turns[0].response).toContain('Actual interval, neighboring SF/WM, transaction and transition evidence received.');
      expect(position.entry?.getIndex()).toBe(1);
    } finally { fixture.destroy(); }
  }, 30000);
});
