# Current Phase

Selected candidate id: runtime-model-selection-e2e

Status: complete

## Goal
Make local model selection real end-to-end so the user-selected runtime model is saved for the local chat session, sent on chat requests, and used by the Ollama runtime without silently falling back to the first available model.

## Why this phase is next
- After excluding ids already listed in `.opencode/backlog/completed.yaml`, `runtime-model-selection-e2e` is the highest-priority unshipped candidate.
- It stays inside the existing web chat/runtime surface and fits the default bounded 5-file phase size.
- It is a direct same-module follow-up to the shipped web/chat work and removes a concrete hidden behavior (`first-model-wins`) without expanding into broader refactors.
- `pnpm --filter web validate` is a clear stable validator command for this phase.
- The previous active plan referenced shipped runtime model-selection work, but the canonical ledger does not mark this candidate complete, so this plan resets the active phase to the ledger-backed next step.

## Primary files
- `apps/web/app/components/runtime-status.tsx`
- `apps/web/app/components/chat-workbench.tsx`
- `apps/web/app/api/chat/route.ts`
- `apps/web/lib/runtime/ollama.ts`
- `apps/web/lib/runtime/model-selection-store.ts`

## Expected max files changed
5

## Forbidden paths
- `.opencode/**`
- `.github/**`
- `docs/**`
- `README.md`
- `apps/web/prisma/**`
- `apps/web/app/create/**`
- `apps/web/app/lessons/**`
- `apps/web/app/progress/**`
- `node_modules/**`
- `apps/web/.next/**`

## Risk
The main risk is creating inconsistent selection state between the runtime status UI, the local model-selection store, and the chat request path.

A second risk is accidentally expanding this phase into full request-schema hardening or broader persistence changes instead of only fixing explicit selected-model flow and failure behavior.

## Rollback note
If this phase becomes unstable, revert the explicit selected-model plumbing and restore the prior behavior only within the listed files, without touching unrelated chat, persistence, or workflow files.

## In scope
- Persist an explicit selected runtime model for the local chat session.
- Wire the runtime status UI to read and update the selected model.
- Include `selectedModel` on chat requests from the chat workbench.
- Require and use `selectedModel` in the chat API/runtime path.
- Fail clearly when the selected model is missing or stale instead of silently falling back.

## Out of scope
- Full chat request schema hardening beyond what is strictly required for `selectedModel` flow.
- SQLite, Prisma, or any server-backed persistence.
- Companion draft, lessons, or progress changes.
- New routes, layout work, or broader chat UI redesign.
- Docs, backlog, governance, or workflow artifact edits.

## Tasks
- Trace the current runtime model selection flow across runtime status, chat workbench, chat route, and Ollama runtime helper to identify where implicit first-model fallback still occurs.
- Update `apps/web/lib/runtime/model-selection-store.ts` so the selected model is represented explicitly and can detect missing or stale selections.
- Update `apps/web/app/components/runtime-status.tsx` to write the user-selected model into the shared local selection flow.
- Update `apps/web/app/components/chat-workbench.tsx` to send `selectedModel` on chat requests and surface a clear failure when no valid model is selected.
- Update `apps/web/app/api/chat/route.ts` to require `selectedModel` and return a stable clear failure for missing or stale models.
- Update `apps/web/lib/runtime/ollama.ts` so runtime chat uses `selectedModel` and does not fall back to the first available model.
- Keep all implementation changes bounded to the listed files.

## Validation command
`pnpm --filter web validate`

## Validation
- PASS: `pnpm --filter web validate` passed (`typecheck`, `next build`, and `smoke`).
- PASS: scope stayed within the bounded phase files: `.opencode/plans/current-phase.md`, `apps/web/lib/runtime/model-selection-store.ts`, `apps/web/app/components/runtime-status.tsx`, `apps/web/app/components/chat-workbench.tsx`, and `apps/web/app/api/chat/route.ts`.
- PASS: expected max files changed was met at 5 files total, with no tracked generated artifacts under `node_modules/**` or `apps/web/.next/**`.
- PASS: `apps/web/lib/runtime/model-selection-store.ts` persists selected model plus available-model snapshot in session storage, and `apps/web/app/components/runtime-status.tsx` reads/writes that state for the local chat session.
- PASS: `apps/web/app/components/chat-workbench.tsx` includes `selectedModel` in the `/api/chat` request body.
- PASS: `apps/web/lib/runtime/ollama.ts` uses `selectedModel` for runtime chat (`model: selectedModel`) and rejects unavailable selections instead of falling back to the first model.
- PASS: missing selections fail clearly in `apps/web/app/components/chat-workbench.tsx` and `apps/web/app/api/chat/route.ts`; stale selections fail clearly in `apps/web/app/components/runtime-status.tsx`, `apps/web/app/components/chat-workbench.tsx`, and server-side in `apps/web/lib/runtime/ollama.ts` with `Selected model "..." is not available in the local Ollama runtime.`

## Repair targets
- none

## Acceptance criteria
- Selected runtime model is saved for the local chat session.
- Chat requests include `selectedModel`.
- Runtime chat uses `selectedModel` instead of the first available model.
- Missing or stale selected models fail clearly instead of silently falling back.
- `pnpm --filter web validate` passes.

## Completion summary
- files changed:
  - `.opencode/plans/current-phase.md`
  - `apps/web/lib/runtime/model-selection-store.ts`
  - `apps/web/app/components/runtime-status.tsx`
  - `apps/web/app/components/chat-workbench.tsx`
  - `apps/web/app/api/chat/route.ts`
- implementation summary:
  - stored runtime model selection in session storage as explicit local session state with the selected model plus the latest available-model snapshot so missing and stale selections can be detected
  - updated runtime status to persist available models, preserve unavailable selections, and show a clear stale-selection message instead of silently clearing or falling back
  - updated chat submission and the chat API to require a valid `selectedModel` and surface stable clear errors for missing or stale model selections
- known risks:
  - stale detection depends on the runtime status fetch refreshing the locally saved available-model list before chat is sent in a given session
  - runtime availability failures and stale-model failures now share the same non-2xx API error path, so future UI work may want finer-grained recovery messaging
