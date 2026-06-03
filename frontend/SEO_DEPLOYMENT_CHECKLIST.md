# SEO Deployment & Discoverability Checklist

## 1. Search Console & Webmaster Tools
- [ ] Verify ownership on [Google Search Console](https://search.google.com/search-console).
- [ ] Submit `sitemap.xml` to Google Search Console.
- [ ] Verify ownership on [Bing Webmaster Tools](https://www.bing.com/webmasters).
- [ ] Submit `sitemap.xml` to Bing.

## 2. Technical SEO Validation
- [ ] Test `robots.txt` validity.
- [ ] Run a [Lighthouse Audit](https://web.dev/measure/) on the production URL.
- [ ] Validate JSON-LD Schema using [Schema Markup Validator](https://validator.schema.org/).
- [ ] Check for broken links using a crawler (e.g., Screaming Frog).
- [ ] Ensure all images have descriptive `alt` tags.

## 3. Social Media Optimization
- [ ] Test OpenGraph tags with [Open Graph Check](https://opengraph.dev/).
- [ ] Validate Twitter Cards with [Twitter Card Validator](https://cards-dev.twitter.com/validator).
- [ ] Test sharing on LinkedIn using [Post Inspector](https://www.linkedin.com/post-inspector/).
- [ ] Ensure the high-resolution OG image (Cloudinary) loads correctly.

## 4. Performance & Core Web Vitals
- [ ] Check Largest Contentful Paint (LCP) < 2.5s.
- [ ] Check Cumulative Layout Shift (CLS) < 0.1.
- [ ] Ensure all fonts are loaded with `swap` or optimized via `next/font`.
- [ ] Verify image compression and lazy loading.

## 5. Geo & AI Search Readiness
- [ ] Confirm Organization schema includes location/region if applicable.
- [ ] Ensure high-value content sections are not hidden behind `use client` without SSR support.
- [ ] Check if `ld+json` is correctly identifying KaziRadar as a `SoftwareApplication`.

## 6. Domain Migration Strategy
- [ ] If changing domains: Set up 301 redirects from the old domain to the new one.
- [ ] Update `NEXT_PUBLIC_SITE_URL` in environment variables.
- [ ] Update Google Search Console with the new domain.
- [ ] Update all social media profiles.
