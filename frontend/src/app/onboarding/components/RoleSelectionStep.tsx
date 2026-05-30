'use client';

import { motion } from 'framer-motion';
import { Briefcase, Rocket, Compass, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const roles = [
  {
    id: 'job-seeker',
    title: 'Job Seeker',
    description: 'Looking for my next career move, internship, or high-value gig.',
    icon: Briefcase,
    color: 'text-primary'
  },
  {
    id: 'entrepreneur',
    title: 'Entrepreneur',
    description: 'Searching for funding, grants, and strategic projects to build.',
    icon: Rocket,
    color: 'text-blue-400'
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Researching emerging trends and looking for niche opportunities.',
    icon: Compass,
    color: 'text-amber-400'
  }
];

interface RoleSelectionStepProps {
  onNext: (role: string) => void;
}

export function RoleSelectionStep({ onNext }: RoleSelectionStepProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl w-full space-y-10"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">How will you use KaziRadar?</h1>
        <p className="text-lg text-muted/80">
          Tell me your goal so I can tailor the discovery process for you.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className="text-left outline-none group"
          >
            <Card className={cn(
              "h-full p-8 rounded-[2rem] border-2 transition-all duration-500 hover:bg-surface/60",
              selectedRole === role.id 
                ? "border-primary bg-surface/80 shadow-2xl shadow-primary/10 scale-[1.02]" 
                : "border-border bg-surface/40 hover:border-white/20"
            )}>
              <div className="relative mb-6">
                <div className={cn(
                  "inline-flex rounded-2xl bg-background p-4 group-hover:scale-110 transition-transform duration-500",
                  role.color
                )}>
                  <role.icon className="h-7 w-7" />
                </div>
                {selectedRole === role.id && (
                  <div className="absolute -top-1 -right-1">
                    <CheckCircle2 className="h-6 w-6 text-primary fill-background" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">{role.title}</h3>
              <p className="text-muted/70 leading-relaxed text-sm">
                {role.description}
              </p>
            </Card>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={() => selectedRole && onNext(selectedRole)} 
          disabled={!selectedRole}
          size="lg" 
          className="w-full max-w-md h-16 text-lg"
        >
          Confirm My Role
        </Button>
      </div>
    </motion.div>
  );
}
