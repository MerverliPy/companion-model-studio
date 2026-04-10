# Current Phase

Selected candidate id: behavior-tests-and-ci

Status: pending

## Goal
Add bounded behavior-level test coverage for the highest-risk shipped flows and wire those tests into the stable `apps/web` validation path so confidence no longer depends only on typecheck, build, and file-existence smoke checks.

## Why this phase is next
- There is explicit user scope to continue the audited follow-up chain after the shipped persistence and CI-fix work.
- The app now validates cleanly, so the next smallest safe step is to add real behavior coverage for the highest-risk shipped surfaces rather than continuing with ad hoc manual verification.
- This phase stays web-scoped and improves confidence in already-shipped behavior without reopening persistence schema work or broader docs alignment.
- Completing this phase creates a stronger base for the final follow-up phase: `docs-reality-alignment`.

## Primary files
- `apps/web/package.json`
- `apps/web/vitest.config.ts`
- `apps/web/app/api/chat/route.test.ts`
- `apps/web/app/components/chat-workbench.test.tsx`
- `apps/web/lib/studio-behavior.test.ts`

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
- `apps/web/app/create/**`
- `apps/web/app/lessons/**`
- `apps/web/app/progress/**`
- `apps/web/app/chat/page.tsx`
- `node_modules/**`
- `apps/web/.next/**`

## Risk
The main risk is introducing an oversized test harness or broad refactors instead of adding only the bounded test coverage needed for the highest-risk shipped behaviors.

A second risk is weakening the stable validation path by adding flaky or environment-sensitive tests that do not fit the local-first web app surface.

## Rollback note
If this phase becomes unstable, revert the test harness and validation-script changes and restore the prior web validation path, keeping all rollback limited to the listed files.

## In scope
- Add a small bounded test setup for `apps/web`.
- Add behavior tests for the chat request boundary.
- Add UI coverage for the selected-model chat flow.
- Add deterministic tests for persisted lesson/progress derivation behavior.
- Wire the tests into `pnpm --filter web validate`.

## Out of scope
- New product features.
- Persistence schema changes.
- New API routes beyond what tests need to exercise current behavior.
- Broad CI workflow redesign.
- Docs, backlog, or workflow artifact edits.

## Tasks
- Add a minimal test runner configuration for `apps/web`.
- Update `apps/web/package.json` so the stable `validate` script runs tests before build and smoke.
- Add a route test for `/api/chat` covering schema rejection and selected-model dispatch behavior.
- Add a UI test for the chat workbench covering the selected-model flow.
- Add a deterministic behavior test covering persisted lesson/progress derivation.
- Keep all changes bounded to the listed files.

## Validation command
`pnpm --filter web validate`

## Validation
- PENDING: validator must run `pnpm --filter web validate`.
- Expected validator checks:
  - tests pass
  - typecheck passes
  - Next.js build passes
  - web smoke passes
- Validator should also confirm:
  - tests are behavior-focused rather than file-existence checks
  - chat route coverage includes invalid-request rejection and selected-model handling
  - progress-related coverage is deterministic and not dependent on ambient local state

## Repair targets
- none

## Acceptance criteria
- `pnpm --filter web validate` runs tests before build and smoke.
- Chat route tests cover schema rejection and selected-model dispatch.
- Model-selection flow has UI coverage.
- Persisted lesson/progress derivation has deterministic test coverage.
- `pnpm --filter web validate` passes.

## Completion summary
- files changed:
  - none yet
- implementation summary:
  - not started
- known risks:
  - test setup must stay small and deterministic
  - validation should not become flaky or dependent on external runtime state
