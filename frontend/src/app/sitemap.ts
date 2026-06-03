import { MetadataRoute } from 'next';
import { SEO_CONFIG } from '@/lib/seo-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/login',
    '/signup',
  ].map((route) => ({
    url: `${SEO_CONFIG.siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // In a real application, you would also fetch dynamic routes here
  // e.g., opportunities, blog posts, etc.
  
  return [...routes];
}
