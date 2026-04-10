# Current Phase

Selected candidate id: server-backed-lesson-results

Status: pending

## Goal
Cut lesson result persistence over from browser localStorage to the shipped SQLite/Prisma foundation so lesson attempts and the progress view read the same server-backed result history.

## Why this phase is next
- There is explicit user scope to queue `server-backed-lesson-results` as the next bounded phase.
- `sqlite-prisma-foundation` is now shipped, so the repo has the persistence base needed for a focused lesson-result cutover.
- This is a bounded web-only persistence phase that updates lesson result reads and writes without bundling chat-session migration into the same change.
- Lesson results directly drive progress and recent achievements, so this phase has clear user-visible value with stable validation.

## Primary files
- `apps/web/app/api/lesson-results/route.ts`
- `apps/web/lib/evals/result-store.ts`
- `apps/web/lib/evals/result-repository.ts`
- `apps/web/app/components/lesson-attempt-panel.tsx`
- `apps/web/app/progress/page.tsx`

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
- `apps/web/app/chat/**`
- `apps/web/app/api/chat/route.ts`
- `node_modules/**`
- `apps/web/.next/**`

## Risk
The main risk is partially migrating lesson-result reads and writes so the lesson attempt flow, progress page, and badge derivation disagree about which result history is canonical.

A second risk is scope drift into chat-session migration or broader eval redesign before the bounded result-history cutover is complete.

## Rollback note
If this phase becomes unstable, revert the lesson-result API and repository cutover changes and restore the prior localStorage-backed result flow, keeping all rollback limited to the listed files.

## In scope
- Add a server-backed lesson-results route.
- Add a small repository layer for lesson-result reads and writes using Prisma.
- Update the lesson attempt flow to save results through the server-backed path.
- Update the progress page to load persisted result history from the server-backed repository.
- Remove browser localStorage as the canonical lesson-result source.

## Out of scope
- Companion draft persistence changes.
- Chat-session persistence migration.
- New lesson-pack design or eval-rule redesign.
- Broader progress UI redesign beyond what is required to consume server-backed results.
- Test-framework introduction or CI workflow changes.
- Docs, backlog, or workflow artifact edits during implementation.

## Tasks
- Review the existing lesson-result load/save flow and identify all localStorage dependencies.
- Add `apps/web/lib/evals/result-repository.ts` backed by Prisma.
- Add `apps/web/app/api/lesson-results/route.ts` for bounded lesson-result reads and writes.
- Update `apps/web/lib/evals/result-store.ts` so it no longer treats localStorage as canonical storage.
- Update `apps/web/app/components/lesson-attempt-panel.tsx` to save through the server-backed path.
- Update `apps/web/app/progress/page.tsx` to load persisted result history from the server-backed repository.
- Keep all changes bounded to the listed files.

## Validation command
`pnpm --filter web validate`

## Validation
- PENDING: validator must run `pnpm --filter web validate`.
- Expected validator checks:
  - typecheck passes
  - Next.js build passes
  - web smoke passes
- Validator should also confirm:
  - running a lesson writes through the server-backed persistence path
  - progress resolves the same persisted result history after reload
  - localStorage is no longer the canonical lesson-result source
  - no chat-session migration work was silently included

## Repair targets
- none

## Acceptance criteria
- Running a lesson writes a result row to SQLite via Prisma.
- Progress reads persisted lesson history from the server-backed repository.
- Result ordering and recent-achievement derivation remain stable after reload.
- localStorage is no longer the canonical lesson-result source.
- `pnpm --filter web validate` passes.

## Completion summary
- files changed:
  - none yet
- implementation summary:
  - not started
- known risks:
  - stale browser-local result data may still exist and must not silently override the server-backed history
  - result ordering must remain newest-first so progress and achievement derivation stay stable
