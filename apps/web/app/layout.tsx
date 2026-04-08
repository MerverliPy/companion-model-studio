import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { StudioShell } from './components/studio-shell';

export const metadata: Metadata = {
  title: 'Companion Model Studio',
  description: 'Local-first studio bootstrap for a user-owned AI companion.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StudioShell>{children}</StudioShell>
      </body>
    </html>
  );
}
