'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, LayoutDashboard, Menu, Search, Sparkles, UserCircle2, X } from 'lucide-react';
import { SearchInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/', label: 'Overview', icon: Sparkles },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebar = (
    <aside
      className={cn(
        'dashboard-bg surface-panel flex h-full flex-col rounded-[1.75rem] p-4 transition-all duration-200',
        isCollapsed ? 'w-[88px]' : 'w-[260px]',
      )}
    >
      <div className="mb-6 flex items-center justify-between gap-3 px-2">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] text-sm font-semibold text-[#0f0f14]">
            OS
          </div>
          {!isCollapsed ? (
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-[color:var(--foreground)]">Opportunity Scanner</p>
              <p className="truncate text-sm text-[color:var(--muted)]">Premium dashboard</p>
            </div>
          ) : null}
        </Link>
        <button
          className="hidden rounded-2xl border border-white/10 bg-white/5 p-2 text-[color:var(--muted)] transition-all duration-200 hover:scale-105 hover:bg-white/10 lg:block"
          onClick={() => setIsCollapsed((value) => !value)}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </button>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-105',
                active
                  ? 'bg-[rgba(255,77,141,0.18)] text-[color:var(--foreground)] glow-border'
                  : 'text-[color:var(--muted)] hover:bg-white/5 hover:text-[color:var(--foreground)]',
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed ? <span>{label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
        {!isCollapsed ? (
          <>
            <p className="text-sm font-semibold text-[color:var(--foreground)]">Signal quality</p>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
              Keep scans, evidence, and review state visible in one calm workspace.
            </p>
          </>
        ) : (
          <Search className="mx-auto h-5 w-5 text-[color:var(--primary-glow)]" />
        )}
      </div>
    </aside>
  );

  return (
    <div className="dashboard-bg min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-4 p-4 lg:p-6">
        <div className="hidden lg:block">{sidebar}</div>

        {isMobileOpen ? (
          <div className="fixed inset-0 z-40 bg-black/60 p-4 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileOpen(false)}>
            <div className="h-full max-w-[280px]" onClick={(event) => event.stopPropagation()}>
              {sidebar}
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-6">
          <header className="surface-panel fade-in flex items-center gap-4 rounded-[1.75rem] px-4 py-4 lg:px-6">
            <button
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[color:var(--foreground)] transition-all duration-200 hover:scale-105 lg:hidden"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden min-w-0 flex-1 md:block">
              <SearchInput placeholder="Search opportunities, categories, or source domains" />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[color:var(--muted)] transition-all duration-200 hover:scale-105 hover:text-[color:var(--foreground)]">
                <Bell className="h-5 w-5" />
              </button>
              <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 sm:flex">
                <UserCircle2 className="h-8 w-8 text-[color:var(--primary-glow)]" />
                <div>
                  <p className="text-sm font-medium text-[color:var(--foreground)]">Radar Operator</p>
                  <p className="text-sm text-[color:var(--muted)]">Active workspace</p>
                </div>
              </div>
            </div>
          </header>

          <main className="fade-in flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
