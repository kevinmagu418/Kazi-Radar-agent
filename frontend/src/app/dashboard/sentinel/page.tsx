'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Loader2, ShieldCheck, Info, ArrowLeft } from 'lucide-react';
import { SentinelPulse } from './components/SentinelPulse';
import { SentinelVault } from './components/SentinelVault';
import { SentinelUpsell } from './components/SentinelUpsell';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { UserProfile } from '@/lib/api';

export default function SentinelPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(data as UserProfile);
      setLoading(false);
    }
    loadProfile();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  const isPremium = profile?.account_tier && profile.account_tier !== 'free';

  if (!isPremium) {
    return (
      <div className="space-y-6">
        <div className="flex justify-start">
          <Link href="/dashboard">
            <Button variant="ghost" className="border border-white/10 text-muted/60 hover:text-foreground hover:bg-white/5 rounded-xl px-4 gap-2 text-xs font-bold uppercase tracking-widest transition-all">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <SentinelUpsell />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" className="border border-white/10 text-muted/60 hover:text-foreground hover:bg-white/5 rounded-xl px-4 gap-2 text-xs font-bold uppercase tracking-widest transition-all">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-white/5 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted/80">Active Scan</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.3em]">
            <ShieldCheck className="h-4 w-4" /> Intelligence Terminal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Scout Sentinel</h1>
          <p className="text-muted/60 max-w-xl font-medium">
            Your automated intelligence partner. Monitoring the web 24/7 for high-value signals and sector trends.
          </p>
        </div>
      </div>

      {/* Analytics Pulse Section */}
      <section className="space-y-6">
        <SentinelPulse />
      </section>

      {/* Intelligence Vault Section */}
      <section className="space-y-6">
        <SentinelVault />
      </section>

      {/* Footer Info */}
      <div className="p-6 rounded-3xl bg-surface/20 border border-white/5 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <Info className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-sm">How Sentinel Works</h4>
          <p className="text-xs text-muted/50 leading-relaxed max-w-2xl">
            The Scout Sentinel uses Deep Matching AI to evaluate every incoming opportunity against your profile. Matches with a score above 85% are automatically archived here. This ensures you never miss a critical signal, even if you don&apos;t check the dashboard daily.
          </p>
        </div>
      </div>
    </div>
  );
}
