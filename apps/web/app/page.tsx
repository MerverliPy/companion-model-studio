import { RuntimeStatus } from './components/runtime-status';

export default function HomePage() {
  return (
    <main>
      <h1>Build a local-first AI companion.</h1>
      <p>Create, teach, review, and chat from one studio shell.</p>
      <p>Use Create, Lessons, and Progress to explore the initial route placeholders. Chat stays in navigation for the next bounded phase.</p>
      <RuntimeStatus />
    </main>
  );
}
