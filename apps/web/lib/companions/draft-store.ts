import { buildCompanionDraft, type CompanionDraft, type CompanionDraftInput } from './companion-schema';

const storageKey = 'companion-model-studio:draft-companion';

export function saveCompanionDraft(input: CompanionDraftInput): CompanionDraft {
  const draft = buildCompanionDraft(input);

  window.localStorage.setItem(storageKey, JSON.stringify(draft));

  return draft;
}

export function loadCompanionDraft(): CompanionDraft | null {
  const stored = window.localStorage.getItem(storageKey);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as CompanionDraft;
  } catch {
    return null;
  }
}
