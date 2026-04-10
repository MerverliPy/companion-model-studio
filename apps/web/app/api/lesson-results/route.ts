import { NextResponse } from 'next/server';

import {
  createLessonResult,
  listLessonResults,
} from '../../../lib/evals/result-repository';
import type { LessonAttemptResult } from '../../../lib/evals/eval-runner';

function isLessonAttemptResult(value: unknown): value is LessonAttemptResult {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const result = value as Record<string, unknown>;

  return (
    typeof result.lessonPackId === 'string' &&
    typeof result.companionId === 'string' &&
    typeof result.companionName === 'string' &&
    typeof result.attemptedAt === 'string' &&
    typeof result.score === 'number' &&
    typeof result.passed === 'boolean' &&
    Array.isArray(result.checks) &&
    typeof result.summary === 'string'
  );
}

export async function GET() {
  const results = await listLessonResults();

  return NextResponse.json({ results });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  if (!isLessonAttemptResult(body)) {
    return NextResponse.json({ error: 'Invalid lesson result payload.' }, { status: 400 });
  }

  const results = await createLessonResult(body);

  return NextResponse.json({ results }, { status: 201 });
}
