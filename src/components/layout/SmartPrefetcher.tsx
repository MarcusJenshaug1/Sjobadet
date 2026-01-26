'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * SmartPrefetcher intelligently prefetches key routes during idle time.
 * It respects connection quality and data saver settings.
 */
export function SmartPrefetcher() {
    const router = useRouter();

    useEffect(() => {
        // Guardrails: Don't prefetch if on slow connection or data saver is on
        const connection = (navigator as any).connection;
        if (connection) {
            if (connection.saveData || /2g/.test(connection.effectiveType)) {
                return;
            }
        }

        const prefetchRoutes = [
            '/home/tbg_brygge', // Highly likely next steps
            '/home/hjemseng_brygge',
            '/medlemskap',
            '/info'
        ];

        const runPrefetch = () => {
            // Use requestIdleCallback if available, fallback to timeout
            const schedule = (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 2000));

            schedule(() => {
                prefetchRoutes.forEach((route, index) => {
                    // Stagger prefetching to avoid burst network activity
                    setTimeout(() => {
                        try {
                            router.prefetch(route);
                        } catch (e) {
                            // Ignore prefetch errors
                        }
                    }, index * 500);
                });
            });
        };

        // Wait a bit after mount to let the main thread settle
        const timeout = setTimeout(runPrefetch, 3000);

        return () => clearTimeout(timeout);
    }, [router]);

    return null;
}
