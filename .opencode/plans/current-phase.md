# Current Phase

Selected candidate id: studio-shell-and-routing

Status: complete

## Goal
Add a shared studio shell in `apps/web` so the top-level Companion Model Studio navigation is available across the app, not only on the home page, while keeping route content and existing feature slices intact.

## Why this phase is next
- No new explicit user scope was provided, so selection falls back to the backlog rubric in `AGENTS.md`.
- `chat-workbench` and `local-model-connectivity` are already in `.opencode/backlog/completed.yaml`, so they cannot be re-selected.
- `foundation-workspace-bootstrap` appears materially complete in the repo already; if shipper confirms it was validated but never ledgered, shipper should reconcile that on the next validated ship rather than re-opening bootstrap work.
- `studio-shell-and-routing` is the highest-priority remaining candidate with a clear, bounded implementation gap: the app has routes, but the studio shell navigation still lives only on the home page instead of a shared app shell.
- This keeps scope to one module and avoids broadening into feature redesign or backlog-wide reconciliation.

## Primary files
- `apps/web/app/layout.tsx`
- `apps/web/app/page.tsx`
- `apps/web/app/components/studio-shell.tsx`

## Expected max files changed
3

## Forbidden paths
- `node_modules/**`
- `apps/web/.next/**`
- `packages/**`
- `docs/**`
- `.github/**`
- `.opencode/backlog/**`
- `apps/web/app/api/**`
- `apps/web/lib/**`
- `apps/web/app/create/**`
- `apps/web/app/lessons/**`
- `apps/web/app/progress/**`
- `apps/web/app/chat/**`

## Risk
The main risk is scope drift from a shared shell into a visual redesign of all routes. A secondary risk is accidentally moving feature-specific copy or logic while trying to centralize navigation.

## Rollback note
If this phase must be reverted, remove the shared shell component, restore `apps/web/app/layout.tsx` to a plain wrapper, and return the home page to owning the only navigation markup.

## In scope
- Add a shared studio shell wrapper for the web app.
- Move top-level navigation into the shared shell so it appears on app routes consistently.
- Keep the home page content focused on the home route instead of duplicating shell responsibilities.
- Preserve existing route paths and route-level feature content.

## Out of scope
- Any changes to runtime connectivity, companion creation logic, lessons, progress, or chat behavior.
- Styling redesign beyond the minimum needed to present a coherent shared shell.
- New routes, route renames, or feature refactors.
- Ledger updates to `.opencode/backlog/completed.yaml`.

## Tasks
- Add a reusable studio shell component with the existing top-level navigation links.
- Update `apps/web/app/layout.tsx` to render the shared shell around route content.
- Trim `apps/web/app/page.tsx` so it no longer owns duplicated shell navigation markup.

## Validation command
`pnpm --filter web validate`

## Validation
- PASS: `pnpm --filter web validate` succeeded; `typecheck`, `build`, and `smoke` all passed.
- Checked files: `apps/web/app/layout.tsx`, `apps/web/app/page.tsx`, `apps/web/app/components/studio-shell.tsx`, plus route presence in `apps/web/app/create/page.tsx`, `apps/web/app/lessons/page.tsx`, `apps/web/app/progress/page.tsx`, `apps/web/app/chat/page.tsx`.
- Acceptance criteria met: shared shell wraps the app, primary navigation is available across routes, Create/Lessons/Progress/Chat remain reachable, and the phase stayed within shell/routing scope.
- Scope check: implementation changes stayed within the 3 planned web files; only this workflow metadata file was additionally updated.
- Generated artifact check passed: no tracked `node_modules` or `apps/web/.next` files were found.

## Repair targets
- none

## Acceptance criteria
- The app shows a shared Companion Model Studio shell.
- Top-level navigation exists across the app, not just on the home page.
- Existing Create, Lessons, Progress, and Chat routes remain reachable through that shared navigation.
- The phase stays bounded to shell and routing structure only.
- `pnpm --filter web validate` passes.

## Completion summary
- Files changed:
  - `.opencode/plans/current-phase.md`
  - `apps/web/app/layout.tsx`
  - `apps/web/app/page.tsx`
  - `apps/web/app/components/studio-shell.tsx`
- Implementation summary:
  - Added a reusable `StudioShell` component with the existing top-level navigation links.
  - Updated the root web layout to render the shared studio shell around all route content.
  - Removed duplicated shell navigation from the home page so it keeps only route-specific content.
- Known risks:
  - The shared shell keeps navigation simple and does not mark the active route.
  - Route pages that already define their own top-level landmarks remain unchanged by this phase.
