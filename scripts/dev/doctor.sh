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
  ".opencode/commands/repair-phase.md"
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
  echo
  echo "Doctor check failed: missing required files."
  exit 1
fi

phase_file=".opencode/plans/current-phase.md"

sections=(
  "Selected candidate id:"
  "Status:"
  "## Goal"
  "## Why this phase is next"
  "## Primary files"
  "## Expected max files changed"
  "## Forbidden paths"
  "## Risk"
  "## Rollback note"
  "## In scope"
  "## Out of scope"
  "## Tasks"
  "## Validation command"
  "## Validation"
  "## Repair targets"
  "## Acceptance criteria"
  "## Completion summary"
)

for section in "${sections[@]}"; do
  if ! grep -Fq "$section" "$phase_file"; then
    echo "Missing phase section: $section"
    exit 1
  fi
done

status="$(grep -E '^Status:' "$phase_file" | sed 's/^Status:[[:space:]]*//' | tr -d '\r' || true)"
case "$status" in
  pending|in_progress|implemented|validated|complete|blocked) ;;
  *)
    echo "Invalid phase status: ${status:-<empty>}"
    exit 1
    ;;
esac

if git ls-files | grep -Eq '(^|/)(node_modules|\.next)(/|$)'; then
  echo "Tracked generated artifacts detected (.next or node_modules)."
  exit 1
fi

if [ "$status" = "validated" ] || [ "$status" = "complete" ]; then
  if ! grep -Eq 'PASS' "$phase_file"; then
    echo "Validated/complete phase must include PASS in Validation."
    exit 1
  fi
fi

if [ "$status" = "blocked" ]; then
  if ! grep -Eq 'FAIL' "$phase_file"; then
    echo "Blocked phase must include FAIL in Validation."
    exit 1
  fi
fi

echo "Doctor check passed."
