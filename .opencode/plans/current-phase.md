# Current Phase

Selected candidate id: runtime-model-selection-e2e

Status: pending

## Goal
Implement end-to-end runtime model selection so the user-chosen local Ollama model is actually used by chat requests instead of silently defaulting to the first available runtime model.

## Why this phase is next
- There is explicit user scope to fix the audited issues, and model-selection integrity is the highest-priority visible product gap in that sequence.
- The current UI exposes local model selection, but the runtime chat path still defaults to the first available model, so the visible control is not yet behaviorally real.
- This is the smallest safe first fix because it stays inside the existing web/runtime/chat surface without introducing schema hardening, persistence migration, or broader infrastructure changes.
- This phase creates a stable base for the next bounded follow-up phases: request-schema hardening and SQLite/Prisma persistence.

## Primary files
- `apps/web/app/components/runtime-status.tsx`
- `apps/web/app/components/chat-workbench.tsx`
- `apps/web/app/api/chat/route.ts`
- `apps/web/lib/runtime/ollama.ts`
- `apps/web/lib/runtime/model-selection-store.ts`

## Expected max files changed
5

## Forbidden paths
- `.opencode/backlog/**`
- `.opencode/agents/**`
- `.opencode/commands/**`
- `.github/**`
- `docs/**`
- `README.md`
- `apps/web/prisma/**`
- `node_modules/**`
- `apps/web/.next/**`

## Risk
The main risk is introducing silent fallback behavior that still masks model-selection bugs instead of making selection deterministic and observable.

A second risk is scope drift into broader chat-session persistence or API schema hardening before this phase makes the selected-model path real.

## Rollback note
If this phase becomes unstable, revert the selected-model propagation changes and restore the prior first-model runtime behavior, keeping all rollback limited to the listed files.

## In scope
- Persist the selected runtime model for the current local web session.
- Pass the selected model from the UI/chat path into the chat API request.
- Update the chat API/runtime layer to use the explicitly selected model.
- Fail clearly when the selected model is missing or no longer available instead of silently switching to another model.

## Out of scope
- SQLite or Prisma setup.
- Companion draft persistence changes.
- Lesson or progress persistence changes.
- General request-schema hardening beyond the minimal fields needed for selected-model support.
- Test-framework introduction or CI workflow changes.
- Docs, backlog, or workflow artifact edits.

## Tasks
- Review the current runtime-status selection behavior and identify where the selected model is currently UI-only.
- Add a small local model-selection store for the active web session.
- Update the runtime-status UI so the selected model is saved and recoverable in-session.
- Update the chat workbench to include the selected model in outbound chat requests.
- Update the chat API route to accept and pass through the selected model.
- Update the Ollama runtime layer to use the selected model instead of the first available model.
- Return a clear failure when the selected model is unavailable or empty.

## Validation command
`pnpm --filter web validate`

## Validation
- PENDING: validator must run `pnpm --filter web validate`.
- Expected validator checks:
  - typecheck passes
  - Next.js build passes
  - web smoke passes
- Validator should also confirm behavior by reviewing that selected-model propagation is explicit from UI -> request -> api -> runtime call and that no silent first-model fallback remains.

## Repair targets
- none

## Acceptance criteria
- Selected runtime model is saved for the active local web session.
- Chat requests include the selected model.
- Runtime chat uses the selected model instead of the first available model.
- Missing or stale selected models fail clearly instead of silently falling back.
- `pnpm --filter web validate` passes.

## Completion summary
- files changed:
  - none yet
- implementation summary:
  - not started
- known risks:
  - selected-model state may still be session-local until a later persistence phase
  - unavailable local models must fail clearly without regressing chat UX into a silent fallback path
