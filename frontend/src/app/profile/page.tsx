'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  MapPin, 
  Briefcase, 
  Calendar,
  Globe,
  Flame,
  Shield,
  CreditCard,
  Settings,
  Sparkles,
  Search,
  Hash,
  ArrowRight,
  LogOut,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

import { ProfileForm } from '@/components/auth/ProfileForm';
import { AvatarUpload } from '@/components/auth/AvatarUpload';

import { UserProfile } from '@/lib/api';

const SUGGESTED_TAGS = [
  'Full-stack Development', 'UI/UX Design', 'Product Management', 'SaaS', 
  'Blockchain', 'Artificial Intelligence', 'Cybersecurity', 'Fintech',
  'Remote Work', 'Early-stage Startup', 'VC Funding', 'Open Source',
  'DevOps', 'Cloud Architecture', 'Mobile Apps', 'Data Science'
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<{ id: string; current_period_end: string; cancel_at_period_end: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  
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
        setProfile({
          ...profileData,
          auth_method: user.app_metadata.provider || 'email',
          email: user.email
        });
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

  const handleUpdateInterests = async (newInterests: string[]) => {
    if (!profile) return;
    setIsUpdating(true);
    const { error } = await supabase
      .from('profiles')
      .update({ interests: newInterests })
      .eq('id', profile.id);
    
    if (!error) {
      setProfile({ ...profile, interests: newInterests });
    }
    setIsUpdating(false);
  };

  const handleToggleRemote = async (enabled: boolean) => {
    if (!profile) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentPreferences = (profile.preferences || {}) as Record<string, any>;
    const newPreferences = { ...currentPreferences, remote_only: enabled };
    
    setIsUpdating(true);
    const { error } = await supabase
      .from('profiles')
      .update({ preferences: newPreferences })
      .eq('id', profile.id);
    
    if (!error) {
      setProfile({ ...profile, preferences: newPreferences });
    }
    setIsUpdating(false);
  };

  const handleUpdateSensitivity = async (val: number[]) => {
    if (!profile) return;
    const newVal = val[0];
    setProfile({ ...profile, sensitivity: newVal }); // Optimistic update
    
    const { error } = await supabase
      .from('profiles')
      .update({ sensitivity: newVal })
      .eq('id', profile.id);
    
    if (error) {
      alert('Failed to update sensitivity: ' + error.message);
    }
  };

  const handleToggleEmailAlerts = async (enabled: boolean) => {
    if (!profile) return;
    setProfile({ ...profile, email_alerts: enabled }); // Optimistic
    
    const { error } = await supabase
      .from('profiles')
      .update({ email_alerts: enabled })
      .eq('id', profile.id);
    
    if (error) {
      alert('Failed to update email settings: ' + error.message);
    }
  };

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

  const handleChangePassword = async () => {
    if (profile?.auth_method !== 'email') {
      alert('Password management is handled by your social provider (Google/GitHub).');
      return;
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email || '', {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('A password reset link has been sent to your email.');
    }
  };

  const handleDeactivateProfile = async () => {
    const confirmed = confirm(
      "WARNING: This will deactivate your scout profile and stop all active scanning. You will be signed out immediately. Continue?"
    );

    if (confirmed) {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'deactivated' })
        .eq('id', profile?.id);

      if (!error) {
        await supabase.auth.signOut();
        router.push('/');
      } else {
        alert('Failed to deactivate profile: ' + error.message);
      }
      setLoading(false);
    }
  };

  if (loading || !profile) return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-10">
      {/* Dynamic Header Strategy */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/10 to-primary/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
        <div className="relative overflow-hidden rounded-[2.5rem] bg-surface/40 backdrop-blur-md border border-border/50 p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Avatar Upload Hub */}
            <div className="shrink-0">
              <AvatarUpload 
                uid={profile.id} 
                url={profile.avatar_url} 
                onUpload={(url) => setProfile({ ...profile, avatar_url: url })} 
              />
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                    {profile?.full_name || 'Anonymous Scout'}
                  </h1>
                  <Badge tone="primary" className="h-6 px-3 rounded-lg border-primary/30 bg-primary/10 font-black uppercase text-[10px] tracking-widest">
                    {profile?.account_tier || 'Free'}
                  </Badge>
                </div>
                <p className="text-muted/40 font-bold tracking-widest text-xs uppercase">Terminal ID: {profile?.username || 'user_id'}</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface/50 border border-border/50 text-xs font-bold text-muted/80">
                  <Briefcase className="h-3.5 w-3.5 text-primary" />
                  <span className="capitalize">{profile?.onboarding_role?.replace('-', ' ') || 'Explorer'}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface/50 border border-border/50 text-xs font-bold text-muted/80">
                  <MapPin className="h-3.5 w-3.5 text-blue-400" />
                  <span>{profile?.location || 'Global Base'}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface/50 border border-border/50 text-xs font-bold text-muted/80">
                  <Calendar className="h-3.5 w-3.5 text-amber-400" />
                  <span>Joined {new Date(profile?.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 hidden lg:block">
              <div className="h-24 w-24 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center gap-1">
                <span className="text-2xl font-black text-primary">
                  {profile?.account_tier === 'free' ? (profile?.scan_credits || 0) : '∞'}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-muted/40 text-center px-2">Scan<br/>Credits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="intelligence" className="w-full">
        <div className="flex items-center justify-center mb-10">
          <TabsList className="bg-surface/30 border-border/30">
            <TabsTrigger value="intelligence" className="gap-2">
              <Globe className="h-3.5 w-3.5" />
              Intelligence
            </TabsTrigger>
            <TabsTrigger value="discovery" className="gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Discovery
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="h-3.5 w-3.5" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-3.5 w-3.5" />
              Security
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="intelligence">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="rounded-[2.5rem] bg-surface/30 border border-border/50 p-8 md:p-12 backdrop-blur-sm">
                <ProfileForm initialProfile={profile} />
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="rounded-[2.5rem] bg-surface/30 border border-border/50 p-8 backdrop-blur-sm">
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground/80 mb-6 flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  System Preferences
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-bold">Theme Mode</p>
                      <p className="text-[10px] text-muted/40 uppercase font-bold tracking-wider">Visual Interface</p>
                    </div>
                    <ThemeToggle />
                  </div>
                  <div className="h-px bg-border/30" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-bold">Real-time Intel</p>
                      <p className="text-[10px] text-muted/40 uppercase font-bold tracking-wider">Background Scanning</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="rounded-[2.5rem] bg-primary/5 border border-primary/10 p-8 relative overflow-hidden group">
                <div className="absolute top-6 right-8 w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 overflow-hidden backdrop-blur-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Scout Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                      <User className="h-8 w-8 text-primary/40" />
                    </div>
                  )}
                </div>

                <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                  <Flame className="h-4 w-4" />
                  Scout Efficiency
                </h3>
                <p className="text-xs text-muted/60 leading-relaxed mb-6 max-w-[70%]">Your profile completion is at 85%. Add a detailed bio to improve matching accuracy.</p>
                <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%] rounded-full shadow-[0_0_10px_rgba(255,77,141,0.5)]" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="discovery">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-[2.5rem] bg-surface/30 border border-border/50 p-8 md:p-10 backdrop-blur-sm space-y-8">
              <div className="space-y-2">
                <h3 className="text-lg font-black tracking-tight">Signal Interests</h3>
                <p className="text-xs text-muted/40 font-bold uppercase tracking-widest">What are we looking for?</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {profile?.interests?.map((interest: string) => (
                    <div key={interest} className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                      <Hash className="h-3 w-3 opacity-40" />
                      {interest}
                      <button 
                        onClick={() => profile.interests && handleUpdateInterests(profile.interests.filter((i: string) => i !== interest))}
                        className="hover:text-foreground transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="relative">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add custom intel tag..."
                      className="flex-1 bg-surface/50 border border-border/50 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-primary/50 transition-all"
                      value={tagInput}
                      onChange={(e) => {
                        setTagInput(e.target.value);
                        setShowTagSuggestions(true);
                      }}
                      onFocus={() => setShowTagSuggestions(true)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && tagInput.trim()) {
                          handleUpdateInterests([...(profile?.interests || []), tagInput.trim()]);
                          setTagInput('');
                        }
                      }}
                    />
                    <Button 
                      size="sm" 
                      className="rounded-xl h-10 px-4"
                      onClick={() => {
                        if (tagInput.trim()) {
                          handleUpdateInterests([...(profile?.interests || []), tagInput.trim()]);
                          setTagInput('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>

                  {showTagSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-surface border border-border/50 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto backdrop-blur-xl">
                      <div className="p-2 text-[10px] font-black uppercase tracking-widest text-muted/40 border-b border-border/30 mb-2">
                        Suggested Signals
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {SUGGESTED_TAGS.filter(tag => !profile?.interests?.includes(tag)).map(tag => (
                          <button
                            key={tag}
                            className="px-3 py-1.5 rounded-lg bg-surface/50 border border-border/50 text-[10px] font-bold hover:border-primary/50 hover:text-primary transition-all"
                            onClick={() => {
                              handleUpdateInterests([...(profile?.interests || []), tag]);
                              setShowTagSuggestions(false);
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <button 
                        className="w-full mt-4 p-2 text-[9px] font-black uppercase tracking-widest text-muted/20 hover:text-muted/40 transition-colors"
                        onClick={() => setShowTagSuggestions(false)}
                      >
                        Close Suggestions
                      </button>
                    </div>
                  )}
                </div>

                {(!profile?.interests || profile.interests.length === 0) && (
                  <div className="p-8 rounded-[2rem] border border-border/30 border-dashed text-center space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-muted/5 flex items-center justify-center mx-auto">
                      <Search className="h-6 w-6 text-muted/20" />
                    </div>
                    <p className="text-xs text-muted/40 font-bold uppercase tracking-widest">No interests locked in</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-surface/30 border border-border/50 p-8 md:p-10 backdrop-blur-sm space-y-8">
              <div className="space-y-2">
                <h3 className="text-lg font-black tracking-tight">Search Filters</h3>
                <p className="text-xs text-muted/40 font-bold uppercase tracking-widest">Tailor your scout engine</p>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-bold">Remote-Only Signals</p>
                    <p className="text-[10px] text-muted/40 uppercase font-bold tracking-wider">Global opportunities only</p>
                  </div>
                  <Switch 
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    checked={!!(profile?.preferences as any)?.remote_only} 
                    onCheckedChange={handleToggleRemote}
                    disabled={isUpdating}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-bold">Match Sensitivity</p>
                      <p className="text-[10px] text-muted/40 uppercase font-bold tracking-wider">Signal strictness</p>
                    </div>
                    <span className="text-xs font-black text-primary">{profile?.sensitivity || 75}%</span>
                  </div>
                  <Slider 
                    value={[profile?.sensitivity || 75]} 
                    max={100} 
                    step={1} 
                    onValueChange={handleUpdateSensitivity}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-bold">Email Alerts</p>
                    <p className="text-[10px] text-muted/40 uppercase font-bold tracking-wider">Intel delivery</p>
                  </div>
                  <Switch 
                    checked={!!profile?.email_alerts} 
                    onCheckedChange={handleToggleEmailAlerts}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="max-w-3xl mx-auto rounded-[3rem] overflow-hidden bg-surface/30 border border-border/50 backdrop-blur-sm">
            <div className="p-10 md:p-14 text-center space-y-8">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-4">
                <CreditCard className="h-10 w-10" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black tracking-tight">Scouting Plan</h3>
                <p className="text-muted/60 max-w-md mx-auto">Manage your subscription, view invoices, and upgrade your intelligence tier.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                <div className="p-6 rounded-[2rem] bg-surface/50 border border-border/50 text-left space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted/40">Active Tier</p>
                  <p className="text-xl font-black text-primary capitalize">{profile?.account_tier || 'Free Trial'}</p>
                </div>
                <div className="p-6 rounded-[2rem] bg-surface/50 border border-border/50 text-left space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted/40">Expires In</p>
                  <p className="text-xl font-black text-foreground">
                    {subscription?.current_period_end 
                      ? `${Math.ceil((new Date(subscription.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} Days`
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>

              {subscription?.current_period_end && (
                <p className="text-xs text-muted/40 font-bold uppercase tracking-widest">
                  {subscription.cancel_at_period_end ? 'Your access ends on: ' : 'Next billing cycle: '}
                  {new Date(subscription.current_period_end).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
              )}

              <div className="flex flex-col gap-4 max-w-sm mx-auto pt-6">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="h-14 rounded-2xl font-black uppercase tracking-widest text-xs"
                  onClick={() => router.push('/onboarding?step=plan')}
                >
                  {profile?.account_tier === 'free' ? 'Unlock Premium Intelligence' : 'Refine Scout Tier'}
                </Button>
                
                {profile?.account_tier !== 'free' && subscription && !subscription.cancel_at_period_end && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCancelSubscription}
                    className="text-[10px] font-black uppercase tracking-widest text-muted/30 hover:text-red-400 transition-colors"
                  >
                    Suspend Subscription
                  </Button>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-[2.5rem] bg-surface/30 border border-border/50 p-8 md:p-10 backdrop-blur-sm space-y-8">
              <div className="space-y-2">
                <h3 className="text-lg font-black tracking-tight">Access Control</h3>
                <p className="text-xs text-muted/40 font-bold uppercase tracking-widest">Protect your terminal</p>
              </div>
              <div className="space-y-4">
                <Button 
                  variant="secondary" 
                  className="w-full h-12 rounded-xl font-bold text-sm justify-between px-6"
                  onClick={handleChangePassword}
                  disabled={profile.auth_method !== 'email'}
                >
                  <span className="flex items-center gap-2">
                    Change Password
                    {profile.auth_method !== 'email' && (
                      <Badge tone="default" className="text-[9px] h-4 uppercase opacity-50">OAuth Managed</Badge>
                    )}
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-30" />
                </Button>
                <Button variant="secondary" className="w-full h-12 rounded-xl font-bold text-sm justify-between px-6">
                  Two-Factor Authentication
                  <Badge tone="default" className="text-[9px] h-5">Disabled</Badge>
                </Button>
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-rose-500/5 border border-rose-500/10 p-8 md:p-10 backdrop-blur-sm space-y-8">
              <div className="space-y-2">
                <h3 className="text-lg font-black tracking-tight text-rose-500">Danger Zone</h3>
                <p className="text-xs text-rose-500/40 font-bold uppercase tracking-widest">Permanent actions</p>
              </div>
              <div className="space-y-4">
                <Button 
                  variant="ghost" 
                  className="w-full h-12 rounded-xl font-bold text-sm text-rose-500 hover:bg-rose-500/10 justify-between px-6"
                  onClick={handleDeactivateProfile}
                >
                  Deactivate Scout Profile
                  <Shield className="h-4 w-4 opacity-30" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full h-12 rounded-xl font-bold text-sm text-muted/40 hover:text-foreground justify-between px-6"
                  onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
                >
                  Sign Out of Terminal
                  <LogOut className="h-4 w-4 opacity-30" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
