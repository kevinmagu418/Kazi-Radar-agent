'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Zap, 
  ArrowRight, 
  Sparkles,
  Search,
  Target,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-primary/30 text-foreground">
      {/* Dynamic Speed-Force Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]" />
        
        {/* Animated Speed Lines */}
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '200%', opacity: [0, 1, 0] }}
              transition={{
                duration: 2 + (i % 3),
                repeat: Infinity,
                delay: (i % 4) * 0.5,
                ease: "linear"
              }}
              className="absolute h-[1px] w-[300px] bg-gradient-to-r from-transparent via-primary to-transparent"
              style={{ top: `${15 * i + 10}%` }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-all duration-500 relative overflow-hidden">
            <Zap className="h-5 w-5 text-background fill-current relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-bold tracking-tight uppercase tracking-[0.1em]">Kaziradar</span>
        </div>
        <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.15em] text-muted/50">
          <a href="#intelligence" className="hover:text-primary transition-colors">Intelligence</a>
          <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          <Link href="/login" className="hover:text-primary transition-colors">Sign In</Link>
          <Link href="/onboarding">
            <Button variant="primary" className="rounded-full px-6 h-10 text-[11px] font-bold shadow-lg shadow-primary/10">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 pt-12 pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12">
          
          {/* Central Logo & Flame Effect */}
          <div className="relative group cursor-pointer">
            {/* The "Flame" Aura */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-12 bg-gradient-to-t from-primary/40 via-orange-500/20 to-transparent rounded-full blur-[60px] opacity-40 mix-blend-screen"
            />
            
            {/* Core Mascot Container */}
            <div className="relative h-44 w-44 rounded-[2.5rem] bg-surface border border-white/5 flex items-center justify-center shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
              
              <Image 
                src="/mascot.png" 
                alt="KaziRadar AI Opportunity Scout Mascot" 
                width={128}
                height={128}
                className="object-contain relative z-20 transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(255,77,141,0.3)]" 
              />
              
              {/* Vertical Scan Line */}
              <motion.div 
                animate={{ y: ['-150%', '150%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent z-10"
              />
            </div>
            
            {/* System Status */}
            <div className="absolute -top-4 -right-12 glass-pill px-4 py-1.5 border-primary/20 bg-background/60 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Live Scan</span>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="space-y-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary uppercase tracking-[0.2em]"
            >
              <Sparkles className="h-3 w-3" />
              Intelligence Speed Force
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              Discovery faster than <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-blue-400 bg-[length:200%_auto] animate-gradient-x">
                the competition
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted/60 max-w-2xl mx-auto leading-relaxed font-medium">
              Kaziradar scours the web 24/7 to find high-value jobs, grants, and business opportunities. While they search, you decide.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link href="/onboarding">
                <Button size="lg" className="h-16 px-10 text-base font-bold rounded-2xl shadow-xl shadow-primary/20 group overflow-hidden relative">
                  <span className="relative z-10 flex items-center gap-2">
                    Activate Your Scout
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Section */}
      <section id="intelligence" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 order-2 lg:order-1">
            <div className="space-y-3">
               <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">
                Hyper-Speed <br />
                <span className="text-primary">Discovery Network</span>
              </h2>
              <div className="h-1 w-16 bg-primary/30 rounded-full" />
            </div>
            
            <div className="grid gap-6">
              {[
                { 
                  icon: Search, 
                  title: 'Global Ingestion', 
                  desc: 'Scanning 10,000+ sources including private tender lists and startup boards.',
                  color: 'text-primary',
                  bg: 'bg-primary/5'
                },
                { 
                  icon: Target, 
                  title: 'Precision Matching', 
                  desc: 'Our AI evaluates relevance based on your specific career goals and trajectory.',
                  color: 'text-blue-400',
                  bg: 'bg-blue-400/5'
                },
                { 
                  icon: Trophy, 
                  title: 'Priority Alerts', 
                  desc: 'Be the first to know about high-value signals before they become saturated.',
                  color: 'text-orange-400',
                  bg: 'bg-orange-400/5'
                }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5 p-6 rounded-3xl bg-surface/20 border border-white/5 hover:bg-surface/30 transition-all group">
                  <div className={`h-11 w-11 rounded-xl ${item.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-all shadow-sm`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div>
                    <h4 className="text-foreground font-bold text-lg mb-1">{item.title}</h4>
                    <p className="text-muted/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl bg-surface/30 p-2">
               <Image 
                src="/scout-engine-visual.png" 
                alt="KaziRadar AI Intelligence Engine for Opportunity Discovery" 
                width={600}
                height={600}
                className="w-full h-full object-cover rounded-[2.5rem] opacity-80 mix-blend-lighten"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40" />
            </div>
            
            {/* Visual Deco */}
            <div className="absolute -top-10 -right-10 h-32 w-32 bg-primary/10 blur-[80px]" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <div className="space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Zap className="h-5 w-5 text-primary fill-current" />
              <span className="text-lg font-bold tracking-tight uppercase">Kaziradar</span>
            </div>
            <p className="text-muted/30 text-[10px] font-bold uppercase tracking-widest">
              Distributed Intelligence © 2026
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-muted/40">
            <a href="#" className="hover:text-primary transition-colors">Neural Safety</a>
            <a href="#" className="hover:text-primary transition-colors">Scout Logs</a>
            <a href="#" className="hover:text-primary transition-colors">API</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 8s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}
