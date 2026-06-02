'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  User, 
  MapPin, 
  Briefcase, 
  Calendar,
  Globe,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';

import { ProfileForm } from '@/components/auth/ProfileForm';

export default function ProfilePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');

      // Load Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Load Subscription
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
      
      setSubscription(subData);
      setLoading(false);
    }
    loadProfile();
  }, [supabase, router]);

  const handleCancelSubscription = async () => {
    if (!subscription || !confirm('Are you sure you want to cancel your subscription? You will keep your benefits until the end of the period.')) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('id', subscription.id);
    
    if (!error) {
      setSubscription({ ...subscription, cancel_at_period_end: true });
    } else {
      alert('Failed to cancel subscription: ' + error.message);
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-surface border border-border p-8 md:p-12 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 border-2 border-border flex items-center justify-center text-primary overflow-hidden shadow-2xl shrink-0 mx-auto md:mx-0">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={profile.avatar_url} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-14 w-14" />
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-4xl font-bold tracking-tight">
                {profile?.full_name || 'Anonymous Scout'}
              </h1>
              <Badge tone="primary" className="uppercase text-[10px] tracking-widest font-bold">
                {profile?.account_tier || 'Free'}
              </Badge>
            </div>
            <p className="text-muted/60 font-medium">@{profile?.username || 'user'}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted/80">
                <Briefcase className="h-4 w-4 text-primary" />
                <span className="capitalize">{profile?.onboarding_role?.replace('-', ' ') || 'Explorer'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted/80">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{profile?.location || 'Remote'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="glass-card rounded-[2rem] p-8 space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Intelligence Brief
            </h3>
            
            <ProfileForm initialProfile={profile} />
          </div>
          
          <div className="glass-card rounded-[2rem] p-8 space-y-6">
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted/40">Member Since</span>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary/60" />
                  {new Date(profile?.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-muted/40">Scan Credits</span>
                <p className="font-bold text-primary">{profile?.scan_credits || 0} available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card rounded-[2rem] p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-400" />
              Scouting Plan
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-surface border border-border">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted/40 block mb-1">Current Tier</span>
                <p className="text-lg font-bold text-foreground capitalize">{profile?.account_tier || 'Free Trial'}</p>
                {subscription?.current_period_end && (
                  <p className="text-[10px] text-muted/40 mt-1">
                    {subscription.cancel_at_period_end ? 'Expires: ' : 'Renews: '}
                    {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                )}
                {subscription?.cancel_at_period_end && (
                  <p className="text-[10px] text-red-400 mt-1 font-bold italic">
                    Cancellation Pending
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Button 
                  variant="primary" 
                  className="w-full rounded-xl"
                  onClick={() => router.push('/onboarding?step=plan')}
                >
                  {profile?.account_tier === 'free' ? 'Upgrade Scout' : 'Change Plan'}
                </Button>
                
                {profile?.account_tier !== 'free' && subscription && !subscription.cancel_at_period_end && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCancelSubscription}
                    className="w-full text-[11px] text-muted/40 hover:text-red-400"
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-8">
            <h3 className="text-xl font-bold mb-6">Discovery</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-surface border border-border">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted/40 block mb-2">My Interests</span>
                <div className="flex flex-wrap gap-2">
                  {profile?.interests?.length > 0 ? (
                    profile.interests.map((i: string) => <Badge key={i} tone="primary" className="capitalize">{i}</Badge>)
                  ) : (
                    <p className="text-xs text-muted/40 italic">No interests set</p>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-border">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted/40 block mb-4">Interface Theme</span>
                <ThemeToggle className="w-full justify-around" />
              </div>
              
              <div className="p-4 rounded-2xl bg-surface border border-border">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted/40 block mb-2">Account Safety</span>
                <p className="text-xs text-muted/60 mb-4">Your scouting data is encrypted and private.</p>
                <Button variant="secondary" size="sm" className="w-full text-[11px]" onClick={() => supabase.auth.signOut().then(() => router.push('/'))}>
                  Sign Out of Terminal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
