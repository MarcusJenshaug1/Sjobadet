import { nanoid } from 'nanoid';

const SESSION_KEY = 'sjobadet_session';
const CONSENT_KEY = 'sjobadet_consent';
const CONSENT_VERSION = 'v1'; // Audit finding #3: Versioning

export interface ConsentChoices {
    essential: boolean;
    analysis: boolean;
    marketing: boolean;
    functional: boolean;
    version: string;
    timestamp: number;
}

/**
 * Retrieve current consent from cookies. 
 */
export const getConsent = (): ConsentChoices | null => {
    if (typeof window === 'undefined') return null;
    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${CONSENT_KEY}=`));

    if (!cookie) return null;
    try {
        const consent = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
        // Audit finding #3: Check if version is outdated
        if (consent.version !== CONSENT_VERSION) return null;
        return consent;
    } catch {
        return null;
    }
};

/**
 * Persist consent choices to a long-lived cookie.
 */
export const setConsent = (choices: Partial<ConsentChoices>) => {
    const fullChoices: ConsentChoices = {
        essential: true, // Always required
        analysis: choices.analysis ?? false,
        marketing: choices.marketing ?? false,
        functional: choices.functional ?? false,
        version: CONSENT_VERSION,
        timestamp: Date.now(),
    };

    const value = encodeURIComponent(JSON.stringify(fullChoices));
    // Set cookie for 1 year, samesite lax
    document.cookie = `${CONSENT_KEY}=${value}; path=/; max-age=${365 * 24 * 60 * 60}; samesite=lax; secure`;

    // Broadcast change for components to react (e.g. TrackingProvider)
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('consentChange', { detail: fullChoices }));
    }
    return fullChoices;
};

/**
 * Audit finding #4: Stable session and UTM attribution using cookies (24h)
 */
interface SessionData {
    id: string;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
    referrer: string | null;
}

const getSessionData = (): SessionData => {
    if (typeof window === 'undefined') return { id: '', utmSource: null, utmMedium: null, utmCampaign: null, referrer: null };

    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${SESSION_KEY}=`));

    if (cookie) {
        try {
            return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
        } catch (e) { }
    }

    // New session: capture initial attribution
    const searchParams = new URLSearchParams(window.location.search);
    const data: SessionData = {
        id: nanoid(),
        utmSource: searchParams.get('utm_source'),
        utmMedium: searchParams.get('utm_medium'),
        utmCampaign: searchParams.get('utm_campaign'),
        referrer: document.referrer || null,
    };

    // Save for 24 hours
    const value = encodeURIComponent(JSON.stringify(data));
    document.cookie = `${SESSION_KEY}=${value}; path=/; max-age=${24 * 60 * 60}; samesite=lax; secure`;

    return data;
};

/**
 * Core track function. Checks for analysis consent before sending.
 */
export async function track(type: 'pageview' | 'event', data: {
    eventName?: string;
    path?: string;
    payload?: any;
}) {
    // Skip tracking for admin sessions to keep analytics clean from internal activity
    if (typeof window !== 'undefined' && (window as any).SJOBADET_IS_ADMIN) {
        return;
    }

    // Only track if analysis is allowed by user
    const consent = getConsent();
    if (!consent?.analysis) return;

    const session = getSessionData();
    const sessionId = session.id;
    const path = data.path || (typeof window !== 'undefined' ? window.location.pathname : '');

    try {
        await fetch('/api/analytics/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId,
                type,
                eventName: data.eventName,
                path,
                payload: data.payload,
                // Audit finding #4: Use frozen session attribution
                metadata: {
                    utmSource: session.utmSource,
                    utmMedium: session.utmMedium,
                    utmCampaign: session.utmCampaign,
                }
            }),
            // Use keepalive for better reliability during navigation
            keepalive: true,
        });
    } catch (e) {
        // Silent fail - analytics should never block the main app
    }
}

/**
 * Convenience helpers for tracking.
 */
export const trackPageview = (path?: string) => track('pageview', { path });
export const trackEvent = (eventName: string, payload?: any) => track('event', { eventName, payload });

/**
 * Specifically for tracking consent choices anonymously.
 * Bypasses the consent check since it's the action of giving/denying consent itself.
 * Does NOT send a sessionId to ensure total anonymity.
 */
export async function trackConsentChoice(choice: 'accepted' | 'declined' | 'custom') {
    // Skip tracking for admin sessions
    if (typeof window !== 'undefined' && (window as any).SJOBADET_IS_ADMIN) {
        return;
    }

    try {
        await fetch('/api/analytics/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'event',
                eventName: 'consent_choice',
                payload: { choice },
                path: typeof window !== 'undefined' ? window.location.pathname : '',
                metadata: {} // No UTMs or session bits for extra privacy
            }),
            keepalive: true,
        });
    } catch (e) { }
}
