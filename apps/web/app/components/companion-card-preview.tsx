import {
  avatarThemes,
  personalityTemplates,
  type CompanionDraftInput,
} from '../../lib/companions/companion-schema';

const avatarThemeStyles: Record<string, { background: string; color: string }> = {
  sunrise: { background: '#f59e0b', color: '#1f2937' },
  forest: { background: '#15803d', color: '#f0fdf4' },
  aurora: { background: '#7c3aed', color: '#f5f3ff' },
};

type CompanionCardPreviewProps = {
  values: CompanionDraftInput;
};

export function CompanionCardPreview({ values }: CompanionCardPreviewProps) {
  const selectedTemplate = personalityTemplates.find(
    (template) => template.value === values.personalityTemplate,
  );
  const selectedTheme = avatarThemes.find((theme) => theme.value === values.avatarTheme);
  const themeStyle = avatarThemeStyles[values.avatarTheme] ?? {
    background: '#e5e7eb',
    color: '#111827',
  };

  return (
    <section aria-labelledby="companion-preview-heading">
      <h2 id="companion-preview-heading">Preview</h2>
      <article
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '16px',
          padding: '1rem',
          maxWidth: '24rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            aria-hidden="true"
            style={{
              ...themeStyle,
              width: '3rem',
              height: '3rem',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 700,
            }}
          >
            {(values.name.trim()[0] ?? '?').toUpperCase()}
          </div>
          <div>
            <h3 style={{ margin: 0 }}>{values.name.trim() || 'Your companion name'}</h3>
            <p style={{ margin: '0.25rem 0 0' }}>{selectedTheme?.label || 'Avatar theme not selected'}</p>
          </div>
        </div>

        <p style={{ marginBottom: '0.75rem' }}>
          {values.shortBio.trim() || 'A short bio will appear here as you shape your companion.'}
        </p>

        <p style={{ margin: 0, fontWeight: 600 }}>
          {selectedTemplate?.label || 'Choose a personality template'}
        </p>
        <p style={{ marginTop: '0.25rem' }}>
          {selectedTemplate?.description || 'Template guidance will appear here.'}
        </p>
      </article>
    </section>
  );
}
