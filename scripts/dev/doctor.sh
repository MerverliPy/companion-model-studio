#!/usr/bin/env bash
set -euo pipefail

echo "Repo root: $(pwd)"
echo "Branch: $(git branch --show-current 2>/dev/null || echo none)"
echo
echo "Git status:"
git status --short || true

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
  ".opencode/backlog/completed.yaml"
  ".opencode/plans/current-phase.md"
  "scripts/dev/doctor.sh"
  "scripts/dev/validate-repo.sh"
  "scripts/dev/smoke-web.sh"
  "package.json"
  "pnpm-workspace.yaml"
  "apps/web/package.json"
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
    echo "Invalid phase status: ${status:-}"
    exit 1
    ;;
esac

if git ls-files | grep -Eq '(^|/)(node_modules|\.next)(/|$)'; then
  echo "Tracked generated artifacts detected (.next or node_modules)."
  exit 1
fi

if ! grep -Fq 'version:' .opencode/backlog/completed.yaml; then
  echo "Completion ledger malformed: missing version."
  exit 1
fi

if ! grep -Fq 'shipped_ids:' .opencode/backlog/completed.yaml; then
  echo "Completion ledger malformed: missing shipped_ids."
  exit 1
fi

echo "Doctor check passed."
