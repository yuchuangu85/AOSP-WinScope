# AI Display Anomaly Analysis Plan

## Status

Phase 1 of this plan is implemented: an independent `ai/` Node module,
loopback HTTP/SSE gateway, CLI, MCP stdio server, provider registry, external
agent/skill import, deterministic evidence skills and an Angular panel are now
in place. Bounded Screen Recording sampling and finding-to-timeline
navigation are also implemented. deeper BufferQueue/Fence/VSync/FrameTimeline causal correlation and
packaged release integration remain follow-up work.

This plan does not authorize copying SmartPerfetto source code, changing the
product license, or widening the current runtime network boundary. Those
decisions require the gates below.

## Objective

Add AI-assisted analysis for Android black-screen and screen-flicker problems
to AOSP-WinScope. The feature should provide:

- a conversational analysis window;
- configurable AI providers and model runtimes;
- streaming progress and multi-turn follow-up questions;
- deterministic trace and video evidence extraction;
- structured findings linked to timestamps, frames, layers, windows and
  transactions;
- Markdown/HTML result generation and export; and
- navigation from a finding back to the existing WinScope timeline and viewers.

The integration may use SmartPerfetto's AI engine, Agent runtime, result
protocols and skills. Skills may be vendored into a dedicated backend or
loaded from an external, versioned skill registry.

## Scope Boundary

### In scope

- WinScope Angular UI for chat, progress, evidence and final reports.
- A separately owned AI gateway or backend adapter.
- SmartPerfetto backend integration through a documented HTTP/SSE contract.
- Direct or external loading of SmartPerfetto skill packs.
- New black-screen and flicker skills where the existing catalog is
  insufficient.
- Reuse of WinScope Trace, TraceProcessor, Frame mapping, video playback and
  timeline navigation APIs.

### Out of scope for the first implementation

- Replacing WinScope parsers or the existing viewer architecture.
- Making an LLM the source of truth for raw trace facts.
- Sending complete trace files or videos to a model by default.
- Claiming that a trace-only candidate proves what a user saw on the panel.
- Changing the standalone release license without an explicit legal decision.

## Integration Options

### Option A: External SmartPerfetto backend and skills

Run SmartPerfetto's backend separately. WinScope uploads or registers the
current trace, starts an analysis session, consumes SSE events and renders the
result in an Angular panel. The backend loads SmartPerfetto skills from its
normal registry.

This is the fastest validation path and keeps the Agent runtime, skill engine,
Trace Processor ownership and provider management outside the WinScope web
bundle. It still requires deployment and license review.

### Option B: Dedicated vendored AI backend

Add a separate backend component to this repository or its distribution. It
can vendor a versioned SmartPerfetto skill pack and the required skill loader,
executor, SQL assets, Agent runtime and provider adapter.

This gives one packaged product and loopback operation, but creates a large
dependency closure, AGPL obligations, backend packaging work and a larger
release-validation surface.

### Option C: External skill registry with a local gateway

Implement a WinScope-owned AI gateway with a stable skill-provider interface.
The gateway can load a local path, Git-pinned skill pack or remote skill
service at runtime:

```ts
interface AnalysisSkillProvider {
  listSkills(): Promise<SkillDescriptor[]>;
  executeSkill(
    skillId: string,
    traceContext: TraceContext,
    input: unknown,
  ): Promise<SkillResult>;
}
```

This is the preferred long-term boundary. It permits SmartPerfetto skills,
WinScope-owned skills and future providers to coexist without coupling the
Angular UI to a particular Agent implementation.

### Recommended sequence

1. Use Option A to validate chat, skill execution, evidence and reports.
2. Define provider and skill contracts from the validated traffic.
3. Move to Option C for the stable WinScope integration.
4. Choose Option B only if a self-contained distribution is required and the
   license, dependency closure and release evidence are accepted.

## Target Architecture

```text
WinScope LoadedFileData / TraceProcessor / Frame mapping
                         |
                         v
                DisplayEvidenceAnalyzer
                         |
          +--------------+--------------+
          |                             |
   Trace evidence                  Video evidence
   SF/WM/Tx/transition              luma/frame diff
          |                             |
          +--------------+--------------+
                         v
                    AI Gateway
          +--------------+--------------+
          |              |              |
      Provider       Agent        Skill registry
      runtime        session       local/external
          |              |              |
          +--------------+--------------+
                         v
             SSE conversation and report
                         |
                         v
                 Angular AI Panel
                         |
                         v
                Existing timeline jump
```

The gateway must receive structured evidence and bounded context rather than
unfiltered trace contents whenever possible. Raw trace upload is allowed only
when a backend skill requires server-side Trace Processor access and the user
has explicitly enabled that path.

