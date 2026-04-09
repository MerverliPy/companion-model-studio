export type LessonPack = {
  id: string;
  title: string;
  description: string;
  targetSkillPack: string;
  requiredPersonalityTemplate: string;
  checks: [string, string, string];
};

export const lessonPacks: LessonPack[] = [
  {
    id: 'foundations-reflection-checkin',
    title: 'Reflection check-in',
    description:
      'Verify that a saved companion draft is ready to guide a calm daily reflection with a clear profile and matching starter skill.',
    targetSkillPack: 'daily-reflection',
    requiredPersonalityTemplate: 'warm-encourager',
    checks: [
      'Bio is detailed enough for a first lesson.',
      'Daily reflection skill pack is enabled.',
      'Personality matches a supportive check-in tone.',
    ],
  },
];

export const builtInLessonPack = lessonPacks[0];
