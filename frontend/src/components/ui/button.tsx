'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-background hover:bg-primary-glow shadow-lg shadow-primary/20 hover:shadow-primary/30',
  secondary:
    'bg-surface-hover text-foreground hover:bg-surface border border-border',
  ghost:
    'text-muted hover:text-foreground hover:bg-surface',
  soft:
    'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/10',
};

const sizes: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base font-semibold',
};

export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  type = 'button', 
  ...props 
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-pill font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
