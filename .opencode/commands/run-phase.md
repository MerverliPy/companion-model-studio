---
description: Implement the current phase only
agent: builder
subtask: true
model: openai/gpt-5.4
---

Read .opencode/plans/current-phase.md and implement only that phase.

Rules:
- set Status to in_progress before changes
- stay inside scope
- avoid unrelated edits
- do not run the phase validation command as the final gate
- use only the smallest relevant commands needed to implement the phase
- after implementation, set Status to implemented
- update Completion summary with:
  - files changed
  - implementation summary
  - known risks
- do not declare PASS or FAIL
