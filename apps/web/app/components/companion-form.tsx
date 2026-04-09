'use client';

import { useMemo, useState, type FormEvent } from 'react';

import { CompanionCardPreview } from './companion-card-preview';
import { CompanionReview } from './companion-review';
import {
  avatarThemes,
  hasCompanionErrors,
  personalityTemplates,
  type CompanionDraftInput,
  validateCompanionInput,
} from '../../lib/companions/companion-schema';
import { saveCompanionDraft } from '../../lib/companions/draft-store';

const initialValues: CompanionDraftInput = {
  name: '',
  shortBio: '',
  personalityTemplate: '',
  avatarTheme: '',
  skillPacks: [],
};

type CoreCompanionField = 'name' | 'shortBio' | 'personalityTemplate' | 'avatarTheme';

type TouchedFields = Partial<Record<CoreCompanionField, boolean>>;

type SaveState = {
  type: 'idle' | 'saved' | 'error';
  message: string;
};

export function CompanionForm() {
  const [values, setValues] = useState<CompanionDraftInput>(initialValues);
  const [touched, setTouched] = useState<TouchedFields>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [step, setStep] = useState<'details' | 'review'>('details');
  const [saveState, setSaveState] = useState<SaveState>({ type: 'idle', message: '' });

  const errors = useMemo(() => validateCompanionInput(values), [values]);

  function updateField(field: keyof CompanionDraftInput, value: string | string[]) {
    setValues((current) => ({ ...current, [field]: value }));
    setSaveState({ type: 'idle', message: '' });
  }

  function showError(field: CoreCompanionField) {
    return (submitAttempted || touched[field]) && errors[field];
  }

  function reviewCurrentInputs() {
    setSubmitAttempted(true);

    if (hasCompanionErrors(errors)) {
      return;
    }

    setStep('review');
  }

  function saveDraft() {
    const draft = saveCompanionDraft(values);
    setSaveState({
      type: 'saved',
      message: `Draft saved for ${draft.name} at ${new Date(draft.savedAt).toLocaleTimeString()}.`,
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);

    if (hasCompanionErrors(errors)) {
      setStep('details');
      return;
    }

    try {
      saveDraft();
    } catch {
      setSaveState({
        type: 'error',
        message: 'Unable to save the draft in this browser session.',
      });
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: '2rem',
        alignItems: 'start',
        gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
      }}
    >
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <p style={{ marginBottom: '0.25rem', fontWeight: 600 }}>
              {step === 'details' ? 'Step 1 of 2 · Companion details' : 'Step 2 of 2 · Review'}
            </p>
            <p style={{ marginTop: 0 }}>
              {step === 'details'
                ? 'Enter the core identity details for this draft companion.'
                : 'Review the draft details before saving them to this browser.'}
            </p>
          </div>

          <div>
            <label htmlFor="companion-name">Companion name</label>
            <input
              id="companion-name"
              name="name"
              type="text"
              value={values.name}
              onChange={(event) => updateField('name', event.target.value)}
              onBlur={() => setTouched((current) => ({ ...current, name: true }))}
              aria-describedby={showError('name') ? 'companion-name-error' : undefined}
              aria-invalid={Boolean(showError('name'))}
              disabled={step === 'review'}
            />
            {showError('name') ? <p id="companion-name-error">{errors.name}</p> : null}
          </div>

          <div>
            <label htmlFor="companion-short-bio">Short bio</label>
            <textarea
              id="companion-short-bio"
              name="shortBio"
              rows={4}
              value={values.shortBio}
              onChange={(event) => updateField('shortBio', event.target.value)}
              onBlur={() => setTouched((current) => ({ ...current, shortBio: true }))}
              aria-describedby={showError('shortBio') ? 'companion-short-bio-error' : undefined}
              aria-invalid={Boolean(showError('shortBio'))}
              disabled={step === 'review'}
            />
            {showError('shortBio') ? <p id="companion-short-bio-error">{errors.shortBio}</p> : null}
          </div>

          <div>
            <label htmlFor="companion-personality-template">Personality template</label>
            <select
              id="companion-personality-template"
              name="personalityTemplate"
              value={values.personalityTemplate}
              onChange={(event) => updateField('personalityTemplate', event.target.value)}
              onBlur={() =>
                setTouched((current) => ({ ...current, personalityTemplate: true }))
              }
              aria-describedby={
                showError('personalityTemplate') ? 'companion-personality-template-error' : undefined
              }
              aria-invalid={Boolean(showError('personalityTemplate'))}
              disabled={step === 'review'}
            >
              <option value="">Select a template</option>
              {personalityTemplates.map((template) => (
                <option key={template.value} value={template.value}>
                  {template.label}
                </option>
              ))}
            </select>
            {showError('personalityTemplate') ? (
              <p id="companion-personality-template-error">{errors.personalityTemplate}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="companion-avatar-theme">Avatar theme</label>
            <select
              id="companion-avatar-theme"
              name="avatarTheme"
              value={values.avatarTheme}
              onChange={(event) => updateField('avatarTheme', event.target.value)}
              onBlur={() => setTouched((current) => ({ ...current, avatarTheme: true }))}
              aria-describedby={showError('avatarTheme') ? 'companion-avatar-theme-error' : undefined}
              aria-invalid={Boolean(showError('avatarTheme'))}
              disabled={step === 'review'}
            >
              <option value="">Select a theme</option>
              {avatarThemes.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </select>
            {showError('avatarTheme') ? (
              <p id="companion-avatar-theme-error">{errors.avatarTheme}</p>
            ) : null}
          </div>

          {step === 'details' ? (
            <button type="button" onClick={reviewCurrentInputs}>
              Continue to review
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setStep('details')}>
                Back to edit
              </button>
              <button type="submit">Save draft companion</button>
            </div>
          )}
          {saveState.message ? <p>{saveState.message}</p> : null}
        </div>
      </form>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <CompanionCardPreview values={values} />
        <CompanionReview values={values} />
      </div>
    </div>
  );
}