## WinScope Integration Points

The current implementation provides the required data and lifecycle boundaries:

- Trace loading and cross-trace construction:
  `src/ui/trace_loading/loaded_file_data.ts`.
- Browser Trace Processor access:
  `src/trace_processor/trace_processor.ts`.
- Trace/frame identity and alignment:
  `src/trace_api/trace.ts`, `src/trace_api/traces.ts` and
  `src/trace_api/frame_mapper.ts`.
- Existing media frame decoding:
  `src/ui/shared/playback/video_frame_cache.ts` and
  `src/ui/media_based/presenter.ts`.
- Application lifecycle and layout:
  `src/app/app_component.ts` and `src/app/app_component.ng.html`.
- Event routing and timeline propagation:
  `src/app/mediator.ts` and `src/messaging/winscope_event.ts`.

The AI implementation should be an independent analysis service and viewer. It
should not put model calls inside a SurfaceFlinger presenter or parser.

## Skill and Evidence Design

Relevant SmartPerfetto skills for the initial investigation include:

- `surfaceflinger_analysis`;
- `jank_frame_detail`;
- `fence_wait_decomposition`;
- `present_fence_timing`;
- `vsync_config`;
- `vsync_phase_alignment`;
- `rendering_pipeline_detection`; and
- `sf_frame_consumption`.

The exact skill set must be selected by capability detection. Missing
SurfaceFlinger, FrameTimeline, screen recording or video data must produce a
visible incomplete-evidence state, not a fabricated conclusion.

### Black-screen evidence

Correlate:

- screen-recording black-pixel ratio, luminance and consecutive-frame duration;
- display power/on state when available;
- visible layer coverage, alpha, bounds and buffer state;
- WindowManager visible/focused windows;
- transitions and transaction changes;
- buffer/latch/present timing; and
- frame/time alignment across available sources.

Trace-only output must be labelled as a black-screen candidate unless pixel
evidence or an equivalent display-state contract is present.

### Flicker evidence

Detect and correlate:

- rapid changes in visible layer/window sets;
- repeated layer removal and re-addition;
- abrupt alpha, bounds or composition changes;
- short-lived empty or black display coverage;
- abnormal transaction or transition bursts;
- buffer, latch, present or Fence gaps; and
- rapid luminance changes and frame differences in the recording.

### Structured result contract

Every finding should retain a stable identity and evidence references:

```ts
interface DisplayAnomalyFinding {
  type: "black_screen" | "flicker";
  startNs: bigint;
  endNs: bigint;
  confidence: number;
  severity: "info" | "warning" | "critical";
  suspectedStage:
    | "app"
    | "render_thread"
    | "buffer_queue"
    | "surface_flinger"
    | "window_manager"
    | "display"
    | "unknown";
  evidence: EvidenceReference[];
  explanation: string;
  limitations: string[];
}
```

The final report must distinguish observed facts, model interpretation,
unsupported hypotheses and missing evidence. Clicking an evidence reference
must navigate to an existing WinScope time position or viewer entry.

## UI Plan

Add a standalone Angular AI panel rather than copying SmartPerfetto's Mithril
`ai_panel.ts`. The panel should provide:

- provider/runtime status;
- current trace and evidence scope;
- conversation history;
- streaming analysis phases and skill/tool activity;
- cancel and retry actions;
- structured findings with severity and confidence;
- evidence links to the timeline and viewers;
- generated report preview; and
- export/download actions.

The panel may be a right-side drawer or resizable overlay, but it must reuse
existing application events and timeline contracts instead of creating a second
timeline or independent trace-selection model.

## Security, Privacy and Licensing Gates

1. Keep the default Local Analysis Boundary. Non-loopback AI or skill access
   requires explicit runtime configuration and user-visible opt-in.
2. Do not persist API keys, bearer tokens, raw trace contents or full device
   identities in browser storage, URLs or ordinary diagnostics.
3. Use bounded request sizes, timeouts, cancellation, replay protection and
   safe SSE parsing.
4. Treat trace content and model output as untrusted input. Sanitize Markdown,
   HTML, links and tool-result rendering.
5. Record the exact skill pack, Agent runtime, provider and trace-processing
   versions used for a report.
6. Review SmartPerfetto's AGPL-3.0 obligations before copying source, skill
   files or backend assets into this repository or a distributed artifact.
7. If the skill pack remains external, document the service boundary, source
   revision, data flow and failure behavior.

## Validation Plan

Report these evidence classes separately:

- unit tests for provider, skill registry, evidence extraction, SSE state and
  result contracts;
