---
description: Draft commit message and shipping summary for a validated phase
agent: shipper
subtask: true
model: openai/gpt-5.4-mini
---

Read:
- .opencode/plans/current-phase.md
- git diff
- git status --short

Gate rules:
- if Status is not validated, return NOT READY
- if Validation does not contain PASS, return NOT READY
- if tracked generated artifacts exist, return NOT READY

If NOT READY, return:
- NOT READY
- blocking issues

If READY:
- set Status to complete
- return:
  1. conventional commit message
  2. short shipping summary
  3. recommended next candidate id
  4. safe to commit: yes
