import { motion } from 'framer-motion';
import { TrendingUp, Minus, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function SentinelPulse() {
  const [affinity, setAffinity] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAffinity() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('affinity_score')
        .eq('id', user.id)
        .single();
      
      if (data?.affinity_score) {
        setAffinity(data.affinity_score as Record<string, number>);
      }
      setLoading(false);
    }
    fetchAffinity();
  }, [supabase]);

  const topCategories = Object.entries(affinity)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  // Fallback if no activity yet
  const displayTrends = topCategories.length > 0 
    ? topCategories.map(([cat, score]) => ({
        category: cat,
        status: 'up',
        change: `+${Math.min(100, Math.floor(score / 10))}%`,
        volume: score,
        color: score > 50 ? 'text-emerald-400' : 'text-blue-400'
      }))
    : [
        { category: 'AgTech', status: 'stable', change: '0%', volume: 0, color: 'text-muted/40' },
        { category: 'Fintech', status: 'stable', change: '0%', volume: 0, color: 'text-muted/40' },
        { category: 'Grants', status: 'stable', change: '0%', volume: 0, color: 'text-muted/40' },
        { category: 'General', status: 'stable', change: '0%', volume: 0, color: 'text-muted/40' },
      ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 w-full animate-pulse bg-surface/40 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Your Interest Pulse</h2>
          <p className="text-xs font-bold text-muted/40 uppercase tracking-widest flex items-center gap-2">
            Personalized Behavioral Intelligence <Zap className="h-3 w-3 text-primary" />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayTrends.map((trend, i) => (
          <motion.div
            key={trend.category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-5 bg-surface/40 border-white/5 hover:border-white/10 transition-all flex items-center justify-between group overflow-hidden relative">
              <div className="space-y-1 relative z-10">
                <span className="text-[10px] font-bold text-muted/40 uppercase tracking-widest">{trend.category}</span>
                <p className="text-lg font-bold">{trend.volume} <span className="text-[10px] text-muted/40 font-normal">pts</span></p>
                <div className={`flex items-center gap-1 text-[11px] font-bold ${trend.color}`}>
                  {trend.status === 'up' && <TrendingUp className="h-3 w-3" />}
                  {trend.status === 'stable' && <Minus className="h-3 w-3" />}
                  Affinity {trend.change}
                </div>
              </div>

              {/* Decorative sparkline-like background */}
              <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity">
                 <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
                    <path 
                      d="M0 35 L20 25 L40 30 L60 10 L80 15" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      className={trend.color}
                    />
                 </svg>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
