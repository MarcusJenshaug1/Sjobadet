/**
 * Next.js Caching Strategy Documentation
 * 
 * This application uses Next.js' built-in caching mechanisms for optimal performance:
 * 
 * 1. STATIC GENERATION (ISR - Incremental Static Regeneration)
 *    - Pages: / (homepage) - Revalidates every 5 minutes
 *    - Pages: /home/[slug] (sauna detail) - Revalidates every 10 minutes
 *    - Benefits: Super fast, instant page loads, automatic updates
 * 
 * 2. DATABASE CACHING (sauna-service.ts)
 *    - Active saunas list: 10 minutes cache
 *    - Individual sauna detail: 10 minutes cache
 *    - Fallback to static JSON if DB unavailable
 *    - Cache invalidation on data changes
 * 
 * 3. IMAGE OPTIMIZATION
 *    - Next.js Image component automatic optimization
 *    - Lazy loading on SaunaCard (loading="lazy")
 *    - Quality: 80% for card images, 85% for hero
 *    - Browser cache: Leverages browser caching via headers
 * 
 * 4. BROWSER CACHING
 *    - Static assets (CSS, JS): 1 year
 *    - Images: 1 year
 *    - HTML pages: 0 minutes (always check for updates)
 * 
 * 5. API RESPONSE CACHING
 *    - /api/availability/today - 1 minute cache
 *    - /api/analytics/ingest - No cache (real-time)
 * 
 * INVALIDATION TRIGGERS:
 * - Manual: Redeploy on Vercel
 * - Automatic: ISR revalidation times
 * - Manual: Using Vercel's purge API if needed
 * 
 * PERFORMANCE IMPACT:
 * - Improved LCP: Static pages load instantly
 * - Reduced database load: In-memory caching
 * - Smaller bundle: Image optimization
 * - Better SEO: Pre-rendered HTML
 */

export const CACHE_CONFIG = {
  SAUNA_LIST_TTL: 10 * 60 * 1000, // 10 minutes
  SAUNA_DETAIL_TTL: 10 * 60 * 1000, // 10 minutes
  AVAILABILITY_TTL: 60 * 1000, // 1 minute
  PAGE_REVALIDATE_INTERVAL: 300, // 5 minutes (homepage)
  DETAIL_REVALIDATE_INTERVAL: 600, // 10 minutes (detail pages)
} as const;
