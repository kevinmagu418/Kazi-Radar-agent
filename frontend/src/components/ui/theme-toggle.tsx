'use client';

import { useTheme } from '@/lib/theme-context';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <div className={cn("flex items-center gap-1 bg-surface p-1 rounded-full border border-border shadow-sm", className)}>
      <button
        onClick={() => setTheme('light')}
        className={cn(
          "relative p-2 rounded-full transition-all duration-300",
          resolvedTheme === 'light' ? "bg-primary text-background shadow-md" : "text-muted hover:text-foreground"
        )}
        aria-label="Light Mode"
      >
        <Sun className="h-4 w-4 relative z-10" />
        {resolvedTheme === 'light' && (
          <motion.div
            layoutId="theme-active"
            className="absolute inset-0 bg-primary rounded-full"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          "relative p-2 rounded-full transition-all duration-300",
          resolvedTheme === 'dark' ? "bg-primary text-background shadow-md" : "text-muted hover:text-foreground"
        )}
        aria-label="Dark Mode"
      >
        <Moon className="h-4 w-4 relative z-10" />
        {resolvedTheme === 'dark' && (
          <motion.div
            layoutId="theme-active"
            className="absolute inset-0 bg-primary rounded-full"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </button>
    </div>
  );
}
