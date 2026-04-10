# Current Phase

Selected candidate id: server-backed-chat-session

Status: complete

## Goal
Cut active chat session persistence over from browser localStorage to the shipped SQLite/Prisma foundation so local chat reloads against the same server-backed session history and no longer depends on browser-canonical storage.

## Why this phase is next
- There is explicit user scope to continue the audited follow-up chain after the shipped server-backed lesson-results phase.
- The database layer exists and the earlier persistence cutovers for companion drafts and lesson results are complete, so the remaining bounded persistence surface is the active chat session.
- This is the smallest safe next step because it migrates only the chat session storage path without reopening companion, lesson, or broader runtime work.
- Completing this phase finishes the planned persistence cutover sequence before the later behavior-test and docs-alignment follow-ups.

## Primary files
- `apps/web/app/api/chat-sessions/route.ts`
- `apps/web/lib/chat/session-store.ts`
- `apps/web/lib/chat/chat-session-repository.ts`
- `apps/web/app/components/chat-workbench.tsx`
- `apps/web/app/chat/page.tsx`

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
- `apps/web/app/create/**`
- `apps/web/app/lessons/**`
- `apps/web/app/progress/**`
- `apps/web/app/api/companion-draft/**`
- `apps/web/app/api/lesson-results/**`
- `apps/web/app/api/chat/route.ts`
- `node_modules/**`
- `apps/web/.next/**`

## Risk
The main risk is partially migrating chat-session reads and writes so page load, optimistic message updates, and persisted history disagree about which session is canonical.

A second risk is scope drift into broader chat runtime changes or test/CI work before the bounded session-storage cutover is complete.

## Rollback note
If this phase becomes unstable, revert the chat-session API and repository cutover changes and restore the prior localStorage-backed session flow, keeping all rollback limited to the listed files.

## In scope
- Add a server-backed chat-sessions route.
- Add a small repository layer for chat-session reads and writes using Prisma.
- Update the chat workbench to load the active session from the server-backed path.
- Update the chat workbench to persist user and assistant messages through the server-backed path.
- Remove browser localStorage as the canonical chat-session source.

## Out of scope
- Companion draft persistence changes.
- Lesson-result persistence changes.
- New runtime model-selection changes.
- Broader chat API redesign beyond what is required for session persistence.
- Test-framework introduction or CI workflow changes.
- Docs, backlog, or workflow artifact edits.

## Tasks
- Review the existing chat-session load/save flow and identify all localStorage dependencies.
- Add `apps/web/lib/chat/chat-session-repository.ts` backed by Prisma.
- Add `apps/web/app/api/chat-sessions/route.ts` for bounded chat-session reads and writes.
- Update `apps/web/lib/chat/session-store.ts` so it no longer treats localStorage as canonical storage.
- Update `apps/web/app/components/chat-workbench.tsx` to load and persist the active session through the server-backed path.
- Update `apps/web/app/chat/page.tsx` only as needed to support the bounded session cutover.
- Keep all changes bounded to the listed files.

## Validation command
`pnpm --filter web validate`

## Validation
- PASS: `pnpm --filter web validate` completed successfully.
- Evidence:
  - prisma generate passed
  - typecheck passed
  - Next.js build passed
  - web smoke passed
  - `/api/chat-sessions` is the active session persistence path used by chat load/save helpers
  - chat send flow persists both user and assistant messages through the server-backed session store
  - no changed files touched forbidden paths or tracked generated artifacts

## Repair targets
- none

## Acceptance criteria
- Active chat session is loaded from SQLite on page open.
- Sending a message persists both user and assistant messages to SQLite.
- Full page reload preserves session history without relying on localStorage.
- localStorage is no longer the canonical chat-session source.
- `pnpm --filter web validate` passes.

## Completion summary
- files changed:
  - `.opencode/plans/current-phase.md`
  - `apps/web/app/api/chat-sessions/route.ts`
  - `apps/web/app/components/chat-workbench.tsx`
  - `apps/web/lib/chat/chat-session-repository.ts`
  - `apps/web/lib/chat/session-store.ts`
- implementation summary:
  - added a server-backed `/api/chat-sessions` route plus a Prisma repository for loading and saving the active chat session from SQLite
  - replaced localStorage-backed chat session helpers with fetch-based load/save helpers and updated the chat workbench to initialize, persist, and restore session history through the server-backed path
- known risks:
  - the active-session lookup currently returns the most recently updated stored session, so future multi-session behavior would need more explicit scoping
  - if chat-session persistence fails during message send, the UI rolls back to the prior session state but the transient optimistic message may briefly appear before the rollback completes
