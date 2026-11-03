# Winscope AI Module

`ai/` is an independent Node module. It owns the model/provider boundary,
agent and skill registries, deterministic display evidence analysis, HTTP/SSE
gateway, CLI and MCP stdio server. The Angular application only consumes the
same-origin gateway contract.

## Build and run

```sh
npm run ai:build
npm run ai:test
npm run ai:serve -- --port 7341
npm run ai:cli -- list-agents
npm run ai:mcp
```

Start Winscope with the launcher proxy after the gateway is running:

```sh
npm start -- --offline-only --open --ai-url http://127.0.0.1:7341
```

## Providers

### Read-only timeline queries

With trace context enabled, a submitted conversation includes a fresh snapshot
of the manually selected timeline position and authorizes the model to query
other times in the same loaded traces. For example: `Analyze the current frame`
or `Get WinScope data at 1s200ms and explain the visible layers`. This is a
browser-backed API, not filesystem access or an external MCP trace reader.

The provider-neutral tool protocol accepts a whole JSON response:

```json
{"tool":"winscope_query_trace","arguments":{"time":"1s200ms"}}
```

Omit `time` for the latest manually selected position. Accepted formats match
the timeline: integer nanoseconds with optional `ns`, elapsed units, full date
and time, or time of day using the current trace date. The query reuses viewer
frame/entry matching without moving the timeline. Snapshot entries contain
actual hierarchy and property values, requested/matched nanosecond timestamps,
source identities and partial/truncation reasons; raw media is excluded.
Each snapshot also exposes `windowManager` time-alignment metadata. Its entries
give the exact requested and matched nanosecond timestamps, signed `deltaNs`,
matching strategy and a `dataPath` into the snapshot's actual window hierarchy.
The hierarchy is not duplicated, preserving the payload budget. `available`,
`partial` and `unavailable` distinguish a usable timed match from truncated,
untimed or absent data. A point-in-time match is not proof of a complete timeline
or of the display's on/off state.
After an accepted query, deterministic evidence checks are rerun against the
latest snapshot and their results replace the earlier checks for that turn.
WindowManager missing-data warnings therefore clear only after a usable WM
observation is actually received. Partial/untimed data remains qualified;
failed, oversized or cancelled queries do not upgrade prior evidence claims.

The initiating request opts in with `traceQueryEnabled: true` and a fresh
`traceQueryContextId`. The gateway emits `trace_query_requested` through the
session SSE stream with `{queryId, contextId, query}`. The initiating browser
replies to `POST /api/sessions/:sessionId/trace-query/:queryId` with
`{contextId, result}` or `{contextId, error}`. Only the matching pending request
in that running turn is accepted. Results are not saved in event logs or
conversation history. Stale replies fail with 409; results over 128 KiB fail
with 413. Each run permits at most four queries, a query waits at most 20 seconds,
and cancellation/shutdown releases pending requests.
Session detail exposes only the currently pending query metadata so an owning
browser can reconnect. That metadata does not authorize local reads: a restored
browser without the original in-memory consent replies with an error.

Snapshot reads have a shared 10-second deadline and a 96 KiB UTF-8 output cap.
The provider context has a cumulative 192 KiB evidence budget. Missing data,
range errors and truncated results must not be presented as complete evidence.

### Provider configuration

Built-in command provider IDs are `codex`, `claude` and `ds`. They execute the
configured executable without a shell and send the prompt through stdin. The
actual command flags are intentionally configurable because local CLI versions
and authentication modes differ.

An OpenAI-compatible provider can be added through a JSON config:

```json
{
  "providers": [
    {
      "id": "local-model",
      "kind": "openai-compatible",
      "baseUrl": "http://127.0.0.1:12345/v1",
      "model": "your-model",
      "apiKeyEnv": "LOCAL_MODEL_API_KEY"
    }
  ]
}
```

Use `WINSCOPE_AI_CONFIG=/path/to/config.json` or `--config` with the CLI.
Credentials remain environment references; values are not stored in manifests.

### Read local Codex and Claude settings

