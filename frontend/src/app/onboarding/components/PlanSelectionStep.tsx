'use client';

import { motion } from 'framer-motion';
import { Check, Zap, Shield, Crown, Star } from 'lucide-react';
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
    icon: Zap,
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
    features: ['Everything in Monthly', 'Best price value', 'Early access features', 'Multi-sector scout'],
    icon: Crown,
    color: 'text-amber-400'
  }
];

interface PlanSelectionStepProps {
  onNext: (plan: string) => void;
}

export function PlanSelectionStep({ onNext }: PlanSelectionStepProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-6xl w-full space-y-12"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Choose your scouting plan</h1>
        <p className="text-lg text-muted/80 max-w-2xl mx-auto">
          Select the level of intelligence you need. Upgrade or downgrade anytime.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className="text-left outline-none group"
          >
            <Card className={cn(
              "relative h-full p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col hover:bg-surface/60",
              selectedPlan === plan.id 
                ? "border-primary bg-surface/80 shadow-2xl shadow-primary/10 scale-[1.02]" 
                : "border-border bg-surface/40 hover:border-white/10",
              plan.popular && !selectedPlan && "border-white/5"
            )}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge tone="primary" className="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <div className="mb-8">
                <div className={cn(
                  "inline-flex rounded-2xl bg-background p-3 mb-6 group-hover:scale-110 transition-transform duration-500",
                  plan.color
                )}>
                  <plan.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">{plan.priceLabel}</span>
                  <span className="text-sm text-muted/60">{plan.period}</span>
                </div>
              </div>

              <div className="flex-grow space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted/80">{feature}</span>
                  </div>
                ))}
              </div>

              <div className={cn(
                "mt-auto w-full py-4 rounded-2xl text-center text-sm font-bold transition-all duration-300",
                selectedPlan === plan.id 
                  ? "bg-primary text-background" 
                  : "bg-white/5 text-foreground group-hover:bg-white/10"
              )}>
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </div>
            </Card>
          </button>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          onClick={() => selectedPlan && onNext(selectedPlan)} 
          disabled={!selectedPlan}
          size="lg" 
          className="w-full max-w-md h-16 text-lg"
        >
          Complete Discovery Setup
        </Button>
      </div>
    </motion.div>
  );
}
