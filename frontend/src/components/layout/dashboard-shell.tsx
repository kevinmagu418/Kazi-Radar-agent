'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home,
  Menu,
  X,
  Compass,
  Heart,
  Settings,
  ShieldCheck,
  Search
} from 'lucide-react';
import Image from 'next/image';
import { SearchInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CommandCenter } from './command-center';
import { UserMenu } from './user-menu';
import { SentinelNotifications } from './sentinel-notifications';

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
        <header className="glass-pill sticky top-6 z-40 flex items-center justify-between px-6 py-2.5 shadow-2xl">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-full border border-white/10 shadow-lg shadow-primary/10 transition-transform hover:scale-105">
                <Image 
                  src="/applogo.png" 
                  alt="Kaziradar Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="hidden text-lg font-bold tracking-tight md:block">Kaziradar</span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={label}
                    href={href}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300',
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

          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Search */}
            <div className="hidden md:block w-48 lg:w-64">
              <div 
                onClick={() => setIsCommandCenterOpen(true)}
                className="cursor-pointer group"
              >
                <SearchInput 
                  placeholder="Ask me anything..." 
                  readOnly
                  className="rounded-full bg-surface border-none pointer-events-none group-hover:bg-surface-hover transition-all h-10" 
                />
              </div>
            </div>

            {/* Mobile Search Trigger */}
            <button 
              onClick={() => setIsCommandCenterOpen(true)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full bg-surface text-muted hover:text-foreground border border-border"
            >
              <Search className="h-4 w-4" />
            </button>
            
            <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

            <SentinelNotifications />
            <UserMenu profile={profile} />

            <button 
              className="lg:hidden p-2 text-muted hover:text-primary transition-colors"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
