'use client';

import { motion } from 'framer-motion';
import { Radar, Search, Briefcase, TrendingUp, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#050b15] relative overflow-hidden selection:bg-emerald-500/30">
      {/* Background Radiance */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 group cursor-pointer">
          <img src="/kazilogo.png" alt="KaziRadar" className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform duration-500" />
          <span className="text-2xl font-bold tracking-tight text-white">
            Kazi<span className="text-emerald-500">Radar</span>
          </span>
        </div>
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 rounded-full border border-white/10 glass text-sm font-medium hover:border-emerald-500/50 transition-colors"
          >
            Launch Terminal
          </motion.button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Market Intelligence
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            The Elite Agent for <br />
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-400 bg-clip-text text-transparent">
              Global Opportunities.
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            A high-performance intelligence scanner that uncovers verified jobs, grants, and entrepreneurial signals across Tech, Agriculture, and Fintech.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg flex items-center gap-3 shadow-xl shadow-emerald-500/20 active:bg-emerald-600 transition-all"
              >
                Scan Now
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 glass rounded-2xl border border-white/10 font-bold text-lg hover:bg-white/5 transition-all text-white"
            >
              How it works
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Floating Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full px-4 md:px-0"
        >
          <div className="glass p-10 rounded-[2.5rem] text-left hover:border-emerald-500/30 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-500/20 transition-all duration-500 group-hover:scale-110">
              <Briefcase className="text-emerald-500 w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Job Ingestion</h3>
            <p className="text-slate-400 text-base leading-relaxed">
              Real-time API integration with Adzuna & Remotive for the latest global remote roles, precisely filtered for your career path.
            </p>
          </div>

          <div className="glass p-10 rounded-[2.5rem] text-left hover:border-blue-500/30 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-500/20 transition-all duration-500 group-hover:scale-110">
              <TrendingUp className="text-blue-500 w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Venture Signals</h3>
            <p className="text-slate-400 text-base leading-relaxed">
              AI-driven extraction of startup signals and grants from World Bank & Global News to catch trends before they go mainstream.
            </p>
          </div>

          <div className="glass p-10 rounded-[2.5rem] text-left hover:border-amber-500/30 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors" />
            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-amber-500/20 transition-all duration-500 group-hover:scale-110">
              <Search className="text-amber-500 w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">AI Verification</h3>
            <p className="text-slate-400 text-base leading-relaxed">
              Every discovery is cross-referenced by our Intelligence Model to ensure verifiability, proof links, and accurate context.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Decorative pulse element */}
      <div className="absolute inset-x-0 bottom-0 py-20 flex justify-center pointer-events-none opacity-20">
         <div className="w-[800px] h-[800px] border border-white/5 rounded-full radar-pulse" />
      </div>
    </div>
  );
}
