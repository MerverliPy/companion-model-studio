export const skillPacks = [
  {
    value: 'daily-reflection',
    label: 'Daily reflection',
    description: 'Build a steady journaling habit with light prompts and check-ins.',
  },
  {
    value: 'focus-sprints',
    label: 'Focus sprints',
    description: 'Support short planning sessions and momentum for important work.',
  },
  {
    value: 'confidence-rehearsal',
    label: 'Confidence rehearsal',
    description: 'Practice upcoming conversations and decisions with calm coaching.',
  },
] as const;

export const skillPackValues = new Set<string>(skillPacks.map((skillPack) => skillPack.value));
