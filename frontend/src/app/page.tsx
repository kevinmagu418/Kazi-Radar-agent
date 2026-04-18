import Link from 'next/link';
import { ArrowRight, BellRing, BriefcaseBusiness, Radar, SearchCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const featureCards = [
  {
    title: 'Unified signal intake',
    description: 'Jobs, grants, and venture opportunities land in one review surface with consistent metadata.',
    icon: Radar,
  },
  {
    title: 'Evidence-aware review',
    description: 'Inspect source links, relevance score, and provider context without leaving the main flow.',
    icon: SearchCheck,
  },
  {
    title: 'Fast operator controls',
    description: 'Trigger new scans, monitor feed health, and manage filtering from a premium SaaS workspace.',
    icon: BellRing,
  },
];

const stats = [
  { label: 'Coverage', value: 'Jobs, grants, founder leads' },
  { label: 'Review model', value: 'Score + proof link workflow' },
  { label: 'Operator control', value: 'Manual scan execution' },
];

export default function LandingPage() {
  return (
    <main className="dashboard-bg min-h-screen px-4 py-6 lg:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col gap-6">
        <header className="surface-panel fade-in flex flex-col gap-4 rounded-[2rem] p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] text-lg font-semibold text-[#0f0f14]">
              OS
            </div>
            <div>
              <p className="text-lg font-semibold text-[color:var(--foreground)]">Opportunity Scanner</p>
              <p className="text-sm text-[color:var(--muted)]">Modern intelligence workspace</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="primary">Dark SaaS UI</Badge>
            <Link href="/dashboard">
              <Button>
                Open dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="fade-in rounded-[2rem] p-6 lg:p-8">
            <div className="max-w-3xl space-y-6">
              <Badge tone="primary">Opportunity Intelligence</Badge>
              <div className="space-y-4">
                <h1 className="text-2xl font-semibold leading-relaxed text-[color:var(--foreground)] lg:text-[2rem]">
                  A calmer dashboard for reviewing signals, running scans, and keeping sourcing operations visible.
                </h1>
                <p className="text-base leading-relaxed text-[color:var(--muted)]">
                  The frontend is now structured like a premium product workspace: stronger hierarchy, cleaner density, and a
                  layout built for continuous review instead of one-off browsing.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard">
                  <Button>
                    Launch workspace
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost">Premium dark system</Button>
              </div>
            </div>
          </Card>

          <Card className="fade-in rounded-[2rem] p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[rgba(255,77,141,0.18)] p-3 text-[color:var(--primary-glow)]">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[color:var(--foreground)]">Platform snapshot</h2>
                  <p className="text-sm text-[color:var(--muted)]">Built around the current data flow and scan workflow.</p>
                </div>
              </div>

              <div className="space-y-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="surface-soft rounded-[1.5rem] p-4">
                    <p className="text-sm text-[color:var(--muted)]">{stat.label}</p>
                    <p className="mt-2 text-base font-medium text-[color:var(--foreground)]">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="fade-in rounded-[2rem]">
              <div className="mb-4 inline-flex rounded-2xl bg-[rgba(255,77,141,0.16)] p-3 text-[color:var(--primary-glow)]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-[color:var(--foreground)]">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">{description}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="fade-in rounded-[2rem]">
            <div className="space-y-4">
              <Badge tone="default">Why this refactor</Badge>
              <h2 className="text-xl font-semibold text-[color:var(--foreground)]">Designed for daily dashboard use</h2>
              <p className="text-sm leading-relaxed text-[color:var(--muted)]">
                The visual system now standardizes surface treatment, spacing, typography, and interaction states so new routes
                can reuse the same shell without design drift.
              </p>
            </div>
          </Card>

          <Card className="fade-in rounded-[2rem]">
            <div className="grid gap-4 md:grid-cols-3">
              {['Dashboard shell', 'Reusable cards and table', 'Responsive controls'].map((item) => (
                <div key={item} className="surface-soft rounded-[1.5rem] p-4">
                  <Sparkles className="h-5 w-5 text-[color:var(--primary-glow)]" />
                  <p className="mt-4 text-base font-medium text-[color:var(--foreground)]">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
