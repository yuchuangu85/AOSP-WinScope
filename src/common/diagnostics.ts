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

import {RuntimeConfig} from '@runtime/runtime_config';
import {FileReader} from '@trace_api/file_reader';
import {TraceType} from '@trace_api/trace_type';
import {ParsingErrorType} from '@ui/trace_loading/parsing_error_type';

export const DIAGNOSTIC_FILENAME = 'aosp-winscope-diagnostics.json';
export const DIAGNOSTIC_PREVIEW =
  'Export diagnostics?\n\nFiles:\n- diagnostics.json\n\n' +
  'Includes product/runtime mode, loaded trace type names, parser status, and packet-loss count. ' +
  'Excludes trace bytes, filenames, paths, tokens, commands, device serials, and device identity.';

interface DiagnosticInput {
  runtimeConfig: RuntimeConfig;
  runtimeDiagnostic?: string;
  privacyMode: boolean;
  readers: FileReader[];
  parsingErrors: Map<TraceType, ParsingErrorType>;
  lostPerfettoPackets: number;
  generatedAt?: Date;
}

export function makeDiagnosticBlob(input: DiagnosticInput): Blob {
  const traceTypes = Array.from(
    new Set(input.readers.map((reader) => TraceType[reader.getTraceType()])),
  ).sort();
  const parsingErrors = Array.from(input.parsingErrors.entries())
    .map(([traceType, error]) => ({
      traceType: TraceType[traceType],
      category: ParsingErrorType[error],
    }))
    .sort((a, b) => a.traceType.localeCompare(b.traceType));
  const diagnostics = {
    schemaVersion: 1,
    generatedAt: (input.generatedAt ?? new Date()).toISOString(),
    product: 'AOSP-WinScope',
    privacyMode: input.privacyMode,
    runtime: {
      hostKind: input.runtimeConfig.host.kind,
      captureProvider: input.runtimeConfig.capture.provider,
      diagnostic: input.runtimeDiagnostic,
    },
    loadedData: {
      readerCount: input.readers.length,
      traceTypes,
      parsingErrors,
      lostPerfettoPackets: input.lostPerfettoPackets,
    },
    exclusions: [
      'trace-bytes',
      'filenames',
      'paths',
      'tokens',
      'commands',
      'device-serials',
      'device-identity',
    ],
  };
  return new Blob([JSON.stringify(diagnostics, undefined, 2) + '\n'], {
    type: 'application/json',
  });
}
