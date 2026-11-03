import {setLanguage, translate} from '@common/i18n';

import {formatAnalysisDuration, formatConversationResponse, projectConversation,} from './ai_conversation';

describe('AI conversation projection', () => {
  afterEach(() => setLanguage('en'));

  it('keeps each completed turn duration when replaying a multi-turn conversation', () => {
    const turns = projectConversation([
      {type: 'analysis_started', data: {prompt: 'First'}},
      {type: 'analysis_completed', data: {durationMs: 1250, provider: {output: 'First answer'}}},
      {type: 'analysis_started', data: {prompt: 'Second'}},
      {type: 'analysis_completed', data: {durationMs: 65000, provider: {output: 'Second answer'}}},
    ]);
    expect(turns.map((turn) => turn.durationMs)).toEqual([1250, 65000]);
    expect(turns[0].response).toBe('First answer');
    expect(formatAnalysisDuration(1250, translate)).toBe('1.3 s');
    expect(formatAnalysisDuration(65000, translate)).toBe('1 min 5 s');
    setLanguage('zh-CN');
    expect(formatAnalysisDuration(1250, translate)).toBe('1.3 秒');
    expect(formatAnalysisDuration(3665000, translate)).toBe('1 小时 1 分 5 秒');
  });

  it('does not invent elapsed time for legacy or invalid completion events', () => {
    for (const durationMs of [undefined, -1, NaN, Infinity, '1200']) {
      const [turn] = projectConversation([
        {type: 'analysis_started'}, {type: 'analysis_completed', data: {durationMs}},
      ]);
      expect(turn.durationMs).toBeUndefined();
    }
  });

  it('localizes only owned missing-evidence reasons while preserving identical model text and unknown diagnostics', () => {
    const raw = 'WindowManager evidence is missing';
    const [turn] = projectConversation([
      {type: 'analysis_started', data: {prompt: 'Analyze'}},
      {type: 'analysis_completed', data: {
        provider: {output: raw}, skillResults: [{skillId: 'black-screen-diagnosis', result: {
          findings: [], complete: false, incompleteReasons: [raw, 'CustomWindow ID=123', 'WindowManager evidence is incomplete'],
        }}],
      }},
    ]);
    setLanguage('zh-CN');
    const translated = formatConversationResponse(turn, translate);
    expect(translated.startsWith(raw)).toBeTrue();
    expect(translated).toContain('缺少 WindowManager 跟踪证据; CustomWindow ID=123; WindowManager 跟踪证据不完整');
    expect(turn.response).toContain(raw);
    setLanguage('en');
    expect(formatConversationResponse(turn, translate)).toBe(turn.response);
  });

  it('projects localized trace query progress without rendering raw snapshot data', () => {
    const started = {type: 'analysis_started', data: {prompt: 'Analyze current time'}};
    const requested = {type: 'trace_query_requested', data: {queryId: 'q', query: {time: '1s'}}};
    const [reading] = projectConversation([started, requested]);
    expect(reading.activity).toBe('Reading trace data…');
    const [received] = projectConversation([started, requested, {type: 'trace_query_completed'}]);
    expect(received.activity).toBe('Trace data received');
    expect(received.response).toBe('');
    setLanguage('zh-CN');
    expect(translate(reading.activity)).toBe('正在读取跟踪数据…');
  });

  it('localizes owned deterministic response sections without translating identical provider output', () => {
    const providerOutput = 'No anomaly found in the available evidence.';
    const [turn] = projectConversation([
      {type: 'analysis_started', data: {prompt: 'test'}},
      {
        type: 'analysis_completed',
        data: {
          provider: {output: providerOutput},
          skillResults: [
            {
              skillId: 'Save',
              result: {
                findings: [],
                complete: true,
                incompleteReasons: ['Input <script>'],
              },
            },
          ],
        },
      },
    ]);
    const original = turn.response;
    setLanguage('zh-CN');
    const rendered = formatConversationResponse(turn, translate);
    expect(rendered.startsWith(providerOutput + '\n\n')).toBeTrue();
    expect(rendered).toContain('已观察到的证据 · Save');
    expect(rendered).toContain(translate(providerOutput));
    expect(translate(providerOutput)).not.toBe(providerOutput);
    expect(rendered).toContain('证据不完整：Input <script>');
    expect(turn.response).toBe(original);
    setLanguage('en');
    expect(formatConversationResponse(turn, translate)).toBe(original);
  });

  it('keeps explicit provider errors raw while localizing owned missing-message fallbacks', () => {
    const rawTurns = projectConversation([
      {type: 'analysis_started', data: {prompt: 'test'}},
      {type: 'error', message: 'Analysis failed.'},
    ]);
    const fallbackTurns = projectConversation([
      {type: 'analysis_started', data: {prompt: 'test'}},
      {type: 'error'},
    ]);
    setLanguage('zh-CN');
    expect(formatConversationResponse(rawTurns[0], translate)).toBe(
      'Analysis failed.',
    );
    expect(formatConversationResponse(fallbackTurns[0], translate)).toBe(
      '分析失败。',
    );
    expect(rawTurns[0].response).toBe('Analysis failed.');
    expect(fallbackTurns[0].response).toBe('Analysis failed.');
  });

  it('rebuilds multiple turns, cancellation and retry from the server log', () => {
    const turns = projectConversation([
      {
        id: 1,
        type: 'analysis_started',
        data: {prompt: 'First question', attachments: [{name: 'notes.txt'}]},
      },
      {id: 2, type: 'provider_started', data: {providerId: 'local'}},
      {
        id: 3,
        type: 'analysis_completed',
        data: {provider: {output: 'First answer'}},
      },
      {id: 4, type: 'analysis_started', data: {prompt: 'Follow-up'}},
      {id: 5, type: 'analysis_cancelled', message: 'Stopped by user'},
    ]);
    expect(turns.length).toBe(2);
    expect(turns[0].prompt).toBe('First question');
    expect(turns[0].attachments).toEqual(['notes.txt']);
    expect(turns[0].response).toBe('First answer');
    expect(turns[0].status).toBe('completed');
    expect(turns[1].id).toBe(4);
    expect(turns[1].status).toBe('cancelled');
  });

  it('keeps observed findings, incomplete evidence and safe frame links', () => {
    const [turn] = projectConversation([
      {id: 1, type: 'analysis_started', data: {prompt: 'Analyze'}},
      {
        id: 2,
        type: 'analysis_completed',
        data: {
          skillResults: [
            {
              skillId: 'black-screen',
              result: {
                findings: [
                  {
                    title: '<img onerror=alert(1)>',
                    reason: 'Low luminance',
                    frameIndexes: [-2, 3],
                  },
                ],
                incompleteReasons: ['Missing Fence'],
              },
            },
          ],
        },
      },
    ]);
    expect(turn.response).toContain('Observed evidence');
    expect(turn.response).toContain('Missing Fence');
    expect(turn.links[0].frameIndex).toBe(3);
  });

  it('ignores malformed/orphan activity and retains explicit failure', () => {
    const turns = projectConversation([
      {type: 'provider_started'},
      {type: 'analysis_started', data: null},
      {type: 'error', message: 'Provider unavailable'},
    ]);
    expect(turns.length).toBe(1);
    expect(turns[0].status).toBe('failed');
    expect(turns[0].response).toBe('Provider unavailable');
  });
});
