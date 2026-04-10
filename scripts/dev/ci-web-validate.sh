#!/usr/bin/env bash
set -euo pipefail

mkdir -p ci-logs

run_step() {
  local name="$1"
  shift

  echo
  echo "=== ${name} ==="
  {
    echo "STEP: ${name}"
    echo "PWD: $(pwd)"
    echo "DATE: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    echo "CMD: $*"
    echo
    "$@"
  } 2>&1 | tee "ci-logs/${name}.log"
}

run_step repo-doctor pnpm repo:doctor
run_step web-resolve-next pnpm --filter web exec node -p "require.resolve('next/package.json')"
run_step web-resolve-react pnpm --filter web exec node -p "require.resolve('react/package.json')"
run_step web-resolve-react-dom pnpm --filter web exec node -p "require.resolve('react-dom/package.json')"
run_step web-dependency-list pnpm --filter web list next react react-dom --depth 0
run_step web-typecheck pnpm --filter web typecheck
run_step web-build pnpm --filter web build
run_step web-smoke pnpm --filter web smoke

echo "CI web validation passed." | tee "ci-logs/summary.log"
