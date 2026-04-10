import type { LessonAttemptResult } from './eval-runner';

async function parseResultResponse(response: Response) {
  const body = (await response.json()) as { error?: string; results?: LessonAttemptResult[] };

  if (!response.ok || !body.results) {
    throw new Error(body.error ?? 'Unable to load lesson results.');
  }

  return body.results;
}

export async function saveLessonResult(result: LessonAttemptResult) {
  const response = await fetch('/api/lesson-results', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(result),
  });

  return parseResultResponse(response);
}

export async function loadLessonResults(): Promise<LessonAttemptResult[]> {
  const response = await fetch('/api/lesson-results', {
    method: 'GET',
    cache: 'no-store',
  });

  return parseResultResponse(response);
}
