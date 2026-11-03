# DeepSeek Harness Markdown Extensions

Read-only source reference: `deepseek-ai/deepseek-harness`, revision
`ce7073d51254c26cd63b22a60835b8f948deb447`.

`cjkFriendlyStrong.ts` and `mathCompatibility.ts` are vendored from
`packages/client/ui-primitives/src/markdown/` under the included MIT license.
They preserve the reference's CJK strong emphasis and TeX delimiter grammar.
Import ordering and lint annotations may differ. One equivalent explicit
undefined guard supports WinScope's strict TypeScript checks; grammar behavior
is unchanged.

The Angular adapter in `src/services/ai_markdown.ts` uses the same mdast, GFM
and math parsing libraries. It does not import React, host file access,
workspace agents or skills. Raw HTML remains literal text and images remain
alt text, avoiding automatic remote requests and local filesystem exposure.
