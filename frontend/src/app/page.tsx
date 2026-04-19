'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Bot,
  Sparkles, 
  Target,
  Zap,
  Globe,
  Heart,
  Search,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    title: 'Always Searching',
    description: 'While you sleep, your Scout is scouring the web for new opportunities that match your specific interests.',
    icon: Search,
    color: 'text-primary'
  },
  {
    title: 'Smart Matching',
    description: 'We don\'t just show everything. Our AI understands what you\'re looking for and only shows the best matches.',
    icon: Target,
    color: 'text-blue-400'
  },
  {
    title: 'Simple & Calm',
    description: 'No complex dashboards or confusing charts. Just a clean feed of things you\'ll actually care about.',
    icon: Sparkles,
    color: 'text-amber-400'
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background selection:bg-primary/30">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <header className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/10 shadow-xl shadow-primary/20">
              <img 
                src="/applogo.png" 
                alt="Kaziradar Logo" 
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">Kaziradar</span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="hidden text-sm font-semibold text-muted hover:text-foreground transition-colors sm:block">
              Sign In
            </Link>
            <Link href="/dashboard">
              <Button size="md" className="shadow-xl">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10 px-6">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl py-20 text-center lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            <div className="flex justify-center">
              <Badge tone="primary" className="px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 border-primary/20">
                Meet your new AI companion
              </Badge>
            </div>
            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl leading-[1.1]">
              Find your next <span className="text-primary italic">big thing</span> without the search.
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted/80">
              Meet Kaziradar—your personal AI agent that discovers jobs, grants, and projects across the entire web, so you don't have to.
            </p>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-16 px-10 text-lg shadow-2xl shadow-primary/30">
                  Try Kaziradar for Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3 px-6 py-4 glass-pill text-sm font-medium">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-surface-hover" />
                  ))}
                </div>
                <span>Used by 2,000+ happy humans</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="mx-auto max-w-7xl py-32">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Card className="h-full group hover:bg-surface/60 transition-all duration-500 rounded-[2.5rem] p-10">
                  <div className={`mb-8 inline-flex rounded-3xl bg-surface p-4 group-hover:scale-110 transition-transform duration-500 ${feature.color}`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-lg leading-relaxed text-muted/70">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Human Centered Quote */}
        <section className="mx-auto max-w-4xl py-32 text-center">
          <div className="relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-10">
              <Sparkles className="h-24 w-24 text-primary" />
            </div>
            <h2 className="text-3xl font-bold italic text-foreground/90 sm:text-4xl md:text-5xl leading-tight">
              "It's like having a super-smart friend who spends all day looking for things you'll love."
            </h2>
            <div className="mt-12 flex flex-col items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary fill-primary" />
              </div>
              <div>
                <p className="text-lg font-bold">Sarah Jenkins</p>
                <p className="text-sm text-muted">Creative Freelancer</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-7xl py-32">
          <div className="relative overflow-hidden rounded-[3rem] bg-primary p-12 md:p-24 text-center shadow-[0_40px_100px_rgba(255,77,141,0.2)]">
            <div className="relative z-10 space-y-10">
              <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-background sm:text-6xl">
                Ready to find your next opportunity?
              </h2>
              <p className="mx-auto max-w-xl text-xl font-medium text-background/80">
                It takes less than a minute to set up your AI agent. No credit card required.
              </p>
              <Link href="/dashboard" className="inline-block pt-4">
                <Button variant="ghost" className="h-16 bg-background text-primary hover:bg-background/90 px-12 text-xl font-bold shadow-2xl">
                  Start your search now
                </Button>
              </Link>
            </div>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="h-full w-full bg-[radial-gradient(circle_at_20%_30%,white,transparent_40%),radial-gradient(circle_at_80%_70%,white,transparent_40%)]" />
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row pt-10 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 overflow-hidden rounded-full border border-white/10">
              <img src="/applogo.png" alt="Kaziradar Logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-xl font-bold">Kaziradar</span>
          </div>
          <div className="flex gap-12 text-sm font-semibold text-muted">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
          <p className="text-sm text-muted/50">
            &copy; 2026 Kaziradar AI Discovery. Made with love for humans.
          </p>
        </div>
      </footer>
    </div>
  );
}
