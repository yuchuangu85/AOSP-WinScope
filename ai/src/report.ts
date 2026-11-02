import {JsonValue} from './types';

export function buildMarkdownReport(
  sessionId: string,
  result: JsonValue | undefined,
  error?: string,
): string {
  const lines = [
    '# Winscope AI Analysis',
    '',
    `- Session: \`${sessionId}\``,
    `- Generated: ${new Date().toISOString()}`,
    '',
  ];
  if (error) lines.push('## Analysis Error', '', error, '');
  const payload = asRecord(result);
  const skillResults = Array.isArray(payload?.skillResults)
    ? payload.skillResults
    : [];
  const findings: Array<Record<string, JsonValue>> = [];
  const limitations = new Set<string>();
  for (const item of skillResults) {
    const skill = asRecord(item);
    const skillResult = asRecord(skill?.result);
    const rawFindings = Array.isArray(skillResult?.findings)
      ? skillResult.findings
      : [];
    for (const finding of rawFindings) {
      const normalized = asRecord(finding);
      if (normalized) findings.push(normalized);
    }
    const incomplete = Array.isArray(skillResult?.incompleteReasons)
      ? skillResult.incompleteReasons
      : [];
    for (const reason of incomplete)
      if (typeof reason === 'string') limitations.add(reason);
  }
  lines.push('## Deterministic Evidence');
  if (findings.length === 0)
    lines.push('', 'No deterministic finding was emitted.');
  for (const finding of findings) {
    lines.push(
      '',
      `- **${stringValue(finding.title, 'Finding')}** (${stringValue(finding.kind, 'unknown')}, ${stringValue(finding.severity, 'info')})`,
      `  - ${stringValue(finding.reason, 'No reason provided.')}`,
      `  - Frames: ${arrayValue(finding.frameIndexes).join(', ') || 'none'}`,
    );
  }
  const provider = asRecord(payload?.provider);
  if (typeof provider?.output === 'string' && provider.output.trim())
    lines.push('', '## Model Interpretation', '', provider.output);
  lines.push('', '## Limitations');
  if (limitations.size === 0)
    lines.push('', 'No additional deterministic limitation was emitted.');
  for (const reason of limitations) lines.push('', `- ${reason}`);
  lines.push(
    '',
    '## Evidence Boundary',
    '',
    'Deterministic evidence, model interpretation and missing evidence are kept separate. A candidate finding is not proof of the user-visible panel result without the required display evidence.',
  );
  return lines.join('\n');
}

export function buildHtmlReport(
  sessionId: string,
  result: JsonValue | undefined,
  error?: string,
): string {
  const markdown = buildMarkdownReport(sessionId, result, error);
  return `<!doctype html><html><head><meta charset="utf-8"><title>Winscope AI Analysis</title></head><body><pre>${escapeHtml(markdown)}</pre></body></html>`;
}

function asRecord(
  value: JsonValue | undefined,
): Record<string, JsonValue> | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value
    : undefined;
}
function stringValue(value: JsonValue | undefined, fallback: string): string {
  return typeof value === 'string' && value ? value : fallback;
}
function arrayValue(value: JsonValue | undefined): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}
function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
