# Companion Model Studio - Product Spec V1

## Product statement
Companion Model Studio is a local-first app that lets a user create a customizable AI companion, connect it to a local model runtime, improve it through lessons/evals, and visually track progress through badges and dashboards.

## Target user
- solo builders
- AI hobbyists
- privacy-focused users
- users who want a personal local assistant with character identity

## Core jobs to be done
1. Create a companion profile
2. Select avatar and personality template
3. Select skill packs
4. Connect to a local model runtime
5. Run lessons/evals
6. View measurable progress
7. Chat with the companion locally

## V1 feature set
### 1. Companion creation
- name
- short bio
- personality template
- avatar theme
- companion card preview

### 2. Skill packs
- assistant
- creator
- editor
- debugger

### 3. Local runtime connectivity
- runtime status
- model listing
- model selection
- basic health checks

### 4. Lessons and evals
- lesson catalog
- lesson attempt flow
- score history
- pass/fail + notes

### 5. Progress and badges
- level/progress bar
- skill progression
- badge unlock system
- recent achievements

### 6. Chat workspace
- local chat
- companion header card
- selected skills visible
- session history

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

## Quality bar
- one bounded phase at a time
- prefer single-module changes
- each phase must have validation
- no silent scope expansion
- no dead files left behind
