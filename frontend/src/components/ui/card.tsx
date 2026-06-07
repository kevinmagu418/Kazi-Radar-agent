import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'glass-card-soft p-6 transition-all duration-300 hover:bg-surface/60',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('mb-5 space-y-2', className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return <h3 className={cn('text-lg font-bold leading-tight tracking-tight', className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('text-xs text-muted/80 leading-relaxed', className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('', className)} {...props} />;
}
