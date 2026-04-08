# Current Phase

Selected candidate id: local-model-connectivity

Status: complete

## Goal
Replace the placeholder local reply path in `apps/web/app/api/chat/route.ts` with a bounded Ollama chat request path that uses the existing runtime base URL configuration and returns a stable fallback error when the local runtime is unavailable.

## Why this phase is next
- Explicit user scope is `ollama-chat-request-path`, which maps most directly to the remaining local runtime integration work in the `web` module.
- `chat-workbench` is already listed in `.opencode/backlog/completed.yaml`, so it cannot be re-selected even though this phase touches its API boundary.
- This is the smallest safe slice that makes the shipped chat surface use the real local runtime without broadening into streaming, model management, or UI redesign.
- Existing runtime health and model-list surfaces appear materially present already; if shipper confirms earlier connectivity work was validated but not ledgered, shipper should reconcile that separately on the next validated ship.

## Primary files
- `apps/web/app/api/chat/route.ts`
- `apps/web/lib/runtime/ollama.ts`
- `apps/web/app/components/chat-workbench.tsx`

## Expected max files changed
3

## Forbidden paths
- `node_modules/**`
- `apps/web/.next/**`
- `packages/**`
- `docs/**`
- `.github/**`
- `.opencode/backlog/**`
- `apps/web/app/create/**`
- `apps/web/app/lessons/**`
- `apps/web/app/progress/**`
- `apps/web/app/api/runtime/**`
- `apps/web/app/components/runtime-status.tsx`

## Risk
The main risk is accidental scope drift from a bounded request-path change into streaming, model selection persistence, or a broader runtime refactor. A secondary risk is brittle error handling if the chat route assumes Ollama availability instead of preserving a stable failure response.

## Rollback note
If this phase must be reverted, restore `apps/web/app/api/chat/route.ts` to its current placeholder reply behavior and remove any new Ollama chat helper logic added for this phase.

## In scope
- Add a reusable Ollama chat request helper in the existing runtime layer.
- Update the chat API route to call the Ollama helper instead of returning a deterministic placeholder reply.
- Preserve the existing runtime base URL configuration path.
- Return a bounded, user-safe error response when Ollama cannot satisfy the request.
- Make only the smallest chat UI adjustment needed if the client must handle the new response or error shape.

## Out of scope
- Streaming responses, token-by-token UI, or markdown rendering.
- New runtime health or model-list UI work.
- Model picker persistence, multi-model orchestration, or prompt-template redesign.
- Changes to create, lessons, progress, or broader navigation flows.
- Ledger updates to `.opencode/backlog/completed.yaml`.

## Tasks
- Add a typed Ollama chat request function to `apps/web/lib/runtime/ollama.ts` using the configured base URL.
- Update `apps/web/app/api/chat/route.ts` to build a bounded message payload and forward it to Ollama.
- Keep the route response shape stable for the chat workbench, adding only the smallest client adjustment if needed.
- Ensure disconnected or non-OK Ollama responses become stable error replies instead of unhandled failures.

## Validation command
`pnpm --filter web validate`

## Validation
- PASS: `pnpm --filter web validate` passed on this run (`typecheck`, `next build`, and `smoke-web.sh`).
- Checked files: `apps/web/app/api/chat/route.ts`, `apps/web/lib/runtime/ollama.ts`, `apps/web/app/components/chat-workbench.tsx`.
- Scope and repo checks passed: 3 changed files matched the expected max of 3, no forbidden paths were changed, and no tracked generated artifacts were found under `node_modules/**` or `apps/web/.next/**`.
- Acceptance criteria satisfied: chat now goes through the local Ollama request path, the route reuses runtime-layer base URL logic, unavailable/non-OK runtime cases return a bounded reply payload the workbench can render, and the phase stayed scoped to the chat request path.

## Repair targets
none

## Acceptance criteria
- Sending a chat message goes through the local Ollama request path instead of the placeholder string generator.
- The chat route reuses the configured Ollama base URL logic from the runtime layer.
- If Ollama is unavailable or returns a non-OK response, the route returns a stable failure response that the workbench can handle without crashing.
- The phase stays bounded to the chat request path and does not expand into streaming or broader runtime refactors.
- `pnpm --filter web validate` passes.

## Completion summary
- Files changed: `.opencode/plans/current-phase.md`, `apps/web/app/api/chat/route.ts`, `apps/web/lib/runtime/ollama.ts`
- Implementation summary: added a reusable Ollama chat helper that reuses the configured base URL and selects the first available local model, then updated the chat API route to send a bounded message history plus companion context through that helper and return a stable fallback reply when the runtime is unavailable or returns a bad response.
- Known risks: chat requests currently use the first available local model because model selection persistence is out of scope for this phase; the fallback reply includes the runtime error text, which is stable but may still vary slightly by failure mode.
