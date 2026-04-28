import type { Metadata } from 'next';
import { Inter, Anton } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/LanguageContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'AdVibe: Facebook Reklāmu Meistars',
  description: 'Ģenerējiet stilīgus un augstas konversijas Facebook reklāmas ierakstus.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lv" className={`${inter.variable} ${anton.variable}`}>
      <body suppressHydrationWarning className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
