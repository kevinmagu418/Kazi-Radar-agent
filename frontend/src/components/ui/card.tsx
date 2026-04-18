import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'surface-panel rounded-[1.5rem] p-6 transition-all duration-200 hover:scale-[1.01]',
        className,
      )}
      {...props}
    />
  );
}
