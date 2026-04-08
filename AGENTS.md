# Companion Model Studio

## Mission
Build a local-first studio for creating, training, and chatting with a user-owned AI companion.

## Product constraints
- V1 is NOT foundation-model pretraining from scratch.
- V1 IS a local companion builder plus lesson and eval platform.
- Keep architecture simple and runnable on a normal PC.
- Prefer local UX over cloud dependencies.

## Workflow model
Primary flow: orchestrator -> builder -> validator -> shipper

Failure flow: orchestrator -> builder -> validator -> repair -> validator -> shipper

## Canonical completion ledger
- The canonical shipped/completed source of truth is `.opencode/backlog/completed.yaml`.
- `.opencode/plans/current-phase.md` is the active working plan only. It is not the canonical historical ledger.
- A candidate id listed in `.opencode/backlog/completed.yaml` is considered complete and must not be re-selected.
- Shipper is the only agent allowed to append ids to `.opencode/backlog/completed.yaml`.
- Shipper may only append an id after validator PASS for the active phase.

## Phase states
Allowed `Status:` values:
- pending
- in_progress
- implemented
- validated
- complete
- blocked

## Phase rules
- Keep current work in `.opencode/plans/current-phase.md`.
- Select work from `.opencode/backlog/candidates.yaml`.
- Exclude any candidate already present in `.opencode/backlog/completed.yaml`.
- Only one bounded phase at a time.
- Prefer single-module phases.
- Default expected max files changed: 5.
- Never silently expand scope.
- Builder implements only.
- Validator is the only PASS/FAIL gate.
- Repair uses only validator failures.
- Shipper only ships validated phases.

## Scope discipline
- Do not touch files outside the phase unless required by the exact task.
- Do not add generated artifacts to git.
- Do not broaden the phase goal during repair.
- Do not convert a small phase into a refactor.

## Next-phase selection rubric
Choose using this order:
1. explicit_user_scope
2. highest_priority
3. same_module_followup
4. smallest_safe_scope
5. clearest_validation

## Required current-phase format
Every generated `.opencode/plans/current-phase.md` must contain:
- `# Current Phase`
- `Selected candidate id:`
- `Status:`
- `## Goal`
- `## Why this phase is next`
- `## Primary files`
- `## Expected max files changed`
- `## Forbidden paths`
- `## Risk`
- `## Rollback note`
- `## In scope`
- `## Out of scope`
- `## Tasks`
- `## Validation command`
- `## Validation`
- `## Repair targets`
- `## Acceptance criteria`
- `## Completion summary`
