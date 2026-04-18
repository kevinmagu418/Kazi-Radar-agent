import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Opportunity Scanner Dashboard',
  description: 'Modern opportunity intelligence workspace for jobs, grants, and entrepreneurial signals.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="app-shell">{children}</body>
    </html>
  );
}
