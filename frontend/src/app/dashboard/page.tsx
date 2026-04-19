'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Compass,
  Filter,
  Globe,
  Plus,
  RefreshCw,
  Sparkles,
  Search,
  Zap,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Bot,
  Star,
  Clock,
  MapPin,
  TrendingUp,
  LayoutGrid,
  List,
  Heart
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { api, Opportunity, Stats } from '@/lib/api';
import { cn } from '@/lib/utils';

const sectorOptions = ['', 'tech', 'agriculture', 'fintech', 'grants'];
const typeOptions = [
  { id: '', label: 'Everything' },
  { id: 'job', label: 'Careers' },
  { id: 'entrepreneurial', label: 'Projects' },
];

function getHostLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'Web';
  }
}

export default function DashboardPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [sectorFilter, setSectorFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>(['tech']);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['jobs']);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    } catch (err) {
      setError('I couldn\'t reach the database right now. Please try again in a bit!');
    } finally {
      setIsLoading(false);
    }
  }, [sectorFilter, typeFilter]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleTriggerScan = async () => {
    setIsScanning(true);
    try {
      await api.triggerScan(selectedCats, selectedGoals);
      setTimeout(() => {
        setIsScanning(false);
        setIsScanModalOpen(false);
        fetchData();
      }, 2000);
    } catch (err) {
      setError('Something went wrong with the search. Let\'s try again?');
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Friendly Welcome */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-surface/30 p-8 md:p-12 border border-white/5">
        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest">
              <Sparkles className="h-4 w-4" />
              <span>Live Updates</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Hi! I've found <span className="text-primary">{opportunities.length}</span> new things for you.
            </h1>
            <p className="text-lg text-muted/80 leading-relaxed">
              I'm constantly scanning the web for the best jobs, projects, and grants that match your interests.
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
            <div className="h-64 w-64 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-slow">
              <Bot className="h-32 w-32 text-primary float" />
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
          <span className="text-sm font-medium text-muted mr-2">I'm looking for</span>
          {typeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTypeFilter(opt.id)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                typeFilter === opt.id 
                  ? "bg-primary text-background shadow-lg shadow-primary/20" 
                  : "bg-surface text-muted hover:text-foreground hover:bg-surface-hover"
              )}
            >
              {opt.label}
            </button>
          ))}
          <span className="text-sm font-medium text-muted mx-2">in</span>
          <select 
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="bg-surface text-foreground text-sm font-medium rounded-full px-4 py-2 border-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            {sectorOptions.map(opt => (
              <option key={opt} value={opt}>{opt || 'All Categories'}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-surface p-1 rounded-full border border-white/5">
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
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-10 w-10 text-primary animate-bounce" />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-bold">Checking the web...</h3>
              <p className="text-muted">I'll be done in just a second!</p>
            </div>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="flex h-96 flex-col items-center justify-center text-center p-8 bg-surface/10 rounded-[3rem] border border-dashed border-white/10">
            <Search className="h-16 w-16 text-muted mb-6 opacity-20" />
            <h3 className="text-2xl font-bold">Nothing found just yet</h3>
            <p className="text-muted mt-2 max-w-sm mx-auto">
              I couldn't find anything matching those specific filters. Try widening your search!
            </p>
            <Button variant="soft" className="mt-8" onClick={() => {setSectorFilter(''); setTypeFilter('');}}>
              Reset my filters
            </Button>
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
              {opportunities.map((opp) => (
                <motion.div
                  key={opp._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="group flex h-full flex-col hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border-white/5 bg-surface/40 overflow-hidden">
                    <div className="p-6 flex-1 space-y-6">
                      <div className="flex items-center justify-between">
                        <Badge tone={opp.relevanceScore > 85 ? 'primary' : 'default'} className="px-3 py-1">
                          {opp.relevanceScore}% Match
                        </Badge>
                        <button className="text-muted hover:text-primary transition-colors">
                          <Star className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">
                          {opp.title}
                        </h4>
                        <div className="flex flex-wrap gap-4 text-xs text-muted font-medium">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            {opp.location || 'Remote'}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            Fresh
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5 text-primary" />
                            {getHostLabel(opp.originalUrl)}
                          </div>
                        </div>
                      </div>

                      {opp.description && (
                        <p className="text-sm text-muted/70 line-clamp-3 leading-relaxed">
                          {opp.description}
                        </p>
                      )}
                    </div>

                    <div className="p-6 pt-0 flex gap-2">
                      <Button 
                        className="flex-1 rounded-2xl" 
                        onClick={() => window.open(opp.originalUrl, '_blank')}
                      >
                        Learn more
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        className="rounded-2xl w-14"
                        onClick={() => {}}
                      >
                        <Heart className="h-4 w-4" />
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
                <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold italic">"On it! I'm checking everywhere..."</h3>
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
                          : "border-white/5 bg-white/5 text-muted hover:bg-white/10"
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
                          : "border-white/5 bg-white/5 text-muted hover:bg-white/10"
                      )}
                    >
                      <span className="capitalize">{goal === 'jobs' ? 'Find a Job' : 'Find a Project'}</span>
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
    </div>
  );
}
