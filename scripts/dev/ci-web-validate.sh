#!/usr/bin/env bash
set -euo pipefail

mkdir -p ci-logs

run_pnpm() {
  corepack pnpm "$@"
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
    echo "NODE_BIN: $(command -v node || echo 'not-found')"
    echo "NODE_VERSION: $(node -v 2>/dev/null || echo 'node-unavailable')"
    echo "COREPACK_BIN: $(command -v corepack || echo 'not-found')"
    echo "COREPACK_VERSION: $(corepack --version 2>/dev/null || echo 'corepack-unavailable')"
    echo "CMD: $*"
    echo
    "$@"
  } 2>&1 | tee "ci-logs/${name}.log"
}

run_step toolchain-env bash -lc 'which node && node -v && which corepack && corepack --version && corepack pnpm --version'
run_step install run_pnpm install --frozen-lockfile
run_step repo-doctor run_pnpm repo:doctor
run_step web-resolve-next run_pnpm --filter web exec node -p "require.resolve('next/package.json')"
run_step web-resolve-react run_pnpm --filter web exec node -p "require.resolve('react/package.json')"
run_step web-resolve-react-dom run_pnpm --filter web exec node -p "require.resolve('react-dom/package.json')"
run_step web-dependency-list run_pnpm --filter web list next react react-dom --depth 0
run_step web-validate run_pnpm --filter web validate

echo "CI web validation passed." | tee "ci-logs/summary.log"
