import {
  avatarThemes,
  personalityTemplates,
  type CompanionDraftInput,
} from '../../lib/companions/companion-schema';
import { skillPacks } from '../../lib/companions/skill-packs';

type CompanionReviewProps = {
  values: CompanionDraftInput;
};

export function CompanionReview({ values }: CompanionReviewProps) {
  const personalityTemplate = personalityTemplates.find(
    (template) => template.value === values.personalityTemplate,
  );
  const avatarTheme = avatarThemes.find((theme) => theme.value === values.avatarTheme);
  const selectedSkillPacks = skillPacks.filter((skillPack) =>
    values.skillPacks.includes(skillPack.value),
  );

  return (
    <section aria-labelledby="companion-review-heading">
      <h2 id="companion-review-heading">Review</h2>
      <div
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '16px',
          padding: '1rem',
          display: 'grid',
          gap: '0.75rem',
        }}
      >
        <div>
          <strong>Name:</strong> {values.name.trim() || 'Not set yet'}
        </div>
        <div>
          <strong>Bio:</strong>{' '}
          {values.shortBio.trim() || 'Add a short bio before saving this draft'}
        </div>
        <div>
          <strong>Template:</strong> {personalityTemplate?.label || 'Not selected'}
        </div>
        <div>
          <strong>Theme:</strong> {avatarTheme?.label || 'Not selected'}
        </div>
        <div>
          <strong>Skill packs:</strong>{' '}
          {selectedSkillPacks.length > 0 ? (
            <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
              {selectedSkillPacks.map((skillPack) => (
                <li key={skillPack.value}>
                  <span style={{ fontWeight: 600 }}>{skillPack.label}</span>
                  {`: ${skillPack.description}`}
                </li>
              ))}
            </ul>
          ) : (
            'No skill packs selected yet'
          )}
        </div>
      </div>
    </section>
  );
}
