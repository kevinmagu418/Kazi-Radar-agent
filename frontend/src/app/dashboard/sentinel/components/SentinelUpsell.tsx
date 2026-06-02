'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, TrendingUp, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export function SentinelUpsell() {
  const router = useRouter();

  return (
    <div className="relative min-h-[60vh] flex items-center justify-center p-6 overflow-hidden rounded-[3rem] bg-surface/30 border border-white/5">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-2xl text-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-background border border-white/10 shadow-2xl mb-4"
        >
          <Shield className="h-10 w-10 text-primary" />
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Activate the <span className="text-primary">Scout Sentinel</span>
          </h1>
          <p className="text-lg text-muted/60 leading-relaxed font-medium">
            You are currently on the Free Tier. Unlock the Intelligence Vault to automatically archive high-value signals and access real-time sector analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {[
            { 
              icon: Zap, 
              title: 'Automated Archival', 
              desc: 'Sentinel automatically saves opportunities with >85% relevance scores.' 
            },
            { 
              icon: TrendingUp, 
              title: 'Market Pulse', 
              desc: 'Real-time tracking of sector growth and competition trends.' 
            }
          ].map((feature, i) => (
            <Card key={i} className="p-6 bg-surface/50 border-white/5 hover:border-primary/20 transition-all">
              <feature.icon className="h-6 w-6 text-primary mb-3" />
              <h4 className="font-bold text-foreground mb-1">{feature.title}</h4>
              <p className="text-xs text-muted/60 leading-relaxed">{feature.desc}</p>
            </Card>
          ))}
        </div>

        <div className="pt-8">
          <Button 
            size="lg" 
            onClick={() => router.push('/onboarding?step=plan')}
            className="h-16 px-10 rounded-2xl shadow-xl shadow-primary/20 font-bold gap-3 text-lg group"
          >
            Upgrade to Premium Access
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="mt-4 text-xs font-bold text-muted/30 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <Lock className="h-3 w-3" /> Standard or Premium Tier Required
          </p>
        </div>
      </div>
    </div>
  );
}
