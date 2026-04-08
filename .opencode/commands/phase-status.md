---
description: Summarize current phase state and next command
agent: orchestrator
---

Read .opencode/plans/current-phase.md and summarize:
- Selected candidate id
- Status
- Goal
- Validation state
- Repair targets
- next recommended command

Use this mapping:
- pending -> /run-phase
- implemented -> /validate-phase
- blocked -> /repair-phase
- validated -> /ship-phase
- complete -> /next-phase
