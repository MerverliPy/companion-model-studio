'use client';

import { useEffect, useState } from 'react';

import { loadCompanionDraft } from '../../lib/companions/draft-store';
import {
  builtInLessonPack,
} from '../../lib/evals/lesson-packs';
import {
  runLessonEvaluation,
  type LessonAttemptResult,
} from '../../lib/evals/eval-runner';
import { loadLessonResults, saveLessonResult } from '../../lib/evals/result-store';

export function LessonAttemptPanel() {
  const [draftName, setDraftName] = useState<string | null>(null);
  const [results, setResults] = useState<LessonAttemptResult[]>([]);
  const [error, setError] = useState('');

  const latestResult = results[0] ?? null;

  useEffect(() => {
    const draft = loadCompanionDraft();

    setDraftName(draft?.name ?? null);
    setResults(loadLessonResults());
  }, []);

  function runLessonAttempt() {
    const draft = loadCompanionDraft();

    if (!draft) {
      setDraftName(null);
      setError('Save a companion draft before running this lesson.');
      return;
    }

    const nextResult = runLessonEvaluation(builtInLessonPack, draft);

    const nextResults = saveLessonResult(nextResult);
    setDraftName(draft.name);
    setResults(nextResults);
    setError('');
  }

  return (
    <section
      style={{
        display: 'grid',
        gap: '1rem',
        border: '1px solid #d1d5db',
        borderRadius: '12px',
        padding: '1rem',
      }}
    >
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <p style={{ margin: 0 }}>Built-in lesson pack</p>
        <h2 style={{ margin: 0 }}>{builtInLessonPack.title}</h2>
        <p style={{ margin: 0 }}>{builtInLessonPack.description}</p>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          {builtInLessonPack.checks.map((check) => (
            <li key={check}>{check}</li>
          ))}
        </ul>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <p style={{ margin: 0 }}>
          Saved companion draft: {draftName ? <strong>{draftName}</strong> : 'none saved yet'}
        </p>
        <button type="button" onClick={runLessonAttempt}>
          Run lesson eval
        </button>
        {error ? (
          <p style={{ margin: 0 }}>
            {error} <a href="/create">Create a draft companion.</a>
          </p>
        ) : null}
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <h3 style={{ margin: 0 }}>Stored lesson results</h3>
        {latestResult ? (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <pre
              style={{
                margin: 0,
                padding: '1rem',
                borderRadius: '10px',
                background: '#f3f4f6',
                overflowX: 'auto',
              }}
            >
              {JSON.stringify(latestResult, null, 2)}
            </pre>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {results.map((storedResult) => (
                <li key={`${storedResult.lessonPackId}-${storedResult.attemptedAt}`}>
                  <strong>{storedResult.companionName}</strong>: {storedResult.score}% ·{' '}
                  {storedResult.passed ? 'ready' : 'needs updates'} · {storedResult.attemptedAt}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p style={{ margin: 0 }}>No lesson results saved yet.</p>
        )}
      </div>
    </section>
  );
}
