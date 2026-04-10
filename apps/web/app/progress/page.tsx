'use client';

import { useEffect, useMemo, useState } from 'react';

import { ProgressSummary } from '../components/progress-summary';
import { loadLessonResults } from '../../lib/evals/result-store';
import type { LessonAttemptResult } from '../../lib/evals/eval-runner';
import { deriveBadges } from '../../lib/progress/badges';
import { deriveProgressSummary } from '../../lib/progress/progress-summary';

export default function ProgressPage() {
  const [results, setResults] = useState<LessonAttemptResult[]>([]);

  useEffect(() => {
    void loadLessonResults().then((storedResults) => setResults(storedResults));
  }, []);

  const summary = useMemo(() => deriveProgressSummary(results), [results]);
  const badges = useMemo(() => deriveBadges(results), [results]);

  return (
    <main style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <h2 style={{ margin: 0 }}>Progress</h2>
        <p style={{ margin: 0 }}>
          Review saved lesson results, deterministic badge unlocks, and recent achievements for
          your companion setup.
        </p>
      </div>

      <ProgressSummary summary={summary} badges={badges} />
    </main>
  );
}
