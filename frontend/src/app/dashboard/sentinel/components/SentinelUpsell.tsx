'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Sparkles, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function SentinelUpsell() {
  const router = useRouter();

  return (
    <div className="relative min-h-[70vh] w-full overflow-hidden rounded-[3.5rem] bg-[#FDFCFB] border border-[#E8E1DB] shadow-2xl">
      {/* Background Texture & Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row h-full">
        {/* Content Side */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
              <Sparkles className="h-3.5 w-3.5" />
              Exclusive Premium Feature
            </div>

            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[#2D2621] leading-[1.05]">
              Meet your <br />
              <span className="text-primary">24/7 Scout.</span>
            </h1>

            <p className="text-xl text-[#6D635B] max-w-lg leading-relaxed font-medium">
              While you sleep, the Sentinel scours the deep web to secure high-value opportunities before they even hit the mainstream.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {[
              'Autonomous Opportunity Archiving',
              'Real-time Market Affinity Pulse',
              'Deep-Matching Intelligence Engine',
              'Priority Early-Access Signals'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-bold text-[#4A413A]">
                <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                {feature}
              </div>
            ))}
          </motion.div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
            <Button 
              size="lg" 
              onClick={() => router.push('/onboarding?step=plan')}
              className="h-16 px-10 rounded-2xl shadow-2xl shadow-primary/20 font-bold gap-3 text-lg group bg-primary hover:bg-primary-glow text-white border-none transition-all"
            >
              Activate Sentinel Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B8B0AA] flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Standard or higher
              </span>
              <span className="text-xs font-bold text-[#6D635B]">Starting from $19/mo</span>
            </div>
          </div>
        </div>

        {/* Visual Side */}
        <div className="hidden lg:block w-[40%] relative bg-[#F8F5F2]">
          <div className="absolute inset-0">
            {/* Local Generated Image */}
            <Image 
              src="/sentinel-scout.png" 
              alt="KaziRadar Intelligence Officer" 
              fill
              className="object-cover grayscale-[0.2] contrast-[1.1] brightness-[0.95]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F8F5F2] via-transparent to-transparent" />
            
            {/* Intelligence HUD Elements Overlay */}
            <div className="absolute inset-0 p-12 flex flex-col justify-end">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="p-6 rounded-[2rem] bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl space-y-4 max-w-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary">Sentinel Active</h4>
                    <span className="text-[10px] text-muted/60 font-bold">Scanning Global Tenders</span>
                  </div>
                </div>
                <div className="space-y-2">
                   <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-full w-1/2 bg-primary/40 rounded-full"
                      />
                   </div>
                   <p className="text-[9px] font-medium text-muted/40 italic">Found 12 matches in last 4 hours...</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
