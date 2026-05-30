import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme-context';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Kaziradar',
  description: 'Your personal AI scout for discovering jobs, grants, and entrepreneurial opportunities.',
  icons: {
    icon: '/applogo.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('kaziradar-theme');
                  var resolvedTheme = theme;
                  if (!theme || theme === 'system') {
                    resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  } else if (theme !== 'light' && theme !== 'dark') {
                    resolvedTheme = 'dark';
                  }
                  document.documentElement.classList.add(resolvedTheme);
                  document.documentElement.setAttribute('data-theme', resolvedTheme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="app-shell">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
