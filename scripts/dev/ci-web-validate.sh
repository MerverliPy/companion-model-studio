#!/usr/bin/env bash
set -euo pipefail

mkdir -p ci-logs

run_pnpm() {
  if command -v pnpm >/dev/null 2>&1; then
    pnpm "$@"
  else
    corepack pnpm "$@"
  fi
}

run_step() {
  local name="$1"
  shift

  echo
  echo "=== ${name} ==="
  {
    echo "STEP: ${name}"
    echo "PWD: $(pwd)"
    echo "DATE: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    echo "PATH: $PATH"
    echo "PNPM_BIN: $(command -v pnpm || echo 'not-found')"
    echo "COREPACK_BIN: $(command -v corepack || echo 'not-found')"
    echo "CMD: $*"
    echo
    "$@"
  } 2>&1 | tee "ci-logs/${name}.log"
}

run_step repo-doctor run_pnpm repo:doctor
run_step web-resolve-next run_pnpm --filter web exec node -p "require.resolve('next/package.json')"
run_step web-resolve-react run_pnpm --filter web exec node -p "require.resolve('react/package.json')"
run_step web-resolve-react-dom run_pnpm --filter web exec node -p "require.resolve('react-dom/package.json')"
run_step web-dependency-list run_pnpm --filter web list next react react-dom --depth 0
run_step web-typecheck run_pnpm --filter web typecheck
run_step web-build run_pnpm --filter web build
run_step web-smoke run_pnpm --filter web smoke

echo "CI web validation passed." | tee "ci-logs/summary.log"
