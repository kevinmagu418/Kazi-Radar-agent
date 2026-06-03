import { Metadata } from 'next';
import LandingClient from './LandingClient';
import { SEO_CONFIG } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: SEO_CONFIG.defaultTitle,
  description: SEO_CONFIG.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.description,
    url: SEO_CONFIG.siteUrl,
    images: [
      {
        url: SEO_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: 'KaziRadar - AI Opportunity Scout',
      },
    ],
  },
};

export default function Page() {
  return <LandingClient />;
}
