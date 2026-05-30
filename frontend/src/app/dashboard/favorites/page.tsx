'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Heart,
  RefreshCw,
  ExternalLink,
  Bot,
  Star,
  Clock,
  MapPin,
  Globe,
  LayoutGrid,
  List,
  AlertCircle
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api, Opportunity } from '@/lib/api';
import { cn } from '@/lib/utils';

function getHostLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'Web';
  }
}

export default function FavoritesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [favs, ids] = await Promise.all([
        api.getFavorites(),
        api.getBookmarks()
      ]);
      setOpportunities(favs);
      setBookmarkedIds(ids);
    } catch {
      setError('Failed to load your favorites.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleToggleBookmark = async (id: string) => {
    setSavingId(id);
    const isBookmarked = bookmarkedIds.includes(id);
    const success = await api.toggleBookmark(id, isBookmarked);
    if (success) {
      setBookmarkedIds(prev => isBookmarked ? prev.filter(i => i !== id) : [...prev, id]);
      if (isBookmarked) {
        // Remove from list if un-favorited on this page
        setOpportunities(prev => prev.filter(opp => opp.id !== id));
      }
    }
    setSavingId(null);
  };

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-surface border border-border p-8 md:p-12 shadow-sm">
        <div className="relative z-10 space-y-4 max-w-xl">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest">
            <Heart className="h-4 w-4 fill-current" />
            <span>Saved Terminal</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Your <span className="text-primary">Favorites</span>
          </h1>
          <p className="text-lg text-muted/80 leading-relaxed">
            All the high-value opportunities you&apos;ve scouted and saved for later.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-between px-2">
        <div className="text-sm font-medium text-muted">
          {opportunities.length} opportunities saved
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

      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex h-96 flex-col items-center justify-center gap-6 animate-pulse">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-10 w-10 text-primary animate-bounce" />
            </div>
            <h3 className="text-xl font-bold">Accessing your vault...</h3>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="flex h-96 flex-col items-center justify-center text-center p-8 bg-surface border border-dashed border-border rounded-[3rem] shadow-sm">
            <Heart className="h-16 w-16 text-muted mb-6 opacity-20" />
            <h3 className="text-2xl font-bold">Your vault is empty</h3>
            <p className="text-muted mt-2 max-w-sm mx-auto">
              You haven&apos;t saved any opportunities yet. Head back to the dashboard to start scouting!
            </p>
            <Button variant="soft" className="mt-8" onClick={() => window.location.href = '/dashboard'}>
              Go Scouting
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
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 bg-primary/10 text-primary border border-primary/20"
                        >
                          <Star className="h-3.5 w-3.5 fill-current" />
                          Saved
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
                            Saved
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5 text-primary" />
                            {getHostLabel(opp.original_url)}
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
                        onClick={() => window.open(opp.original_url, '_blank')}
                      >
                        Learn more
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="primary" 
                        className="rounded-2xl w-14 transition-all duration-300"
                        onClick={() => handleToggleBookmark(opp.id)}
                      >
                        {savingId === opp.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Heart className="h-4 w-4 fill-current" />
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
    </div>
  );
}
