import type { CompanionDraft } from '../companions/companion-schema';

import type { LessonPack } from './lesson-packs';

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

export function runLessonEvaluation(
  lessonPack: LessonPack,
  draft: CompanionDraft,
): LessonAttemptResult {
  const checks: LessonAttemptResult['checks'] = [
    {
      label: lessonPack.checks[0],
      passed: draft.shortBio.trim().length >= 40,
    },
    {
      label: lessonPack.checks[1],
      passed: draft.skillPacks.includes(lessonPack.targetSkillPack),
    },
    {
      label: lessonPack.checks[2],
      passed: draft.personalityTemplate === lessonPack.requiredPersonalityTemplate,
    },
  ];
  const passedChecks = checks.filter((check) => check.passed).length;
  const score = Math.round((passedChecks / checks.length) * 100);
  const passed = score >= 67;

  return {
    lessonPackId: lessonPack.id,
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
