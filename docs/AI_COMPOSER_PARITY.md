# AI composer reference and validation

## Scope and baseline

User request (2026-11-01): restore DeepSeek Harness composer styling and
supported interactions as closely as possible; move model configuration into
AI settings. This explicitly overrides the reference's inline model trigger.

Read-only reference:
`/Users/yuchuan.gu/Workspace/AI/deepseek-harness`, revision
`ce7073d51254c26cd63b22a60835b8f948deb447`.

Inspected implementation:

- `packages/client/ui-conversation/src/client/skeleton/InputBar.tsx`
- `InputBar.module.css` and `ConversationRoot.module.css` in that directory
- `packages/client/ui-conversation/src/client/input/editor/keymap.ts`
- `packages/client/ui-theme/src/styles/base.css`, `design-platform.css`,
  `gradient-shadow-text.css`

No authenticated live browser compositor baseline is available: the running
reference host returns HTTP 401 and its inspector exposes only a non-DOM host
realm. Do not bypass authentication or claim pixel parity. Reference rendering
in the local validation harness is a source/token-derived **geometry specimen**,
not a screenshot of the live DeepSeek product. No reference runtime/assets are
shipped with WinScope.

## Implementation plan and acceptance

1. Keep current conversation/analysis/report contracts and regression tests.
2. Replace form-like composer with a 28px-radius capsule, 8px top inset, 12px
   text/toolbar gap, 36px docked or 52px empty-state text floor and 336px cap.
   Use system UI typography, 14px/24px rhythm, no rectangular textarea ring.
3. Match 28px plus and 34px send/stop circles; send has a white arrow and no
   visible text. Plus opens real actions, not a direct picker.
4. Show attachment cards only when populated. Reuse one bounded text-note
   intake for picker, paste and drag/drop, preserving rejection diagnostics.
5. Preserve Enter/Shift+Enter and IME behavior; reject held/Alt Enter; keep
   caret/selection and keyboard-focus affordances. Never invent queue/steer.
6. Move agent/provider/model/custom ID/reasoning controls into an atomic
   Save/Cancel AI settings page. Keep changes disabled during a run.
7. Verify settings save/cancel and real request payload, restored session,
   attachment content, keyboard, geometry, dark/light and 390px layout through
   unit tests and production bundle + real Launcher browser E2E.

## Intentional differences / exclusions

WinScope trace context replaces unsupported Plan/permission chips. Settings
replace the inline model menu at the user's request. Textarea keeps native
plain-text accessibility rather than importing Lexical. No false context-token
meter, image upload/vision, command execution, queue, steering or filesystem
references are displayed. Attachments remain bounded UTF-8 text/Markdown/JSON,
not raw trace/video uploads. Existing session/privacy limits are unchanged.

## Verification results

- Focused Angular suite: **35 passed**, including settings draft isolation,
  running/capability locks, session-restoration races and asynchronous note
  removal.
- Production build and real Go Launcher browser E2E: passed. Browser assertions
  cover actual model/effort request arguments after Settings Save, invalid model
  draft cancellation, plus menu, paste/drop note contents, session recovery,
  report downloads, send/stop, 336px draft cap, light/dark fills and 390px layout.
- Source-derived specimen and actual composer: radius 28px, text/toolbar gap
  12px, hero draft floor 52px, plus 28px and send 34px. The final desktop
  specimen/actual crops have equal dimensions. Pixel difference is secondary
  diagnostic evidence, not a full-product acceptance score.
- Build succeeds without increasing budgets. Remaining warnings: AI panel style
  exceeds the 6kB warning threshold (below its existing 10kB error threshold),
  plus the existing main-bundle/CommonJS warnings.

Artifacts: `dist/validation/ai-composer-*.png`,
`dist/validation/ai-composer/{actual,reference-specimen,diff}.png`,
`dist/validation/ai-composer/comparison.json`, and
`dist/validation/ai-workflow-browser.json`.

Reproduction:

```sh
npm run test:unit:ai
npm run test:e2e:ai:browser
# Optional read-only local source specimen for geometry/pixel diagnostics:
WINSCOPE_COMPOSER_REFERENCE_ROOT=/path/to/deepseek-harness \
  node scripts/ai_browser_e2e.mjs
```

The reference checkout is optional for normal E2E. It is never imported by the
production application. Provider auth/real model execution and signed-package
qualification are separate from this deterministic UI/runtime evidence.

## Compact-layout follow-up (2026-11-01)

The user's newer request halves the AI header and makes shared controls compact;
the source-derived composer dimensions above remain unchanged. Live before/after
measurements: AI header **81px to 40px**, icon actions **40px to 32px**, settings
fields **38px to 32px**, settings header **94.8px to 53px**, and settings footer
**69px to 45px**. Both Material themes use -2 density, with -4 icon density and
existing trace/timeline-specific overrides preserved.

Fresh validation passed all 35 focused Angular tests, TypeScript checking,
scoped ESLint/Prettier, production build, Go launcher tests and the browser E2E's
24 workflow/layout checks. Nine compact-layout scenarios cover desktop/mobile,
both themes, one-row header actions and 1280x640 composer/settings usability.
Artifacts: `dist/validation/ai-compact-{before,live,density}.json`, corresponding
before/live screenshots and `dist/validation/ai-density-*.png`. The local page
was updated without restarting the gateway or losing its in-memory sessions.
Existing bundle/CommonJS and component-style budget warnings remain; no budget
was increased. This is targeted UI/runtime evidence, not a full trace-viewer or
real-provider qualification.
