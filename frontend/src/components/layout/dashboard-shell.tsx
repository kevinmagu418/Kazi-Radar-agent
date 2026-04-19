'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Home,
  Search, 
  Sparkles, 
  User, 
  Menu,
  X,
  Compass,
  Heart,
  Settings,
  Bot
} from 'lucide-react';
import { SearchInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'My Finds', icon: Compass },
  { href: '/', label: 'Overview', icon: Home },
  { href: '#', label: 'Favorites', icon: Heart },
  { href: '#', label: 'Settings', icon: Settings },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-8">
        {/* Navigation Bar */}
        <header className="glass-pill sticky top-6 z-40 flex items-center justify-between px-6 py-3 shadow-2xl">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 shadow-lg shadow-primary/10">
                <img 
                  src="/applogo.png" 
                  alt="Kaziradar Logo" 
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="hidden text-xl font-bold tracking-tight md:block">Kaziradar</span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={label}
                    href={href}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
                      active
                        ? 'bg-primary text-background shadow-md'
                        : 'text-muted hover:bg-white/5 hover:text-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden w-48 md:block lg:w-64">
              <SearchInput placeholder="Ask me anything..." className="rounded-full bg-white/5 border-none" />
            </div>
            
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-muted transition-colors hover:text-foreground">
              <Bell className="h-4 w-4" />
            </button>

            <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />

            <button className="flex items-center gap-2 rounded-full bg-white/5 pl-2 pr-4 py-1.5 transition-all hover:bg-white/10 group">
              <div className="h-7 w-7 rounded-full bg-surface-hover border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <User className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium hidden sm:block">Me</span>
            </button>

            <button 
              className="lg:hidden p-2 text-muted"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </header>

        {/* Mobile Nav */}
        {isMobileOpen && (
          <div className="glass-card-soft fixed inset-x-4 top-24 z-50 p-6 lg:hidden animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 text-lg font-medium text-muted hover:text-primary transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        <main className="fade-in mt-2 flex-1 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
