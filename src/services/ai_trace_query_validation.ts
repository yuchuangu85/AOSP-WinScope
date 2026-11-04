import {WinscopeTraceQuery} from './winscope_trace_query';

export const AI_QUERY_TRACE_TYPES = [
  'SURFACE_FLINGER', 'WINDOW_MANAGER', 'TRANSACTIONS', 'TRANSITION',
  'WM_TRANSITION', 'SHELL_TRANSITION', 'SCREEN_RECORDING', 'SCREENSHOT',
  'VIEW_CAPTURE', 'PROTO_LOG',
] as const;

export function isAiTraceQuery(value: unknown): value is WinscopeTraceQuery {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const query = value as Record<string, unknown>;
  const fields = ['time', 'endTime', 'before', 'after', 'limit', 'traceTypes', 'layerId', 'windowId', 'displayId'];
  if (Object.keys(query).some((key) => !fields.includes(key))) return false;
  for (const key of ['time', 'endTime', 'layerId', 'windowId', 'displayId']) {
    if (key in query && (typeof query[key] !== 'string' || !query[key].trim() ||
      query[key].length > 128 || Array.from(query[key]).some((character) =>
        character.charCodeAt(0) < 32 || (character.charCodeAt(0) >= 127 && character.charCodeAt(0) <= 159)))) return false;
  }
  for (const key of ['before', 'after', 'limit']) {
    if (key in query && (!Number.isInteger(query[key]) || (query[key] as number) < (key === 'limit' ? 1 : 0) ||
      (query[key] as number) > (key === 'limit' ? 8 : 2))) return false;
  }
  if ('endTime' in query && (!('time' in query) || 'before' in query || 'after' in query)) return false;
  if ('traceTypes' in query && (!Array.isArray(query['traceTypes']) || !query['traceTypes'].length ||
    query['traceTypes'].length > AI_QUERY_TRACE_TYPES.length ||
    new Set(query['traceTypes']).size !== query['traceTypes'].length ||
    query['traceTypes'].some((type) => !AI_QUERY_TRACE_TYPES.includes(type)))) return false;
  return true;
}
