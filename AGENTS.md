# Companion Model Studio

## Mission
Build a local-first studio for creating, training, and chatting with a user-owned AI companion.

## Product constraints
- V1 is NOT foundation-model pretraining from scratch
- V1 IS a local companion builder + lesson/eval platform
- Keep architecture simple and runnable on a normal PC
- Prefer local UX over cloud dependencies

## Stack target
- TypeScript
- Next.js app in apps/web
- SQLite + Prisma
- Ollama first
- pnpm workspace

## Workflow rules
- Preferred loop: orchestrator -> builder -> validator -> builder(if fail) -> validator -> shipper
- Keep current work in .opencode/plans/current-phase.md
- Select work from .opencode/backlog/candidates.yaml
- Only one bounded phase at a time
- Prefer single-module phases
- Default expected max files changed: 5
- Never silently expand scope
- Validator must not edit files
- Shipper drafts commit message and release notes, but does not push

## Phase file requirements
Every current phase must include:
- Goal
- Why this phase is next
- Primary files
- Expected max files changed
- Risk
- Rollback note
- In scope
- Out of scope
- Tasks
- Validation command
- Validation
- Acceptance criteria
- Completion summary
