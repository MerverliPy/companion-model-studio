import { skillPacks } from '../../lib/companions/skill-packs';

type SkillPackPickerProps = {
  selectedSkillPacks: string[];
  onChange: (nextSkillPacks: string[]) => void;
  error?: string;
};

export function SkillPackPicker({ selectedSkillPacks, onChange, error }: SkillPackPickerProps) {
  function toggleSkillPack(value: string) {
    if (selectedSkillPacks.includes(value)) {
      onChange(selectedSkillPacks.filter((skillPack) => skillPack !== value));
      return;
    }

    onChange([...selectedSkillPacks, value]);
  }

  return (
    <fieldset style={{ border: '1px solid #d1d5db', borderRadius: '12px', padding: '1rem' }}>
      <legend>Skill packs</legend>
      <p style={{ marginTop: 0 }}>Choose one or more starting skills for this companion.</p>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {skillPacks.map((skillPack) => {
          const checked = selectedSkillPacks.includes(skillPack.value);

          return (
            <label
              key={skillPack.value}
              style={{
                display: 'grid',
                gap: '0.25rem',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '0.75rem',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleSkillPack(skillPack.value)}
                />
                <span style={{ fontWeight: 600 }}>{skillPack.label}</span>
              </span>
              <span>{skillPack.description}</span>
            </label>
          );
        })}
      </div>

      {error ? <p style={{ marginBottom: 0 }}>{error}</p> : null}
    </fieldset>
  );
}
