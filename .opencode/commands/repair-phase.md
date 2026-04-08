---
description: Repair only the exact failures from the latest validator result
agent: builder
---

Read:
- .opencode/plans/current-phase.md
- the latest validator result in the current conversation

Requirements:
- only repair items listed in Repair targets or the latest validator FAIL
- do not change Goal
- do not change In scope
- do not change Out of scope
- do not change Acceptance criteria
- do not add new features
- do not broaden the phase

Process:
- set Status to in_progress
- make only the minimum repairs required
- after repairs, set Status back to implemented
- append a brief repair note to Completion summary

Return:
- repaired items
- files changed
- remaining risks

Do not declare PASS or FAIL.
