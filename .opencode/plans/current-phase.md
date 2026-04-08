# Current Phase

Selected candidate id: chat-workbench

Status: pending

## Goal
Add the first bounded chat-workbench slice in `apps/web` so a user can open a local chat session, see selected companion context in the chat surface, and render a stable message list using only the minimum local browser state needed for this phase without expanding into richer history, lessons, or runtime refactors.

## Why this phase is next
- Chosen by highest_priority among the remaining unfinished candidates: `chat-workbench` is now the only meaningful unfinished product candidate left in the backlog.
- It follows the product spec sequence after creation, skill packs, lessons/evals, and progress by making the configured companion usable in a local chat flow.
- It beat no stronger alternatives because the earlier candidates are already materially complete and should not be re-selected.
- This plan keeps the phase safely bounded to a first chat slice: one chat page, one stable chat panel, and the minimum local session state needed to apply saved companion context.

Stronger alternatives rejected:
- `foundation-workspace-bootstrap`, `studio-shell-and-routing`, `local-model-connectivity`, `companion-creation-wizard`, `skill-pack-selection`, `lessons-and-evals`, and `progress-and-badges` were rejected because they are already materially complete and should not be re-selected.

## Primary files
- `apps/web/app/chat/page.tsx`
- `apps/web/app/components/chat-workbench.tsx`
- `apps/web/app/components/companion-chat-header.tsx`
- `apps/web/app/api/chat/route.ts`
- `apps/web/lib/chat/session-store.ts`

## Expected max files changed
5

## Forbidden paths
- `node_modules/**`
- `apps/web/.next/**`
- `packages/**`
- `docs/**`
- `.opencode/backlog/**`
- `apps/web/app/create/**`
- `apps/web/app/lessons/**`
- `apps/web/app/progress/**`
- `apps/web/app/api/runtime/**`
- `apps/web/app/components/runtime-status.tsx`
- `apps/web/lib/runtime/**`

## Risk
The main risk is scope drift from a first local chat slice into a full assistant stack with streaming, model orchestration, or durable multi-session history. A secondary risk is over-coupling the chat flow to runtime connectivity instead of keeping this phase focused on stable local UI, applied companion context, and minimal local session behavior.

## Rollback note
If this phase fails validation or must be reverted, remove the chat page, chat workbench, companion chat header, chat API route, and local session storage changes, then return the app to the current state where chat exists only as a navigation target.

## In scope
- Add a first chat page for the local companion chat flow.
- Show saved companion context in a bounded chat header or summary surface.
- Add a stable chat message list and composer interaction.
- Add only the minimum API route and local session state needed to send and render messages in the workbench.

## Out of scope
- Streaming responses, rich markdown rendering, attachments, or multi-session history management.
- Changes to lessons, progress, create flow, or runtime connectivity behavior.
- Broad model orchestration refactors or server-backed persistence.
- Unrelated navigation or layout refactors.

## Tasks
- Add a bounded chat page that replaces the current placeholder route.
- Add a companion-aware chat header using the saved draft companion context.
- Add a stable local chat panel with message list and composer.
- Add the smallest chat API route and session storage needed to render a local chat loop.

## Validation command
`pnpm --filter web build`

## Validation
NOT RUN

- Pending implementation.

## Repair targets
none

## Acceptance criteria
- User can open a local chat session.
- Selected companion context is applied in the chat surface.
- Messages render in a stable chat UI.
- The phase stays bounded to the first chat-workbench slice and does not introduce unrelated refactors.
- Validation command passes.

## Completion summary
- Not started.
