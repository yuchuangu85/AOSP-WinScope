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

import {TestFileReaderBuilder} from '@legacy_file_readers/testing/test_file_reader_builder';
import {DEFAULT_RUNTIME_CONFIG} from '@runtime/runtime_config';
import {TraceFile} from '@trace_api/trace_file';
import {TraceType} from '@trace_api/trace_type';
import {ParsingErrorType} from '@ui/trace_loading/parsing_error_type';

import {makeDiagnosticBlob} from './diagnostics';

describe('diagnostics', () => {
  it('contains bounded status and excludes sensitive values', async () => {
    const canary = 'secret-device-path-token';
    const reader = new TestFileReaderBuilder()
      .setTraceFile(new TraceFile(new File([canary], canary)))
      .setType(TraceType.WINDOW_MANAGER)
      .setTimestamps([])
      .build();

    const blob = makeDiagnosticBlob({
      runtimeConfig: DEFAULT_RUNTIME_CONFIG,
      privacyMode: true,
      readers: [reader],
      parsingErrors: new Map([
        [TraceType.WINDOW_MANAGER, ParsingErrorType.DATA_INCOMPLETE],
      ]),
      lostPerfettoPackets: 2,
      generatedAt: new Date('2026-08-20T00:00:00Z'),
    });
    const text = await blob.text();

    expect(text).toContain('WINDOW_MANAGER');
    expect(text).toContain('DATA_INCOMPLETE');
    expect(text).toContain('2026-08-20T00:00:00.000Z');
    expect(text).not.toContain(canary);
  });
});
