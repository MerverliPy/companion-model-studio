import { buildCompanionDraft, type CompanionDraft, type CompanionDraftInput } from './companion-schema';

const storageKey = 'companion-model-studio:draft-companion';

export function saveCompanionDraft(input: CompanionDraftInput): CompanionDraft {
  const draft = buildCompanionDraft(input);

  window.localStorage.setItem(storageKey, JSON.stringify(draft));

  return draft;
}
