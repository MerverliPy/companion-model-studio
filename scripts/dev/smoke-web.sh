#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

required=(
  "apps/web/app/page.tsx"
  "apps/web/app/create/page.tsx"
  "apps/web/app/lessons/page.tsx"
  "apps/web/app/progress/page.tsx"
  "apps/web/app/chat/page.tsx"
  "apps/web/app/api/chat/route.ts"
)

missing=0
for file in "${required[@]}"; do
  if [ ! -f "$file" ]; then
    echo "Missing web smoke target: $file"
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  echo "Web smoke failed."
  exit 1
fi

echo "Web smoke passed."
