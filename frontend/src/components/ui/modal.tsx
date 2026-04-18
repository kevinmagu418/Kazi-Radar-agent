'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  closeDisabled?: boolean;
}

export function Modal({ open, title, description, onClose, children, closeDisabled = false }: ModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!closeDisabled) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Card className="hover:scale-100">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-[color:var(--foreground)]">{title}</h2>
                  {description ? <p className="text-sm leading-relaxed text-[color:var(--muted)]">{description}</p> : null}
                </div>
                {!closeDisabled ? (
                  <Button variant="ghost" className="h-11 w-11 rounded-2xl p-0" onClick={onClose} aria-label="Close modal">
                    <X className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
              {children}
            </Card>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
