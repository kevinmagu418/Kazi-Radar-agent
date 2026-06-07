'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Flame, 
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
          <div className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-all duration-500 relative overflow-hidden">
            <Flame className="h-5 w-5 text-primary fill-primary/20 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-bold tracking-tight uppercase tracking-[0.1em]">Kaziradar</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6 md:gap-10 text-[10px] font-bold uppercase tracking-[0.15em] text-muted/50">
          <div className="hidden md:flex items-center gap-10">
            <a href="#intelligence" className="hover:text-primary transition-colors">Intelligence</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>
          <Link href="/login" className="text-foreground/80 hover:text-primary transition-colors">Sign In</Link>
          <Link href="/onboarding">
            <Button variant="primary" className="rounded-full px-5 sm:px-6 h-9 text-[10px] font-bold shadow-lg shadow-primary/10">
              <span className="hidden sm:inline">Start Free Trial</span>
              <span className="sm:hidden">Start</span>
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
                <span className="text-[8px] font-bold uppercase tracking-widest text-primary">Live Scan</span>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="space-y-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-bold text-primary uppercase tracking-[0.2em]"
            >
              <Sparkles className="h-3 w-3" />
              Intelligence Heat Map
            </motion.div>
            
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
              Discovery faster than <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-blue-400 bg-[length:200%_auto] animate-gradient-x">
                the competition
              </span>
            </h1>

            <p className="text-sm md:text-base text-muted/60 max-w-2xl mx-auto leading-relaxed font-medium">
              Kaziradar scours the web 24/7 to find high-value jobs, grants, and business opportunities. While they search, you decide.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link href="/onboarding">
                <Button size="lg" className="h-14 px-10 text-sm font-bold rounded-2xl shadow-xl shadow-primary/20 group overflow-hidden relative">
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
               <h2 className="text-xl md:text-2xl font-bold tracking-tight uppercase">
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
                    <h4 className="text-foreground font-bold text-base mb-1">{item.title}</h4>
                    <p className="text-muted/60 text-xs leading-relaxed">{item.desc}</p>
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

      <footer className="relative z-10 border-t border-white/5 pt-32 pb-12 px-8 overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -inset-2 bg-primary/20 blur-xl rounded-full"
                />
                <Flame className="h-8 w-8 text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative z-10" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic group-hover:text-primary transition-colors">Kaziradar</span>
            </div>
            
            <p className="text-muted/60 text-sm leading-relaxed max-w-xs font-medium">
              Autonomous intelligence scout for the next generation of high-value opportunity discovery. Built for speed, precision, and human decison-making.
            </p>

            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted/40">Network Status: Optimal</span>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/80">Product</h4>
            <ul className="space-y-4">
              <li><a href="#intelligence" className="text-sm text-muted/50 hover:text-primary transition-colors font-medium">Intelligence</a></li>
              <li><a href="#pricing" className="text-sm text-muted/50 hover:text-primary transition-colors font-medium">Pricing Tier</a></li>
              <li><a href="#" className="text-sm text-muted/50 hover:text-primary transition-colors font-medium">Scout Logs</a></li>
              <li><a href="#" className="text-sm text-muted/50 hover:text-primary transition-colors font-medium">Waitlist</a></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/80">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-muted/50 hover:text-primary transition-colors font-medium">API Docs</a></li>
              <li><a href="#" className="text-sm text-muted/50 hover:text-primary transition-colors font-medium">Neural Safety</a></li>
              <li><a href="#" className="text-sm text-muted/50 hover:text-primary transition-colors font-medium">Support Hub</a></li>
              <li><a href="#" className="text-sm text-muted/50 hover:text-primary transition-colors font-medium">Community</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/80">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-muted/50 hover:text-primary transition-colors font-medium">Privacy Signal</a></li>
              <li><a href="#" className="text-sm text-muted/50 hover:text-primary transition-colors font-medium">Terms of Sync</a></li>
              <li><a href="#" className="text-sm text-muted/50 hover:text-primary transition-colors font-medium">Cookie Vault</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-muted/30 text-[10px] font-black uppercase tracking-[0.3em]">
            Distributed Intelligence © 2026 KaziRadar
          </p>

          <div className="flex items-center gap-8">
            <a href="#" className="text-muted/30 hover:text-primary transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="text-muted/30 hover:text-primary transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="#" className="text-muted/30 hover:text-primary transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
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
