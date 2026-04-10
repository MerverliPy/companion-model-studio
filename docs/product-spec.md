# Companion Model Studio - Product Spec V1

## Product statement
Companion Model Studio is a local-first app for a single local user to create a companion draft, connect to a local runtime, run a first built-in lesson eval, review progress, and chat with the draft using local context.

## Target user
- solo builders
- AI hobbyists
- privacy-focused users
- users who want a personal local assistant with character identity

## Core jobs to be done
1. Create and save a companion draft
2. Select avatar, personality template, and skill packs
3. Connect to a local Ollama runtime
4. Run the built-in lesson eval
5. View saved progress and badge unlocks
6. Chat locally with the saved draft as context

## Shipped feature set
### 1. Companion creation
- name
- short bio
- personality template
- avatar theme
- starter skill pack selection
- companion card preview
- saved locally in browser storage

### 2. Starter skill packs
- assistant
- creator
- editor
- debugger

### 3. Local runtime connectivity
- runtime status
- model listing
- model selection
- basic Ollama health checks
- selected model stored locally in browser storage

### 4. Lessons and evals
- one built-in lesson pack
- lesson attempt flow against the saved draft
- saved score history
- pass/fail + notes persisted through Next.js API routes into SQLite via Prisma

### 5. Progress and badges
- summary metrics from stored lesson results
- deterministic badge unlock system
- recent achievements

### 6. Chat workspace
- local chat against the selected Ollama model
- companion header card
- selected skills visible
- active session persisted through Next.js API routes into SQLite via Prisma

## Current constraints
- local-first web app only
- single-user only
- no cloud sync
- no multi-user auth
- companion draft currently lives in browser storage rather than SQLite
- UI currently centers on one saved draft companion and one active chat session

## V1 non-goals
- training a frontier/foundation model from scratch
- cloud training
- voice cloning
- social marketplace
- plugin platform
- multi-user auth

## Technical stance
- local-first web app
- Next.js + TypeScript
- SQLite + Prisma
- Ollama as first runtime target
- llama.cpp as later optional runtime

## Later optional directions
- additional lesson packs and richer eval coverage
- broader progress presentation beyond the current summary and badges
- deeper companion persistence beyond the current browser-stored draft
- support for more local runtime targets where useful

## Quality bar
- one bounded phase at a time
- prefer single-module changes
- each phase must have validation
- no silent scope expansion
- no dead files left behind
