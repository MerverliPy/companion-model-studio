---
description: Draft commit message and shipping summary for a validated phase
agent: shipper
---

Read:
- .opencode/plans/current-phase.md
- latest validator result
- git diff

If the latest validator result is not PASS, do not ship the phase.
Instead return:
- NOT READY
- blocking validation failures

If the latest validator result is PASS, return:
1. commit message
2. short shipping summary
3. recommended next candidate id
