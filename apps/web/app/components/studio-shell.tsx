import Link from 'next/link';
import type { ReactNode } from 'react';

const navigationLinks = [
  { href: '/', label: 'Home' },
  { href: '/create', label: 'Create' },
  { href: '/lessons', label: 'Lessons' },
  { href: '/progress', label: 'Progress' },
  { href: '/chat', label: 'Chat' },
];

export function StudioShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header>
        <p>Companion Model Studio</p>
        <nav aria-label="Primary">
          <ul>
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {children}
    </>
  );
}
