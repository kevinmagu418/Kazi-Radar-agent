'use client';

import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  TrendingUp, 
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function SentinelUpsell() {
  const router = useRouter();

  return (
    <div className="relative min-h-[85vh] w-full overflow-hidden rounded-[3.5rem] bg-[#FDFCFB] border border-[#E8E1DB] shadow-2xl">
      {/* Dynamic Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.05)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(245,158,11,0.05)_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 h-full">
        {/* Left Section: Persuasion & Stats */}
        <div className="lg:col-span-7 p-8 md:p-16 flex flex-col justify-center space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
              <Sparkles className="h-3.5 w-3.5" />
              Advanced Autonomous Discovery
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[#2D2621] leading-[0.95]">
              Stop hunting. <br />
              <span className="text-emerald-600 italic">Start Securing.</span>
            </h1>

            <p className="text-lg text-[#6D635B] max-w-xl leading-relaxed font-medium">
              While you check your dashboard once a day, the Sentinel checks every <span className="text-[#2D2621] font-bold">120 seconds</span>. It&apos;s not a search engine; it&apos;s your personal intelligence officer.
            </p>
          </motion.div>

          {/* Statistical Graphics Mockup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#E8E1DB] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black text-emerald-500">+412%</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2D2621]">Discovery Velocity</h4>
                <p className="text-xs text-muted/60">Sentinel finds opportunities 4x faster than manual search.</p>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-emerald-500" 
                />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E8E1DB] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <Database className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black text-blue-500">Global</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2D2621]">Deep-Web Indexing</h4>
                <p className="text-xs text-muted/60">Access to non-public tenders and early-stage signals.</p>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ height: [10, 20, 10] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className="flex-1 bg-blue-400/20 rounded-full" 
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-8">
            <Button 
              size="lg" 
              onClick={() => router.push('/onboarding?step=plan')}
              className="h-16 px-12 rounded-2xl shadow-2xl shadow-emerald-500/20 font-black gap-3 text-base group bg-emerald-600 hover:bg-emerald-700 text-white border-none transition-all"
            >
              Unlock Sentinel Intelligence
              <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Button>
            
            <div className="flex flex-col items-start border-l border-[#E8E1DB] pl-8">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B8B0AA] flex items-center gap-1.5">
                <Lock className="h-3 w-3" /> Professional Tier
              </span>
              <span className="text-xs font-bold text-[#6D635B]">Integrated with GPT-4o Insight</span>
            </div>
          </div>
        </div>

        {/* Right Section: Visual HUD & Comparison */}
        <div className="lg:col-span-5 relative bg-[#F8F5F2] border-l border-[#E8E1DB] overflow-hidden">
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col gap-8">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#B8B0AA] text-center mb-4">Live Discovery Feed (Mockup)</h3>
            
            {/* Visual Feed Item 1: Blurred/Locked */}
            <motion.div 
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="relative p-6 rounded-3xl bg-white border border-[#E8E1DB] shadow-xl group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[6px] z-10 flex flex-col items-center justify-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#2D2621]">
                  <Lock className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#2D2621]">Premium Signal Locked</span>
              </div>
              <div className="space-y-3 opacity-20">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 bg-slate-200 rounded-full" />
                  <div className="h-4 w-12 bg-emerald-100 rounded-full" />
                </div>
                <div className="h-6 w-full bg-slate-100 rounded-lg" />
                <div className="h-4 w-3/4 bg-slate-50 rounded-lg" />
              </div>
            </motion.div>

            {/* Visual Feed Item 2: High Match */}
            <motion.div 
              animate={{ x: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="relative p-6 rounded-3xl bg-white border-2 border-emerald-500 shadow-2xl shadow-emerald-500/5 overflow-hidden"
            >
              <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-2xl">
                98% Match
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#2D2621] uppercase">UN Environment Grant</h4>
                    <span className="text-[10px] text-muted/40 font-bold uppercase tracking-tighter">Verified 2m ago</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#6D635B] leading-relaxed">
                  Sentinel detected a new $50k funding round perfectly aligned with your &quot;Sustainability&quot; tags.
                </p>
              </div>
            </motion.div>

            {/* Comparison Table */}
            <div className="mt-auto space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B8B0AA] border-b border-[#E8E1DB] pb-4">The Sentinel Advantage</h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#6D635B]">Refresh Rate</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[#B8B0AA]">24h</span>
                      <span className="text-emerald-600 font-black">120s</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#6D635B]">AI Filtering</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[#B8B0AA]">Basic</span>
                      <span className="text-emerald-600 font-black">Deep Match</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#6D635B]">Alerts</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[#B8B0AA]">None</span>
                      <span className="text-emerald-600 font-black">Instant</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Abstract Image Base Overlay */}
          <div className="absolute inset-0 z-[-1] opacity-20">
             <Image 
              src="/sentinelnew.png" 
              alt="Background" 
              fill
              className="object-cover grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-[#F8F5F2]/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
