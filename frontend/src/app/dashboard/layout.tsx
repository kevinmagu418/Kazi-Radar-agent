import type { ReactNode } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { getDashboardData } from '@/lib/dashboard-data';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { profile } = await getDashboardData();
  return <DashboardShell profile={profile}>{children}</DashboardShell>;
}
