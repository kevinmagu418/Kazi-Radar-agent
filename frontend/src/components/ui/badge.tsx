import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BadgeTone = 'default' | 'primary' | 'success' | 'warning' | 'danger';

const tones: Record<BadgeTone, string> = {
  default: 'bg-white/[0.08] text-[color:var(--foreground)]',
  primary: 'bg-[rgba(255,77,141,0.18)] text-[color:var(--primary-glow)]',
  success: 'bg-emerald-500/16 text-emerald-300',
  warning: 'bg-amber-500/16 text-amber-300',
  danger: 'bg-rose-500/16 text-rose-300',
};

export function Badge({
  className,
  children,
  tone = 'default',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-all duration-200',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
