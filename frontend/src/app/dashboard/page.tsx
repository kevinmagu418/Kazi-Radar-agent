'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, 
  Search, 
  MapPin, 
  ArrowUpRight, 
  Activity, 
  Briefcase, 
  Zap,
  Filter,
  RefreshCw,
  Plus,
  TrendingUp
} from 'lucide-react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Chip,
  Checkbox,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import { api, Opportunity, Stats } from '@/lib/api';

export default function Dashboard() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>(['tech']);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['jobs']);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto refresh stats
    return () => clearInterval(interval);
  }, [filter]);

  const fetchData = async () => {
    try {
      const [opps, statData] = await Promise.all([
        api.getOpportunities(filter),
        api.getStats()
      ]);
      setOpportunities(opps);
      setStats(statData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerScan = async () => {
    try {
      await api.triggerScan(selectedCats, selectedGoals);
      setIsScanModalOpen(false);
      // Optional: Show toast
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b15] text-white">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 flex-col items-center py-8 glass border-r-0 z-20 transition-all">
        <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center shadow-lg group cursor-pointer mb-12 hover:bg-emerald-500/20 transition-all">
          <img src="/kazilogo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
        </div>
        <div className="flex flex-col gap-8">
          <motion.div whileHover={{ scale: 1.1 }} className="p-3 text-emerald-500 bg-emerald-500/10 rounded-xl cursor-not-allowed">
            <Activity className="w-6 h-6" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} className="p-3 text-slate-500 hover:text-white transition-colors cursor-not-allowed">
            <Briefcase className="w-6 h-6" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} className="p-3 text-slate-500 hover:text-white transition-colors cursor-not-allowed">
            <TrendingUp className="w-6 h-6" />
          </motion.div>
        </div>
      </aside>

      <main className="pl-0 md:pl-20 pb-20 md:pb-0">
        <header className="px-4 md:px-8 py-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#050b15]/80 backdrop-blur-md z-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Intelligence Terminal</h1>
            <p className="text-sm text-slate-400">Monitoring global opportunity signals</p>
          </div>
          <div className="flex items-center gap-4">
             <Button 
               onClick={() => setIsScanModalOpen(true)}
               variant="contained" 
               startIcon={<Plus className="w-4 h-4" />}
               sx={{ 
                 bgcolor: '#10b981', 
                 '&:hover': { bgcolor: '#059669' },
                 borderRadius: '12px',
                 textTransform: 'none',
                 fontWeight: 'bold',
                 px: 3
               }}
             >
               Trigger Scan
             </Button>
          </div>
        </header>

        <section className="p-4 md:p-8 max-w-7xl">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            {[
              { label: 'Active Sources', value: stats?.sources.active || 0, icon: Search, color: 'emerald' },
              { label: 'Raw Signals', value: stats?.data.raw || 0, icon: Zap, color: 'blue' },
              { label: 'AI Processed', value: stats?.data.processed || 0, icon: Radar, color: 'amber' },
              { label: 'Scan Range', value: 'Global', icon: MapPin, color: 'rose' }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-6 rounded-3xl"
              >
                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-4`}>
                  <stat.icon className={`text-${stat.color}-500 w-5 h-5`} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              {['', 'tech', 'agriculture', 'fintech'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                    filter === cat ? 'bg-white text-black' : 'glass text-slate-400 hover:text-white'
                  }`}
                >
                  {cat || 'All Categories'}
                </button>
              ))}
            </div>
            <button onClick={fetchData} className="p-2 glass rounded-xl hover:bg-white/5 transition-colors">
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Feed */}
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {opportunities.map((opp, idx) => (
                <motion.div
                  key={opp._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass p-6 rounded-3xl group flex items-start justify-between hover:border-white/20 transition-all cursor-default"
                >
                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                       {opp.category === 'tech' && <Zap className="text-blue-400 w-6 h-6" />}
                       {opp.category === 'agriculture' && <TrendingUp className="text-emerald-400 w-6 h-6" />}
                       {opp.category === 'fintech' && <Briefcase className="text-amber-400 w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{opp.category}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                        <span className="text-xs font-bold text-slate-400">{opp.providerName}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-emerald-400 transition-colors">{opp.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5 font-medium">
                          <MapPin className="w-4 h-4" />
                          {opp.location || 'Remote'}
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-emerald-500/80">
                          <Activity className="w-4 h-4" />
                          {opp.relevanceScore}% Match
                        </div>
                      </div>
                    </div>
                  </div>
                  <a 
                    href={opp.originalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 glass rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
                  >
                    <ArrowUpRight className="w-6 h-6" />
                  </a>
                </motion.div>
              ))}
            </AnimatePresence>

            {opportunities.length === 0 && !isLoading && (
              <div className="py-20 text-center glass rounded-[2.5rem] border-dashed border-white/5">
                <img src="/kazilogo.png" alt="Empty" className="w-16 h-16 mx-auto mb-4 opacity-20 grayscale" />
                <p className="text-slate-500 font-medium">No intelligence signals found in this sector yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Scan Modal */}
      <Dialog 
        open={isScanModalOpen} 
        onClose={() => setIsScanModalOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: '#0f172a',
            color: 'white',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '12px'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Trigger Intelligence Scan</DialogTitle>
        <DialogContent>
          <div className="py-4">
             <p className="text-slate-400 text-sm mb-6">Select the sectors and goals for the KaziRadar agent to target.</p>
             
             <div className="mb-6">
                <label className="text-xs font-bold uppercase text-slate-500 block mb-3">Target Categories</label>
                <div className="flex flex-wrap gap-2">
                  {['tech', 'agriculture', 'fintech', 'grants'].map(c => (
                    <Chip 
                      key={c}
                      label={c}
                      onClick={() => setSelectedCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                      sx={{ 
                        color: selectedCats.includes(c) ? 'white' : '#94a3b8',
                        bgcolor: selectedCats.includes(c) ? '#10b981' : 'rgba(255,255,255,0.05)',
                        fontWeight: 'bold',
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </div>
             </div>

             <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-3">Target Goals</label>
                <div className="flex flex-wrap gap-2">
                  {['jobs', 'entrepreneurial'].map(g => (
                    <Chip 
                      key={g}
                      label={g}
                      onClick={() => setSelectedGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])}
                      sx={{ 
                        color: selectedGoals.includes(g) ? 'white' : '#94a3b8',
                        bgcolor: selectedGoals.includes(g) ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                        fontWeight: 'bold'
                      }}
                    />
                  ))}
                </div>
             </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={() => setIsScanModalOpen(false)} sx={{ color: '#94a3b8', textTransform: 'none', fontWeight: 'bold' }}>Cancel</Button>
          <Button 
            onClick={handleTriggerScan} 
            variant="contained" 
            sx={{ 
                bgcolor: '#10b981', 
                borderRadius: '12px',
                px: 4,
                fontWeight: 'bold',
                textTransform: 'none'
            }}
          >
            Launch Scan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full h-20 glass md:hidden flex items-center justify-around px-6 z-30 border-t border-white/5 backdrop-blur-xl">
        <motion.button whileTap={{ scale: 0.9 }} className="p-3 text-emerald-500 bg-emerald-500/10 rounded-2xl relative">
          <Activity className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#050b15]"></span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} className="p-3 text-slate-500 hover:text-white transition-colors">
          <Briefcase className="w-6 h-6" />
        </motion.button>
        
        {/* Central Scan Button for Mobile */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }} 
          onClick={() => setIsScanModalOpen(true)}
          className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 -mt-12 border-4 border-[#050b15]"
        >
          <Plus className="w-7 h-7" />
        </motion.button>

        <motion.button whileTap={{ scale: 0.9 }} className="p-3 text-slate-500 hover:text-white transition-colors">
          <TrendingUp className="w-6 h-6" />
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} className="p-3 text-slate-500 hover:text-white transition-colors">
          <MapPin className="w-6 h-6" />
        </motion.button>
      </nav>
    </div>
  );
}
