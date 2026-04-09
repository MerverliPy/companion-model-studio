import type { BadgeState } from '../../lib/progress/badges';
import type { ProgressSummaryData } from '../../lib/progress/progress-summary';

type ProgressSummaryProps = {
  summary: ProgressSummaryData;
  badges: BadgeState[];
};

export function ProgressSummary({ summary, badges }: ProgressSummaryProps) {
  const recentAchievements = badges
    .filter((badge) => badge.unlocked && badge.unlockedAt)
    .sort((left, right) => (right.unlockedAt ?? '').localeCompare(left.unlockedAt ?? ''))
    .slice(0, 3);

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        }}
      >
        <SummaryCard label="Lessons logged" value={String(summary.lessonsLogged)} />
        <SummaryCard label="Pass rate" value={summary.passRateLabel} />
        <SummaryCard label="Average score" value={summary.averageScoreLabel} />
        <SummaryCard label="Checks passed" value={summary.passedChecksLabel} />
      </div>

      <div
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        }}
      >
        <section
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '12px',
            padding: '1rem',
            display: 'grid',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'grid', gap: '0.25rem' }}>
            <h3 style={{ margin: 0 }}>Recent achievements</h3>
            <p style={{ margin: 0 }}>{summary.statusMessage}</p>
          </div>

          {recentAchievements.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'grid', gap: '0.5rem' }}>
              {recentAchievements.map((badge) => (
                <li key={badge.id}>
                  <strong>{badge.title}</strong>
                  <div>{badge.description}</div>
                  <div style={{ color: '#4b5563', fontSize: '0.9rem' }}>
                    Unlocked {new Date(badge.unlockedAt ?? '').toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0 }}>Run a lesson eval to unlock the first achievement.</p>
          )}
        </section>

        <section
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '12px',
            padding: '1rem',
            display: 'grid',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'grid', gap: '0.25rem' }}>
            <h3 style={{ margin: 0 }}>Badge cabinet</h3>
            <p style={{ margin: 0 }}>Unlocks are derived only from the stored lesson result.</p>
          </div>

          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: '0.75rem' }}>
            {badges.map((badge) => (
              <li
                key={badge.id}
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  background: badge.unlocked ? '#ecfdf5' : '#f9fafb',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                  <strong>{badge.title}</strong>
                  <span>{badge.unlocked ? 'Unlocked' : 'Locked'}</span>
                </div>
                <p style={{ marginBottom: 0.25, marginTop: '0.5rem' }}>{badge.description}</p>
                {badge.unlockedAt ? (
                  <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem' }}>
                    Earned {new Date(badge.unlockedAt).toLocaleString()}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <article
      style={{
        border: '1px solid #d1d5db',
        borderRadius: '12px',
        padding: '1rem',
        display: 'grid',
        gap: '0.35rem',
      }}
    >
      <p style={{ margin: 0 }}>{label}</p>
      <strong style={{ fontSize: '1.5rem' }}>{value}</strong>
    </article>
  );
}
