# Current Phase

Selected candidate id: runtime-model-selection-e2e

Status: complete

## Goal
Make runtime model selection behaviorally real across the web UI, chat request, API route, and Ollama runtime so chat uses the user-selected local model instead of implicitly choosing the first available model.

## Why this phase is next
- `runtime-model-selection-e2e` is the only remaining unshipped candidate after excluding ids in `.opencode/backlog/completed.yaml`.
- It is also the highest-priority remaining candidate and stays bounded to the existing web/runtime chat path.
- The visible model selector is already present, so making that selection deterministic is the smallest safe follow-up with clear validation.

## Primary files
- `apps/web/app/components/runtime-status.tsx`
- `apps/web/app/components/chat-workbench.tsx`
- `apps/web/app/api/chat/route.ts`
- `apps/web/lib/runtime/ollama.ts`
- `apps/web/lib/runtime/model-selection-store.ts`

## Expected max files changed
5

## Forbidden paths
- `.opencode/backlog/**`
- `.opencode/agents/**`
- `.opencode/commands/**`
- `.github/**`
- `docs/**`
- `README.md`
- `apps/web/prisma/**`
- `node_modules/**`
- `apps/web/.next/**`

## Risk
The main risk is preserving a hidden fallback path that still masks selection bugs by quietly choosing another model.

Secondary risk is scope drift into durable persistence, schema redesign, or broader chat refactoring beyond the selected-model path.

## Rollback note
If validation fails or behavior regresses, revert selected-model propagation changes in the listed files and restore the prior runtime path without changing unrelated chat behavior.

## In scope
- Save the selected runtime model for the active local web session.
- Propagate the selected model from UI state into outbound chat requests.
- Accept and use the selected model in the chat API/runtime layer.
- Fail clearly when a selected model is missing, empty, or stale instead of silently falling back.

## Out of scope
- SQLite or Prisma persistence work.
- Companion draft, lessons, or progress persistence changes.
- Broader request-schema hardening beyond the minimal selected-model field needed for this phase.
- Chat UI redesign or general chat refactoring.
- CI, docs, backlog, or workflow artifact edits outside this plan file.

## Tasks
- Confirm where runtime model selection currently stops being propagated.
- Implement a small local session model-selection store in `apps/web/lib/runtime/model-selection-store.ts`.
- Update `runtime-status.tsx` to write and restore the selected model for the active session.
- Update `chat-workbench.tsx` so chat requests include `selectedModel`.
- Update `app/api/chat/route.ts` to validate and pass through `selectedModel`.
- Update `lib/runtime/ollama.ts` so chat execution uses `selectedModel` and fails clearly when it is unavailable.

## Validation command
`pnpm --filter web validate`

## Validation
- PASS: `pnpm --filter web validate` completed successfully (typecheck, Next build, and `smoke-web` all passed on 2026-04-09).
- PASS: selected-model propagation is explicit across the bounded phase: `runtime-status.tsx` restores/saves session selection, `chat-workbench.tsx` sends `selectedModel`, `app/api/chat/route.ts` requires and forwards it, and `lib/runtime/ollama.ts` trims, validates availability, and submits `model: selectedModel` to Ollama.
- PASS: no silent first-model fallback remains for chat execution; prior `nextModels.models[0]?.name` UI auto-selection and runtime default-model helper were removed, and runtime chat now fails clearly for missing or stale selections.
- PASS: bounded scope held to the five primary implementation files, with no forbidden/generated artifact changes detected (`node_modules/**`, `apps/web/.next/**`).

## Repair targets
- none

## Acceptance criteria
- The selected runtime model is saved for the active local web session.
- Chat requests include `selectedModel`.
- Runtime chat uses `selectedModel` instead of the first available model.
- Missing, empty, or stale selected models fail clearly without silent fallback.
- `pnpm --filter web validate` passes.

## Completion summary
- files changed:
  - `.opencode/plans/current-phase.md`
  - `apps/web/app/components/runtime-status.tsx`
  - `apps/web/app/components/chat-workbench.tsx`
  - `apps/web/app/api/chat/route.ts`
  - `apps/web/lib/runtime/ollama.ts`
  - `apps/web/lib/runtime/model-selection-store.ts`
- implementation summary:
  - added a session-scoped runtime model selection store and updated the runtime status UI to restore, save, and clear stale selected models without auto-falling back to the first model
  - propagated `selectedModel` through chat requests, validated it in the chat API route, and required Ollama chat execution to use the selected model explicitly
  - added clear chat-facing failure messages for missing or unavailable selected models instead of silently choosing another runtime model
- known risks:
  - selected-model persistence remains limited to browser session storage and does not survive a new browser session
  - stale-model handling depends on the runtime model list being reachable when the runtime status UI refreshes
  - chat failures now surface selection errors more directly, so users must choose a model before first send
