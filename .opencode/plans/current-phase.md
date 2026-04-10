# Current Phase

Selected candidate id: none-eligible

Status: blocked

## Goal
Record that next-phase selection is blocked because every candidate currently listed in `.opencode/backlog/candidates.yaml` is already shipped in `.opencode/backlog/completed.yaml`.

## Why this phase is next
- The user explicitly asked for the next phase.
- The canonical completion ledger marks every listed candidate as complete, so none can be re-selected.
- The smallest safe action is to block selection rather than invent uncataloged work or re-open shipped work.
- A backlog refresh is required before builder can receive another bounded implementation phase.

## Primary files
- `.opencode/backlog/candidates.yaml`
- `.opencode/backlog/completed.yaml`
- `.opencode/plans/current-phase.md`

## Expected max files changed
1

## Forbidden paths
- `apps/**`
- `packages/**`
- `.github/**`
- `docs/**`
- `README.md`
- `AGENTS.md`
- `.opencode/backlog/candidates.yaml`
- `.opencode/backlog/completed.yaml`

## Risk
The main risk is mistakenly re-selecting shipped work because `candidates.yaml` is stale relative to the canonical completion ledger.

## Rollback note
Rollback is limited to restoring the prior `.opencode/plans/current-phase.md` if backlog maintenance happens separately.

## In scope
- Compare current candidate ids against the canonical completion ledger.
- Record blocked status for phase selection.
- State the exact prerequisite for resuming implementation planning.

## Out of scope
- Product implementation.
- Repair work.
- Editing backlog candidates or the completion ledger.
- Creating new uncataloged candidate ids.

## Tasks
- Confirm that no candidate id in `.opencode/backlog/candidates.yaml` remains unshipped.
- Mark the current phase as blocked.
- Require backlog refresh before the next implementation phase is selected.

## Validation command
`Not applicable — backlog refresh required before an implementation validation command can be assigned.`

## Validation
- PASS: no candidate from `.opencode/backlog/candidates.yaml` was re-selected if it already appears in `.opencode/backlog/completed.yaml`.
- PASS: `.opencode/plans/current-phase.md` records `Status: blocked` and explains why selection cannot continue.
- PASS: no files outside `.opencode/plans/current-phase.md` were changed.

## Repair targets
- none

## Acceptance criteria
- No completed candidate id is re-selected.
- The current phase clearly states that selection is blocked because no eligible unshipped candidates remain.
- The required next action is backlog refresh, not implementation.

## Completion summary
- blocked pending backlog refresh to add at least one new unshipped candidate id
