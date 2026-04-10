# Current Phase

Selected candidate id: none

Status: blocked

## Goal
Do not start another implementation phase until a new unshipped candidate is added to `.opencode/backlog/candidates.yaml`.

## Why this phase is next
- The canonical completion ledger now includes `docs-reality-alignment`.
- Every candidate currently listed in `.opencode/backlog/candidates.yaml` is already present in `.opencode/backlog/completed.yaml`.
- Per `AGENTS.md`, completed candidate ids must not be re-selected.
- The correct next action is to stop phase selection rather than invent or reopen scope.

## Primary files
- `.opencode/backlog/candidates.yaml`
- `.opencode/backlog/completed.yaml`
- `.opencode/plans/current-phase.md`

## Expected max files changed
1

## Forbidden paths
- `README.md`
- `docs/**`
- `apps/**`
- `.github/**`
- `scripts/**`
- `node_modules/**`

## Risk
The main risk is accidentally re-selecting shipped work or fabricating a new phase without a backlog candidate, which would break the workflow contract.

## Rollback note
If a valid new candidate is later added, replace this blocked plan with a normal bounded phase plan for that candidate.

## In scope
- Record that no unshipped candidate is currently available.
- Keep the workflow blocked until backlog owners add a new candidate.

## Out of scope
- Reopening any shipped candidate.
- Creating ad hoc implementation work outside the backlog.
- Any product, docs, runtime, persistence, CI, or test changes.

## Tasks
- Confirm the canonical completed ledger against the current candidate list.
- Refuse re-selection of already shipped candidate ids.
- Wait for a new backlog candidate before selecting another implementation phase.

## Validation command
`pnpm validate:repo`

## Validation
- Not run for this blocked state.
- No validator work should begin until a valid unshipped candidate exists.

## Repair targets
- Add at least one new unshipped candidate to `.opencode/backlog/candidates.yaml`.

## Acceptance criteria
- No completed candidate id is re-selected.
- The plan clearly states that backlog selection is blocked pending a new candidate.
- No implementation scope is assigned while the backlog has no unshipped candidates.

## Completion summary
- files changed:
  - `.opencode/plans/current-phase.md`
- implementation summary:
  - Replaced the completed phase plan with a blocked placeholder because the backlog contains no remaining unshipped candidates.
- known risks:
  - Workflow remains paused until backlog owners define a new candidate.
