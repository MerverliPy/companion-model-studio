import { CompanionForm } from '../components/companion-form';

export default function CreatePage() {
  return (
    <main>
      <p>Companion creation</p>
      <h1>Create your first companion draft.</h1>
      <p>
        Capture the core profile now: name, short bio, personality template, avatar
        theme, and starting skill packs.
      </p>
      <CompanionForm />
    </main>
  );
}
