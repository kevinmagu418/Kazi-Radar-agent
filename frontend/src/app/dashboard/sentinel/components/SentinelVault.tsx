'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Archive, 
  ExternalLink, 
  MapPin, 
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VaultItem {
  id: string;
  archived_at: string;
  ai_strategy_notes: string | null;
  sentinel_score: number | null;
  opportunities: {
    id: string;
    title: string;
    category: string;
    location: string;
    url: string;
    relevance_score: number;
    type: string;
  };
}

export function SentinelVault() {
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [affinity, setAffinity] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Parallel fetch vault and affinity
      const [vaultRes, profileRes] = await Promise.all([
        supabase
          .from('user_vault')
          .select('*, opportunities (*)')
          .eq('user_id', user.id)
          .order('archived_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('affinity_score')
          .eq('id', user.id)
          .single()
      ]);

      if (vaultRes.data) setVaultItems(vaultRes.data as unknown as VaultItem[]);
      if (profileRes.data?.affinity_score) setAffinity(profileRes.data.affinity_score as Record<string, number>);
      
      setLoading(false);
    }

    fetchData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 w-full animate-pulse bg-surface/40 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (vaultItems.length === 0) {
    return (
      <Card className="p-12 bg-surface/20 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4 rounded-[3rem]">
        <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center text-muted/30">
          <Archive className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Your Vault is Empty</h3>
          <p className="text-sm text-muted/60 max-w-sm">
            Sentinel is standing by. High-value opportunities matching your profile will appear here automatically as they are discovered.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Intelligence Vault</h2>
          <p className="text-xs font-bold text-muted/40 uppercase tracking-widest flex items-center gap-2">
            Automated Archival & Strategy <ShieldCheck className="h-3 w-3 text-primary" />
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {vaultItems.map((item, i) => {
            const hasHighAffinity = affinity[item.opportunities.category] > 50;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="group relative overflow-hidden rounded-[2.5rem] bg-surface/40 border-white/5 hover:bg-surface/60 hover:border-white/10 transition-all p-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Side: Core Info */}
                    <div className="flex-1 space-y-6">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge tone="primary" className="uppercase text-[10px] tracking-widest font-bold">
                            {item.opportunities.category}
                          </Badge>
                          {hasHighAffinity && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase text-[10px] tracking-widest font-bold flex items-center gap-1">
                              <Zap className="h-2 w-2 fill-current" /> High Interest Match
                            </Badge>
                          )}
                          <div className="flex items-center gap-1.5 text-xs text-muted/60 font-medium">
                            <MapPin className="h-3 w-3" />
                            {item.opportunities.location}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted/60 font-medium">
                            <Calendar className="h-3 w-3" />
                            Archived {new Date(item.archived_at).toLocaleDateString()}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                          {item.opportunities.title}
                        </h3>
                      </div>

                      {/* AI Strategy Note (Premium) */}
                      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                          <Sparkles className="h-3 w-3" /> Sentinel Strategy
                        </div>
                        <p className="text-sm text-muted/80 leading-relaxed italic">
                          &ldquo;{item.ai_strategy_notes || `Based on your profile as an ${item.opportunities.type}, this is a high-impact match. Focus your application on your proven results in this sector.`}&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Right Side: Metrics & Action */}
                    <div className="lg:w-48 shrink-0 flex flex-col justify-between items-end gap-6">
                      <div className="text-right space-y-1">
                        <span className="text-[10px] font-bold text-muted/40 uppercase tracking-widest block">Relevance</span>
                        <div className="text-4xl font-bold text-primary">
                          {item.sentinel_score || item.opportunities.relevance_score}%
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full lg:w-auto">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="flex-1 lg:flex-none rounded-xl h-12"
                          onClick={() => window.open(item.opportunities.url, '_blank', 'noopener,noreferrer')}
                        >
                          Apply <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-12 w-12 p-0 rounded-xl border border-white/5 hover:bg-white/5"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Visual */}
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldCheck className="h-12 w-12 text-primary rotate-12" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
