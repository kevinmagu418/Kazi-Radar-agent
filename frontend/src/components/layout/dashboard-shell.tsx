'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Home,
  User, 
  Menu,
  X,
  Compass,
  Heart,
  Settings,
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import { SearchInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { CommandCenter } from './command-center';

const navItems = [
  { href: '/dashboard', label: 'My Finds', icon: Compass },
  { href: '/dashboard/sentinel', label: 'Sentinel', icon: ShieldCheck },
  { href: '/', label: 'Overview', icon: Home },
  { href: '/dashboard/favorites', label: 'Favorites', icon: Heart },
  { href: '/profile', label: 'Settings', icon: Settings },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DashboardShell({ children, profile }: { children: ReactNode, profile: any }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  
  const isFullyOnboarded = profile && (
    profile.onboarding_completed || 
    (profile.onboarding_role && profile.onboarding_role !== 'job-seeker' && profile.account_tier && profile.account_tier !== 'free')
  );

  const showOnboardingBanner = profile && !isFullyOnboarded;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-8">
        {showOnboardingBanner && (
          <div className="glass-pill bg-primary/10 border border-primary/20 p-4 flex items-center justify-between text-sm">
            <span>Welcome! Please complete your setup to get the best matches.</span>
            <Link href="/onboarding" className="font-bold text-primary underline">Continue Onboarding</Link>
          </div>
        )}
        {/* Navigation Bar */}
        <header className="glass-pill sticky top-6 z-40 flex items-center justify-between px-6 py-3 shadow-2xl">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 shadow-lg shadow-primary/10">
                <Image 
                  src="/applogo.png" 
                  alt="Kaziradar Logo"
                  width={40}
                  height={40}
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
              <div 
                onClick={() => setIsCommandCenterOpen(true)}
                className="cursor-pointer group"
              >
                <SearchInput 
                  placeholder="Ask me anything..." 
                  readOnly
                  className="rounded-full bg-surface border-none pointer-events-none group-hover:bg-surface-hover transition-all" 
                />
              </div>
            </div>
            
            <ThemeToggle className="hidden sm:flex" />

            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-muted transition-colors hover:text-foreground border border-border">
              <Bell className="h-4 w-4" />
            </button>

            <div className="h-8 w-px bg-border mx-1 hidden sm:block" />

            <Link href="/profile" className="flex items-center gap-2 rounded-2xl bg-surface border border-border pl-1.5 pr-4 py-1.5 transition-all hover:bg-surface-hover hover:border-primary/20 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform overflow-hidden shadow-sm">
                {profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt={profile.full_name || 'User'} width={32} height={32} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start -space-y-0.5 relative z-10">
                <span className="text-xs font-bold tracking-tight">{profile?.full_name?.split(' ')[0] || 'Scout'}</span>
                <span className="text-[9px] font-bold text-muted/40 uppercase tracking-widest">{profile?.account_tier || 'Free'}</span>
              </div>
            </Link>

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

        <CommandCenter 
          isOpen={isCommandCenterOpen}
          onClose={() => setIsCommandCenterOpen(false)}
          onSearch={(query) => {
            window.dispatchEvent(new CustomEvent('kaziradar-search', { detail: query }));
          }}
        />
      </div>
    </div>
  );
}
