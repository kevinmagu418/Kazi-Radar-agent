import type { InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted)] transition-all duration-200 focus:border-[color:var(--primary)] focus:ring-4 focus:ring-[color:var(--ring)] focus:outline-none',
        className,
      )}
      {...props}
    />
  );
}

export function SearchInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn('relative w-full', className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />
      <Input className="pl-11" {...props} />
    </div>
  );
}
