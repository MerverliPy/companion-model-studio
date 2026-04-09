# Current Phase

Selected candidate id: skill-pack-selection

Status: pending

## Goal
Add bounded skill-pack selection to the existing companion creation flow so a user can choose one or more skill packs, keep that selection in the draft record, and see the selected skills in the review step without expanding into lessons, chat, or runtime work.

## Why this phase is next
- There is no explicit new user scope overriding backlog order.
- `.opencode/backlog/completed.yaml` is canonical, and the higher-priority candidates in `candidates.yaml` are already complete.
- `skill-pack-selection` is the next unshipped candidate in the same `web` module and is a direct follow-up to the completed `companion-creation-wizard` phase.
- The existing create flow already carries a bounded `skillPacks` field, which makes this the smallest safe next phase with clear validation.

## Primary files
- `apps/web/app/components/companion-form.tsx`
- `apps/web/app/components/companion-review.tsx`
- `apps/web/lib/companions/skill-packs.ts`
- `apps/web/lib/companions/companion-schema.ts`
- `apps/web/lib/companions/draft-store.ts`

## Expected max files changed
5

## Forbidden paths
- `apps/web/app/chat/**`
- `apps/web/app/lessons/**`
- `apps/web/app/progress/**`
- `apps/web/app/api/**`
- `apps/web/app/create/page.tsx`
- `.opencode/backlog/**`
- `.opencode/agents/**`
- `.opencode/commands/**`
- `docs/**`
- `.github/**`
- `node_modules/**`
- `apps/web/.next/**`

## Risk
The main risk is turning a small selection phase into a broader redesign of companion configuration, persistence, or create-flow navigation.

A second risk is introducing skill-pack-specific behavior beyond selection and review display, which belongs to later product phases.

## Rollback note
If this phase becomes unstable, revert the skill-pack UI and validation changes and restore the create flow to the previously validated core identity-only behavior.

## In scope
- Add UI for selecting one or more skill packs in the existing companion form.
- Validate the skill-pack selection against the bounded defined options.
- Keep selected skill packs in the saved draft companion record.
- Show selected skill packs in the existing review step.

## Out of scope
- New skill-pack content systems beyond the current bounded definitions.
- Lessons, evals, badges, or progress behavior.
- Chat runtime behavior or model connectivity changes.
- Create-flow step redesign beyond what is required to display and save skill-pack selections.
- Workflow, backlog, or shipped-ledger edits.

## Tasks
- Review the current create flow and use the existing draft shape to add bounded skill-pack selection.
- Implement one-or-more skill-pack selection UI in `companion-form.tsx`.
- Ensure submitted skill-pack values are constrained to the allowed definitions in `skill-packs.ts` and `companion-schema.ts`.
- Display selected skill packs in `companion-review.tsx`.
- Keep all changes inside the listed primary files and within the 5-file limit.

## Validation command
`pnpm --filter web validate`

## Validation
- pending

## Repair targets
- none

## Acceptance criteria
- User can select one or more skill packs in the companion creation flow.
- Selected skill packs persist when the draft companion is saved.
- Selected skill packs appear in the review step.
- The phase stays within the expected max file count and forbidden paths remain untouched.
- `pnpm --filter web validate` passes.

## Completion summary
- pending
