import { describe, expect, it } from 'vitest';

import { type CompanionDraft } from './companions/companion-schema';
import { runLessonEvaluation } from './evals/eval-runner';
import { builtInLessonPack } from './evals/lesson-packs';
import { deriveProgressSummary } from './progress/progress-summary';

describe('studio behavior', () => {
  it('derives deterministic progress labels from persisted lesson results', () => {
    const draft: CompanionDraft = {
      id: 'draft-1',
      name: 'Mira',
      shortBio: 'A calm and supportive guide for local daily reflection check-ins.',
      personalityTemplate: 'warm-encourager',
      avatarTheme: 'sunrise',
      skillPacks: ['daily-reflection'],
      savedAt: '2026-04-09T00:00:00.000Z',
    };

    const latestResult = runLessonEvaluation(builtInLessonPack, draft);
    const earlierResult = {
      ...latestResult,
      attemptedAt: '2026-04-08T00:00:00.000Z',
      score: 33,
      passed: false,
      checks: latestResult.checks.map((check, index) => ({
        ...check,
        passed: index === 0,
      })),
      summary: 'Mira needs a few profile updates before this lesson pack is ready.',
    };

    expect(latestResult.score).toBe(100);
    expect(latestResult.passed).toBe(true);

    expect(deriveProgressSummary([latestResult, earlierResult])).toEqual({
      lessonsLogged: 2,
      passRateLabel: '50%',
      averageScoreLabel: '67%',
      passedChecksLabel: '4/6',
      statusMessage: 'Mira is ready for this first reflection lesson.',
    });
  });
});
