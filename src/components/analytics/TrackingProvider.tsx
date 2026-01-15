'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageview, getConsent, ConsentChoices } from '@/lib/analytics/tracking';
import { ConsentBanner } from './ConsentBanner';

const TrackingContext = createContext<{
    consent: ConsentChoices | null;
    showBanner: boolean;
    setShowBanner: (val: boolean) => void;
} | undefined>(undefined);

/**
 * TrackingProvider wraps the app to:
 * 1. Initialize consent state from cookies.
 * 2. Automatically track pageviews on route changes (if consented).
 * 3. Provide a way for child components to interact with consent.
 */
export function TrackingProvider({ children, isAdmin }: { children: React.ReactNode; isAdmin: boolean }) {
    const [consent, setConsentState] = useState<ConsentChoices | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Set a global flag for the tracking SDK to check
        if (typeof window !== 'undefined') {
            (window as any).SJOBADET_IS_ADMIN = isAdmin;
        }

        // Initial load: check for consent
        const c = getConsent();
        setConsentState(c);

        // Only show banner if no consent has been set yet AND user is not an admin
        if (!c && !isAdmin) {
            setShowBanner(true);
        }

        // Listen for internal consent updates
        const handleConsentChange = (e: any) => {
            setConsentState(e.detail);
        };

        window.addEventListener('consentChange', handleConsentChange);
        return () => window.removeEventListener('consentChange', handleConsentChange);
    }, [isAdmin]);

    // Automatic Pageview Tracking
    useEffect(() => {
        // Skip tracking for admins or internal admin pages
        if (isAdmin) {
            return;
        }

        // We only track pageviews if user has given 'analysis' consent
        if (consent?.analysis) {
            trackPageview(pathname);
        }
    }, [pathname, consent?.analysis, isAdmin]);

    return (
        <TrackingContext.Provider value={{ consent, showBanner, setShowBanner }}>
            {children}
            {!isAdmin && <ConsentBanner />}
        </TrackingContext.Provider>
    );
}

export const useTracking = () => {
    const context = useContext(TrackingContext);
    if (!context) throw new Error('useTracking must be used within a TrackingProvider');
    return context;
};
