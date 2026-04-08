import type { LessonAttemptResult } from '../evals/lesson-flow';

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
    isUnlocked: (result: LessonAttemptResult | null) => Boolean(result),
  },
  {
    id: 'reflection-ready',
    title: 'Reflection ready',
    description: 'Pass the reflection check-in lesson.',
    isUnlocked: (result: LessonAttemptResult | null) => Boolean(result?.passed),
  },
  {
    id: 'perfect-checklist',
    title: 'Perfect checklist',
    description: 'Pass every check in the current lesson pack.',
    isUnlocked: (result: LessonAttemptResult | null) => result?.score === 100,
  },
] as const;

export function deriveBadges(result: LessonAttemptResult | null): BadgeState[] {
  return badgeDefinitions.map((badge) => {
    const unlocked = badge.isUnlocked(result);

    return {
      id: badge.id,
      title: badge.title,
      description: badge.description,
      unlocked,
      unlockedAt: unlocked ? result?.attemptedAt ?? null : null,
    };
  });
}
