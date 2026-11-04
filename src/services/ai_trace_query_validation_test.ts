import {isAiTraceQuery} from './ai_trace_query_validation';

describe('AI trace query options', () => {
  it('accepts current, neighbors, ranges and bounded filters', () => {
    for (const query of [{}, {before: 0, after: 2, limit: 8},
      {time: '1s', endTime: '2s', traceTypes: ['TRANSACTIONS', 'TRANSITION']},
      {layerId: '9007199254740995', windowId: 'Window{a}', displayId: '0', traceTypes: ['WINDOW_MANAGER']}]) {
      expect(isAiTraceQuery(query)).withContext(JSON.stringify(query)).toBeTrue();
    }
  });

  it('rejects unbounded values, extra fields and incompatible combinations', () => {
    for (const query of [null, [], {start: '1s'}, {endTime: '2s'}, {time: '1s', endTime: '2s', before: 1},
      {before: -1}, {after: 3}, {before: 1.5}, {limit: 0}, {limit: 9}, {limit: '1'},
      {traceTypes: []}, {traceTypes: ['WINDOW_MANAGER', 'WINDOW_MANAGER']}, {traceTypes: ['unknown']},
      {layerId: ''}, {displayId: 'x\n'}, {windowId: 'x'.repeat(129)}]) {
      expect(isAiTraceQuery(query)).withContext(JSON.stringify(query)).toBeFalse();
    }
  });
});
