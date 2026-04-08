---
description: Validate the current phase and update workflow status
agent: validator
subtask: true
model: openai/gpt-5.4-mini
---

Read:
- docs/product-spec.md
- .opencode/plans/current-phase.md
- relevant changed files

Run the exact validation command from the phase.

Checks required:
- command result
- acceptance criteria
- scope drift
- expected max files changed
- forbidden paths
- tracked generated artifacts

Then update only .opencode/plans/current-phase.md:
- PASS -> Status: validated
- FAIL -> Status: blocked

Also update:
- Validation
- Repair targets

Return:
- PASS or FAIL
- exact reasons
- missing acceptance criteria
- specific files checked
- command output summary
