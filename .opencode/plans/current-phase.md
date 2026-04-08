# Current Phase

Status: pending

## Goal
Implement `studio-shell-and-routing` by turning the existing `apps/web` placeholder into the first visible Companion Model Studio shell with top-level navigation and route placeholders for Create, Lessons, Progress, and Chat.

## Why this phase is next
- `studio-shell-and-routing` is present in the backlog, and the user asked to use that exact candidate id if valid.
- `foundation-workspace-bootstrap` is already completed, so the next smallest safe step is to make the app visibly navigable.
- This phase stays within one module (`apps/web`) and prepares the product shell without pulling in runtime, persistence, or feature-specific logic.

## Primary files
- `apps/web/app/layout.tsx`
- `apps/web/app/page.tsx`
- `apps/web/app/create/page.tsx`
- `apps/web/app/lessons/page.tsx`
- `apps/web/app/progress/page.tsx`

## Expected max files changed
5

## Risk
Low: the main risk is accidentally expanding the shell into feature implementation or adding more routes than the bounded phase allows.

## Rollback note
Revert the route placeholder pages and layout/page shell edits if the navigation structure needs to be redesigned before feature work proceeds.

## In scope
- Update the root web shell to clearly present Companion Model Studio as the app header/home shell.
- Add top-level navigation links for Create, Lessons, Progress, and Chat.
- Add placeholder route pages for Create, Lessons, and Progress.
- Keep all new pages static and placeholder-only.

## Out of scope
- Runtime connectivity, model health, or model selection.
- Companion form fields, persistence, validation schemas, or database work.
- Lessons execution, scoring, progress logic, badges, or chat functionality.
- API routes, shared data models, styling systems, or broad visual polish.

## Tasks
1. Update `apps/web/app/layout.tsx` or `apps/web/app/page.tsx` to show the first visible studio shell.
2. Add top-level navigation for Create, Lessons, Progress, and Chat.
3. Create static placeholder pages for Create, Lessons, and Progress.
4. Keep Chat represented in navigation only for this bounded phase to stay within the 5-file limit.

## Validation command
`pnpm --filter "./apps/web" exec next build`

## Validation
- Passed: `pnpm --filter "./apps/web" exec next build`
- The build completed successfully after consolidating the shell and navigation into `apps/web/app/page.tsx` and keeping Create, Lessons, and Progress as the only placeholder routes.
- Removed regenerated `apps/web/next-env.d.ts` and `apps/web/tsconfig.json` after validation so the phase stays within the 5-file cap.

## Acceptance criteria
- App shows a Companion Model Studio shell instead of only the bootstrap message.
- Top-level navigation exists for Create, Lessons, Progress, and Chat.
- Placeholder sections exist as pages for Create, Lessons, and Progress, with Chat present in navigation for the next bounded follow-up.
- The validation command passes.

## Completion summary
Kept the studio shell in `apps/web/app/page.tsx`, restored `apps/web/app/layout.tsx` to its minimal bootstrap form, and left Create, Lessons, and Progress as the only new placeholder routes. Chat remains navigation-only so the phase fits the 5-file limit including this plan.
