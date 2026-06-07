'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShieldCheck, Flame, X, Check, Trash2, ExternalLink } from 'lucide-react';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function SentinelNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const router = useRouter();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Bell Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 outline-none focus:ring-2 focus:ring-primary/20",
          isOpen 
            ? "bg-primary/10 text-primary border border-primary/20" 
            : "bg-surface text-muted hover:text-foreground border border-border"
        )}
      >
        <Bell className={cn("h-4 w-4", unreadCount > 0 && "animate-pulse")} />
        
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-background border-2 border-background"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/5"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, y: 10, scale: 0.95, x: 20 }}
              className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-[2rem] bg-surface/95 backdrop-blur-xl border border-border shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-widest">Intelligence Logs</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="p-1.5 rounded-lg text-muted/40 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors disabled:opacity-30"
                    title="Mark all as read"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={clearAll}
                    disabled={notifications.length === 0}
                    className="p-1.5 rounded-lg text-muted/40 hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-30"
                    title="Clear all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-muted/40 hover:text-foreground transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="max-h-[380px] overflow-y-auto scrollbar-hide py-2">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                    <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                      <Flame className="h-6 w-6 text-primary/30" />
                    </div>
                    <p className="text-xs font-bold text-foreground/60 uppercase tracking-widest">No New Signals</p>
                    <p className="text-[10px] text-muted/40 mt-1">Sentinel is active and scanning...</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/30">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={cn(
                          "relative p-4 transition-all duration-300 hover:bg-primary/5 cursor-pointer group",
                          !notification.is_read && "bg-primary/[0.02]"
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {!notification.is_read && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                        )}
                        
                        <div className="flex gap-3">
                          <div className={cn(
                            "h-8 w-8 shrink-0 rounded-xl flex items-center justify-center",
                            notification.type === 'sentinel_match' ? "bg-primary/10 text-primary" : "bg-blue-500/10 text-blue-500"
                          )}>
                            {notification.type === 'sentinel_match' ? <ShieldCheck className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                          </div>
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-[11px] font-black text-foreground leading-tight line-clamp-1">
                                {notification.title}
                              </h4>
                              <span className="text-[8px] font-bold text-muted/40 uppercase whitespace-nowrap">
                                {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[10px] text-muted/60 leading-relaxed line-clamp-2">
                              {notification.content}
                            </p>
                            
                            {notification.link && (
                              <div className="pt-1 flex items-center gap-1 text-[9px] font-black text-primary uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">
                                View Intelligence <ExternalLink className="h-2.5 w-2.5" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border/50 bg-primary/5 p-3 text-center">
                <button 
                  onClick={() => {
                    router.push('/dashboard/sentinel');
                    setIsOpen(false);
                  }}
                  className="text-[9px] font-black text-primary uppercase tracking-[0.2em] hover:text-primary-glow transition-colors"
                >
                  Enter Sentinel Terminal
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
