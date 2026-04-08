'use client';

import { useEffect, useMemo, useState } from 'react';

import { ProgressSummary } from '../components/progress-summary';
import { loadLessonResult, type LessonAttemptResult } from '../../lib/evals/lesson-flow';
import { deriveBadges } from '../../lib/progress/badges';
import { deriveProgressSummary } from '../../lib/progress/progress-summary';

export default function ProgressPage() {
  const [result, setResult] = useState<LessonAttemptResult | null>(null);

  useEffect(() => {
    setResult(loadLessonResult());
  }, []);

  const summary = useMemo(() => deriveProgressSummary(result), [result]);
  const badges = useMemo(() => deriveBadges(result), [result]);

  return (
    <main style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <h2 style={{ margin: 0 }}>Progress</h2>
        <p style={{ margin: 0 }}>
          Review the latest lesson result and the first deterministic badge unlocks for your
          companion setup.
        </p>
      </div>

      <ProgressSummary summary={summary} badges={badges} />
    </main>
  );
}
