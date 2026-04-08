import type { LessonAttemptResult } from '../evals/lesson-flow';

export type ProgressSummaryData = {
  lessonsLogged: number;
  passRateLabel: string;
  averageScoreLabel: string;
  passedChecksLabel: string;
  statusMessage: string;
};

export function deriveProgressSummary(result: LessonAttemptResult | null): ProgressSummaryData {
  if (!result) {
    return {
      lessonsLogged: 0,
      passRateLabel: '0%',
      averageScoreLabel: '0%',
      passedChecksLabel: '0/3',
      statusMessage: 'No lesson result saved yet.',
    };
  }

  const passedChecks = result.checks.filter((check) => check.passed).length;

  return {
    lessonsLogged: 1,
    passRateLabel: result.passed ? '100%' : '0%',
    averageScoreLabel: `${result.score}%`,
    passedChecksLabel: `${passedChecks}/${result.checks.length}`,
    statusMessage: result.summary,
  };
}
