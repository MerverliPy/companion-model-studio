import type { LessonAttemptResult } from '../evals/eval-runner';

export type ProgressSummaryData = {
  lessonsLogged: number;
  passRateLabel: string;
  averageScoreLabel: string;
  passedChecksLabel: string;
  statusMessage: string;
};

export function deriveProgressSummary(results: LessonAttemptResult[]): ProgressSummaryData {
  if (results.length === 0) {
    return {
      lessonsLogged: 0,
      passRateLabel: '0%',
      averageScoreLabel: '0%',
      passedChecksLabel: '0/3',
      statusMessage: 'No lesson results saved yet.',
    };
  }

  const latestResult = results[0];
  const passedLessonCount = results.filter((result) => result.passed).length;
  const totalScore = results.reduce((sum, result) => sum + result.score, 0);
  const passedChecks = results.reduce(
    (sum, result) => sum + result.checks.filter((check) => check.passed).length,
    0,
  );
  const totalChecks = results.reduce((sum, result) => sum + result.checks.length, 0);

  return {
    lessonsLogged: results.length,
    passRateLabel: `${Math.round((passedLessonCount / results.length) * 100)}%`,
    averageScoreLabel: `${Math.round(totalScore / results.length)}%`,
    passedChecksLabel: `${passedChecks}/${totalChecks}`,
    statusMessage: latestResult.summary,
  };
}
