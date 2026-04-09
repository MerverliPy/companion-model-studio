import type { LessonAttemptResult } from './eval-runner';

const resultStorageKey = 'companion-model-studio:lesson-results';

export function saveLessonResult(result: LessonAttemptResult) {
  const existingResults = loadLessonResults();
  const nextResults = [result, ...existingResults].slice(0, 5);

  window.localStorage.setItem(resultStorageKey, JSON.stringify(nextResults));

  return nextResults;
}

export function loadLessonResults(): LessonAttemptResult[] {
  const stored = window.localStorage.getItem(resultStorageKey);

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored) as LessonAttemptResult[];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
