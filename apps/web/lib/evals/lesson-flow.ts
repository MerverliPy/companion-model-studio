import type { CompanionDraft } from '../companions/companion-schema';

export const builtInLessonPack = {
  id: 'foundations-reflection-checkin',
  title: 'Reflection check-in',
  description:
    'Verify that a saved companion draft is ready to guide a calm daily reflection with a clear profile and matching starter skill.',
  targetSkillPack: 'daily-reflection',
  requiredPersonalityTemplate: 'warm-encourager',
  checks: [
    'Bio is detailed enough for a first lesson.',
    'Daily reflection skill pack is enabled.',
    'Personality matches a supportive check-in tone.',
  ],
} as const;

export type LessonAttemptResult = {
  lessonPackId: string;
  companionId: string;
  companionName: string;
  attemptedAt: string;
  score: number;
  passed: boolean;
  checks: Array<{ label: string; passed: boolean }>;
  summary: string;
};

const resultStorageKey = 'companion-model-studio:lesson-result';

export function runLessonEvaluation(draft: CompanionDraft): LessonAttemptResult {
  const checks = [
    {
      label: builtInLessonPack.checks[0],
      passed: draft.shortBio.trim().length >= 40,
    },
    {
      label: builtInLessonPack.checks[1],
      passed: draft.skillPacks.includes(builtInLessonPack.targetSkillPack),
    },
    {
      label: builtInLessonPack.checks[2],
      passed: draft.personalityTemplate === builtInLessonPack.requiredPersonalityTemplate,
    },
  ];
  const passedChecks = checks.filter((check) => check.passed).length;
  const score = Math.round((passedChecks / checks.length) * 100);
  const passed = score >= 67;

  return {
    lessonPackId: builtInLessonPack.id,
    companionId: draft.id,
    companionName: draft.name,
    attemptedAt: new Date().toISOString(),
    score,
    passed,
    checks,
    summary: passed
      ? `${draft.name} is ready for this first reflection lesson.`
      : `${draft.name} needs a few profile updates before this lesson pack is ready.`,
  };
}

export function saveLessonResult(result: LessonAttemptResult) {
  window.localStorage.setItem(resultStorageKey, JSON.stringify(result));
}

export function loadLessonResult(): LessonAttemptResult | null {
  const stored = window.localStorage.getItem(resultStorageKey);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as LessonAttemptResult;
  } catch {
    return null;
  }
}
