# KaziRadar SEO Audit Report

**Date:** June 3, 2026
**Project:** KaziRadar (AI-powered opportunity intelligence platform)
**Framework:** Next.js 15+ (App Router)

## 1. Current SEO State

### 1.1 Metadata
- **Title:** "Kaziradar" (Basic, needs better keyword targeting)
- **Description:** "Your personal AI scout for discovering jobs, grants, and entrepreneurial opportunities." (Good, but could be optimized)
- **Icons:** Basic favicon implementation.
- **Missing:** OpenGraph tags, Twitter cards, keywords, authors, robots directives.

### 1.2 Technical SEO
- **Sitemap:** Missing (`sitemap.xml` / `sitemap.ts`).
- **Robots.txt:** Missing (`robots.txt` / `robots.ts`).
- **Canonical URLs:** Not implemented.
- **Structured Data (JSON-LD):** Missing Organization, WebSite, and SoftwareApplication schemas.
- **Heading Structure:** 
  - Landing page has H1, H2, and H4. 
  - Need to ensure every page has a unique H1.
- **Semantic HTML:** Good use of `<nav>`, `<main>`, `<section>`, and `<footer>`.
- **URL Structure:** App Router used, but needs canonical tag management.

### 1.3 Performance & Optimization
- **Images:** Using `next/image` which is excellent. Alt tags are present but could be more keyword-rich.
- **Fonts:** Using `next/font/google` (Poppins), which is optimized.
- **Hydration:** Landing page is `'use client'`, which might impact SEO if content grows. Consider moving static sections to server components.

### 1.4 Social Sharing
- **OG Tags:** Missing.
- **Twitter Tags:** Missing.
- **Preview Images:** No dedicated social sharing images defined in metadata.

## 2. SEO Score (Estimated)
- **Technical SEO:** 30/100
- **Content Optimization:** 45/100
- **Mobile Friendliness:** 90/100 (Responsive design is strong)
- **Performance:** 85/100 (Next.js defaults)

**Overall Estimated Score: 50/100**

## 3. Quick Wins
1.  Implement `app/robots.ts` and `app/sitemap.ts`.
2.  Add global OpenGraph and Twitter metadata in `layout.tsx`.
3.  Implement JSON-LD Organization and SoftwareApplication schema.
4.  Define a keyword-rich title template.

## 4. High-Impact Fixes
1.  **Dynamic Metadata:** Ensure every route has unique metadata.
2.  **Canonical URLs:** Prevent duplicate content issues.
3.  **AI Discovery Optimization:** Add `ld+json` for AI crawlers (Perplexity, ChatGPT).
4.  **Keyword Strategy:** Align page titles and headings with high-volume search terms.

---
*Audit performed by Gemini CLI SEO Agent.*
