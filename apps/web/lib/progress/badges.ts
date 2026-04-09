import type { LessonAttemptResult } from '../evals/eval-runner';

export type BadgeState = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt: string | null;
};

const badgeDefinitions = [
  {
    id: 'first-lesson-logged',
    title: 'First lesson logged',
    description: 'Save your first lesson evaluation result.',
    isUnlocked: (results: LessonAttemptResult[]) => results.length >= 1,
    getUnlockedAt: (results: LessonAttemptResult[]) => results.at(-1)?.attemptedAt ?? null,
  },
  {
    id: 'steady-practice',
    title: 'Steady practice',
    description: 'Log three lesson evaluation results.',
    isUnlocked: (results: LessonAttemptResult[]) => results.length >= 3,
    getUnlockedAt: (results: LessonAttemptResult[]) => results[2]?.attemptedAt ?? null,
  },
  {
    id: 'reflection-ready',
    title: 'Reflection ready',
    description: 'Pass the reflection check-in lesson.',
    isUnlocked: (results: LessonAttemptResult[]) => results.some((result) => result.passed),
    getUnlockedAt: (results: LessonAttemptResult[]) =>
      [...results].reverse().find((result) => result.passed)?.attemptedAt ?? null,
  },
  {
    id: 'perfect-checklist',
    title: 'Perfect checklist',
    description: 'Pass every check in the current lesson pack.',
    isUnlocked: (results: LessonAttemptResult[]) => results.some((result) => result.score === 100),
    getUnlockedAt: (results: LessonAttemptResult[]) =>
      [...results].reverse().find((result) => result.score === 100)?.attemptedAt ?? null,
  },
] as const;

export function deriveBadges(results: LessonAttemptResult[]): BadgeState[] {
  return badgeDefinitions.map((badge) => {
    const unlocked = badge.isUnlocked(results);

    return {
      id: badge.id,
      title: badge.title,
      description: badge.description,
      unlocked,
      unlockedAt: unlocked ? badge.getUnlockedAt(results) : null,
    };
  });
}
