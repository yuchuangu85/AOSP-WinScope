# Design

## Source of truth

Status: Active. Updated: 2026-11-03. Surface: independent application settings,
WinScope AI conversation workspace and shared compact control density.
The current iteration implements the user's requested conversation workflow,
not full DeepSeek Harness product or pixel parity. Reference code is read-only.
Evidence: `docs/AI_DISPLAY_ANALYSIS_PLAN.md`, `src/app/ai_panel_component.*`,
`src/styles/material-theme.scss`, and DeepSeek Harness's
`packages/client/ui-chat/src/client/chat/ChatView.module.css` and
`packages/client/ui-conversation/src/client/skeleton/InputBar.module.css`.

## Brand

An understated engineering tool: evidence first, neutral surfaces, compact
controls. Reuse WinScope colors and Material icons. Avoid marketing cards,
raw SSE dumps as conversation content, and unsupported diagnostic certainty.

## Product goals

Browse, search, create, resume and continue conversations; choose provider,
model and reasoning level; compose multiline messages with explicit context;
stop/retry; inspect, copy and export reports. Preserve findings-to-timeline
navigation. Success means verified multi-turn and restored sessions, not just
an attractive empty state. Full workspace/branch/pin/archive parity is out of scope.

## Personas and jobs

Android display engineers investigating black screens and flicker using local
trace evidence and contextual notes, often switching between chat and timeline.

## Information architecture

One large workspace under the WinScope toolbar: session browser on the left,
conversation header and transcript in the center, multiline composer anchored
at the bottom. Report preview is an optional secondary panel within the same
workspace. No second trace-selection or timeline state.

Settings is a separate application dialog, not a view inside the AI workspace.
Its left menu contains General settings, AI settings and About; the right scrollport
shows the chosen section. General owns language and theme. AI settings has a
provider dropdown containing every gateway catalog entry, including custom
providers, and displays only the selected provider's section. Switching providers
retains independent drafts. Codex and Claude each expose Get configuration in
their own section; editable nonsecret fields and sanitized authentication status
stay separate from credentials, which never enter the renderer.
About shows the product name and the version from the root package metadata,
the same version source used by desktop packaging. It works without a gateway
and does not remount or discard the AI settings draft.

## Design principles

Keep transcript and composer on one centered width axis. Separate drafts from
sent messages and connection state from run state. Detaching a panel or switching
sessions disconnects the stream, never silently cancels server work. Only Stop
cancels a run. Clearly distinguish observed findings and model interpretation.

## Visual language

Use WinScope theme variables for background, drawer, foreground, border,
selected, primary and error colors. Sidebar approximately 248px; conversation
column capped at 800px. Rounded composer, minimal elevation, 4/8/12/16/24px
spacing. Right-aligned user bubbles; open assistant responses. No new fonts,
bitmap assets or design-system dependencies.

## Components

Reuse Angular standalone components, FormsModule and Material buttons/icons.
Conversation states stay in `AiPanelComponent`; `AppSettingsComponent` owns
settings navigation, catalog loading and configuration imports, with an embedded
`AiSettingsComponent` for independent provider drafts. HTTP/SSE stays in
`AiGatewayClient`.
Use stable turn IDs, searchable session rows, compact run activity, explicit
context/attachment chips and a labelled model menu trigger.
Four app-owned diagnostic templates (black screen, flicker, current frame,
evidence audit) are available in the empty view and composer menu. Clicking
inserts the full template in the resolved UI language; it never sends or rewrites
an existing draft when language changes. An explicit capture preset configures
diagnostic data sources without starting collection. See
`docs/AI_DIAGNOSTIC_EVIDENCE.md` for evidence/clock/query limits and provenance.
Each diagnostic category also exposes two concrete, localized question examples.
Examples insert the existing diagnostic constraints plus the case-specific
request without auto-send. Unfilled times, packages and display IDs remain
explicit placeholders, never fictitious observations. Example navigation and
dismissal do not change drafts or history; an existing conversation can reopen
examples through the composer menu. Submitting hides the examples until reopened.

## Accessibility

