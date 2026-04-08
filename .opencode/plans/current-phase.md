# Current Phase

Selected candidate id: progress-and-badges

Status: pending

## Goal
Add the first bounded progress-and-badges slice in `apps/web` so the progress page can read stored lesson results, compute deterministic badge unlocks from those results, and show a minimal recent-achievements view without adding broader analytics, chat features, or a multi-page progress system.

## Why this phase is next
- Chosen by highest_priority among the remaining unfinished candidates: `progress-and-badges` is now the highest-priority valid backlog item after `lessons-and-evals` completed.
- It is the clearest follow-up because the product spec places measurable progress after lessons/evals, and the current repo now has stored lesson result data to visualize.
- It beat `chat-workbench` because chat is the same priority but depends less clearly on progress data, while this phase directly builds on the newly completed lesson result loop.
- This plan keeps the candidate safely bounded to a first progress slice: one progress page, one deterministic badge computation module, and one recent-achievements surface.

Stronger alternatives rejected:
- `chat-workbench` was rejected because although it is still valid, it is not as direct a follow-up to the new stored lesson results and would open a broader interaction surface.
- `foundation-workspace-bootstrap`, `studio-shell-and-routing`, `local-model-connectivity`, `companion-creation-wizard`, `skill-pack-selection`, and `lessons-and-evals` were rejected because they are already materially complete and should not be re-selected.

## Primary files
- `apps/web/app/progress/page.tsx`
- `apps/web/app/components/progress-summary.tsx`
- `apps/web/app/components/badge-cabinet.tsx`
- `apps/web/lib/progress/badges.ts`
- `apps/web/lib/progress/progress-summary.ts`

## Expected max files changed
5

## Forbidden paths
- `node_modules/**`
- `apps/web/.next/**`
- `packages/**`
- `docs/**`
- `.opencode/backlog/**`
- `apps/web/app/chat/**`
- `apps/web/app/create/**`
- `apps/web/app/lessons/**`
- `apps/web/app/api/runtime/**`
- `apps/web/app/components/runtime-status.tsx`
- `apps/web/lib/runtime/**`

## Risk
The main risk is scope drift from a minimal progress slice into a full dashboard or analytics system. A secondary risk is mixing future badge progression rules into this phase instead of keeping the unlock logic deterministic and derived only from current lesson result data.

## Rollback note
If this phase fails validation or must be reverted, remove the progress summary, badge cabinet, and deterministic progress logic changes, then restore the progress page to its current placeholder state.

## In scope
- Read the existing stored lesson result data needed for progress display.
- Show a bounded progress summary on the progress page.
- Compute deterministic badge unlocks from current lesson result data.
- Show a recent-achievements or badge-cabinet surface on the progress page.

## Out of scope
- Broader analytics dashboards, charts, filtering, or historical reporting.
- Changes to lesson execution, chat behavior, runtime/model connectivity, or companion creation.
- Server-backed persistence, Prisma/SQLite integration, or cross-page progress systems.
- Non-deterministic badge logic or unrelated refactors.

## Tasks
- Add a small progress-summary helper that derives stable progress fields from stored lesson results.
- Add deterministic badge rules for the first unlockable progress slice.
- Replace the progress placeholder with a bounded progress view.
- Add a recent-achievements or badge-cabinet UI driven by the derived badge state.

## Validation command
`pnpm --filter web build`

## Validation
NOT RUN

- Pending implementation.

## Repair targets
none

## Acceptance criteria
- A progress view exists.
- Badges unlock from deterministic rules.
- A recent achievement list or equivalent badge-cabinet surface is visible.
- The phase stays bounded to the first progress-and-badges slice and does not introduce unrelated refactors.
- Validation command passes.

## Completion summary
- Not started.
