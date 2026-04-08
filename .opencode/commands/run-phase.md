---
description: Execute the current implementation phase
agent: builder
---

Read .opencode/plans/current-phase.md and implement only that phase.

Rules:
- stay inside scope
- avoid unrelated edits
- do not run the phase validation command as the final gate
- use only the smallest relevant commands needed to implement the phase
- do not declare PASS or FAIL
- update Completion summary with:
  - files changed
  - implementation summary
  - known risks
