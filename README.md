# Companion Model Studio

Local-first studio for building and chatting with a user-owned AI companion on your own machine.

## Shipped in this repo today
- Create and save one local companion draft with a name, short bio, personality template, avatar theme, and starter skill packs.
- Check local Ollama runtime health, list local models, and choose a model for chat.
- Run the built-in lesson eval against the saved draft.
- Review progress, summary metrics, and deterministic badge unlocks derived from saved lesson results.
- Chat locally with the saved draft as context and persist the active chat session.

## Local persistence
- Companion draft and selected runtime model are stored in the browser for the current local user.
- Lesson results and chat sessions are persisted in SQLite through Prisma-backed Next.js API routes.
- The app is intentionally local-only and single-user in this phase; there is no cloud sync or multi-user auth.

## Runtime
- Primary runtime target: Ollama on `http://127.0.0.1:11434`
- Later optional runtime direction: `llama.cpp`

## Development workflow
This repo uses:

- orchestrator -> builder -> validator -> shipper
- failure path: orchestrator -> builder -> validator -> repair -> validator -> shipper
- `.opencode/backlog/completed.yaml` is the canonical shipped/completed ledger
- `.opencode/plans/current-phase.md` is the active working plan and should point at the next unshipped bounded phase

## Validation
- `pnpm repo:doctor`
- `pnpm validate:repo`
- `pnpm --filter web validate`

## Governance
- CI: `.github/workflows/ci.yml`
- Code ownership: `CODEOWNERS`
- Branch protection notes: `docs/branch-protection.md`