Target WCAG 2.2 AA: labelled controls, visible focus, semantic buttons, polite
status announcements, keyboard-operable history and composer. Enter sends;
Shift+Enter inserts a newline; IME composition never submits. User messages stay
plain text; assistant Markdown is rendered as semantic elements, with authored
HTML kept literal. Do not rely on hover or color alone for actions/state.
Keyboard events inside the AI dialog stay local without cancelling native text
editing. Global timeline shortcuts ignore textareas, text inputs and editable
content; Space toggles playback only outside those editing surfaces.
Completed turns show localized elapsed time measured by the gateway for that
turn, including rule execution, model calls and trace-query round trips. Replay
preserves each turn's duration. Legacy events without timing show no estimate.

## Responsive behavior

The header history toggle is always available and reflects actual sidebar
visibility through `aria-expanded`. Wide AI windows show history by default;
both the toggle and the sidebar's close icon can hide it without changing the
draft, session or model. Keep the refresh action. At a measured panel width of
760px or less, including a resized window inside a wide viewport, history is an
overlay dismissed by its close icon, Escape or outside click. Desktop visibility
and compact overlay state are independent, in-memory preferences.

The AI workspace is a non-modal floating window, initially centered below the
32px toolbar at up to 1040 x 720 logical pixels. The existing header is a pointer
and keyboard move handle; buttons and editable controls never initiate dragging.
The background viewer remains interactive. Position is clamped so the entire
window and its close/move/resize controls remain within the viewport.
A bottom-right **Resize AI window** icon (`south_east`) adjusts width and height,
with a minimum of 640 x 420 logical CSS pixels, clamped on smaller screens.
Arrow keys resize from the grip or move from the focused header by 16px, or
64px with Shift. Header Home centers the current size; grip Home/double-click
restores the centered default geometry. Respect display size at 80%-140% when
converting physical pointer deltas, remeasure and clamp after viewport/zoom
changes, and keep size and position in memory only. Escape first ends an active
drag/resize; pointer cancellation, settings suspension and destruction release
only that interaction's pointer capture. The composer stays
in layout and caps long drafts using panel height so header and send controls
remain visible at the minimum size. No horizontal overflow at 390px; respect
reduced motion and both WinScope themes. Hiding history, suspending or closing the
window preserves draft/session/model state and never cancels a running analysis.

## Interaction states

Show catalog/history loading, unavailable gateway, empty history/search/chat,
restored running/completed/failed/cancelled turns, reconnect and retry. Preserve
in-memory drafts when switching sessions. Restore active session ID only through
sessionStorage; gateway history is memory-only and is lost on gateway restart.
Unsupported attachments fail visibly; only bounded text notes are sent, not raw
trace/video files. Report actions are available after a terminal turn.

## Content voice

Concise and factual. Use Conversation, Agent, Provider, Model, Reasoning level,
Trace context, Attach notes, Stop, Retry and Report. Explain incomplete evidence
and the local provider/runtime boundary without claiming full device diagnosis.

## Implementation constraints

Angular 20/Material, existing CSS tokens, no new dependencies. Do not store
prompts, attachment content, credentials or raw traces in browser storage.
Text attachments are bounded UTF-8 notes; trace evidence is opt-in per draft.
The trace-context toggle also authorizes read-only `winscope_query_trace` calls
for that submitted turn. Queries reuse viewer entry/frame matching and never
move the timeline. Omitted time reads the latest manually selected position;
specified times use the timeline's existing timestamp formats. Results contain
actual bounded hierarchy/property values, exact nanosecond strings, entry
identity and explicit partial/truncated diagnostics. Raw media is excluded.
The gateway binds each query to its session, turn context and query ID; results
are not retained in event/history storage. Each run permits at most four calls.

## Assistant Markdown

Assistant responses use DeepSeek Harness's mdast/GFM parsing stack and vendored
CJK strong-emphasis and TeX compatibility extensions at reference revision
`ce7073d51254c26cd63b22a60835b8f948deb447`. Angular renders a semantic node tree;
raw HTML stays literal text and unsafe/local links stay inert. No trusted-HTML
bypass is permitted. KaTeX uses untrusted mode and Shiki supplies token spans.
Source libraries are explicitly authorized for this requested integration.

