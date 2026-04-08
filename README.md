# Companion Model Studio

Local-first platform for creating, training, and improving a user-owned AI companion.

## V1
- Create a companion
- Pick avatar, template, and skill packs
- Connect to a local model runtime
- Run lessons and evals
- Track progress and badges
- Chat locally

## Development workflow
This repo uses:

- orchestrator -> builder -> validator -> shipper
- failure path: orchestrator -> builder -> validator -> repair -> validator -> shipper

## Validation
- `pnpm repo:doctor`
- `pnpm validate:repo`
- `pnpm --filter web validate`

## Governance
- CI: `.github/workflows/ci.yml`
- Code ownership: `CODEOWNERS`
- Branch protection notes: `docs/branch-protection.md`
