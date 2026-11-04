/*
 * Copyright (C) 2026 The Android Open Source Project
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

// prettier-ignore
import {AI_DIAGNOSTIC_EXAMPLES, AI_DIAGNOSTIC_PROMPTS, AI_DIAGNOSTIC_SOURCES, AiDiagnosticPromptId, diagnosticExamplePrompt, diagnosticExamples, diagnosticExampleText, diagnosticPrompt} from './ai_diagnostic_prompts';

describe('AI diagnostic prompts', () => {
  it('provides two concrete examples for each category with stable unique IDs', () => {
    expect(AI_DIAGNOSTIC_EXAMPLES.length).toBe(8);
    expect(new Set(AI_DIAGNOSTIC_EXAMPLES.map((example) => example.id)).size).toBe(8);
    for (const category of AI_DIAGNOSTIC_PROMPTS) {
      const examples = diagnosticExamples(category.id);
      expect(examples.length).withContext(category.id).toBe(2);
      for (const example of examples) {
        expect(example.title).toBeTruthy();
        expect(diagnosticExampleText(example.id, 'zh-CN')).toMatch(/[\u4e00-\u9fff]/);
        expect(diagnosticExampleText(example.id, 'en')).not.toMatch(/[\u4e00-\u9fff]/);
        expect(diagnosticExamplePrompt(example.id, 'en')).toContain(diagnosticPrompt(category.id, 'en'));
        expect(diagnosticExamplePrompt(example.id, 'zh-CN')).toContain(diagnosticPrompt(category.id, 'zh-CN'));
        expect(diagnosticExamplePrompt(example.id, 'zh-CN')).toContain('不能把占位项当作证据');
        expect(diagnosticExamplePrompt(example.id, 'en')).toContain('never treat placeholders as evidence');
      }
    }
  });
  const ids: AiDiagnosticPromptId[] = [
    'black-screen',
    'flicker',
    'current-frame',
    'evidence-audit',
  ];
  const languages = ['en', 'zh-CN'] as const;

  it('keeps stable IDs, English catalog labels and Material icon names', () => {
    expect(AI_DIAGNOSTIC_PROMPTS.map(({id}) => id)).toEqual(ids);
    expect(AI_DIAGNOSTIC_PROMPTS.map(({label}) => label)).toEqual([
      'Investigate a black screen',
      'Find flicker evidence',
      'Analyze current frame',
      'Audit evidence completeness',
    ]);
    for (const {icon} of AI_DIAGNOSTIC_PROMPTS) {
      expect(icon).toMatch(/^[a-z]+(?:_[a-z]+)*$/);
    }
    expect(new Set(AI_DIAGNOSTIC_PROMPTS.map(({icon}) => icon)).size).toBe(4);
  });

  it('exports the supplied official research as metadata only', () => {
    expect(AI_DIAGNOSTIC_SOURCES.map<string>(({url}) => url)).toEqual(
      [
        'overview',
        'capture/winscope',
        'capture/adb',
        'analyze/sf',
        'analyze/wm',
        'analyze/search',
      ].map(
        (path) =>
          `https://source.android.com/docs/core/graphics/winscope/${path}`,
      ),
    );
    for (const source of AI_DIAGNOSTIC_SOURCES) {
      expect(source.title.length).toBeGreaterThan(0);
    }
  });

  for (const id of ids) {
    for (const language of languages) {
      describe(`${id} / ${language}`, () => {
        const prompt = diagnosticPrompt(id, language);

        it('is a substantive self-contained template below the gateway limit', () => {
          expect(prompt.length).toBeGreaterThanOrEqual(1500);
          expect(prompt.length).toBeLessThanOrEqual(3500);
          expect(new TextEncoder().encode(prompt).byteLength).toBeLessThan(
            128 * 1024,
          );
          expect(prompt).not.toMatch(/undefined|\[object Object\]|\$\{/);
          expect(prompt).not.toContain('https://');
        });

        it('uses the requested language, not a previously selected language', () => {
          if (language === 'en') {
            expect(prompt).toContain('reply in English');
            expect(prompt).toContain('Observed, Inferred, and Unknown');
            expect(prompt).not.toMatch(/[\u3400-\u9fff]/);
          } else {
            expect(prompt).toContain('使用简体中文回答');
            expect(prompt).toContain('“已观察”“推断”“未知”');
          }
          expect(diagnosticPrompt(id, language)).toBe(prompt);
        });

        it('requires exact citations and explicit incompleteness handling', () => {
          for (const term of [
            'traceType',
            'sourceIndex',
            'index',
            'ts',
            'timestampNs/time',
            'truncated',
            'incompleteReasons',
            'Android',
          ]) {
            expect(prompt).withContext(term).toContain(term);
          }
          expect(prompt).toContain(
            language === 'en'
              ? 'exact field path/value'
              : '精确字段路径和原始值',
          );
          expect(prompt).toContain(
            language === 'en'
              ? 'coverage is not causal proof'
              : '覆盖不等于因果证明',
          );
          expect(prompt).toContain(
            language === 'en'
              ? 'same clock and display'
              : '同一时钟和同一 display',
          );
          expect(prompt).toContain(
            language === 'en'
              ? 'device, clock mapping, capture options'
              : '设备、时钟映射、采集选项',
          );
        });

        it('documents the new bounded query contract without invented scans', () => {
          for (const argument of [
            'time?:string',
            'endTime?:string',
            'before?:integer 0..2',
            'after?:integer 0..2',
            'limit?:integer 1..8',
            'traceTypes?:array of supported types',
            'layerId?:string',
            'windowId?:string',
            'displayId?:string',
          ]) {
            expect(prompt).withContext(argument).toContain(argument);
          }
          for (const clause of language === 'en'
            ? [
                'at most 4 winscope_query_trace queries',
                'including retries',
                'Omitted time means current selection',
                'not physical frames',
                'endTime must include time',
                'results can be limited',
                'do not require a scan',
              ]
            : [
                '最多 4 次 winscope_query_trace 查询',
                '重试也计入',
                '省略 time 表示当前选择',
                '不是物理显示帧',
                'endTime 的范围查询必须显式包含 time',
                '返回结果可能受 limit 限制',
                '不支持的全区间扫描',
              ]) {
            expect(prompt).withContext(clause).toContain(clause);
          }
          expect(prompt).not.toMatch(/16\.7\s*ms|scan\s*:/);
        });

        it('bounds visual claims and retains domain-specific investigation fields', () => {
          for (const term of [
            'secure',
            'FrameTimeline',
            'Buffer',
            'visible region',
            'crop/transform',
            'requested',
            'calculated',
            'OPAQUE',
            'window/task/activity',
            'PID/UID',
            'layer/display/vsync',
            'transition-leash',
            'participants',
            'merge/abort',
            'handler',
          ]) {
            expect(prompt).withContext(term).toContain(term);
          }
          expect(prompt).toContain(
            language === 'en' ? 'not the physical display' : '不等同于物理显示',
          );
          expect(prompt).toContain(
            language === 'en'
              ? 'only when image evidence was actually provided and inspected'
              : '只有实际提供并检查了图像证据',
          );
          expect(prompt).not.toMatch(
            /I (saw|inspected) (the |your )?image|我已看到/,
          );
          expect(prompt).toContain(
            language === 'en'
              ? 'Do not access credentials, local paths, shell, or external services'
              : '不得访问凭据、本地路径、shell 或外部服务',
          );
        });
      });
    }
  }

  it('uses a distinct task in each language for all four prompt types', () => {
    const headings = {
      'en': [
        'Black-screen diagnosis',
        'Flicker diagnosis',
        'Current-frame explanation',
        'Evidence sufficiency audit',
      ],
      'zh-CN': ['黑屏诊断', '闪烁诊断', '当前帧解释', '证据充分性审计'],
    };
    for (const language of languages) {
      const prompts = ids.map((id) => diagnosticPrompt(id, language));
      expect(new Set(prompts).size).toBe(4);
      for (let index = 0; index < ids.length; index++) {
        expect(prompts[index]).toContain(headings[language][index]);
        for (let other = 0; other < ids.length; other++) {
          if (other !== index) {
            expect(prompts[index]).not.toContain(headings[language][other]);
          }
        }
      }
    }
  });

  it('prefers current selection and makes temporal context optional', () => {
    expect(diagnosticPrompt('current-frame', 'en')).toContain(
      'Begin with winscope_query_trace {}',
    );
    expect(diagnosticPrompt('current-frame', 'en')).toContain(
      '{before:1,after:1} only if temporal context is needed',
    );
    expect(diagnosticPrompt('current-frame', 'zh-CN')).toContain(
      '先用 winscope_query_trace {}',
    );
    expect(diagnosticPrompt('current-frame', 'zh-CN')).toContain(
      '仅在需要时序上下文时优先 {before:1,after:1}',
    );
  });

  it('distinguishes blocking from hypothesis-specific evidence gaps', () => {
    const english = diagnosticPrompt('evidence-audit', 'en');
    expect(english).toContain('missing blocking evidence');
    expect(english).toContain('hypothesis-specific gaps');
    expect(english).toContain('Do not demand every trace for every hypothesis');
    const chinese = diagnosticPrompt('evidence-audit', 'zh-CN');
    expect(chinese).toContain('阻断性缺失');
    expect(chinese).toContain('假设相关缺失');
    expect(chinese).toContain('不要把每种 trace 都当成每个假设的必备条件');
  });

  it('does not send or schedule work when the click-time language changes', () => {
    const timeout = spyOn(globalThis, 'setTimeout');
    const interval = spyOn(globalThis, 'setInterval');
    const fetch = spyOn(globalThis, 'fetch');
    for (const id of ids) {
      const english = diagnosticPrompt(id, 'en');
      const chinese = diagnosticPrompt(id, 'zh-CN');
      expect(chinese).not.toBe(english);
      expect(diagnosticPrompt(id, 'en')).toBe(english);
    }
    expect(timeout).not.toHaveBeenCalled();
    expect(interval).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
    expect(AI_DIAGNOSTIC_PROMPTS.map(({id}) => id)).toEqual(ids);
  });
});