Match the reference Markdown typography: 14/24 body, 21/30 h1, 19/28 h2,
18/26 h3, 13/22 tables, 11/19 fenced code, 16px paragraph spacing. Code blocks
retain the reference's 16px radius and language banner, with local Material copy
and wrap icons. Tables and code have their own scrollports at narrow widths.
Copy response, copied code, history and exports retain original source, not
rendered HTML. Owned control labels follow language; reply content does not.

Remote images, file-opening delegates and the reference's React/host framework
are not imported. Image alt text remains visible without automatic network
requests. See `docs/AI_MARKDOWN_PARITY.md` for provenance and measured boundaries.
Verify projection/state/client unit tests, gateway tests, production build and
browser workflow E2E separately. Visual screenshots support layout inspection,
not a claim of complete reference parity.

## Open questions

- [ ] Durable session persistence across gateway restart: follow-up, requires an
      explicit retention/privacy decision; owner: product.
- [ ] Full DeepSeek Harness visual and extended workspace feature parity:
      follow-up beyond this workflow slice; owner: product.

## Composer refinement (2026-11-01)

The current user override (2026-11-02) uses a borderless **Conversation model**
button in the composer. Clicking anywhere on its model label opens the complete
available model menu above the composer, without a second dropdown action.
The menu left-aligns model names with the provider heading, reserves a trailing
column for the selected model's checkmark, and supports keyboard navigation, Escape and
outside-click dismissal. It lists only the active provider's models;
changing a model cannot activate another provider. Preserve supported reasoning
effort and all message draft/history state. The active custom model remains
selectable. On opening, use the gateway's saved selection when no explicit
frontend provider selection is available, so the composer immediately shows the
configured model name after loading. Running sessions retain their last-run model
until completion. Detailed agent,
provider, model, custom identifier and reasoning controls remain in the dedicated
**AI settings** Save/Cancel surface. This supersedes the earlier settings-only
model decision; it does not move the detailed settings into the composer.

Codex and Claude each have **Get configuration** inside their own section. The
independent settings shell owns the abortable import and catalog reload. Only a
current successful completion fills that provider's draft and metadata and makes
it the sole selected provider. The last successful Get configuration wins, not a
failed or cancelled request; it does not save manual drafts, apply a conversation
change, or replace the other draft. A successful read persists a nonsecret import
marker and default selection so the provider can be restored on the next launch.
The provider dropdown can select any catalog entry; only its section is visible,
and switching preserves every provider's independent draft. Manual fields are
model/custom model, supported reasoning effort, service URL (`baseUrl`), provider
name (`providerName`, up to 128 characters), API key **environment variable name**
(not its value), and integer request timeout (1000-600000 ms). Service URLs allow
only HTTP/HTTPS, without credentials, query parameters or fragments; environment
variable names must be valid identifiers.

Save validates, persists and applies only the active provider's configuration and
selection; inactive drafts are neither saved nor allowed to block it. Durable,
app-owned nonsecret settings live at `~/.winscope/ai-settings.json` on the gateway
machine. Reopening defaults to the saved provider/selection unless an existing
session supplies its own selection, which takes precedence. The composer uses
only the applied active provider, including restored conversations, while ongoing
runs finish unchanged. Show **Already configured** only for a provider confirmed
saved or successfully imported, not merely selected or edited. Never send secret
values to the renderer or persist them in app settings/browser storage. A saved
configuration and available authentication are separate states: show a missing
environment-variable status when its selected credential reference is unset. Do not
rewrite the user's CLI configuration. The parent settings shell saves
asynchronously and closes on Save only after success. On failure, keep the dialog
and drafts open with the generic safe error: "Could not save AI settings. Check
the configuration and try again."

Use the imported default model and supported configured effort, with explicit
fallbacks. Show per-provider busy, retryable error and sanitized success states,
never credentials or raw local file paths. Menu switches preserve drafts and
in-flight reads; closing/destroying settings invalidates pending completions.
Runtime changes, Save and imports are disabled while running, loading, importing
or saving; General settings and Cancel remain usable.
The compact composer toolbar wraps when needed without hiding the model label.

