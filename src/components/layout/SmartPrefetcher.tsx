'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface NetworkInformation {
    saveData?: boolean;
    effectiveType?: string;
}

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
        const nav = navigator as unknown as { connection?: NetworkInformation };
        const connection = nav.connection;
        if (connection) {
            if (connection.saveData || (connection.effectiveType && /2g/.test(connection.effectiveType))) {
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
            type IdleCallback = (cb: () => void) => void;
            const schedule = (window as unknown as { requestIdleCallback?: IdleCallback }).requestIdleCallback ||
                ((cb: () => void) => setTimeout(cb, 5000));

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
                        const { slugs } = await res.json() as { slugs: string[] };
                        const urls = slugs.map((s) => `/home/${s}`);

                        // Standard Next.js prefetch as a fallback (more conservative timing)
                        urls.forEach((url, index) => {
                            setTimeout(() => router.prefetch(url), (staticRoutes.length + index) * 800);
                        });

                        // Set URLs for Speculation Rules injection
                        // We use state to trigger this late in the lifecycle
                        setPrerenderUrls(urls);
                    }
                } catch {
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
