'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FeedbackType = 'success' | 'error' | 'loading' | 'info';

interface FeedbackProps {
  type: FeedbackType;
  title?: string;
  message: string;
  className?: string;
  show?: boolean;
}

export function Feedback({ type, title, message, className, show = true }: FeedbackProps) {
  const configs = {
    success: {
      icon: CheckCircle2,
      bg: 'bg-green-500/10 dark:bg-green-500/5',
      border: 'border-green-500/20 dark:border-green-500/10',
      text: 'text-green-600 dark:text-green-400',
      iconColor: 'text-green-500',
    },
    error: {
      icon: AlertCircle,
      bg: 'bg-red-500/10 dark:bg-red-500/5',
      border: 'border-red-500/20 dark:border-red-500/10',
      text: 'text-red-600 dark:text-red-400',
      iconColor: 'text-red-500',
    },
    loading: {
      icon: Loader2,
      bg: 'bg-primary/10 dark:bg-primary/5',
      border: 'border-primary/20 dark:border-primary/10',
      text: 'text-primary dark:text-primary-glow',
      iconColor: 'text-primary',
    },
    info: {
      icon: Info,
      bg: 'bg-blue-500/10 dark:bg-blue-500/5',
      border: 'border-blue-500/20 dark:border-blue-500/10',
      text: 'text-blue-600 dark:text-blue-400',
      iconColor: 'text-blue-500',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={cn(
            'flex items-start gap-4 p-5 rounded-3xl border transition-all duration-300',
            config.bg,
            config.border,
            className
          )}
        >
          <div className={cn('p-2 rounded-2xl bg-white/50 dark:bg-black/20 shrink-0', config.text)}>
            <Icon className={cn('h-5 w-5', type === 'loading' && 'animate-spin')} />
          </div>
          <div className="space-y-1">
            {title && <h4 className={cn('font-bold text-sm tracking-tight', config.text)}>{title}</h4>}
            <p className={cn('text-sm font-medium leading-relaxed opacity-90', config.text)}>
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
