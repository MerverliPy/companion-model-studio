---
description: Select and write the next bounded implementation phase
agent: orchestrator
---

Analyze:
- docs/product-spec.md
- AGENTS.md
- .opencode/backlog/candidates.yaml
- current repo state
- git status

Write the single best next bounded phase into:
.opencode/plans/current-phase.md

Requirements:
- choose the smallest safe scope
- prefer one module
- expected max files changed <= 5
- include all required phase sections
- do not implement code
- if a completed phase is already present, overwrite it