- Angular component tests for chat, cancellation, findings and timeline jump;
- fixture tests with labelled black-screen and flicker traces;
- browser E2E tests for upload, analysis, stream, report and export;
- real-trace tests covering missing and partial data;
- real-device or packaged-runtime tests where the backend is enabled;
- security and privacy checks for credentials, paths, trace content and HTML;
- package and dependency-closure verification if skills are bundled; and
- release evidence for the selected deployment and license model.

The first acceptance fixture must include a screen recording, SurfaceFlinger,
WindowManager and transition/transaction evidence with manually labelled
anomaly intervals. A result generated only from a synthetic prompt or a
successful model request is not sufficient evidence.

## Decision Gates

- [x] Choose the WinScope-owned local gateway with external registry paths.
- [x] Use public contracts and external skill registry only; do not copy
      SmartPerfetto source or skill assets into the product.
- [x] Complete the current license boundary review; future source imports
      require a new legal decision.
- [x] Define same-origin `./ai/` runtime configuration and launcher loopback
      proxy boundary.
- [x] Pin the inspected external SmartPerfetto revision in
      `ai/external-sources.json`.
- [x] Approve the black-screen/flicker evidence contract.
- [x] Approve the report and timeline-navigation contract.

## Source Mapping

The SmartPerfetto implementation areas reviewed for this plan are:

- `perfetto/ui/src/plugins/com.smartperfetto.AIAssistant/ai_panel.ts`;
- `perfetto/ui/src/plugins/com.smartperfetto.AIAssistant/analysis_backend_connection.ts`;
- `perfetto/ui/src/plugins/com.smartperfetto.AIAssistant/agent_sse_transport.ts`;
- `perfetto/ui/src/core/backend_uploader.ts`;
- `backend/src/routes/agentRoutes.ts`;
- `backend/src/routes/providerRoutes.ts`;
- `backend/src/routes/analysisResultRoutes.ts`;
- `backend/src/routes/reportRoutes.ts`; and
- `backend/skills/` and `backend/strategies/`.

These paths are reference boundaries for integration analysis. They are not
automatically copied into AOSP-WinScope.

## Conversation workflow implementation (2026-10-31)

The Angular AI surface now uses a large conversation workspace, guided by the
read-only DeepSeek Harness reference and the repository's `DESIGN.md`:

- searchable session browser and new-conversation action;
- server-authoritative, multi-turn transcript restored on panel reopen and page
  refresh, with event-ID-based SSE replay and reconnect;
- bottom multiline composer, Enter send, Shift+Enter newline, IME-safe input,
  session-switch draft retention, Stop and retry-prompt actions;
- explicit trace context and actual bounded UTF-8 text/Markdown/JSON notes;
- independent agent/provider/model/reasoning controls, with only supported
  effort levels enabled; custom model availability is validated upstream;
- report preview rendered as text, copy, Markdown/HTML download and existing
  finding-to-timeline navigation.

The gateway validates loopback Host/Origin, requires JSON for mutation requests,
serializes turns, bounds history/notes/output and correctly labels cancellation.
The Go Launcher allows only route-specific `after` and `format` query fields.
The browser stores only the active session ID, not prompts, notes or trace bytes.
History remains in gateway memory; restarting that process clears it. Drafts are
in component memory and survive session switching, not page refresh. Raw
trace/video attachment upload, durable retention, full reference-product parity,
and token-by-token model output remain separate follow-up work.

Reproducible validation commands:

```sh
npm run test:unit:ai
npm run ai:test
npm run ai:verify
npm run test:e2e:ai
npm run test:e2e:ai:browser
go test ./...
```

The browser test builds a local fixture provider and exercises the real Go
Launcher, production Angular bundle and AI gateway. It verifies actual
model/effort arguments, note contents, prior conversation context, restoration,
report downloads, stop/retry, error draft recovery and narrow-window layout.
Its JSON and screenshots are written under `dist/validation/ai-workflow-*`.
This is deterministic local integration evidence, not authenticated real-provider,
real-device, signed-package or Release qualification.

### Composer and settings refinement (2026-11-01)

Provider/model/reasoning controls now live in a dedicated AI settings page,
with atomic Save/Cancel rather than inline composer fields. The compact
composer follows the reference's geometry, light/dark tokens, plus menu,
attachment rail, native text growth and circular send/stop controls. File picker,
clipboard files and drop share the bounded text-note intake. Source provenance,
intentional deviations and validation are recorded in
`AI_COMPOSER_PARITY.md`. This supersedes the earlier inline-selector UI only;
the gateway's provider and evidence contracts remain unchanged.
