'use client';

import { useEffect, useState } from 'react';

import { loadCompanionDraft } from '../../lib/companions/draft-store';
import {
  builtInLessonPack,
  loadLessonResult,
  runLessonEvaluation,
  saveLessonResult,
  type LessonAttemptResult,
} from '../../lib/evals/lesson-flow';

export function LessonAttemptPanel() {
  const [draftName, setDraftName] = useState<string | null>(null);
  const [result, setResult] = useState<LessonAttemptResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const draft = loadCompanionDraft();

    setDraftName(draft?.name ?? null);
    setResult(loadLessonResult());
  }, []);

  function runLessonAttempt() {
    const draft = loadCompanionDraft();

    if (!draft) {
      setDraftName(null);
      setError('Save a companion draft before running this lesson.');
      return;
    }

    const nextResult = runLessonEvaluation(draft);

    saveLessonResult(nextResult);
    setDraftName(draft.name);
    setResult(nextResult);
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
        <h3 style={{ margin: 0 }}>Stored result object</h3>
        {result ? (
          <pre
            style={{
              margin: 0,
              padding: '1rem',
              borderRadius: '10px',
              background: '#f3f4f6',
              overflowX: 'auto',
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        ) : (
          <p style={{ margin: 0 }}>No lesson result saved yet.</p>
        )}
      </div>
    </section>
  );
}
