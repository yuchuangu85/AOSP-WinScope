# ADR 0028: Independent AI Gateway and External Skill Boundary

## Status

Accepted for the first AI display-analysis implementation.

## Context

WinScope is a browser-hosted trace viewer with a strict local runtime boundary.
AI execution, provider credentials, MCP, CLI lifecycle, custom agents and
external skills must not become Angular parser responsibilities. SmartPerfetto
contains useful AI and skill implementations, but its source and backend are
AGPL-3.0-or-later and must not be copied into the Apache-licensed WinScope
product without a separate legal and redistribution decision.

## Decision

Use a local modular boundary:

- `ai/` owns provider execution, agent/child-agent orchestration, skill
  registry, deterministic evidence analysis, HTTP/SSE, CLI and MCP stdio.
- Angular is a thin client that calls the gateway through the launcher’s
  same-origin `./ai/` proxy.
- Built-in provider IDs are `codex`, `claude` and `ds`; command executable and
  arguments are configurable. OpenAI-compatible providers use environment
  variable names for credentials.
- External agents and skills are imported from versioned JSON manifests.
- SmartPerfetto remains an external skill source. The inspected revision is
  pinned in `ai/external-sources.json`; no SmartPerfetto source, skill files or
  backend assets are bundled in this repository or runtime package.
- Current evidence extraction samples Screen Recording frames and records
  bounded SF/WM/Transactions structure summaries. Missing sources remain
  explicit incomplete evidence.

## Consequences

Positive:

- GUI, CLI and MCP share one execution owner and one result contract.
- The browser never receives provider credentials or direct model access.
- SmartPerfetto skills can be added later without changing Angular parser code.
- The current distribution does not acquire SmartPerfetto’s AGPL runtime
  obligations because no covered source is copied or bundled.

Tradeoffs:

- A separate AI process must be started for AI-enabled local runs.
- Full SurfaceFlinger/WindowManager causal correlation remains a later skill
  and evidence expansion.
- External skill imports require revision, license and package verification.

## Validation

The boundary is checked by:

- `npm run ai:verify` for required files, revision pin, no bundled external
  source and credential-pattern scanning;
- `npm run test:e2e:ai` for gateway health, deterministic analysis and report
  export;
- launcher tests for loopback-only `--ai-url` and same-origin `/ai/` proxying;
- Angular unit tests for the panel, client, runtime config and evidence math.
