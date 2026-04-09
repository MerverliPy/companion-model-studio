export const personalityTemplates = [
  {
    value: 'warm-encourager',
    label: 'Warm encourager',
    description: 'Gentle, affirming, and focused on steady progress.',
  },
  {
    value: 'curious-guide',
    label: 'Curious guide',
    description: 'Asks thoughtful questions and helps uncover next steps.',
  },
  {
    value: 'calm-analyst',
    label: 'Calm analyst',
    description: 'Structured, reflective, and good at breaking ideas down.',
  },
] as const;

export const avatarThemes = [
  {
    value: 'sunrise',
    label: 'Sunrise',
  },
  {
    value: 'forest',
    label: 'Forest',
  },
  {
    value: 'aurora',
    label: 'Aurora',
  },
] as const;

export type CompanionDraftInput = {
  name: string;
  shortBio: string;
  personalityTemplate: string;
  avatarTheme: string;
  skillPacks: string[];
};

export type CompanionDraft = CompanionDraftInput & {
  id: string;
  savedAt: string;
};

export type CompanionFieldErrors = Partial<Record<keyof CompanionDraftInput, string>>;

const personalityTemplateValues = new Set<string>(
  personalityTemplates.map((template) => template.value),
);
const avatarThemeValues = new Set<string>(avatarThemes.map((theme) => theme.value));

export function validateCompanionInput(input: CompanionDraftInput): CompanionFieldErrors {
  const name = input.name.trim();
  const shortBio = input.shortBio.trim();
  const errors: CompanionFieldErrors = {};

  if (name.length < 2) {
    errors.name = 'Enter a companion name with at least 2 characters.';
  } else if (name.length > 40) {
    errors.name = 'Keep the companion name to 40 characters or fewer.';
  }

  if (shortBio.length < 12) {
    errors.shortBio = 'Enter a short bio with at least 12 characters.';
  } else if (shortBio.length > 160) {
    errors.shortBio = 'Keep the short bio to 160 characters or fewer.';
  }

  if (!personalityTemplateValues.has(input.personalityTemplate)) {
    errors.personalityTemplate = 'Choose a personality template.';
  }

  if (!avatarThemeValues.has(input.avatarTheme)) {
    errors.avatarTheme = 'Choose an avatar theme.';
  }

  return errors;
}

export function hasCompanionErrors(errors: CompanionFieldErrors) {
  return Object.keys(errors).length > 0;
}

export function buildCompanionDraft(input: CompanionDraftInput): CompanionDraft {
  return {
    id: `draft-${Date.now()}`,
    name: input.name.trim(),
    shortBio: input.shortBio.trim(),
    personalityTemplate: input.personalityTemplate,
    avatarTheme: input.avatarTheme,
    skillPacks: input.skillPacks,
    savedAt: new Date().toISOString(),
  };
}
