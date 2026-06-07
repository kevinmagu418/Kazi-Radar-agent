'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SentinelPopUpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SentinelPopUp({ isOpen, onClose }: SentinelPopUpProps) {
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
          exit={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
          className="fixed bottom-6 right-6 z-50 w-full max-w-[380px]"
        >
          <div className="relative overflow-hidden rounded-3xl bg-surface/90 backdrop-blur-2xl border border-primary/20 shadow-2xl shadow-primary/10">
            {/* Background Texture & Gradients */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-primary/5 rounded-full blur-[60px]" />
            </div>

            <div className="relative z-10 p-5">
              <div className="flex gap-4">
                {/* Visual Side (Avatar) */}
                <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden bg-primary/10 border border-primary/20">
                  <Image 
                    src="/sentinel-scout.png" 
                    alt="Sentinel" 
                    fill
                    className="object-cover grayscale-[0.2] contrast-[1.1]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                </div>

                {/* Content Side */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[8px] font-black text-primary uppercase tracking-widest">
                      <Sparkles className="h-2.5 w-2.5" />
                      Intelligence
                    </div>
                    <button 
                      onClick={onClose}
                      className="p-1 rounded-lg hover:bg-primary/5 text-muted/40 hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-black tracking-tight text-foreground leading-tight">
                    Unlock <span className="text-primary">24/7 Scout</span>
                  </h3>
                  
                  <p className="text-[11px] text-foreground/60 leading-relaxed font-medium">
                    The Sentinel scours the deep web for high-value opportunities while you sleep.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Button 
                  onClick={() => {
                    onClose();
                    router.push('/onboarding?step=plan');
                  }}
                  className="flex-1 h-10 px-4 rounded-xl shadow-lg shadow-primary/10 font-bold text-[11px] gap-2 group bg-primary hover:bg-primary-glow text-white border-none transition-all"
                >
                  Activate Now
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tight">Pro</span>
                </div>
              </div>
            </div>
            
            {/* Active Scanning Bar */}
            <div className="h-1 w-full bg-primary/5 overflow-hidden">
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
