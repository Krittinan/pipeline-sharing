import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Providers from './providers';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Storyline — เขียนและแบ่งปันเรื่องราว',
  description: 'แพลตฟอร์มเขียนและอ่านบทความสไตล์ Medium',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