Standalone AI settings has separate Codex and Claude sections with their own
**Get configuration** actions. Each action updates only that provider in the
running gateway and fills its fields without restarting the gateway or clearing
conversations. The application-level Settings page owns General/AI navigation;
opening it does not create a conversation workspace. Menu switches preserve
independent provider drafts. The last successful Get configuration selects the
single active provider. A failed or cancelled read leaves the previous provider
selected. Save validates and retains only this provider's model/effort selection;
inactive drafts do not block it. The composer lists only the saved provider's
models, so model changes cannot silently switch providers. Ongoing runs are not
interrupted when settings or a different conversation is opened.

- Codex requires a locally installed CLI with `app-server`, a readable
  `$CODEX_HOME/config.toml` (default `~/.codex/config.toml`), and its existing
  authentication. The gateway uses `config/read` and paginated `model/list` JSON-RPC
  calls, letting Codex resolve TOML, profiles and custom model catalogs. Reading
  configuration does not create an agent thread or run a model turn.
- Claude reads `$CLAUDE_CONFIG_DIR/settings.json` (default
  `~/.claude/settings.json`). The list includes the configured model, local
  `modelPicker.options`, `ANTHROPIC_DEFAULT_*_MODEL` mappings and built-in aliases.
  `ANTHROPIC_MODEL` in the gateway environment overrides the configured default.
  Namespaced models and context suffixes such as `[1m]` remain intact.
- Imported providers invoke their local CLI with the selected model and existing
  local authentication, from the user's home directory. Codex remains read-only
  and ephemeral; Claude has no built-in tools and disables conversation persistence.
  Only supported low/medium/high effort overrides are exposed by this gateway.
- This is a gateway-local operation, not a browser file picker or a copy of
  configuration/credentials. The API returns only model/provider descriptors;
  keys, tokens, raw configuration and local file paths are not sent to the browser
  or stored in browser storage. Imports last for this gateway process; repeat
  Get configuration after restarting it or changing local settings. Claude's list is derived
  from local settings/aliases, not a guarantee of remote model access.

Imported descriptors preserve `defaultModelId` and `importedFrom` and include
optional `localConfig` display metadata: `baseUrl`, `providerName`,
`authentication` (`configured` or `cli-managed`) and supported low/medium/high
`reasoningLevel`. Codex uses its effective selected provider and
`model_reasoning_effort`; Claude uses merged `ANTHROPIC_BASE_URL` and credentials
from settings/environment, plus `effortLevel`. URLs are limited to HTTP(S),
bounded in length, and stripped of user information, query strings, fragments
and suspicious paths. `configured` reports only a recognized nonempty credential
source, not a successful login or remote access check. `cli-managed` leaves login
to the CLI; it does not mean unauthenticated. The gateway does not read
`auth.json`, return credentials, or write local CLI settings or credentials.

`POST /api/providers/import-local` accepts only `{"providerId":"codex"}` or
`{"providerId":"claude"}` and returns `{"provider": ...}`. It does not accept
arbitrary file paths or executable names. Missing/invalid configurations and CLI
failures leave the previous provider registered and return a sanitized error.
Concurrent imports and imports during any active run (including child agents) are rejected.
The Codex probe has bounded output, pagination and a 20-second timeout.

## External agents and skills

Agents are JSON files named `agent.json` or `agents.json`. Skills use
`skill.json` or `skills.json`. A config can load directories recursively:

```json
{
  "agentPaths": ["/path/to/agents"],
  "skillPaths": ["/path/to/skills"]
}
```

Agents can reference skills, declare child agent references, and embed custom
subagents. External imports are registered at runtime and are visible through
both CLI and MCP.

## MCP

The `mcp` command speaks line-delimited JSON-RPC on stdin/stdout and exposes
`list_agents`, `list_skills`, `analyze_trace`, `run_agent`, `import_agent` and
`import_skill`. Diagnostic logging goes to stderr so stdout remains a protocol
channel.

## Chat sessions and model selection

The gateway supports the chat-workspace lifecycle:

