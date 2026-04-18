'use client';

import type { ComponentType, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  Briefcase,
  Filter,
  Globe,
  Plus,
  Radar,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api, Opportunity, Stats } from '@/lib/api';
import { cn } from '@/lib/utils';

const sectorOptions = ['', 'tech', 'agriculture', 'fintech', 'grants'];
const typeOptions = [
  { id: '', label: 'All signals' },
  { id: 'job', label: 'Career opportunities' },
  { id: 'entrepreneurial', label: 'Venture signals' },
];

function getHostLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'external source';
  }
}

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="fade-in rounded-[1.75rem]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-[color:var(--muted)]">{label}</p>
          <p className="text-2xl font-semibold text-[color:var(--foreground)]">{value}</p>
        </div>
        <div className="rounded-2xl bg-[rgba(255,77,141,0.16)] p-3 text-[color:var(--primary-glow)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200',
        active
          ? 'bg-[color:var(--primary)] text-[color:var(--foreground)] shadow-[0_10px_30px_rgba(255,77,141,0.24)] hover:scale-105'
          : 'border border-white/10 bg-white/5 text-[color:var(--muted)] hover:scale-105 hover:bg-white/10 hover:text-[color:var(--foreground)]',
      )}
    >
      {children}
    </button>
  );
}

function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[color:var(--foreground)]">{title}</h2>
        <p className="text-sm leading-relaxed text-[color:var(--muted)]">{description}</p>
      </div>
      {action}
    </div>
  );
}

