'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Globe,
  RefreshCw,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Star,
  Clock,
  MapPin,
  LayoutGrid,
  List,
  Heart
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { api, Opportunity, UserProfile } from '@/lib/api';
import { cn } from '@/lib/utils';

import { createClient } from '@/lib/supabase/client';
import { SentinelPopUp } from '@/components/layout/sentinel-popup';

const sectorOptions = ['', 'tech', 'agriculture', 'fintech', 'grants'];

const typeOptions = [
  { id: '', label: 'Everything' },
  { id: 'job', label: 'Careers' },
  { id: 'entrepreneurial', label: 'Entrepreneurship' },
];

function getHostLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'Web';
  }
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [, setStats] = useState<unknown>(null);
  const [sectorFilter, setSectorFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isSentinelPopUpOpen, setIsSentinelPopUpOpen] = useState(false);
  const [isSentinelDismissed, setIsSentinelDismissed] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>(['tech']);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['jobs']);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = useMemo(() => createClient(), []);

  // Pop-up logic: Trigger after 1 minute for free users
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if user is free tier and hasn't dismissed it yet
      if (profile && profile.account_tier === 'free' && !isSentinelDismissed) {
        setIsSentinelPopUpOpen(true);
      }
    }, 60000); // 1 minute

    return () => clearTimeout(timer);
  }, [profile, isSentinelDismissed]);

  // Listen for global search events from Command Center
  useEffect(() => {
    const handleGlobalSearch = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setSearchQuery(customEvent.detail);
    };
    window.addEventListener('kaziradar-search', handleGlobalSearch);
    return () => window.removeEventListener('kaziradar-search', handleGlobalSearch);
  }, []);

  const filteredOpportunities = useMemo(() => {
    let results = opportunities;

    // Apply Remote-Only Filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((profile?.preferences as any)?.remote_only) {
      results = results.filter(opp => 
        !opp.location || 
        opp.location.toLowerCase().includes('remote') || 
        opp.location.toLowerCase().includes('global') ||
        opp.location.toLowerCase().includes('anywhere') ||
        opp.location.toLowerCase().includes('online')
      );
    }

    // Apply Match Sensitivity Filter
    if (profile?.sensitivity) {
      results = results.filter(opp => opp.relevance_score >= (profile.sensitivity || 0));
    }

    if (!searchQuery) return results;
    
    // Intelligent keyword extraction
    const stopWords = ['find', 'me', 'show', 'any', 'the', 'a', 'an', 'are', 'there', 'some', 'looking', 'for', 'about', 'with'];
    const keywords = searchQuery.toLowerCase()
      .split(/[\s,]+/)
      .filter(word => word.length > 1 && !stopWords.includes(word));

    if (keywords.length === 0) return results;

    return results.filter(opp => {
      const targetText = `${opp.title} ${opp.description || ''} ${opp.category} ${opp.type} ${opp.location || ''}`.toLowerCase();
      // Match if at least one keyword is found (could be changed to 'every' for stricter matching)
      return keywords.some(keyword => targetText.includes(keyword));
    });
  }, [opportunities, searchQuery, profile?.preferences]);

  const fetchProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) {
        setProfile(data as UserProfile);
        
        // Onboarding Role-to-Goal & Categories Mapping
        let defaultInterests: string[] = [];

        if (data.onboarding_role === 'job-seeker') {
          defaultInterests = ['tech', 'general'];
        } else if (data.onboarding_role === 'entrepreneur') {
          defaultInterests = ['fintech', 'grants'];
        } else {
          // Explorer / default
          defaultInterests = ['tech', 'agriculture', 'fintech', 'grants'];
        }

        const userInterests = data.interests && data.interests.length > 0 ? data.interests : defaultInterests;

        // Initialize active filters based on user's saved preferences or defaults
        if (userInterests && userInterests.length > 0) {
          const firstInterest = userInterests[0].toLowerCase();
          if (sectorOptions.includes(firstInterest)) {
            setSectorFilter(firstInterest);
          }
        }

        if (data.onboarding_role === 'job-seeker') setTypeFilter('job');
        else if (data.onboarding_role === 'entrepreneur') setTypeFilter('entrepreneurial');
        else setTypeFilter('');

        // Set Scan Modal Defaults
        setSelectedCats(userInterests);
        
        // Map onboarding_role back to scan modal goal tags
        if (data.onboarding_role === 'job-seeker') setSelectedGoals(['jobs']);
        else if (data.onboarding_role === 'entrepreneur') setSelectedGoals(['entrepreneurial']);
        else setSelectedGoals(['jobs', 'entrepreneurial']);
      }
    }
  }, [supabase]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [opps, statData] = await Promise.all([
        api.getOpportunities(sectorFilter, typeFilter),
        api.getStats()
      ]);
      setOpportunities(opps);
      setStats(statData);
    } catch {
      setError('I couldn&apos;t reach the database right now. Please try again in a bit!');
    } finally {
      setIsLoading(false);
    }
  }, [sectorFilter, typeFilter]);

  const fetchBookmarks = useCallback(async () => {
    try {
      const ids = await api.getBookmarks();
      setBookmarkedIds(ids);
    } catch (err) {
      console.error('Failed to load bookmarks', err);
    }
  }, []);

  const handleToggleBookmark = async (id: string) => {
    setSavingId(id);
    const isBookmarked = bookmarkedIds.includes(id);
    const success = await api.toggleBookmark(id, isBookmarked);
    if (success) {
      setBookmarkedIds(prev => isBookmarked ? prev.filter(i => i !== id) : [...prev, id]);
    }
    setSavingId(null);
  };

  const handleTypeFilterChange = async (newType: string) => {
    setTypeFilter(newType);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      let newRole = 'explorer';
      if (newType === 'job') newRole = 'job-seeker';
      else if (newType === 'entrepreneurial') newRole = 'entrepreneur';

      await supabase
        .from('profiles')
        .update({ onboarding_role: newRole })
        .eq('id', user.id);
    }
  };

  const handleSectorFilterChange = async (newSector: string) => {
    setSectorFilter(newSector);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      let newInterests = profile?.interests || [];
      if (newSector) {
        newInterests = [newSector, ...newInterests.filter((i: string) => i !== newSector)];
      }
      await supabase
        .from('profiles')
        .update({ interests: newInterests })
        .eq('id', user.id);
    }
  };

  // Mount effects
  useEffect(() => {
    fetchProfile();
    fetchBookmarks();
  }, [fetchProfile, fetchBookmarks]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTriggerScan = async () => {
    setIsScanning(true);
    try {
      // Trigger the backend scan
      await api.triggerScan(selectedCats, selectedGoals);

      // Persist these preferences to the Supabase profile so the UI stays consistent
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Map selectedGoals tags back to onboarding_role enum
        let newRole = 'explorer';
        if (selectedGoals.length === 1) {
          if (selectedGoals.includes('jobs')) newRole = 'job-seeker';
          if (selectedGoals.includes('entrepreneurial')) newRole = 'entrepreneur';
        }

        await supabase
          .from('profiles')
          .update({
            interests: selectedCats,
            onboarding_role: newRole
          })
          .eq('id', user.id);
        
        // Refresh local profile state
        fetchProfile();
      }

      setTimeout(() => {
        setIsScanning(false);
        setIsScanModalOpen(false);
        fetchData();
      }, 2000);
    } catch {
      setError('Something went wrong with the search. Let&apos;s try again?');
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Friendly Welcome */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-surface border border-border p-8 md:p-12 shadow-sm">
        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2 text-primary font-semibold text-[11px] uppercase tracking-widest">
              <Sparkles className="h-4 w-4" />
              <span>Live Updates</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Hi! I&apos;ve found <span className="text-primary">{filteredOpportunities.length}</span> new things for you.
            </h1>
            <p className="text-sm text-muted/80 leading-relaxed">
              I&apos;m constantly scanning the web for the best jobs, grants, and entrepreneurial opportunities that match your interests.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={() => setIsScanModalOpen(true)} className="shadow-xl">
                Find something new
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="secondary" onClick={() => fetchData()}>
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                Sync
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="h-64 w-64 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
              <Image 
                src="/applogo.png" 
                alt="Kaziradar" 
                width={128}
                height={128}
                className="h-32 w-32 object-contain"
              />
            </div>
            <div className="absolute -top-4 -right-4 glass-pill px-4 py-2 text-xs font-bold animate-bounce">
              Thinking...
            </div>
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between px-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted mr-2">I&apos;m looking for</span>
          {typeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleTypeFilterChange(opt.id)}
              className={cn(
                "px-5 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
                typeFilter === opt.id
                  ? "bg-primary text-background shadow-lg shadow-primary/20"
                  : "bg-surface text-muted hover:text-foreground hover:bg-surface-hover border border-border"
              )}
            >
              {opt.label}
            </button>
          ))}
          <span className="text-xs font-medium text-muted mx-2">in</span>
          <select
            value={sectorFilter}
            onChange={(e) => handleSectorFilterChange(e.target.value)}
            className="bg-surface text-foreground text-xs font-medium rounded-full px-4 py-1.5 border border-border focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            {sectorOptions.map(opt => (
              <option key={opt} value={opt}>{opt || 'All Categories'}</option>
            ))}
          </select>
          </div>

          <div className="flex items-center gap-2 bg-surface p-1 rounded-full border border-border">

          <button 
            onClick={() => setViewMode('grid')}
            className={cn("p-2 rounded-full transition-all", viewMode === 'grid' ? "bg-primary text-background shadow-md" : "text-muted hover:text-foreground")}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={cn("p-2 rounded-full transition-all", viewMode === 'list' ? "bg-primary text-background shadow-md" : "text-muted hover:text-foreground")}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </section>

      {error && (
        <Card className="border-red-500/20 bg-red-500/5 p-4 rounded-3xl">
          <div className="flex items-center gap-3 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </Card>
      )}

      {/* Main Content */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex h-96 flex-col items-center justify-center gap-6 animate-pulse">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
              <Image src="/applogo.png" alt="Scout" width={80} height={80} className="object-cover" />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-bold">Checking the web...</h3>
              <p className="text-sm text-muted">I&apos;ll be done in just a second!</p>
            </div>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="flex h-96 flex-col items-center justify-center text-center p-8 bg-surface border border-dashed border-border rounded-[3rem] shadow-sm">
            <div className="h-20 w-20 rounded-full bg-muted/10 flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-muted opacity-40" />
            </div>
            <h3 className="text-xl font-bold">Nothing found just yet</h3>
            <p className="text-sm text-muted mt-2 max-w-sm mx-auto">
              I couldn&apos;t find any signals matching &quot;{searchQuery || 'your criteria'}&quot;. 
              Try a broader term or reset your filters.
            </p>
            <div className="flex gap-4 mt-8">
              <Button variant="soft" onClick={() => { setSearchQuery(''); handleSectorFilterChange(''); handleTypeFilterChange(''); }}>
                Reset everything
              </Button>
            </div>
          </div>
        ) : (
          <motion.div
            layout
            className={cn(
              "grid gap-6",
              viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}
          >
            <AnimatePresence mode="popLayout">
              {filteredOpportunities.map((opp) => (
                <motion.div
                  key={opp.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="group flex h-full flex-col hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border-border bg-surface overflow-hidden">
                    <div className="p-6 flex-1 space-y-6">
                      <div className="flex items-center justify-between">
                        <Badge tone={opp.relevance_score > 85 ? 'primary' : 'default'} className="px-3 py-1">
                          {opp.relevance_score}% Match
                        </Badge>
                        <button
                          onClick={() => handleToggleBookmark(opp.id)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300",
                            bookmarkedIds.includes(opp.id)
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "bg-surface text-muted hover:bg-surface-hover hover:text-foreground border border-border"
                          )}
                        >

                          <Star className={cn("h-3.5 w-3.5", bookmarkedIds.includes(opp.id) && "fill-current")} />
                          {bookmarkedIds.includes(opp.id) ? 'Saved' : 'Save'}
                        </button>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-lg font-bold group-hover:text-primary transition-colors leading-tight">
                          {opp.title}
                        </h4>
                        <div className="flex flex-wrap gap-4 text-[10px] text-muted font-medium">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-primary" />
                            {opp.location || 'Remote'}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-primary" />
                            Fresh
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Globe className="h-3 w-3 text-primary" />
                            {getHostLabel(opp.original_url)}
                          </div>
                        </div>
                      </div>

                      {opp.description && (
                        <p className="text-xs text-muted/70 line-clamp-3 leading-relaxed">
                          {opp.description}
                        </p>
                      )}

                      {opp.ai_explanation && (
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
                          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-primary">
                            <Sparkles className="h-3 w-3" />
                            AI Insight
                          </div>
                          <p className="text-[10px] text-foreground/80 leading-relaxed italic">
                            &ldquo;{opp.ai_explanation}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="p-6 pt-0 flex gap-2">
                      <Button 
                        className="flex-1 rounded-2xl" 
                        onClick={() => window.open(opp.original_url, '_blank')}
                      >
                        Learn more
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={bookmarkedIds.includes(opp.id) ? "primary" : "secondary"} 
                        className="rounded-2xl w-14 transition-all duration-300"
                        onClick={() => handleToggleBookmark(opp.id)}
                      >
                        {savingId === opp.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Heart className={cn("h-4 w-4", bookmarkedIds.includes(opp.id) && "fill-current")} />
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Scout Modal */}
      <Modal
        open={isScanModalOpen}
        title="What should I look for?"
        description="Tell me your interests and I'll scour the web to find the best matches."
        onClose={() => setIsScanModalOpen(false)}
        closeDisabled={isScanning}
      >
        <div className="space-y-8 py-4">
          {isScanning ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-6">
              <div className="relative">
                <div className="h-24 w-24 animate-spin rounded-full border-4 border-primary/10 border-t-primary" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-xl overflow-hidden border border-primary/20">
                  <Image src="/applogo.png" alt="Scout" width={40} height={40} className="object-cover" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold italic">&quot;On it! I&apos;m checking everywhere...&quot;</h3>
                <p className="text-muted">This usually takes about a minute.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <label className="text-sm font-bold text-foreground block px-1">Categories of interest</label>
                <div className="grid grid-cols-2 gap-3">
                  {['tech', 'agriculture', 'fintech', 'grants'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCats(prev =>
                        prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                      )}
                      className={cn(
                        "flex items-center gap-3 px-5 py-4 rounded-2xl border text-sm font-medium transition-all duration-300",
                        selectedCats.includes(cat)
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border bg-surface text-muted hover:bg-surface-hover"
                      )}
                    >

                      <div className={cn(
                        "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                        selectedCats.includes(cat) ? "bg-primary border-primary scale-110" : "border-muted/30"
                      )}>
                        {selectedCats.includes(cat) && <CheckCircle2 className="h-3 w-3 text-background" />}
                      </div>
                      <span className="capitalize">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-foreground block px-1">Goal</label>
                <div className="flex gap-3">
                  {['jobs', 'entrepreneurial'].map((goal) => (
                    <button
                      key={goal}
                      onClick={() => setSelectedGoals(prev =>
                        prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
                      )}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border text-sm font-bold transition-all duration-300",
                        selectedGoals.includes(goal)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-surface text-muted hover:bg-surface-hover"
                      )}
                    >

                      <span className="capitalize">{goal === 'jobs' ? 'Find a Job' : 'Entrepreneurship'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6">
                <Button variant="ghost" className="flex-1 h-14" onClick={() => setIsScanModalOpen(false)}>
                  Not now
                </Button>
                <Button className="flex-1 h-14" onClick={handleTriggerScan}>
                  Start Search
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      <SentinelPopUp 
        isOpen={isSentinelPopUpOpen} 
        onClose={() => {
          setIsSentinelPopUpOpen(false);
          setIsSentinelDismissed(true);
        }} 
      />
    </div>
  );
}
