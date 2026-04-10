# Current Phase

Selected candidate id: docs-reality-alignment

Status: pending

## Goal
Reconcile the public repo-facing documentation with the now-shipped implementation so README and product-spec describe the actual local-first app, SQLite/Prisma persistence, and current bounded feature set without overstating or understating shipped behavior.

## Why this phase is next
- There is explicit user scope to complete the audited follow-up chain after the shipped behavior-tests-and-ci phase.
- The implementation, persistence cutovers, and CI/test improvements are now in place, so this is the correct time to align docs with reality instead of documenting work that was still in flight.
- This is the smallest safe final phase because it is limited to repo-facing documentation and does not reopen product, persistence, runtime, or CI implementation work.
- Completing this phase closes the audit follow-up sequence by making the repo’s claims match the shipped system.

## Primary files
- `README.md`
- `docs/product-spec.md`
- `.opencode/plans/current-phase.md`

## Expected max files changed
3

## Forbidden paths
- `.opencode/backlog/**`
- `.opencode/agents/**`
- `.opencode/commands/**`
- `.github/**`
- `apps/web/**`
- `apps/web/prisma/**`
- `scripts/**`
- `node_modules/**`
- `apps/web/.next/**`

## Risk
The main risk is reintroducing aspirational product language that no longer reflects the shipped implementation, which would reduce repo trustworthiness instead of improving it.

A second risk is scope drift into non-documentation changes under the pretext of making docs accurate.

## Rollback note
If this phase becomes unstable, revert the documentation edits and restore the prior docs state, keeping all rollback limited to the listed files.

## In scope
- Update README to describe the shipped local-first app accurately.
- Update the product spec to distinguish shipped behavior from future or optional follow-ups.
- Reflect the current SQLite/Prisma-backed persistence model accurately.
- Call out any remaining intentional local-only or single-user constraints where helpful.

## Out of scope
- Product code changes.
- Persistence schema or route changes.
- CI or test changes.
- Backlog, completed ledger, or workflow artifact edits beyond the active current phase file.

## Tasks
- Review the current README for claims that were true only before the shipped persistence and CI follow-up work completed.
- Update README to describe the shipped create, lessons, progress, chat, and local runtime behavior accurately.
- Review `docs/product-spec.md` for wording that blurs shipped behavior and future intent.
- Update the product spec to separate current shipped state from later optional or planned directions.
- Keep all changes bounded to the listed files.

## Validation command
`pnpm validate:repo`

## Validation
- PENDING: validator must run `pnpm validate:repo`.
- Expected validator checks:
  - repo doctor passes
  - web validate passes
- Validator should also confirm:
  - repo-facing claims match the shipped implementation
  - docs do not imply cloud dependencies or unfinished architecture as if already shipped
  - no code or workflow-scope changes were silently included

## Repair targets
- none

## Acceptance criteria
- README accurately describes current SQLite/Prisma-backed persistence.
- Product spec clearly distinguishes shipped behavior from planned or optional follow-ups.
- Any remaining local-only or single-user constraints are stated accurately where relevant.
- `pnpm validate:repo` passes.

## Completion summary
- files changed:
  - none yet
- implementation summary:
  - not started
- known risks:
  - docs must stay descriptive of shipped behavior rather than drifting back into aspirational wording
  - scope must remain documentation-only
