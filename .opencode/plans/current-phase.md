# Current Phase

Selected candidate id: local-model-connectivity

Status: complete

## Goal
Add a minimal Ollama connectivity slice for the existing web shell: a runtime health check, model listing endpoint, and a bounded UI that shows connected/disconnected state and allows temporary model selection.

## Why this phase is next
- Chosen by explicit_user_scope: the backlog contains `local-model-connectivity`, and the user required using that exact candidate id when valid.
- It is valid against the current repo state: the workspace bootstrap and initial studio shell already exist, so runtime connectivity is now a sensible follow-up on the active `apps/web` module.
- It directly advances a core V1 requirement from `docs/product-spec.md`: connect to a local model runtime, surface runtime status, list models, and support model selection.
- It remains bounded to a single module and can fit the default file budget.

Stronger alternatives rejected:
- `foundation-workspace-bootstrap` was rejected even though it has higher priority because the repo already has `package.json`, `pnpm-workspace.yaml`, `apps/web`, and a runnable Next app shell; selecting it would repeat completed groundwork instead of moving the product forward.
- `studio-shell-and-routing` was rejected even though it has higher priority because the current app already exposes the main shell and placeholder routes for Create, Lessons, Progress, and Chat; it appears materially satisfied by the current repo state.
- `companion-creation-wizard` was rejected because explicit user scope takes precedence, and runtime connectivity is the more direct fit for the local-first product promise before persistence-heavy creation flow work.
- Lower-priority candidates were rejected because they either depend on more application structure or broaden scope beyond the smallest safe next step.

## Primary files
- `apps/web/app/page.tsx`
- `apps/web/app/api/runtime/health/route.ts`
- `apps/web/app/api/runtime/models/route.ts`
- `apps/web/lib/runtime/ollama.ts`
- `apps/web/app/components/runtime-status.tsx`

## Expected max files changed
5

## Forbidden paths
- `node_modules/**`
- `apps/web/.next/**`
- `packages/**`
- `docs/**`
- `.opencode/backlog/**`
- `apps/web/app/create/**`
- `apps/web/app/lessons/**`
- `apps/web/app/progress/**`
- `apps/web/app/chat/**`

## Risk
The main risk is over-expanding from a small connectivity slice into broader runtime management, persistence, or chat integration. A secondary risk is coupling the phase to a live local runtime during implementation instead of keeping disconnected behavior explicit and graceful.

## Rollback note
If this phase fails validation or needs to be reverted, remove the runtime helper, the two API routes, and the homepage connectivity UI, returning the app to the current shell-only state.

## In scope
- Add a minimal Ollama runtime helper in `apps/web/lib/runtime/ollama.ts`.
- Add a GET health endpoint for runtime status.
- Add a GET models endpoint for listing locally available models.
- Add a small web UI in the existing shell that shows connected/disconnected state.
- Add a temporary, non-persistent model selection control backed by the fetched model list.
- Handle disconnected runtime responses without crashing the page.

## Out of scope
- Persisting the selected model to a database or settings store.
- Companion creation, lessons/evals, progress, or chat behavior.
- Support for runtimes other than Ollama.
- Background polling, retries, streaming, or advanced connection diagnostics.
- Refactoring unrelated shell or route structure.

## Tasks
- Create a thin Ollama client wrapper with bounded methods for health and model listing.
- Implement `/api/runtime/health` route.
- Implement `/api/runtime/models` route.
- Add a focused runtime status/model picker UI to the existing homepage shell.
- Ensure disconnected runtime cases render a clear non-fatal state.

## Validation command
`pnpm --filter web build`

## Validation
PASS

- Acceptance criteria met: `apps/web/app/api/runtime/health/route.ts` returns the bounded Ollama health shape, `apps/web/app/api/runtime/models/route.ts` returns the model list shape, and `apps/web/app/components/runtime-status.tsx` renders connected/disconnected status plus temporary in-page model selection.
- Validation command passed: `pnpm --filter web build` completed successfully on 2026-04-08.
- Scope stayed bounded to the planned runtime connectivity slice in `apps/web`; no unrelated route/module refactors were introduced.
- File-count check passed for implementation scope: 5 product files changed, matching the expected max of 5. The phase metadata file changed separately as required by workflow.
- Forbidden tracked artifacts check passed: no tracked `node_modules/**` or `apps/web/.next/**` files were found. Build produced an untracked `apps/web/tsconfig.tsbuildinfo`, but it is not tracked.

## Repair targets
none

## Acceptance criteria
- Runtime health endpoint exists and returns a deterministic connected/disconnected shape.
- UI shows connected/disconnected state without requiring unrelated routes or features.
- Local model list can be displayed from the runtime models endpoint.
- User can choose a model from the displayed list for the current page session.
- Phase stays within the listed primary files or a clearly equivalent set, without unrelated refactors.
- Validation command passes.

## Completion summary
- Files changed:
  - `.opencode/plans/current-phase.md`
  - `apps/web/app/page.tsx`
  - `apps/web/app/api/runtime/health/route.ts`
  - `apps/web/app/api/runtime/models/route.ts`
  - `apps/web/lib/runtime/ollama.ts`
  - `apps/web/app/components/runtime-status.tsx`
- Implementation summary:
  - Added a thin Ollama runtime helper with bounded health and model-list methods plus deterministic disconnected responses.
  - Added GET runtime health and models API routes for the web app.
  - Added a homepage runtime status panel that shows connected/disconnected state, lists local models, and supports temporary in-page model selection.
- Known risks:
  - Runtime availability still depends on a local Ollama instance responding at the configured base URL.
  - The model picker is intentionally session-local and does not persist across refreshes.
