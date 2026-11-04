# Display Diagnosis Prompts And Evidence Audit

Scope: app-owned bilingual black-screen, flicker, current-frame and evidence-audit
templates; read-only WinScope evidence transport. These are engineering templates
derived from documentation, not Google-provided AI prompts or accuracy guarantees.

## Source Basis

- AOSP Winscope overview: `https://source.android.com/docs/core/graphics/winscope/overview`
- Capture options: `https://source.android.com/docs/core/graphics/winscope/capture/winscope`
- Version-specific capture: `https://source.android.com/docs/core/graphics/winscope/capture/adb`
- SF properties: `https://source.android.com/docs/core/graphics/winscope/analyze/sf`
- WM properties: `https://source.android.com/docs/core/graphics/winscope/analyze/wm`
- Correlation fields: `https://source.android.com/docs/core/graphics/winscope/analyze/search`

The NotificationShade opaque-layer and parent transition-leash examples motivate
before/during/after comparisons. They are examples, not presumed root causes.
Missing values remain unknown; default/false/zero properties are retained as data.

## Audit And Changes

- Quick prompts were one-line requests without evidence/output constraints.
  They now insert full templates at click time in the resolved interface language.
  Existing drafts/history/model output are never translated or automatically sent.
- The point query lacked temporal context. It now accepts bounded neighboring
  entries and explicit inclusive time ranges, with trace selection and target
  prioritization while retaining ancestors and other context. Entry neighbors
  are not claimed to be adjacent physical display refreshes.
- Requested and matched time were only explicit for WM. Each returned source
  identifies its entries, bounds, matching strategy and exact nanosecond offset;
  caller-supplied clock facts distinguish real/elapsed/unknown domains.
- Hierarchy serialization previously omitted viewer geometry and relationships.
  The query retains actual parent/z-parent IDs, rect/transform observations and
  property source tags, including calculated versus requested values where the
  parser supplies them. Transaction/transition identifiers point into actual
  retained properties rather than inferring causal links from close timestamps.
- Legacy SF/WM/transactions overviews were summaries, not state observations.
  Overview metadata labels summaries, source bounds, unknown capture options and
  visual limitations. All node names are no longer presented as visible windows.
- Video overview samples were sparse but looked continuous; derived sample
  frequency was mislabeled as frame rate. Original trace timestamps and indices
  now accompany luminance samples, sampling mode/count is explicit, gaps do not
  establish consecutive black frames, and sampled transitions do not prove flicker.
- A click-only capture preset enables available SF/WM/recording/transactions/
  transitions, SF buffers/composition and detailed WM state. It does not auto
  record, change unavailable targets, or unconditionally enable heavy HWC data.
  Imported traces do not inherit current capture settings as historical fact.

## Query Contract

`winscope_query_trace` accepts an object containing only:

```json
{
  "time": "12s300ms",
  "before": 1,
  "after": 1,
  "limit": 5,
  "traceTypes": ["SURFACE_FLINGER", "WINDOW_MANAGER", "TRANSACTIONS", "TRANSITION"],
  "layerId": "42",
  "displayId": "0"
}
```

Omit `time` for the manual viewer position. `endTime` requests a range and
requires `time`; it cannot be combined with before/after. Before/after are 0–2,
limit is 1–8, and all strings/trace-type arrays are validated on both transport
sides. IDs are data, never SQL or command text. A range can be partial: inspect
coverage and pagination/limit diagnostics. Target selection prioritizes real
matching nodes but retains context; it does not equate focus, name or rectangle
presence with visible pixels.

The existing 96 KiB snapshot/10-second read deadline, 192 KiB cumulative model
evidence budget, four-call tool budget, per-turn context binding, cancellation
and stale-reply checks still apply. The API cannot manufacture missing records
from a trace captured without buffers, nor inspect a physical display from layer
state. Raw video/images are not sent to the text model. Trace collection requires
the device permissions, version support and producer configuration independently.
Overview extraction separately has a 32 KiB serialized budget, one shared
10-second deadline and a 2,048-node cycle-aware traversal budget; oversized names
are clipped by UTF-8 bytes. WM/SF/transaction overviews are explicitly summaries,
never a substitute for actual state. Explicit `Z` timestamps retain UTC semantics
even when the trace viewer uses a nonzero local offset.

## Acceptance Boundaries

Use actual parser trees and precise timestamps in tests; verify full query
arguments survive model output, gateway SSE and browser callback. Test missing,
partial, mismatched clocks, empty sources, limited ranges and sparse recordings.
Separate local deterministic tests and browser fixture runs from real-device
capture and real-provider diagnostic accuracy. Do not claim an exhaustive root
cause detector or universal Android field schema.

The repeatable `npm run test:e2e:ai:queries` check runs a local deterministic
provider and Chrome through real HTTP/SSE, asserting that complete validated
range/target arguments reach the browser and that actual SF/WM/transaction/
transition values return to the model. It uses constructed parser-style entries,
not a physical Android device or authenticated model; it is transport/contract
evidence rather than diagnostic accuracy evidence.

## Local Verification

- 715 browser-backed AI/App/capture/configuration tests passed.
- 97 standalone AI tests passed.
- The real HTTP/SSE diagnostic query test passed with three provider calls,
  proving both range and neighbor results reached the deterministic model.
- The production bundle and real Go-launcher browser workflow passed 76 checks,
  including insertion of all four templates without sending, Markdown, settings,
  responsive layout, model routing, session restore and keyboard behavior.
- TypeScript, scoped ESLint, i18n audit and whitespace checks passed.

Build retains existing component-style/initial-bundle budget and protobuf
CommonJS warnings. No real device was captured, no authenticated AI provider
was used, and installed desktop bundles were not replaced by these checks.
