# Current Phase

Status: completed

## Goal
Bootstrap `foundation-workspace-bootstrap` with the smallest runnable `apps/web` package and placeholder app shell that fits the 5-file phase cap.

## Why this phase is next
- The backlog explicitly includes `foundation-workspace-bootstrap`, and the user asked to pin to that exact candidate if valid.
- Repo state already had `pnpm-workspace.yaml` and the root `package.json`, but no `apps/web` package.
- This is the smallest safe prerequisite before any visible product shell or feature work can begin.

## Primary files
- `apps/web/package.json`
- `apps/web/app/layout.tsx`
- `apps/web/app/page.tsx`
- `pnpm-lock.yaml`

## Expected max files changed
5

## Risk
Low to medium: initial scaffold choices can create unnecessary setup churn if the workspace layout or package naming is overcomplicated.

## Rollback note
Revert the workspace manifest edits and remove the new `apps/web` scaffold if the bootstrap proves unstable or mismatched with the product direction.

## In scope
- Create the smallest runnable `apps/web` scaffold compatible with the product direction.
- Rely on the existing root workspace configuration that already recognizes `apps/*`.
- Keep the app shell minimal and runnable without adding product features.
- Add only the smallest files needed to validate the workspace bootstrap within the 5-file limit.

## Out of scope
- Product navigation or multi-page routing beyond a minimal landing page.
- Runtime connectivity, companion creation, lessons/evals, progress, or chat features.
- Database, Prisma, SQLite, or API route implementation.
- Styling systems, generated scaffold extras, or design polish beyond the minimal placeholder shell.

## Tasks
1. Create a minimal `apps/web` workspace package.
2. Add the smallest required app-router files for a placeholder shell.
3. Install dependencies and capture the lockfile needed to reproduce the bootstrap.
4. Verify basic Next.js execution for the new workspace.

## Validation command
`pnpm install && pnpm --filter "./apps/web" exec next --version`

## Validation
- Passed: `pnpm install && pnpm --filter "./apps/web" exec next --version`
- Exact result:
  - `Scope: all 2 workspace projects`
  - `Already up to date`
  - `Done in 283ms`
  - `Next.js v15.5.14`
- Final phase file count is 5: this plan file, `apps/web/package.json`, `apps/web/app/layout.tsx`, `apps/web/app/page.tsx`, and `pnpm-lock.yaml`.

## Acceptance criteria
- `foundation-workspace-bootstrap` is implemented with workspace manifests in place.
- `apps/web` exists as a minimal runnable app.
- Root workspace configuration recognizes the app without unnecessary extra package changes.
- The validation command passes.

## Completion summary
Completed: added the smallest bounded bootstrap that satisfies the candidate and validation command: a new `apps/web` package with minimal app-router placeholder files plus the dependency lockfile. Existing root workspace manifests already covered `apps/*`, so no extra root manifest edits were needed.
