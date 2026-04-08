#!/usr/bin/env bash
set -euo pipefail

pnpm repo:doctor
pnpm --filter web validate

echo "Repo validation passed."