export default function Dashboard() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [sectorFilter, setSectorFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>(['tech']);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['jobs']);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [opps, statData] = await Promise.all([api.getOpportunities(sectorFilter, typeFilter), api.getStats()]);
      setOpportunities(opps);
      setStats(statData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load intelligence data';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [sectorFilter, typeFilter]);

  useEffect(() => {
    void fetchData();
    const interval = setInterval(() => {
      void fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const handleTriggerScan = async () => {
    setIsScanning(true);

    try {
      await api.triggerScan(selectedCats, selectedGoals);
      setTimeout(() => {
        setIsScanning(false);
        setIsScanModalOpen(false);
        void fetchData();
      }, 1400);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to trigger scan';
      setError(message);
      setIsScanning(false);
    }
  };

  const summary = useMemo(
    () => ({
      activeSources: stats?.sources.active ?? 0,
      rawSignals: stats?.data.raw ?? 0,
      processedSignals: stats?.data.processed ?? 0,
      feedState: isLoading ? 'Syncing' : 'Active',
    }),
    [isLoading, stats],
  );

  const activeFilters = useMemo(() => {
    const filters: Array<{ label: string; tone: 'primary' | 'default' }> = [];

    if (sectorFilter) {
      filters.push({ label: `Sector: ${sectorFilter}`, tone: 'default' });
    }

    if (typeFilter) {
      const label = typeOptions.find((type) => type.id === typeFilter)?.label ?? typeFilter;
      filters.push({ label, tone: 'primary' });
    }

    return filters;
  }, [sectorFilter, typeFilter]);

  const recentLogItems = useMemo(
    () => [
      `Feed status: ${summary.feedState}`,
      `Visible opportunities: ${opportunities.length}`,
      `Sector filter: ${sectorFilter || 'all'}`,
      `Type filter: ${typeFilter || 'all'}`,
    ],
    [opportunities.length, sectorFilter, summary.feedState, typeFilter],
  );

  return (
    <div className="space-y-6 px-0 py-0">
      <section className="fade-in grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[2rem] p-6 lg:p-8">
          <div className="space-y-6">
            <Badge tone="primary">Opportunity Scanner Dashboard</Badge>
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold leading-relaxed text-[color:var(--foreground)] lg:text-[2rem]">
                Review signals, manage scans, and keep source intelligence readable at production scale.
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-[color:var(--muted)]">
                The dashboard keeps the existing backend workflow intact while presenting opportunities, filters, and scan
                controls in a cleaner premium layout.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => void fetchData()} className="min-w-[160px]">
                <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
                Refresh feed
              </Button>
              <Button variant="ghost" onClick={() => setIsScanModalOpen(true)} className="min-w-[160px]">
                <Plus className="h-4 w-4" />
                Run scan
              </Button>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem]">
          <div className="space-y-5">
            <SectionHeading
              title="Workspace status"
              description="Current feed state and top-line context from the live data layer."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="surface-soft rounded-[1.5rem] p-4">
                <p className="text-sm text-[color:var(--muted)]">Feed status</p>
                <div className="mt-3">
                  <Badge tone={isLoading ? 'warning' : 'success'}>{summary.feedState}</Badge>
                </div>
              </div>
              <div className="surface-soft rounded-[1.5rem] p-4">
                <p className="text-sm text-[color:var(--muted)]">Visible records</p>
                <p className="mt-3 text-xl font-semibold text-[color:var(--foreground)]">{opportunities.length}</p>
              </div>
              <div className="surface-soft rounded-[1.5rem] p-4">
                <p className="text-sm text-[color:var(--muted)]">Queued sectors</p>
                <p className="mt-3 text-sm text-[color:var(--foreground)]">{selectedCats.join(', ')}</p>
              </div>
              <div className="surface-soft rounded-[1.5rem] p-4">
                <p className="text-sm text-[color:var(--muted)]">Queued goals</p>
                <p className="mt-3 text-sm text-[color:var(--foreground)]">{selectedGoals.join(', ')}</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active sources" value={summary.activeSources} icon={Globe} />
        <MetricCard label="Raw signals" value={summary.rawSignals} icon={Zap} />
        <MetricCard label="Processed records" value={summary.processedSignals} icon={Sparkles} />
        <MetricCard label="Visible opportunities" value={opportunities.length} icon={Target} />
      </section>

      {error ? (
        <Card className="rounded-[1.75rem] border border-rose-500/20 bg-rose-500/10">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-rose-300" />
            <p className="text-sm leading-relaxed text-rose-200">{error}</p>
          </div>
        </Card>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-6">
          <Card className="rounded-[2rem]">
            <SectionHeading
              title="Opportunity feed"
              description="Structured records with cleaner density, clearer status chips, and safer action placement."
              action={
                <div className="flex flex-wrap items-center gap-2">
                  {activeFilters.length > 0 ? (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSectorFilter('');
                        setTypeFilter('');
                      }}
                    >
                      Clear filters
                    </Button>
                  ) : null}
                  <Badge tone="default">{opportunities.length} records</Badge>
                </div>
              }
            />

            <div className="mt-5 flex flex-wrap gap-2">
              {activeFilters.length > 0 ? activeFilters.map((filter) => <Badge key={filter.label} tone={filter.tone}>{filter.label}</Badge>) : <Badge tone="default">No active filters</Badge>}
            </div>

            {!isLoading && opportunities.length > 0 ? (
              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Opportunity</TableHeader>
                        <TableHeader>Category</TableHeader>
                        <TableHeader>Score</TableHeader>
                        <TableHeader>Source</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {opportunities.slice(0, 6).map((opp) => (
                        <TableRow key={`summary-${opp._id}`}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-[color:var(--foreground)]">{opp.title}</p>
                              <p className="mt-1 text-sm text-[color:var(--muted)]">{opp.location || 'Distributed'}</p>
                            </div>
                          </TableCell>
                          <TableCell>{opp.category || 'general'}</TableCell>
                          <TableCell>{opp.relevanceScore}%</TableCell>
                          <TableCell>{getHostLabel(opp.originalUrl)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : null}
          </Card>

          {isLoading ? (
            <Card className="rounded-[2rem]">
              <div className="flex min-h-[320px] items-center justify-center">
                <div className="space-y-4 text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[color:var(--primary)]" />
                  <p className="text-sm text-[color:var(--muted)]">Refreshing records...</p>
                </div>
              </div>
            </Card>
          ) : opportunities.length === 0 ? (
            <Card className="rounded-[2rem]">
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <h3 className="text-lg font-semibold text-[color:var(--foreground)]">No matching records</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[color:var(--muted)]">
                  Adjust the current filters or trigger a new scan to populate the dashboard with relevant opportunities.
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {opportunities.map((opp) => {
                  const isEntrepreneurial = opp.type?.toLowerCase() === 'entrepreneurial';

                  return (
                    <motion.div
                      key={opp._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="rounded-[2rem]">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                          <div className="flex min-w-0 flex-1 gap-4">
                            <div className="rounded-2xl bg-[rgba(255,77,141,0.16)] p-3 text-[color:var(--primary-glow)]">
                              {isEntrepreneurial ? <TrendingUp className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                            </div>
                            <div className="min-w-0 flex-1 space-y-4">
                              <div className="flex flex-wrap gap-2">
                                <Badge tone="primary">{opp.category || 'general'}</Badge>
                                <Badge tone={isEntrepreneurial ? 'warning' : 'success'}>{opp.type || 'signal'}</Badge>
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-lg font-semibold leading-relaxed text-[color:var(--foreground)]">{opp.title}</h3>
                                {opp.description ? (
                                  <p className="text-sm leading-relaxed text-[color:var(--muted)]">{opp.description}</p>
                                ) : null}
                              </div>
                              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <div>
                                  <p className="text-sm text-[color:var(--muted)]">Location</p>
                                  <p className="mt-2 text-sm text-[color:var(--foreground)]">{opp.location || 'Distributed'}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-[color:var(--muted)]">Relevance</p>
                                  <p className="mt-2 text-sm text-[color:var(--foreground)]">{opp.relevanceScore}% match</p>
                                </div>
                                <div>
                                  <p className="text-sm text-[color:var(--muted)]">Evidence</p>
                                  <p className="mt-2 text-sm text-[color:var(--foreground)]">{opp.proofLinks.length} links</p>
                                </div>
                                <div>
                                  <p className="text-sm text-[color:var(--muted)]">Source</p>
                                  <p className="mt-2 text-sm text-[color:var(--foreground)]">{getHostLabel(opp.originalUrl)}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 xl:w-[220px] xl:flex-col xl:items-stretch">
                            <a href={opp.originalUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                              <Button variant="ghost" className="w-full">
                                Inspect source
                                <ArrowUpRight className="h-4 w-4" />
                              </Button>
                            </a>
                            <Badge tone="default" className="justify-center xl:justify-center">
                              {opp.providerName || 'source'}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="rounded-[2rem]">
            <SectionHeading title="Filters" description="Refine the feed with reusable controls and consistent spacing." />
            <div className="mt-6 space-y-6">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-[color:var(--primary-glow)]" />
                  <p className="text-sm font-medium text-[color:var(--foreground)]">Sectors</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sectorOptions.map((cat) => (
                    <FilterChip key={cat || 'all'} active={sectorFilter === cat} onClick={() => setSectorFilter(cat)}>
                      {cat || 'All sectors'}
                    </FilterChip>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Radar className="h-4 w-4 text-[color:var(--primary-glow)]" />
                  <p className="text-sm font-medium text-[color:var(--foreground)]">Types</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {typeOptions.map((type) => (
                    <FilterChip key={type.id || 'all'} active={typeFilter === type.id} onClick={() => setTypeFilter(type.id)}>
                      {type.label}
                    </FilterChip>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-[2rem]">
            <SectionHeading title="System overview" description="Compact service context and current view state." />
            <div className="mt-6 space-y-4">
              <div className="surface-soft rounded-[1.5rem] p-4">
                <p className="text-sm text-[color:var(--muted)]">API health</p>
                <div className="mt-3">
                  <Badge tone="success">Active</Badge>
                </div>
              </div>
              <div className="surface-soft rounded-[1.5rem] p-4">
                <p className="text-sm text-[color:var(--muted)]">Selected sector</p>
                <p className="mt-3 text-sm text-[color:var(--foreground)]">{sectorFilter || 'All sectors'}</p>
              </div>
              <div className="surface-soft rounded-[1.5rem] p-4">
                <p className="text-sm text-[color:var(--muted)]">Selected type</p>
                <p className="mt-3 text-sm text-[color:var(--foreground)]">
                  {typeOptions.find((type) => type.id === typeFilter)?.label || 'All signals'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="rounded-[2rem]">
            <SectionHeading
              title="Navigation"
              description="Current route coverage in the refactored dashboard shell."
            />
            <div className="mt-6 space-y-3">
              <Link href="/" className="block rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-sm text-[color:var(--foreground)] transition-all duration-200 hover:scale-105 hover:bg-white/10">
                Return to overview
              </Link>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-sm text-[color:var(--muted)]">
                Detail and form workflows can now inherit this dashboard shell without changing the data layer.
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[2rem]">
          <SectionHeading title="Activity log" description="Recent workspace state changes derived from the current session." />
          <div className="mt-6 space-y-3">
            {recentLogItems.map((item) => (
              <div key={item} className="surface-soft rounded-[1.25rem] p-4 text-sm text-[color:var(--foreground)]">
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[2rem]">
          <SectionHeading title="Scan queue" description="Manual scan parameters and current queue state." />
          <div className="mt-6 grid gap-4">
            <div className="surface-soft rounded-[1.5rem] p-4">
              <p className="text-sm text-[color:var(--muted)]">Queued sectors</p>
              <p className="mt-3 text-sm text-[color:var(--foreground)]">{selectedCats.join(', ')}</p>
            </div>
            <div className="surface-soft rounded-[1.5rem] p-4">
              <p className="text-sm text-[color:var(--muted)]">Queued goals</p>
              <p className="mt-3 text-sm text-[color:var(--foreground)]">{selectedGoals.join(', ')}</p>
            </div>
            <div className="surface-soft rounded-[1.5rem] p-4">
              <p className="text-sm text-[color:var(--muted)]">State</p>
              <div className="mt-3">
                <Badge tone={isScanning ? 'warning' : 'success'}>{isScanning ? 'Running' : 'Ready'}</Badge>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <Modal
        open={isScanModalOpen}
        title="Scan configuration"
        description="Select sectors and goals, then trigger the existing backend scan workflow."
        onClose={() => setIsScanModalOpen(false)}
        closeDisabled={isScanning}
      >
        {isScanning ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <div className="space-y-4 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[color:var(--primary)]" />
              <p className="text-sm text-[color:var(--muted)]">Triggering scan...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-medium text-[color:var(--foreground)]">Sectors</p>
              <div className="flex flex-wrap gap-3">
                {['tech', 'agriculture', 'fintech', 'grants'].map((category) => (
                  <FilterChip
                    key={category}
                    active={selectedCats.includes(category)}
                    onClick={() =>
                      setSelectedCats((prev) =>
                        prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category],
                      )
                    }
                  >
                    {category}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-[color:var(--foreground)]">Goals</p>
              <div className="flex flex-wrap gap-3">
                {['jobs', 'entrepreneurial'].map((goal) => (
                  <FilterChip
                    key={goal}
                    active={selectedGoals.includes(goal)}
                    onClick={() =>
                      setSelectedGoals((prev) =>
                        prev.includes(goal) ? prev.filter((item) => item !== goal) : [...prev, goal],
                      )
                    }
                  >
                    {goal}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setIsScanModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleTriggerScan}>Run scan</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
