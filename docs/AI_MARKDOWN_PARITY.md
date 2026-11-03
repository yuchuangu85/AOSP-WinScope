# Assistant Markdown Parity

## Provenance

Styles are adapted from the read-only repository
`/Users/yuchuan.gu/Workspace/AI/deepseek-harness`, revision
`ce7073d51254c26cd63b22a60835b8f948deb447`:

- `packages/client/ui-primitives/src/markdown/MarkdownText.module.css`
- `packages/client/ui-primitives/src/markdown/CodeBlock.module.css`
- `packages/client/ui-theme/src/styles/gradient-shadow-text.css`
- `packages/client/ui-theme/src/styles/shiki.css`
- `packages/client/ui-theme/src/styles/design-platform.css` (resolved colors)
- `packages/client/ui-theme/src/styles/base.css` (local font stacks and radii)

This targets assistant Markdown only, not the source application's entire UI.
No remote font, asset, or stylesheet is loaded. The upstream MIT notice is
retained below.

## Style Contract

`src/styles/ai_markdown.scss` must be imported by the main integration. Every
selector and palette variable is scoped to the `.ai-markdown` host; dark values
activate under the app's `.dark-mode`, including that class on the host itself.
The host contains native `p`, `h1`-`h6`, `ul`, `ol`, `li`, `blockquote`, `hr`,
`strong`, `a`, and `code` elements.

The source default typography is fixed here: body 14/24; h1 700 21/30;
h2 700 19/28; h3 700 18/26; h4-h6 600 14/24 (pixels). Paragraphs use 16px
margins, h1-h3 32px/16px, and h4-h6 16px, tightened to 8px before lists.
Inline code retains an 8px radius. Code banners are 11/18 and preformatted
content 11/19, with the explicitly requested 16px content inset and block radius;
the source's optional card-specific inset is not used.

Tables use `.table-scroll`; `.md-table-wide` retains natural width, while
other tables fill the column. Optional `.table-fill` and blockquote tables
force filling. Cells use 13/22 text, 10px/16px padding, a 100px floor and
320px ceiling (30vw between those limits), with the source first/last-cell
padding exceptions. Scroll containers own horizontal overflow.

Code markup is `.md-code-block` containing `.code-banner`
(`[data-code-block-banner]` is also supported), `.code-language`, `.code-actions`,
and `.code-content` (`[data-code-block-content]` is also supported) containing
`pre > code > span.line > span`. Token spans consume the source's
`--shiki-token-*` palette through inline styles. Unknown languages use `.plain`.
Code wraps by default; `data-code-wrap="false"` on the code-block host disables
wrapping and `"true"` enables it. `.code-copy` and `.code-wrap` are
Material icon buttons; the main integration owns handlers, tooltips, accessible
names, and wrap `aria-pressed` state. `.image-alt`, `.footnotes`, and
`.katex-display` complete the presentation hooks. The renderer owns scroll-region
focusability and labels; the stylesheet supplies visible keyboard focus rings.

## Semantics And Differences

The main integration owns the Angular semantic renderer, code/math components,
and vendored grammar helpers. The target grammar matches the reference's
`parse.ts`: GFM with `singleTilde: false`, CJK-friendly strong emphasis, and
settled math plus compatibility delimiters. The current gateway supplies settled
assistant replies; an incremental streaming Markdown cache is not imported.
CSS does not establish parsing or sanitization parity.

Intentional differences and integration requirements:

- Remote images are blocked for privacy and CSP; show `.image-alt` instead of
  fetching an image or opening an image preview.
- External links allow only `http`, `https`, and `mailto`. Footnote references
  are inert numbered superscripts, matching the reference's fragment policy.
  Desktop navigation respects the existing desktop link
  policy; no Markdown host-file opener or source file-link behavior is added.
- Long inline code uses wrapping inline fragments instead of inline-flex chips
  so identifiers fit narrow columns. Tables, unwrapped preformatted blocks,
  and display math scroll locally, including at 390px; table scrolling remains
  available without the source's hover-only scrollbar toggle.
- Link/focus colors map to existing `--ai-composer-send`; quote borders map to
  `--ai-composer-caption`, rules to `--ai-composer-stroke`, and dark code banners
  to `--ai-composer-fill`. Remaining neutrals and all nine Shiki token colors
  resolve to the pinned source's light/dark values. Only local font fallbacks
  are used; font availability can change glyph metrics. KaTeX's bundled font
  files are emitted as local assets, without a network font dependency.
- Footnotes use the source small-text scale (12/20). Source app-specific file
  mentions, image lightboxes, compact/tool variants, and adjustable typography
  settings are outside this assistant Markdown stylesheet's scope.

Full pixel parity is not claimed until the integrated renderer is measured
against the pinned reference with the same content, fonts, viewport, and theme.
Compilation, selector checks, and isolated layout checks do not prove semantic,
security, interaction, or full-application visual parity.

## Resource Limits

Replies above 128 KiB, 2,048 line breaks, 512 reference openers or 4,096 emphasis/
math delimiters remain full literal text before entering the parser. The parsed
tree has a 20,000-node/depth-64 budget. Generated table padding is charged
against that same budget. Each reply renders at most 64 live formula components;
later formulae keep their TeX source as inline code.
Code above 64 KiB or 1,000 lines uses one text node instead of token/line views,
with exact-source copying preserved. Formula input is capped at 2,048 characters,
96 commands and brace depth 24; authored macro definitions remain literal to
prevent short input from amplifying into a large tree. KaTeX runs with fresh
macros, `trust: false`, `maxExpand: 50`, `maxSize: 10`, the reference's strict
retry, and a 64 KiB generated-markup cap. These safety fallbacks are intentional
differences from unrestricted rendering and never discard source text.

## Validation

Focused AI/UI suite: 499 browser-backed tests passed, including Markdown,
code-copy/wrap, formula trust, table amplification and source preservation.
TypeScript, scoped ESLint, i18n audit and production compilation passed.
The dependency lock and its 13 regression tests passed. Full dependency-cache
verification still reports `Perfetto UI node_modules cache mismatch`; no
unrelated Perfetto installation was replaced for this feature.

The deterministic browser workflow exercises the production bundle through the
real Go launcher and AI gateway. Markdown evidence contains 11 checks across
12 viewport/theme/zoom combinations and 29 screenshots. Files stay under the
existing `dist/validation/ai-markdown-*` paths. Image inspection supplements
layout/semantic assertions, not a pixel-identical live DeepSeek reference claim.
Remote-image fixtures generated no requests. Clipboard API stubbing verifies
exact copied text, not native operating-system permission handling.

## Upstream License

MIT License

Copyright (c) 2026 DeepSeek

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
