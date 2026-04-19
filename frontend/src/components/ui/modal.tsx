'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              if (!closeDisabled) {
                onClose();
              }
            }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-2xl pointer-events-auto"
            >
              <Card className="shadow-2xl shadow-black/50 overflow-hidden p-0">
                <CardHeader className="p-6 pb-0 flex flex-row items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{title}</CardTitle>
                    {description ? <CardDescription>{description}</CardDescription> : null}
                  </div>
                  {!closeDisabled ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-full h-8 w-8 p-0" 
                      onClick={onClose}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  ) : null}
                </CardHeader>
                <div className="p-6">
                  {children}
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
