# Current Phase

Selected candidate id: chat-request-schema-hardening

Status: pending

## Goal
Harden the `/api/chat` request boundary so malformed, oversized, or invalid chat payloads are rejected through a stable schema layer before any runtime dispatch occurs.

## Why this phase is next
- There is explicit user scope to continue the audited follow-up chain after the shipped runtime model-selection fix.
- The chat route currently accepts request JSON too loosely, so schema enforcement is the smallest safe next step before SQLite/Prisma and server-backed persistence work.
- This phase stays inside the existing web/chat/runtime surface and avoids bundling transport hardening with persistence migration.
- Completing this phase creates a stable request contract for the next bounded follow-up: `sqlite-prisma-foundation`.

## Primary files
- `apps/web/package.json`
- `apps/web/app/api/chat/route.ts`
- `apps/web/lib/chat/chat-request-schema.ts`
- `apps/web/lib/runtime/ollama.ts`
- `apps/web/app/components/chat-workbench.tsx`

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
The main risk is over-hardening the request contract in a way that breaks the current local chat flow instead of rejecting only invalid payloads.

A second risk is scope drift into persistence, authentication, or broader API refactors before this phase establishes a minimal stable schema boundary.

## Rollback note
If this phase becomes unstable, revert the schema layer and route validation changes and restore the prior chat request parsing behavior, keeping all rollback limited to the listed files.

## In scope
- Add a schema layer for `/api/chat` request parsing.
- Enforce selected-model, message-shape, role, count, and content invariants before runtime dispatch.
- Return stable 400 responses for invalid requests.
- Update the chat UI to handle validation rejection without corrupting local session state.

## Out of scope
- SQLite or Prisma setup.
- Companion draft persistence changes.
- Lesson or progress persistence changes.
- Chat-session server persistence.
- Test-framework introduction or CI workflow changes.
- Docs, backlog, or workflow artifact edits.

## Tasks
- Review the current `/api/chat` request shape and identify missing invariants.
- Add a chat request schema module for route-level parsing and validation.
- Update the chat route to use the schema layer before runtime dispatch.
- Enforce message role, message count, trimmed content, and selected-model requirements.
- Return stable invalid-request responses from the route.
- Update the chat workbench to handle schema rejection without corrupting the current local session.
- Keep changes bounded to the listed files.

## Validation command
`pnpm --filter web validate`

## Validation
- PENDING: validator must run `pnpm --filter web validate`.
- Expected validator checks:
  - typecheck passes
  - Next.js build passes
  - web smoke passes
- Validator should also confirm that invalid payloads are rejected before the Ollama runtime layer is called and that the local chat UI remains stable after schema rejection.

## Repair targets
- none

## Acceptance criteria
- `/api/chat` parses request bodies through a schema layer.
- Malformed payloads return stable 400 responses with useful error details.
- Message role, count, length, and `selectedModel` invariants are enforced before runtime dispatch.
- Chat UI handles schema rejection without corrupting the local session.
- `pnpm --filter web validate` passes.

## Completion summary
- files changed:
  - none yet
- implementation summary:
  - not started
- known risks:
  - route validation may expose existing client-side assumptions that need small UI error-handling adjustments
  - request hardening must not silently reintroduce runtime fallbacks or payload mutation