- `GET /api/sessions`: summaries ordered by most recently updated;
- `GET /api/sessions/:id`: summary, complete event history and latest result;
- `POST /api/analyze`: create a session;
- `POST /api/sessions/:id/continue`: append a turn to the same session;
- `GET /api/sessions/:id/stream?after=N`: replay events after the last received
  numeric SSE ID, then follow a running turn;
- `POST /api/sessions/:id/cancel`: stop a running turn; and
- `GET /api/sessions/:id/report?format=markdown|html`: export the latest turn.

Create/continue bodies accept `prompt`, `providerId`, `modelId`,
`reasoningLevel` (`low`, `medium`, `high`), structured `evidence` and text
`attachments`. Agent identity is fixed for a conversation; start a new session
to choose another agent. Invalid settings return 400, an already-running
conversation returns 409, and oversized input returns 413. Omitting `providerId`
on continuation preserves the previous provider; explicit `providerId: null`
resets to the agent default, including no provider for a deterministic agent.

Sessions live **only in gateway memory**. Reopening the panel or reloading the
page can restore transcript/events while that same gateway process runs. A
gateway restart clears conversations; this is not durable disk history. No
credentials, prompts or attachment contents need browser storage. The gateway
keeps at most 100 sessions (evicting the oldest settled session) and 24 turns per
session. Model history retains recent complete turn pairs up to 64 KiB, with
individual history messages capped at 32 KiB and an explicit truncation note.
Current-turn attachments are sent in full within the limits below.

`GET /api/providers` returns model options, supported reasoning levels and
`supportsCustomModel`. `default` means the provider's configured/CLI default.
Built-in Codex uses non-interactive `exec` with a read-only sandbox and actual
`--model` / `model_reasoning_effort` overrides. Built-in Claude uses `--print`,
disables tools and passes actual `--model` / `--effort` flags. The model list is
not an availability/authentication probe: custom identifiers may still be
rejected by the installed CLI or remote service. No Codex server model names
are hardcoded; configured catalogs supply selectable deployment-specific IDs.

Generic commands (including `ds`) do not pretend to support model or reasoning
selection. Opt in through explicit argument templates:

```json
{
  "providers": [{
    "id": "custom-cli",
    "kind": "command",
    "executable": "your-command",
    "args": ["--non-interactive"],
    "models": [{"id": "your-model", "name": "Your model"}],
    "modelArgs": ["--model", "{{model}}"],
    "reasoningArgs": ["--effort", "{{level}}"],
    "reasoningLevels": ["low", "medium", "high"]
  }]
}
```

These are argument vectors, never shell commands. OpenAI-compatible provider
configurations may also declare `models` and `reasoningLevels`; configured
reasoning levels are forwarded as `reasoning_effort`, and unsupported levels
are rejected instead of being appended as a prompt instruction. Before enabling
this field, verify that the chosen API/model supports it.

Attachments are `{name, mimeType, content}` UTF-8 text objects, not local file
paths or placeholder filenames. Only `text/plain`, `text/markdown` and
`application/json` are accepted: at most 6 files, 64 KiB each, 256 KiB total.
Their contents enter the current model prompt as untrusted user-supplied data;
SSE history exposes only name/type/byte-count metadata. Binary images, videos,
raw traces and arbitrary filesystem paths are unsupported. Trace context stays
on the existing structured evidence boundary.

### Local HTTP boundary

The gateway binds only to `127.0.0.1`, `localhost` or `::1`. Every request must
carry a strict loopback `Host` authority (`127.0.0.1`, `localhost`, `[::1]`,
optionally with a valid port). Supplied `Origin` headers must also be loopback
HTTP(S) origins; a different loopback frontend/launcher port is allowed. Local
CLI clients may omit `Origin`. All POST mutations require `application/json`;
simple browser form/text requests are rejected before provider execution.
OPTIONS is rejected and no CORS permission headers are emitted. This boundary
prevents remote web origins and DNS-rebinding hostnames from using local agent
commands; it is not authentication against other applications on the same host.
