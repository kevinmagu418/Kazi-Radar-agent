'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  backLink?: string;
}

export function AuthLayout({ children, title, subtitle, backLink }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center mb-8 group">
            <div className="h-16 w-16 rounded-2xl overflow-hidden border border-primary/20 shadow-xl group-hover:scale-110 transition-transform mb-3">
              <Image 
                src="/applogo.png" 
                alt="KaziRadar" 
                width={64} 
                height={64} 
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-xl font-bold tracking-tight uppercase tracking-widest text-foreground/80 group-hover:text-primary transition-colors">KaziRadar</span>
          </Link>
          
          <h1 className="text-3xl font-bold tracking-tight mb-3">{title}</h1>
          <p className="text-muted/60 font-medium">{subtitle}</p>
        </div>

        <div className="glass-card-soft p-8 bg-surface/20 border-white/5 shadow-2xl">
          {children}
        </div>

        {backLink && (
          <Link 
            href={backLink} 
            className="flex items-center justify-center gap-2 mt-8 text-sm font-semibold text-muted hover:text-foreground transition-colors group"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to safety
          </Link>
        )}
      </motion.div>
    </div>
  );
}
