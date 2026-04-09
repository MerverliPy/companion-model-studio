# Current Phase

Selected candidate id: lessons-and-evals

Status: pending

## Goal
Implement a bounded first lesson/eval loop so a user can run one built-in lesson against a saved companion draft, produce a score/result object, and view the stored latest result in the lessons flow without expanding into progress, badges, chat, or multi-pack systems.

## Why this phase is next
- `skill-pack-selection` is now shipped in `.opencode/backlog/completed.yaml`, so the active phase must move to the next unshipped candidate.
- `lessons-and-evals` is the highest-priority remaining candidate in `.opencode/backlog/candidates.yaml`.
- The product spec lists lessons/evals as the next core loop after companion creation and skill selection.
- This phase is the smallest safe dependency before any broader progress or badge work because it establishes the stored lesson result those follow-ups depend on.

## Primary files
- `apps/web/app/lessons/page.tsx`
- `apps/web/app/components/lesson-attempt-panel.tsx`
- `apps/web/lib/evals/lesson-flow.ts`
- `apps/web/lib/companions/draft-store.ts`
- `apps/web/lib/companions/companion-schema.ts`

## Expected max files changed
5

## Forbidden paths
- `apps/web/app/chat/**`
- `apps/web/app/progress/**`
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
The main risk is scope drift from one bounded lesson/eval into a broader lesson catalog, history system, or cross-page training flow.

A second risk is leaking this phase into progress or badge behavior before the lesson result contract is kept stable and minimal.

## Rollback note
If this phase becomes unstable, revert the lessons page, lesson attempt panel, and lesson-flow changes so the app returns to its prior state without partial lesson-result storage behavior.

## In scope
- Define or refine one built-in lesson pack for the first eval loop.
- Run the lesson against the saved companion draft and produce a deterministic result object.
- Store the latest lesson result using the current bounded local approach.
- Display the saved result clearly in the lessons UI.

## Out of scope
- Progress dashboard changes or badge unlock UX.
- Chat behavior or runtime connectivity changes.
- Multiple lesson packs, lesson history, or catalog redesign.
- Create-flow redesign beyond what is strictly required for reading the saved draft.
- Workflow/backlog/ledger edits.

## Tasks
- Review the saved companion draft contract and keep the lesson phase aligned with existing draft data.
- Implement or tighten one built-in lesson pack and deterministic evaluation logic.
- Persist the latest lesson result through the existing bounded local storage path.
- Update the lessons UI so the user can run the lesson and see the stored result.
- Keep all changes bounded to the listed files and avoid progress or badge expansion.

## Validation command
`pnpm --filter web validate`

## Validation
- pending

## Repair targets
- none

## Acceptance criteria
- At least one lesson pack exists.
- Running the lesson produces a score/result object.
- The latest lesson result can be stored and displayed.
- The phase stays within the expected max file count and forbidden paths remain untouched.
- `pnpm --filter web validate` passes.

## Completion summary
- pending
