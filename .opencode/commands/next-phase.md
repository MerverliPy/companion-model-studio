# /next-phase

Goal: choose the next bounded implementation phase and write `.opencode/plans/current-phase.md`.

## Required inputs
- `AGENTS.md`
- `.opencode/backlog/candidates.yaml`
- `.opencode/backlog/completed.yaml`
- `.opencode/plans/current-phase.md`
- explicit user scope, if provided

## Hard rules
- Never re-select a candidate id already listed in `.opencode/backlog/completed.yaml`.
- Prefer explicit user scope first.
- Prefer a single-module, smallest-safe phase.
- Keep the phase bounded and validation-ready.
- Do not create a phase that silently broadens into refactor or multi-system redesign.

## Selection method
1. Collect candidate ids from `.opencode/backlog/candidates.yaml`.
2. Exclude ids in `.opencode/backlog/completed.yaml`.
3. If the user gave explicit scope, prefer that.
4. Otherwise apply the rubric in `AGENTS.md`.
5. Emit one bounded phase only.

## Output requirements
Write `.opencode/plans/current-phase.md` using the required format from `AGENTS.md`.

## Completion handling
- If the requested work is already listed in `.opencode/backlog/completed.yaml`, do not re-select it.
- If the requested work is already materially complete but missing from the ledger, instruct shipper to reconcile the ledger on the next validated ship.
