'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { ProfileForm } from '@/components/auth/ProfileForm';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

export function ProfileStep({ onNext }: { onNext: () => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) {
          setProfile(data);
        } else {
          // Fallback if profile doesn't exist yet
          setProfile({ id: user.id, full_name: '', username: '', bio: '', location: '', avatar_url: null });
        }
      } else {
        // Default empty profile for guest onboarding
        setProfile({ id: 'guest', full_name: '', username: '', bio: '', location: '', avatar_url: null });
      }
      setLoading(false);
    }
    getProfile();
  }, [supabase]);

  if (loading) return (
    <div className="flex flex-col items-center gap-6 text-center animate-pulse">
      <div className="h-24 w-24 rounded-3xl bg-white/5 border border-white/10" />
      <div className="h-8 w-48 bg-white/5 rounded-full" />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
          <Sparkles className="h-3 w-3" />
          Scout Identity
        </div>
        <h2 className="text-4xl font-bold tracking-tight">Complete your profile</h2>
        <p className="text-muted/60 text-lg">
          Let&apos;s personalize your intelligence terminal. You can skip this for now.
        </p>
      </div>

      <div className="glass-card-soft p-8 md:p-12 rounded-[2.5rem] border-white/5">
        <ProfileForm initialProfile={profile} onComplete={onNext} />
        
        <div className="mt-8 pt-8 border-t border-white/5 flex justify-center">
          <Button 
            variant="ghost" 
            onClick={onNext}
            className="text-muted/40 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2"
          >
            Skip for now
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
