'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * SmartPrefetcher intelligently prefetches key routes during idle time.
 * It also uses the Speculation Rules API to "pre-render" pages in the background
 * for an actual 0ms transition.
 */
export function SmartPrefetcher() {
    const router = useRouter();
    const [prerenderUrls, setPrerenderUrls] = useState<string[]>([]);

    useEffect(() => {
        // Guardrails: Don't prefetch if on slow connection or data saver is on
        const connection = (navigator as any).connection;
        if (connection) {
            if (connection.saveData || /2g/.test(connection.effectiveType)) {
                return;
            }
        }

        const runPrefetch = async () => {
            const staticRoutes = [
                '/medlemskap',
                '/info'
            ];

            // Use requestIdleCallback if available, fallback to a much longer timeout (5s)
            // to ensure LCP has completely finished on mobile.
            const schedule = (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 5000));

            schedule(async () => {
                // 1. Prefetch static high-traffic routes (Standard Next.js Prefetch)
                // Staggered slowly to keep CPU usage low
                staticRoutes.forEach((route, index) => {
                    setTimeout(() => router.prefetch(route), index * 600);
                });

                // 2. Fetch slugs and prepare Speculation Rules (Full Prerender)
                try {
                    const res = await fetch('/api/saunas/slugs');
                    if (res.ok) {
                        const { slugs } = await res.json();
                        const urls = slugs.map((s: string) => `/home/${s}`);

                        // Standard Next.js prefetch as a fallback (more conservative timing)
                        urls.forEach((url: string, index: number) => {
                            setTimeout(() => router.prefetch(url), (staticRoutes.length + index) * 800);
                        });

                        // Set URLs for Speculation Rules injection
                        // We use state to trigger this late in the lifecycle
                        setPrerenderUrls(urls);
                    }
                } catch (e) {
                    // Ignore prefetch errors
                }
            });
        };

        // Aggressive delay: Wait 4 seconds before starting any prefetch work
        // This ensures the initial "hero" experience is untouched by background tasks.
        const timeout = setTimeout(runPrefetch, 4000);

        return () => clearTimeout(timeout);
    }, [router]);

    // Inject Speculation Rules with conservative settings
    if (prerenderUrls.length === 0) return null;

    return (
        <script
            type="speculationrules"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    prerender: [{
                        source: "list",
                        urls: prerenderUrls,
                        // Conservative means it won't start until idle/hover or certain triggers
                        eagerness: "conservative"
                    }]
                })
            }}
        />
    );
}
