# Current Phase

Selected candidate id: progress-and-badges

Status: complete

## Goal
Implement the first bounded progress and badge layer so the app can show companion growth from stored lesson results, unlock badges from deterministic rules, and display a recent achievement list without expanding into chat, runtime, or broader analytics work.

## Why this phase is next
- There is no explicit new user scope overriding backlog order.
- `.opencode/backlog/completed.yaml` is canonical, and once `lessons-and-evals` is shipped, `progress-and-badges` becomes the next highest-priority unshipped candidate.
- The backlog already defines `progress-and-badges` as a bounded phase focused on the progress view, badges logic, and badge cabinet UI.
- This is the smallest safe next step because it builds directly on stored lesson/eval results and turns them into visible user-facing progress without expanding into broader reporting or new training systems.
- The repo workflow says web-only implementation phases should prefer the stable web validation command.

## Primary files
- `apps/web/app/progress/page.tsx`
- `apps/web/app/components/badge-cabinet.tsx`
- `apps/web/lib/progress/badge-rules.ts`
- `apps/web/lib/progress/progress-summary.ts`
- `apps/web/lib/evals/result-store.ts`

## Expected max files changed
5

## Forbidden paths
- `apps/web/app/chat/**`
- `apps/web/app/lessons/**`
- `apps/web/app/api/**`
- `apps/web/app/create/**`
- `.opencode/backlog/**`
- `.opencode/agents/**`
- `.opencode/commands/**`
- `docs/**`
- `.github/**`
- `node_modules/**`
- `apps/web/.next/**`

## Risk
The main risk is scope drift into a broader analytics or progression system instead of a bounded deterministic progress view.

A second risk is coupling badge unlock logic too tightly to future features, which would turn a small progress phase into a larger architecture change.

## Rollback note
If this phase becomes unstable, revert the progress view, badge logic, and achievement display changes and restore the prior bounded progress surface, keeping all work limited to the listed files.

## In scope
- Add or refine the progress view so stored lesson results are summarized for the user.
- Implement deterministic badge unlock rules from bounded lesson/eval results.
- Display unlocked badges in a badge cabinet UI.
- Show a recent achievement list tied to the deterministic badge/progress rules.

## Out of scope
- New lesson content or eval-runner changes.
- Broad analytics dashboards or historical reporting beyond the bounded progress summary.
- Chat runtime behavior or companion conversation changes.
- Create-flow or skill-pack redesign.
- Workflow, backlog, or shipped-ledger edits.

## Tasks
- Review the existing progress surface and keep changes limited to the bounded progress-and-badges follow-up.
- Implement deterministic badge rules from stored lesson/eval results.
- Build or refine the progress summary view using existing stored results.
- Add a badge cabinet UI and a recent achievement list.
- Keep all changes bounded to the listed files and within the 5-file limit.

## Validation command
`pnpm --filter web validate`

## Validation
- PASS: `pnpm --filter web validate` completed successfully.
- Typecheck passed, Next.js build passed, and web smoke passed.
- Build emitted a workspace-root warning about multiple lockfiles, but no validation failure.
- Files checked: `apps/web/app/progress/page.tsx`, `apps/web/app/components/progress-summary.tsx`, `apps/web/lib/progress/badges.ts`, `apps/web/lib/progress/progress-summary.ts`, `.opencode/plans/current-phase.md`.
- Scope/file check: 4 source files changed; within the 5-file limit; no forbidden paths; no tracked generated artifacts detected.

## Repair targets
- none

## Acceptance criteria
- Progress view exists.
- Badges unlock from deterministic rules.
- Recent achievement list is visible.
- The phase stays within the expected max file count and forbidden paths remain untouched.
- `pnpm --filter web validate` passes.

## Completion summary
- files changed:
  - `.opencode/plans/current-phase.md`
  - `apps/web/app/progress/page.tsx`
  - `apps/web/app/components/progress-summary.tsx`
  - `apps/web/lib/progress/badges.ts`
  - `apps/web/lib/progress/progress-summary.ts`
- implementation summary:
  - Switched the progress page to read stored lesson result history from the bounded result store instead of a single latest-only record.
  - Expanded deterministic progress summary metrics to aggregate saved lesson attempts and added additional bounded badge unlock rules.
  - Updated the progress UI to show a recent achievement list ordered by unlock time plus earned timestamps in the badge cabinet.
- known risks:
  - Badge unlock timestamps depend on stored results remaining newest-first in local storage.
  - Older single-result data saved under the legacy lesson-flow key is not surfaced by this bounded progress view.
