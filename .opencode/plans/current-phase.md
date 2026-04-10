# Current Phase

Selected candidate id: none-available

Status: blocked

## Goal
Select the next bounded unshipped phase once a new eligible candidate exists in `.opencode/backlog/candidates.yaml`.

## Why this phase is next
- `server-backed-lesson-results` is now complete and listed in the canonical shipped ledger.
- The shipper recommendation `runtime-model-selection-e2e` must be refused because it is already listed in `.opencode/backlog/completed.yaml`.
- No remaining candidate in `.opencode/backlog/candidates.yaml` is eligible for selection after applying the canonical completion ledger.
- Workflow cannot safely advance until a new unshipped bounded candidate is added.

## Primary files
- `.opencode/backlog/candidates.yaml`
- `.opencode/backlog/completed.yaml`
- `.opencode/plans/current-phase.md`

## Expected max files changed
1

## Forbidden paths
- `apps/**`
- `.github/**`
- `docs/**`
- `README.md`
- `node_modules/**`

## Risk
The main risk is accidentally re-selecting a shipped candidate because stale backlog entries remain in `.opencode/backlog/candidates.yaml`.

## Rollback note
If a new eligible candidate is added, replace this blocked plan with a fresh bounded phase plan and keep the completion ledger unchanged.

## In scope
- Confirm the just-shipped phase is recorded in the canonical completion ledger.
- Refuse any recommended next candidate already present in `.opencode/backlog/completed.yaml`.
- Block phase selection until a new eligible candidate exists.

## Out of scope
- Implementing any new product change.
- Editing shipped candidate entries in the canonical completion ledger.
- Re-selecting any candidate already marked complete.
- Inventing a new candidate outside the backlog.

## Tasks
- Verify the current phase candidate id is present in `.opencode/backlog/completed.yaml`.
- Check all candidate ids in `.opencode/backlog/candidates.yaml` against the canonical completion ledger.
- Refuse any already-complete candidate ids.
- Leave the workflow blocked until a new unshipped bounded candidate is available.

## Validation command
`none until a new eligible candidate exists`

## Validation
- Blocked: there is no eligible next candidate to validate or implement.

## Repair targets
- Add at least one new bounded unshipped candidate to `.opencode/backlog/candidates.yaml`.

## Acceptance criteria
- `server-backed-lesson-results` remains listed in `.opencode/backlog/completed.yaml`.
- No candidate already listed in `.opencode/backlog/completed.yaml` is selected again.
- The plan remains blocked until a new unshipped candidate is available.

## Completion summary
- files changed:
  - `.opencode/plans/current-phase.md`
- implementation summary:
  - replaced the shipped phase plan with a blocked placeholder because no eligible next candidate remains in the backlog
  - refused the shipper's recommended next candidate because `runtime-model-selection-e2e` is already complete in the canonical ledger
- known risks:
  - workflow remains blocked until backlog maintenance adds a new eligible candidate
