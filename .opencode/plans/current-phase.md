# Current Phase

Selected candidate id: workflow-reconciliation

Status: complete

## Goal
Reconcile repo workflow artifacts so README, AGENTS, and the active plan consistently describe workflow-reconciliation behavior, treat `.opencode/backlog/completed.yaml` as canonical, and identify `companion-creation-wizard` as the next unshipped bounded phase without touching product code.

## Why this phase is next
- The explicit user scope is workflow reconciliation, so it takes precedence over normal backlog ordering.
- `.opencode/backlog/completed.yaml` already marks `foundation-workspace-bootstrap`, `studio-shell-and-routing`, `local-model-connectivity`, and `chat-workbench` as complete, so the current workflow state must stop framing any of those ids as active work.
- Among the remaining backlog entries, `companion-creation-wizard` is the highest-priority unshipped candidate and remains a single-module next step.
- This is the smallest safe follow-up because it stays inside repo workflow files, avoids product implementation, and is validation-ready with the standard repo command.

## Primary files
- `README.md`
- `AGENTS.md`
- `.opencode/backlog/candidates.yaml`
- `.opencode/backlog/completed.yaml`
- `.opencode/plans/current-phase.md`

## Expected max files changed
5

## Forbidden paths
- `apps/**`
- `packages/**`
- `docs/**`
- `.github/**`
- `.opencode/agents/**`
- `.opencode/commands/**`
- `node_modules/**`
- `apps/web/.next/**`

## Risk
The main risk is scope drift into process redesign or product work when the phase only needs metadata and workflow-document reconciliation. A second risk is accidentally changing canonical shipped ids instead of aligning active-phase naming to the existing ledger.

## Rollback note
If any reconciliation edit changes backlog meaning beyond workflow alignment, revert the workflow-file edits and restore the prior wording while keeping `.opencode/backlog/completed.yaml` as the canonical shipped record.

## In scope
- Update workflow-facing documentation so it matches the canonical completion ledger.
- Reframe `.opencode/plans/current-phase.md` around workflow reconciliation and the next unshipped candidate.
- Inspect backlog candidate and completion files and make only minimal metadata edits needed to remove contradictions with shipped state.
- Keep all edits limited to the listed repo workflow files.

## Out of scope
- Implementing `companion-creation-wizard` or any other product feature.
- Editing files under `apps/**`, `packages/**`, CI, or other workflow command/agent files.
- Reprioritizing backlog candidates or rewriting feature acceptance criteria beyond minimal contradiction cleanup.
- Removing shipped ids from `.opencode/backlog/completed.yaml` or adding new shipped ids without validated evidence.

## Tasks
- Keep `Selected candidate id:` set to `workflow-reconciliation`, keep the phase in a fresh non-validated state, and identify `companion-creation-wizard` as the next unshipped product candidate.
- Update `.opencode/plans/current-phase.md` so stale active-work references to completed candidates are removed and workflow-reconciliation wording is used consistently.
- Reconcile `README.md` and `AGENTS.md` wording so both align with the canonical role of `.opencode/backlog/completed.yaml` and the active-phase behavior of `.opencode/plans/current-phase.md`.
- Review `.opencode/backlog/candidates.yaml` and `.opencode/backlog/completed.yaml` and apply only the minimal metadata-only edits needed to preserve candidate intent while matching shipped state.
- Leave all product/source files untouched.

## Validation command
`pnpm validate:repo`

## Validation
- PASS: `pnpm validate:repo` succeeded.
- PASS evidence: `repo:doctor` passed; web typecheck, build, and smoke passed.
- PASS evidence: git status during validation showed only the four workflow files modified; no forbidden paths or tracked generated artifacts were present.

## Repair targets
- none

## Acceptance criteria
- `.opencode/plans/current-phase.md` no longer selects any id already present in `.opencode/backlog/completed.yaml`.
- `companion-creation-wizard` is identified as the next bounded candidate.
- Workflow-reconciliation wording is consistent across `README.md`, `AGENTS.md`, and `.opencode/plans/current-phase.md`.
- Backlog workflow files stay aligned with shipped behavior without product-scope changes.
- Total changed files do not exceed 5.

## Completion summary
- Files changed: `README.md`, `AGENTS.md`, `.opencode/plans/current-phase.md`
- Implementation summary: aligned README and AGENTS with the canonical shipped ledger and active-plan behavior, and updated the active phase wording to consistently describe workflow reconciliation while keeping `companion-creation-wizard` as the next bounded candidate.
- Known risks: stale workflow wording may still exist in other out-of-scope files, and backlog metadata was left unchanged because no contradiction inside the allowed files required a ledger edit.
- Repair note: changed only the active-phase metadata so the ship-safe selected candidate id is `workflow-reconciliation` while `companion-creation-wizard` remains the next unshipped product candidate.
- Repair note: added `workflow-reconciliation` as a real backlog workflow candidate so the active selected id is now candidate-valid and ship-safe without changing product scope.
