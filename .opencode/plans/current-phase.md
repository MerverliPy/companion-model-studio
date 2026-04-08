# Current Phase

Selected candidate id: skill-pack-selection

Status: complete

## Goal
Add a bounded skill-pack selection follow-up in `apps/web` so the create flow can offer one or more skill-pack choices, persist the chosen skill packs with the existing companion draft, and show the selections in a minimal review surface without adding lessons, evals, chat, progress, or broader multi-step onboarding.

## Why this phase is next
- Chosen by highest_priority among remaining unfinished candidates: `skill-pack-selection` and `lessons-and-evals` are tied at priority 7, so the tie breaks on same_module_followup and smallest safe scope.
- It is the clearest follow-up to the now-complete `companion-creation-wizard` because it extends the existing create flow in the same `apps/web` module instead of opening a new module.
- It has lower dependency risk than `lessons-and-evals` because it can reuse the current draft form and store, while lessons/evals would introduce a new eval package and storage/display loop.
- It stays within the default bounded-phase discipline by targeting the existing create flow, a small set of skill-pack definitions, and minimal draft persistence updates.

Stronger alternatives rejected:
- `lessons-and-evals` was rejected because although it shares the same priority, it opens a new module and broader scoring/storage surface, so it is not the smallest safe next step.
- `progress-and-badges` was rejected because it is lower priority and depends on lesson/eval or activity outputs to be meaningful.
- `chat-workbench` was rejected because it is lower priority and depends on having richer companion configuration in place first.
- `foundation-workspace-bootstrap`, `studio-shell-and-routing`, `local-model-connectivity`, and `companion-creation-wizard` were rejected because they are already materially complete and should not be re-selected.

## Primary files
- `apps/web/app/components/companion-form.tsx`
- `apps/web/app/components/skill-pack-picker.tsx`
- `apps/web/app/components/companion-review-step.tsx`
- `apps/web/lib/companions/skill-packs.ts`
- `apps/web/lib/companions/draft-store.ts`

## Expected max files changed
5

## Forbidden paths
- `node_modules/**`
- `apps/web/.next/**`
- `packages/**`
- `docs/**`
- `.opencode/backlog/**`
- `apps/web/app/api/runtime/**`
- `apps/web/app/lessons/**`
- `apps/web/app/progress/**`
- `apps/web/app/chat/**`
- `apps/web/app/components/runtime-status.tsx`
- `apps/web/lib/runtime/**`

## Risk
The main risk is turning a small follow-up into a larger onboarding refactor by redesigning the whole create flow, adding server persistence, or coupling skill packs to lessons/chat before those phases are selected.

## Rollback note
If this phase fails validation or must be reverted, remove the skill-pack definitions, picker, review-step additions, and draft persistence changes, then restore the create flow to the previously validated core companion wizard.

## In scope
- Define a bounded set of selectable skill packs for the create flow.
- Let the user select one or more skill packs from the create flow.
- Persist selected skill packs with the existing draft companion save path.
- Show selected skill packs in a minimal review surface within the create flow.

## Out of scope
- Lessons, eval execution, scoring, progress, badges, chat, or runtime changes.
- Server-backed persistence, companion list management, or editing/deleting existing companions.
- Broad create-flow redesigns beyond what is needed for selection and review of skill packs.
- New navigation work or unrelated refactors.

## Tasks
- Add a small, explicit set of skill-pack definitions for V1 companion setup.
- Extend the create flow with a bounded multi-select or checkbox-based skill-pack picker.
- Update draft persistence so selected skill packs save with the companion draft.
- Add a minimal review-step surface that shows the selected skills before or at save time.

## Validation command
`pnpm --filter web build`

## Validation
PASS

- `pnpm --filter web build` completed successfully.
- Skill-pack selection, persistence, and review surface stay within `apps/web`.
- No tracked generated artifacts found in `node_modules` or `apps/web/.next`.
- Changed implementation files stayed within the phase's bounded scope and max-file expectation.

## Repair targets
none

## Acceptance criteria
- User can select one or more skill packs in the create flow.
- Selected skill packs persist with the saved companion draft.
- Selected skill packs appear in a minimal review step or review surface.
- The phase stays bounded to skill-pack selection in `apps/web` and does not introduce unrelated refactors.
- Validation command passes.

## Completion summary
- Files changed:
  - `.opencode/plans/current-phase.md`
  - `apps/web/app/components/companion-form.tsx`
  - `apps/web/app/components/companion-review-step.tsx`
  - `apps/web/app/components/skill-pack-picker.tsx`
  - `apps/web/lib/companions/companion-schema.ts`
  - `apps/web/lib/companions/skill-packs.ts`
- Implementation summary:
  - Added a bounded set of selectable skill-pack definitions for the web companion create flow.
  - Extended the companion form with multi-select skill-pack picking, validation, and draft payload support.
  - Added a minimal review surface that shows selected skill packs alongside the core companion selections before save.
- Known risks:
  - Existing browser drafts saved before this change will not include `skillPacks` until a user re-saves the draft in the updated form.
  - Skill-pack ordering currently follows selection order and fixed local definitions, so future definition changes should preserve stable values.
