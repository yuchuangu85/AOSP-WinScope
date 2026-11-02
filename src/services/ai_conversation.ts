import {AiEvent, AiFindingLink} from './ai_gateway_client';

export type AiResponsePart =
  | {kind: 'raw'; text: string}
  | {
      kind: 'localized';
      source: string;
      params?: Record<string, string | number>;
    };

export interface AiChatTurn {
  id: number;
  prompt: string;
  attachments: string[];
  response: string;
  /** Display-only projection; provider text is always a raw part. */
  responseParts?: AiResponsePart[];
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  activity: string;
  links: AiFindingLink[];
}

// The server event log is the only conversation source of truth. Replaying it
// projects the same transcript after a panel reopen or page refresh.
export function projectConversation(events: AiEvent[]): AiChatTurn[] {
  const turns: AiChatTurn[] = [];
  let turn: AiChatTurn | undefined;
  for (const [index, event] of events.entries()) {
    const data = isRecord(event.data) ? event.data : {};
    if (event.type === 'analysis_started') {
      turn = {
        id: event.id ?? index + 1,
        prompt:
          typeof data['prompt'] === 'string' ? data['prompt'] : 'Analysis',
        attachments: Array.isArray(data['attachments'])
          ? data['attachments'].flatMap((item: unknown) =>
              isRecord(item) && typeof item['name'] === 'string'
                ? [item['name']]
                : [],
            )
          : [],
        response: '',
        status: 'running',
        activity: 'Starting analysis…',
        links: [],
      };
      turns.push(turn);
    }
    if (!turn) continue;
    if (event.type === 'skill_started' || event.type === 'skill_completed') {
      turn.activity = `${event.type === 'skill_started' ? 'Running' : 'Completed'} skill: ${data['skillId'] ?? 'analysis'}`;
    }
    if (event.type === 'provider_started') {
      turn.activity = `Waiting for ${data['providerId'] ?? 'model'}…`;
    }
    if (event.type === 'analysis_completed') {
      turn.responseParts = responseParts(event.data);
      turn.response = formatConversationResponse(turn, interpolateEnglish);
      turn.links = findingLinks(event.data);
      turn.status = 'completed';
      turn.activity = 'Completed';
    }
    if (event.type === 'error' || event.type === 'analysis_cancelled') {
      turn.status = event.type === 'error' ? 'failed' : 'cancelled';
      turn.activity = turn.status === 'failed' ? 'Failed' : 'Stopped';
      turn.responseParts =
        event.message !== undefined
          ? [{kind: 'raw', text: event.message}]
          : [
              {
                kind: 'localized',
                source:
                  turn.status === 'failed'
                    ? 'Analysis failed.'
                    : 'Analysis stopped.',
              },
            ];
      turn.response = formatConversationResponse(turn, interpolateEnglish);
    }
  }
  return turns;
}

/** Localize only explicitly owned prose, never provider output or skill payloads. */
export function formatConversationResponse(
  turn: Pick<AiChatTurn, 'response' | 'responseParts'>,
  localize: (
    source: string,
    params?: Record<string, string | number>,
  ) => string,
): string {
  return turn.responseParts
    ? turn.responseParts
        .map((part) =>
          part.kind === 'raw' ? part.text : localize(part.source, part.params),
        )
        .join('\n\n')
    : turn.response;
}

function interpolateEnglish(
  source: string,
  params: Record<string, string | number> = {},
): string {
  return source.replace(/\{([a-zA-Z][\w]*)\}/g, (match, name: string) =>
    Object.hasOwn(params, name) ? String(params[name]) : match,
  );
}

function responseParts(value: unknown): AiResponsePart[] {
  if (!isRecord(value))
    {return [{kind: 'localized', source: 'Analysis completed.'}];}
  const sections: AiResponsePart[] = [];
  if (
    isRecord(value['provider']) &&
    typeof value['provider']['output'] === 'string'
  ) {
    sections.push({kind: 'raw', text: value['provider']['output']});
  }
  for (const result of skillResults(value)) {
    sections.push({
      kind: 'localized',
      source: 'Observed evidence · {skill}',
      params: {skill: result.skillId},
    });
    const findings = result.result['findings'];
    if (Array.isArray(findings)) {
      const facts = findings
        .filter(isRecord)
        .map(
          (finding) =>
            `${finding['title'] ?? 'Finding'}: ${finding['reason'] ?? ''}`,
        );
      sections.push(
        facts.length
          ? {kind: 'raw', text: facts.join('\n')}
          : {
              kind: 'localized',
              source:
                result.result['complete'] === false
                  ? 'No anomaly conclusion can be established from this incomplete evidence.'
                  : 'No anomaly found in the available evidence.',
            },
      );
    }
    const reasons = result.result['incompleteReasons'];
    if (Array.isArray(reasons) && reasons.length) {
      sections.push({
        kind: 'localized',
        source: 'Incomplete evidence: {reasons}',
        params: {reasons: reasons.join('; ')},
      });
    }
  }
  return sections.some((part) => part.kind === 'localized' || part.text.length > 0)
    ? sections
    : [
        {
          kind: 'localized',
          source: 'Analysis completed. Open the report for details.',
        },
      ];
}

function skillResults(
  value: Record<string, unknown>,
): Array<{skillId: string; result: Record<string, unknown>}> {
  if (!Array.isArray(value['skillResults'])) return [];
  return value['skillResults'].flatMap((item: unknown) =>
    isRecord(item) && isRecord(item['result'])
      ? [
          {
            skillId: String(item['skillId'] ?? 'analysis'),
            result: item['result'],
          },
        ]
      : [],
  );
}

function findingLinks(value: unknown): AiFindingLink[] {
  if (!isRecord(value)) return [];
  return skillResults(value).flatMap(({result}) => {
    if (!Array.isArray(result['findings'])) return [];
    return result['findings'].flatMap((finding: unknown) => {
      if (!isRecord(finding) || !Array.isArray(finding['frameIndexes'])) {
        return [];
      }
      const frame = finding['frameIndexes'].find(
        (index: unknown) =>
          typeof index === 'number' &&
          Number.isSafeInteger(index) &&
          index >= 0,
      );
      return typeof frame === 'number'
        ? [{title: String(finding['title'] ?? 'Finding'), frameIndex: frame}]
        : [];
    });
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
