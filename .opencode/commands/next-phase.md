---
description: Select and write the next bounded implementation phase
agent: orchestrator
subtask: true
model: openai/gpt-5.4
---

Analyze:
- docs/product-spec.md
- AGENTS.md
- .opencode/backlog/candidates.yaml
- current repo state
- git status

If $ARGUMENTS is present, use that exact candidate id if valid.

Choose the next phase using the rubric in AGENTS.md.

Then OVERWRITE .opencode/plans/current-phase.md with all required sections.

Requirements:
- set Status to pending
- include Selected candidate id
- include Forbidden paths
- include Expected max files changed
- explain why this candidate was chosen
- explain why stronger alternatives were rejected
- keep the scope bounded
- do not implement code
