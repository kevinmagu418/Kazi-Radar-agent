'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User,
  Settings,
  Palette,
  CreditCard,
  LogOut,
  ChevronDown,
  Monitor,
  Moon,
  Sun
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/lib/theme-context';
import { createClient } from '@/lib/supabase/client';

interface UserMenuProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any;
}

export function UserMenu({ profile }: UserMenuProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const displayName = profile?.full_name?.split(' ')[0] || 'Scout';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full bg-surface border border-border pl-1.5 pr-3 py-1.5 transition-all hover:bg-surface-hover hover:border-primary/20 group outline-none focus:ring-2 focus:ring-primary/20">
          <div className="relative h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary overflow-hidden shadow-sm transition-transform group-hover:scale-105">
            {profile?.avatar_url ? (
              <Image 
                src={profile.avatar_url} 
                alt={profile.full_name || 'User'} 
                width={28} 
                height={28} 
                className="h-full w-full object-cover" 
              />
            ) : (
              <User className="h-3.5 w-3.5" />
            )}
          </div>
          <span className="hidden lg:block text-xs font-bold tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">
            {displayName}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted/40 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none">{profile?.full_name || 'Kaziradar Scout'}</p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">
              {profile?.account_tier || 'Free Plan'}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup className="p-1.5">
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2.5 h-4 w-4 text-muted/40 transition-colors group-hover:text-primary" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2.5 h-4 w-4 text-muted/40" />
              <span>Account Settings</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <Palette className="mr-2.5 h-4 w-4 text-muted/40" />
              <span>Appearance</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-36">
                <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
                  <Sun className="mr-2.5 h-4 w-4 text-muted/40" />
                  <span>Light</span>
                  {theme === 'light' && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
                  <Moon className="mr-2.5 h-4 w-4 text-muted/40" />
                  <span>Dark</span>
                  {theme === 'dark' && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
                  <Monitor className="mr-2.5 h-4 w-4 text-muted/40" />
                  <span>System</span>
                  {theme === 'system' && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard className="mr-2.5 h-4 w-4 text-muted/40" />
              <span>Billing</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        
        <div className="p-1.5">
          <DropdownMenuItem 
            onClick={handleLogout}
            className="cursor-pointer text-rose-500 focus:bg-rose-500/10 focus:text-rose-500"
          >
            <LogOut className="mr-2.5 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
