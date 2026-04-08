import Link from 'next/link';

import { RuntimeStatus } from './components/runtime-status';

export default function HomePage() {
  return (
    <main>
      <p>Companion Model Studio</p>
      <h1>Build a local-first AI companion.</h1>
      <p>Create, teach, review, and chat from one studio shell.</p>
      <nav aria-label="Primary">
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/create">Create</Link>
          </li>
          <li>
            <Link href="/lessons">Lessons</Link>
          </li>
          <li>
            <Link href="/progress">Progress</Link>
          </li>
          <li>
            <Link href="/chat">Chat</Link>
          </li>
        </ul>
      </nav>
      <p>Use Create, Lessons, and Progress to explore the initial route placeholders. Chat stays in navigation for the next bounded phase.</p>
      <RuntimeStatus />
    </main>
  );
}
