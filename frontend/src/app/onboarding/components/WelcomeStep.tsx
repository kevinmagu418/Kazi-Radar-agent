'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md w-full text-center space-y-8"
    >
      <div className="flex justify-center">
        <div className="relative h-24 w-24 rounded-[2rem] overflow-hidden border border-primary/20 shadow-2xl glow-soft">
          <Image 
            src="/applogo.png" 
            alt="KaziRadar" 
            width={96} 
            height={96} 
            className="h-full w-full object-cover"
          />
          <div className="absolute -top-2 -right-2 z-10">
            <Sparkles className="h-6 w-6 text-amber-400" />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to KaziRadar</h1>
        <p className="text-lg text-muted/80 leading-relaxed">
          I&apos;m your AI Scout. I&apos;ll help you discover elite opportunities while you focus on what matters.
        </p>
      </div>

      <Button onClick={onNext} size="lg" className="w-full h-16 text-lg">
        Let&apos;s Get Started
        <ArrowRight className="h-5 w-5" />
      </Button>

      <div className="pt-2 text-center">
        <span className="text-sm text-muted/50 font-medium">
          Returning to your terminal?{' '}
        </span>
        <a href="/login" className="text-sm font-bold text-primary hover:underline">
          Sign In
        </a>
      </div>

      <p className="text-[10px] text-muted/30 font-bold uppercase tracking-widest pt-4">
        Setup takes less than 60 seconds
      </p>
    </motion.div>
  );
}
