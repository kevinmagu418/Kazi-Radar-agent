'use client';

import { motion } from 'framer-motion';
import { Check, Flame, Shield, Crown, Star, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export const plans = [
  {
    id: 'free',
    name: 'Scout Basic',
    price: 0,
    priceLabel: 'KES 0',
    period: 'forever',
    description: 'Perfect for getting started and testing the scout.',
    features: ['30 streamings per month', 'Limited matching AI', 'Email updates', 'Community access'],
    icon: Star,
    color: 'text-muted'
  },
  {
    id: 'flex',
    name: '5-Day Pack',
    price: 200,
    priceLabel: 'KES 200',
    period: 'for 5 days',
    description: 'Intense search for a short period.',
    features: ['Full platform access', 'Unlimited streamings', 'Priority discovery', 'Real-time alerts'],
    icon: Flame,
    color: 'text-blue-400',
    popular: true
  },
  {
    id: 'monthly',
    name: 'Standard',
    price: 1200,
    priceLabel: 'KES 1,200',
    period: 'per month',
    description: 'Consistent discovery for the active seeker.',
    features: ['Everything in Flex', '30-day continuous scout', 'Dedicated support', 'Custom filtering'],
    icon: Shield,
    color: 'text-primary'
  },
  {
    id: 'quarterly',
    name: 'Premium',
    price: 3000,
    priceLabel: 'KES 3,000',
    period: 'per quarter',
    description: 'Best value for long-term growth and research.',
    features: ['Everything in Monthly', 'Scout Sentinel Intelligence Vault', 'Real-time Market Pulse', 'Best price value'],
    icon: Crown,
    color: 'text-amber-400'
  }
];

interface PlanSelectionStepProps {
  onNext: (plan: string) => void;
}

export function PlanSelectionStep({ onNext }: PlanSelectionStepProps) {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="max-w-7xl w-full space-y-16 px-4 py-10"
    >
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.3em]">
          <Flame className="h-3.5 w-3.5" />
          Intelligence Access
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground italic">
          Choose your <span className="text-primary">Scout Tier.</span>
        </h1>
        <p className="text-base text-muted/60 max-w-2xl mx-auto font-medium">
          Select the discovery velocity that matches your mission. From basic search to 24/7 autonomous scouting.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            onMouseEnter={() => setHoveredPlan(plan.id)}
            onMouseLeave={() => setHoveredPlan(null)}
            whileHover={{ y: -10 }}
            className="flex"
          >
            <Card className={cn(
              "relative w-full p-8 rounded-[3rem] border-2 transition-all duration-700 flex flex-col group overflow-hidden",
              hoveredPlan === plan.id 
                ? "border-primary bg-surface/90 shadow-[0_30px_60px_-12px_rgba(255,77,141,0.15)]" 
                : "border-border bg-surface/40"
            )}>
              {/* Background Glow */}
              <div className={cn(
                "absolute -top-24 -right-24 h-48 w-48 rounded-full blur-[80px] transition-opacity duration-700",
                hoveredPlan === plan.id ? "opacity-20" : "opacity-0",
                plan.id === 'free' && "bg-slate-500",
                plan.id === 'flex' && "bg-blue-500",
                plan.id === 'monthly' && "bg-primary",
                plan.id === 'quarterly' && "bg-amber-500"
              )} />

              {plan.popular && (
                <div className="absolute top-6 right-6">
                  <Badge tone="primary" className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-primary/20 bg-primary/10">
                    Pro Pack
                  </Badge>
                </div>
              )}
              
              <div className="relative z-10 mb-10">
                <div className={cn(
                  "h-14 w-14 rounded-2xl bg-background border border-border flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                  plan.color
                )}>
                  <plan.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-2 uppercase">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-foreground tracking-tighter">{plan.priceLabel}</span>
                  <span className="text-[10px] font-bold text-muted/40 uppercase tracking-widest">{plan.period}</span>
                </div>
              </div>

              <div className="relative z-10 flex-grow space-y-5 mb-10">
                <p className="text-xs text-muted/60 font-medium leading-relaxed italic border-l-2 border-primary/20 pl-4">
                  {plan.description}
                </p>
                <div className="space-y-4 pt-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-emerald-500" />
                      </div>
                      <span className="text-[11px] font-bold text-muted/80 tracking-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-auto pt-6">
                <Button 
                  onClick={() => onNext(plan.id)}
                  variant={hoveredPlan === plan.id ? 'primary' : 'outline'}
                  size="lg"
                  className="w-full rounded-2xl h-14 font-black uppercase tracking-[0.15em] text-[10px] group-hover:shadow-xl group-hover:shadow-primary/20 transition-all duration-500"
                >
                  Activate {plan.name}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted/30">
          Secure Payment Processing • Instant Discovery Access
        </p>
      </div>
    </motion.div>
  );
}
