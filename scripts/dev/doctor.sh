#!/usr/bin/env bash
set -euo pipefail

echo "Repo root: $(pwd)"
echo "Branch: $(git branch --show-current 2>/dev/null || echo none)"
echo

echo "Git status:"
git status --short || true
echo

required=(
  "README.md"
  "AGENTS.md"
  "docs/product-spec.md"
  "opencode.json"
  ".opencode/agents/orchestrator.md"
  ".opencode/agents/builder.md"
  ".opencode/agents/validator.md"
  ".opencode/agents/shipper.md"
  ".opencode/commands/next-phase.md"
  ".opencode/commands/run-phase.md"
  ".opencode/commands/validate-phase.md"
  ".opencode/commands/ship-phase.md"
  ".opencode/commands/phase-status.md"
  ".opencode/backlog/candidates.yaml"
  ".opencode/plans/current-phase.md"
  "scripts/dev/doctor.sh"
  "package.json"
  "pnpm-workspace.yaml"
)

missing=0
for file in "${required[@]}"; do
  if [ ! -e "$file" ]; then
    echo "Missing: $file"
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  exit 1
fi

echo "Doctor check passed."
