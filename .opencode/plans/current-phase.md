# Current Phase

Selected candidate id: companion-creation-wizard

Status: complete

## Goal
Add the first bounded companion creation wizard in `apps/web` so a user can enter a companion name, short bio, personality template, and avatar theme, see inline validation errors, and save a draft companion without adding skill packs, lessons, badges, chat, or unrelated persistence work.

## Why this phase is next
- Chosen by explicit_user_scope: the backlog contains the exact candidate id `companion-creation-wizard`, and the user explicitly required using that exact id if valid.
- It is valid against the current repo state: the workspace bootstrap and studio shell already exist, `local-model-connectivity` is already complete in the current phase file, and `apps/web/app/create/page.tsx` is still a placeholder that directly matches this candidate's unfinished surface area.
- It matches the product spec's first core job to be done and V1 feature set for companion creation: name, short bio, personality template, and avatar theme.
- It can be kept bounded to a single module with the default file budget by limiting the phase to the wizard UI, validation schema, preview, and only the minimum draft-saving path required by the candidate acceptance criteria.

Stronger alternatives rejected:
- `foundation-workspace-bootstrap` was rejected because it has already been materially satisfied by the current repo structure (`package.json`, `pnpm-workspace.yaml`, `apps/web`) and would repeat completed groundwork.
- `studio-shell-and-routing` was rejected because the visible shell and top-level routes already exist, so it is no longer the smallest safe next step.
- `local-model-connectivity` was rejected because it is already completed in the current plan file; selecting it again would violate the one-bounded-phase workflow.
- `skill-pack-selection` was rejected even though it is a nearby follow-up because the user explicitly said to keep this phase strictly limited to the companion creation wizard only and not add skill pack selection.
- `lessons-and-evals`, `progress-and-badges`, and `chat-workbench` were rejected because they are lower priority, depend on having a created companion flow first, and would broaden scope beyond the clearest bounded next phase.

## Primary files
- `apps/web/app/create/page.tsx`
- `apps/web/app/components/companion-form.tsx`
- `apps/web/app/components/companion-card-preview.tsx`
- `apps/web/lib/companions/companion-schema.ts`
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
- `apps/web/app/components/skill-*`

## Risk
The main risk is scope drift from a small creation wizard into a broader onboarding flow, especially by adding skill selection, multi-step review screens, or a larger persistence layer than is required to save one draft companion. A secondary risk is introducing persistence machinery that exceeds the default file budget.

## Rollback note
If this phase fails validation or must be reverted, remove the wizard-specific form, preview, schema, and draft-store changes and return `apps/web/app/create/page.tsx` to its current placeholder state.

## In scope
- Replace the placeholder create page with a bounded companion creation wizard surface.
- Collect exactly the core V1 creation fields for this phase: name, short bio, personality template, and avatar theme.
- Add companion form validation and render inline validation errors.
- Show a companion card preview derived from entered values.
- Save a draft companion using only the minimum persistence needed to satisfy this candidate.

## Out of scope
- Skill pack selection, review-step expansion, or any create-flow features beyond the core wizard fields.
- Lessons, evals, badges, progress, chat, runtime connectivity, or unrelated navigation work.
- Broader persistence infrastructure beyond what is necessary to save a single draft companion.
- Companion list management, editing existing companions, deletion flows, or session history.
- Unrelated refactors to shared layout, routing, or runtime code.

## Tasks
- Define a bounded companion input schema for the four wizard fields.
- Build a focused companion form UI on the existing create page.
- Add inline validation error handling for invalid or missing inputs.
- Add a companion card preview component tied to the wizard inputs.
- Add the minimum draft companion save path needed for successful submission.

## Validation command
`pnpm --filter web build`

## Validation
PASS

- Acceptance criteria met: the create flow collects name, short bio, personality template, and avatar theme; `companion-form.tsx` shows inline validation errors; `companion-card-preview.tsx` renders a live preview; and `draft-store.ts` saves a draft companion to localStorage without adding skill packs, lessons, badges, chat, or broader persistence work.
- Validation command passed: `pnpm --filter web build` completed successfully on 2026-04-08.
- Scope stayed bounded to the companion creation wizard files in `apps/web`; no unrelated refactors or out-of-scope feature additions were introduced.
- File-count check passed for implementation scope: 5 product files changed, matching the expected max of 5. The phase metadata file changed separately as required by workflow.
- Forbidden tracked artifacts check passed: no tracked `node_modules/**` or `apps/web/.next/**` files were found.

## Repair targets
none

## Acceptance criteria
- User can enter a companion name, short bio, personality template, and avatar theme on the create flow.
- Submission saves a draft companion without requiring skill packs, lessons, badges, chat, or unrelated persistence work.
- Validation errors display correctly for invalid or missing inputs.
- The phase stays bounded to the companion creation wizard and does not introduce unrelated refactors.
- Validation command passes.

## Completion summary
- Files changed:
  - `.opencode/plans/current-phase.md`
  - `apps/web/app/create/page.tsx`
  - `apps/web/app/components/companion-form.tsx`
  - `apps/web/app/components/companion-card-preview.tsx`
  - `apps/web/lib/companions/companion-schema.ts`
  - `apps/web/lib/companions/draft-store.ts`
- Implementation summary:
  - Replaced the placeholder create page with a bounded companion creation wizard.
  - Added schema-driven validation for name, short bio, personality template, and avatar theme with inline field errors.
  - Added a live companion card preview and a minimal localStorage-backed draft save path for successful submissions.
- Known risks:
  - Draft persistence is browser-local only and does not restore previously saved values into the form yet.
  - Inline layout uses component-local styles, so future design-system work may restyle this surface.
