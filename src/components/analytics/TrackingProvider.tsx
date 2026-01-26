'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageview, getConsent, ConsentChoices } from '@/lib/analytics/tracking';
import dynamic from 'next/dynamic';

const ConsentBanner = dynamic(() => import('./ConsentBanner').then(mod => mod.ConsentBanner), {
    ssr: false, // Ensure it only loads on the client
});

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
    const [consent, setConsentState] = useState<ConsentChoices | null>(() => {
        if (typeof window === 'undefined') return null;
        return getConsent();
    });
    const [showBanner, setShowBanner] = useState(() => {
        if (typeof window === 'undefined') return false;
        const initialConsent = getConsent();
        return !initialConsent && !isAdmin;
    });
    const pathname = usePathname();

    useEffect(() => {
        // Global flag for tracking SDK
        if (typeof window !== 'undefined') {
            window.SJOBADET_IS_ADMIN = isAdmin;
        }

        // Listen for internal consent updates
        const handleConsentChange = (e: Event) => {
            const customEvent = e as CustomEvent<ConsentChoices>;
            setConsentState(customEvent.detail);
        };

        window.addEventListener('consentChange', handleConsentChange);
        return () => window.removeEventListener('consentChange', handleConsentChange);
    }, [isAdmin, consent]);

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
            {/* Always render ConsentBanner so the event listener is active, even for admins */}
            <ConsentBanner />
        </TrackingContext.Provider>
    );
}

export const useTracking = () => {
    const context = useContext(TrackingContext);
    if (!context) throw new Error('useTracking must be used within a TrackingProvider');
    return context;
};
