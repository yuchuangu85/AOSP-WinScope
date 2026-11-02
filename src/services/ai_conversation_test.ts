import {setLanguage, translate} from '@common/i18n';

import {formatConversationResponse, projectConversation,} from './ai_conversation';

describe('AI conversation projection', () => {
  afterEach(() => setLanguage('en'));

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
