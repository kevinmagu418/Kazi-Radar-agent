'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Flame } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export function CommandCenter({ isOpen, onClose, onSearch }: CommandCenterProps) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Systems online. I'm your Intelligence Scout. Ask me to find specific jobs, grants, or sectors, and I'll filter the terminal for you." 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    const userQuery = query;
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setQuery('');
    onSearch(userQuery);
    setIsTyping(true);

    // Mock AI Intelligence
    setTimeout(() => {
      const lowerQuery = userQuery.toLowerCase();
      const stopWords = ['find', 'me', 'show', 'any', 'the', 'a', 'an', 'are', 'there', 'some', 'looking', 'for'];
      const keywords = userQuery.toLowerCase()
        .split(/[\s,]+/)
        .filter(word => word.length > 1 && !stopWords.includes(word));

      let response = `I've analyzed your request and extracted the core signals: ${keywords.join(', ')}. I'm updating your terminal now.`;
      
      if (lowerQuery.includes('job') || lowerQuery.includes('career')) {
        response = `Career intelligence active. I'm surfacing opportunities matching: ${keywords.filter(k => k !== 'job' && k !== 'jobs').join(', ')}.`;
      } else if (lowerQuery.includes('grant') || lowerQuery.includes('fund')) {
        response = `Financial scout engaged. Prioritizing grants and funding signals related to ${keywords.filter(k => k !== 'grant' && k !== 'grants' && k !== 'fund').join(', ')}.`;
      } else if (keywords.length === 0) {
        response = "I couldn't identify specific keywords in that request. Could you try being a bit more specific? e.g., 'tech jobs' or 'agricultural grants'.";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1000);
  };

  const suggestions = [
    "Find remote tech jobs",
    "Show me agricultural grants",
    "Surface fintech opportunities",
    "High priority signals only"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl overflow-hidden rounded-[2.5rem] bg-surface border border-primary/20 shadow-2xl shadow-primary/10 md:bottom-auto md:top-24"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 bg-primary/5 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary overflow-hidden border border-primary/20">
                  <Image src="/applogo.png" alt="Scout" width={40} height={40} className="object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Intelligence Scout</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted/60">Systems Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="rounded-xl p-2 text-muted/40 hover:bg-white/5 hover:text-foreground transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="h-[350px] overflow-y-auto overflow-x-hidden p-6 space-y-4 scrollbar-hide"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === 'user' ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "px-4 py-3 rounded-[1.5rem] text-sm font-medium leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-primary text-background rounded-tr-none" 
                      : "bg-white/5 border border-white/5 rounded-tl-none text-foreground/90"
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-2 p-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 pt-0 space-y-4">
              {/* Suggestions */}
              {messages.length < 3 && (
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setQuery(s); }}
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-muted/60 hover:border-primary/30 hover:text-primary transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <form 
                onSubmit={handleSendMessage}
                className="relative"
              >
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full h-14 pl-6 pr-14 rounded-2xl bg-background/50 border border-white/10 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/30"
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isTyping}
                  className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-background hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg shadow-primary/20"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
              
              <div className="flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted/20">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  Natural Language
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="h-3 w-3" />
                  Realtime Search
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
