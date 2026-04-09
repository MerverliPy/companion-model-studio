# Current Phase

Selected candidate id: progress-and-badges

Status: pending

## Goal
Connect the Progress view to the shipped lesson-results storage so users can see a bounded deterministic progress summary, badge unlock state, and recent achievements derived from stored lesson eval history.

## Why this phase is next
- There is no explicit new user scope overriding backlog order.
- `.opencode/backlog/completed.yaml` is canonical, and `lessons-and-evals` is now complete, so it cannot be selected again.
- Among remaining unshipped candidates, `progress-and-badges` is the next product candidate and is also the clearest same-module follow-up to the shipped lesson/eval loop.
- This is the smallest safe next step because it uses existing lesson results to power the progress surface without expanding into chat, create-flow, analytics, or persistence redesign.
- The repo workflow says web-only implementation phases should prefer the stable web validation command.

## Primary files
- `apps/web/app/progress/page.tsx`
- `apps/web/app/components/progress-summary.tsx`
- `apps/web/lib/progress/progress-summary.ts`
- `apps/web/lib/progress/badges.ts`
- `apps/web/lib/evals/result-store.ts`

## Expected max files changed
5

## Forbidden paths
- `apps/web/app/chat/**`
- `apps/web/app/api/**`
- `apps/web/app/create/**`
- `apps/web/app/lessons/**`
- `.opencode/backlog/**`
- `.opencode/agents/**`
- `.opencode/commands/**`
- `docs/**`
- `.github/**`
- `node_modules/**`
- `apps/web/.next/**`

## Risk
The main risk is scope drift into a broad analytics dashboard or cross-module refactor instead of a bounded progress view driven by already-stored lesson results.

A second risk is changing badge rules in a way that depends on future server persistence or non-deterministic state, which would weaken the acceptance criteria for this small phase.

## Rollback note
If this phase becomes unstable, revert the Progress page and supporting progress derivation changes, returning the progress surface to its prior bounded state while keeping lesson storage behavior unchanged.

## In scope
- Read lesson results from the current local result storage approach.
- Derive a deterministic progress summary from stored lesson results.
- Derive deterministic badge unlock state from stored lesson results.
- Show recent achievements in the Progress view.

## Out of scope
- New lesson packs or changes to the lessons attempt flow.
- Broad analytics, charts, exports, or long-term reporting.
- Chat runtime behavior or companion conversation changes.
- Create-flow redesign, skill-pack redesign, or workflow/ledger edits.

## Tasks
- Replace single-result progress assumptions with reads from the shipped lesson-results store.
- Update progress summary derivation to use stored results and surface bounded metrics.
- Update badge derivation to use deterministic rules over stored results.
- Update the Progress UI so recent achievements are visible from the derived badge/progress data.
- Keep changes bounded to the listed files and within the 5-file limit.

## Validation command
`pnpm --filter web validate`

## Validation
- pending

## Repair targets
- none

## Acceptance criteria
- The Progress view exists and renders from stored lesson results.
- Badges unlock from deterministic rules derived from stored lesson results.
- A recent achievements list is visible in the Progress view.
- The phase stays within the expected max file count and forbidden paths remain untouched.
- `pnpm --filter web validate` passes.

## Completion summary
- Files changed: pending
- Implementation summary: pending
- Known risks: pending