The application toolbar exposes an icon-only **Settings** action beside AI
analysis. Interface language and theme are changed only inside General settings,
not in the toolbar. Theme uses a native selector with **Follow system**, **Dark
mode** and **Light mode**. Selection applies immediately; Cancel does not revert
language/theme changes. The default is Follow system, with a live system color
scheme listener that is ignored in fixed modes and removed on component teardown.
Store the selected mode separately from the resolved dark boolean required by
existing trace viewers. Preserve legacy explicit dark/light preferences when
migrating, prefer a valid new mode on later loads, and ignore/persist no theme
preferences in privacy mode.
Viewer pane titles use the same 14px baseline as the client toolbar filename,
with 18px title-row icons. Keep the existing equal 40px header rows, centered
32px collapse targets, and uniform display scaling across all seven presets.

General settings also exposes Display size as an 80%-140% range in 10% steps,
defaulting to 100%, with a percentage readout and reset icon. Selection applies
immediately without saving AI edits and persists only when preferences are
enabled. Scale the application uniformly rather than changing trace values or
each component's typography. Trigger layout consumers after scaling; pointer
conversion must use rendered bounds for rectangle picking and timeline dragging.
The range and reset stay reachable at 390px and at the largest setting. This
explicit preference supersedes the earlier no-page-scaling constraint below;
the compact component dimensions still describe the 100% baseline.
This entry works without creating an AI workspace or requiring a gateway;
unavailable model/import controls remain disabled while General remains editable.
When restoring a conversation, lock AI changes until its current selection is
available. Opening settings from AI hides the workspace and suspends its focus
trap, not its stream or drafts. Closing returns to the same conversation. Keep
the existing iframe host settings action separate.

`docs/AI_COMPOSER_PARITY.md` records the read-only reference revision and precise
geometry. Use a 28px capsule, hairline elevation, source-derived light/dark input
colors, 36/52px draft floors, 14px/24px system text and 336px maximum. The toolbar
has a 28px plus menu, functional trace-context chip and 34px icon-only circular
send/stop. Attachments appear above the draft only when present. Support picker,
paste and file drop through the same bounded note validator; do not show fake
Plan/permission/queue/token controls. Keyboard indication must not recreate a
rectangular outline around the text surface.

## Compact vertical layout (2026-11-01)

The user's newer compact-layout request overrides the previous spacious AI
workspace spacing, not the reference-derived composer geometry. The AI header
is **40px border-box**, approximately half the previous 80px content-plus-padding
height. Title, optional subtitle, report actions, settings and close remain on
one row; hide the secondary subtitle on narrow windows rather than adding a row.

Shared Material controls use **-2 density** in both themes, with 32px icon buttons
and the existing 32px app toolbar. Preserve component-specific trace/timeline
height overrides. No font scaling, page zoom or data/interaction changes.
Use 8px sidebar gaps, 4px search padding, 8px session-row padding, 20px turn gaps
and 1.5 message line height. Settings use 32px native fields, 12px card padding
and 8px header/footer padding; only settings content scrolls, keeping Save/Cancel
visible on short windows. The composer keeps its 36/52px draft floors, 24px text
line height, 12px text/toolbar gap and 34px send target.

Verify rendered header/control sizes, no horizontal overflow at 390px, both
themes and composer/settings usability at a 640px viewport height, alongside the
existing keyboard, session, attachment and report workflow regressions.

## Desktop title bar (2026-11-02)

The Electron desktop window merges its existing 32px WinScope toolbar into the
native title-bar area. Keep the existing toolbar commands and essential keyboard
actions. The 2026-11-04 override restores the native File menu with Open...
(CmdOrCtrl+O), Open Recent and Clear Recent, alongside standard Edit/View roles.
Only successfully parsed local files enter the deduplicated, newest-first list
of up to 20 paths, stored in userData/recent-files.json across restarts. Upload
and drop use the same success boundary; archives retain their original path.
Missing recent files show an error and are removed; cancellation adds nothing.
Privacy mode neither reads nor writes recent paths. The sandbox file bridge
permits reads only for a main-process-issued selection token, in 4MiB chunks;
it never exposes arbitrary filesystem reads or Node APIs to the renderer.
macOS retains native
traffic-light controls with an 88px left inset. Windows/Linux retain native
caption buttons through Window Controls Overlay and reserve their actual CSS
safe area. Blank toolbar space drags the window; interactive controls never do.
Native caption glyphs follow the resolved page theme without exposing a general
renderer bridge. Browser-hosted WinScope keeps its existing toolbar and layout.
