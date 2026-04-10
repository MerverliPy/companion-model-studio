import 'server-only';

import { prisma } from '../db/prisma';

import type { LessonAttemptResult } from './eval-runner';

function toLessonAttemptResult(record: {
  lessonPackId: string;
  companionDraftId: string | null;
  companionName: string;
  attemptedAt: Date;
  score: number;
  passed: boolean;
  checksJson: string;
  summary: string;
}): LessonAttemptResult {
  let checks: LessonAttemptResult['checks'] = [];

  try {
    const parsed = JSON.parse(record.checksJson) as LessonAttemptResult['checks'];
    checks = Array.isArray(parsed) ? parsed : [];
  } catch {
    checks = [];
  }

  return {
    lessonPackId: record.lessonPackId,
    companionId: record.companionDraftId ?? '',
    companionName: record.companionName,
    attemptedAt: record.attemptedAt.toISOString(),
    score: record.score,
    passed: record.passed,
    checks,
    summary: record.summary,
  };
}

export async function listLessonResults(): Promise<LessonAttemptResult[]> {
  const records = await prisma.lessonResult.findMany({
    orderBy: [{ attemptedAt: 'desc' }, { createdAt: 'desc' }],
  });

  return records.map(toLessonAttemptResult);
}

export async function createLessonResult(result: LessonAttemptResult): Promise<LessonAttemptResult[]> {
  await prisma.lessonResult.create({
    data: {
      lessonPackId: result.lessonPackId,
      companionName: result.companionName,
      attemptedAt: new Date(result.attemptedAt),
      score: result.score,
      passed: result.passed,
      checksJson: JSON.stringify(result.checks),
      summary: result.summary,
    },
  });

  return listLessonResults();
}
