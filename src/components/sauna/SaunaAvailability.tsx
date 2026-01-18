'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './SaunaAvailability.module.css';

interface ScrapedSlot {
    from: string;
    to: string;
    availableSpots: number;
}

interface AvailabilityResponse {
    date: string | null;
    slots: ScrapedSlot[];
    timestamp: string | null;
    isInitial?: boolean;
}

interface SaunaAvailabilityProps {
    saunaId: string;
    bookingUrlDropin?: string | null;
    bookingUrlPrivat?: string | null;
    capacityDropin: number;
    isAdmin?: boolean;
    showAvailability?: boolean;
}

export default function SaunaAvailability({
    saunaId,
    bookingUrlDropin,
    bookingUrlPrivat,
    capacityDropin = 10,
    isAdmin = false,
    showAvailability = true
}: SaunaAvailabilityProps) {
    const [data, setData] = useState<AvailabilityResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(false);
    const [onlyAvailable, setOnlyAvailable] = useState(true);
    const hasDataRef = useRef(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchData = useCallback(async (force = false, silent = false) => {
        if (showAvailability === false) {
            setLoading(false);
            return;
        }
        setError(false); // Reset error state to show loading UI if needed
        if (!silent) setLoading(true);
        if (silent) setRefreshing(true);

        try {
            // Support external Azure API if configured
            const externalApiUrl = process.env.NEXT_PUBLIC_AVAILABILITY_API_URL;
            const url = externalApiUrl
                ? `${externalApiUrl}?saunaId=${saunaId}${force ? '&force=true' : ''}`
                : `/api/availability/today?saunaId=${saunaId}${force ? '&force=true' : ''}`;

            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch');
            const json = await res.json();

            if (json.isInitial && !hasDataRef.current) {
                // Keep loading if first fetch only returns "initial" placeholder
                setLoading(true);
            } else {
                const now = new Date();
                const currentTime = now.getHours() * 60 + now.getMinutes();

                const filteredSlots = (json.slots || []).filter((s: ScrapedSlot) => {
                    try {
                        // Try to parse 'to' time, but fallback to 'from' time if needed
                        const timeToParse = s.to || s.from;
                        if (!timeToParse) return true; // Keep it if we can't parse time

                        const parts = timeToParse.split(/[:.]/).map(Number);

                        if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) {
                            return true; // Keep it if we can't parse time
                        }

                        const slotTimeMinutes = parts[0] * 60 + parts[1];
                        // If we are using 'to' time, show if it hasn't ended.
                        // If we fallback to 'from' time, show if it hasn't started.
                        return slotTimeMinutes > (s.to ? currentTime : currentTime - 30);
                    } catch (e) {
                        console.error('Error parsing slot time:', e, s);
                        return true;
                    }
                });

                setData({ ...json, slots: filteredSlots });
                hasDataRef.current = true;
                setLoading(false);
            }
            setError(false);
        } catch (err) {
            console.error('Error fetching availability:', err);
            if (!hasDataRef.current) setError(true);
        } finally {
            setRefreshing(false);
        }
    }, [saunaId, showAvailability]);

    useEffect(() => {
        if (showAvailability === false) {
            setLoading(false);
            return;
        }

        // Reset state for new sauna
        hasDataRef.current = false;
        setData(null);
        setError(false);

        fetchData();

        // Refresh every 10 minutes, but DON'T force a re-scrape (rely on server cache)
        const interval = setInterval(() => fetchData(false, true), 1000 * 60 * 10);
        return () => clearInterval(interval);
    }, [saunaId, showAvailability, fetchData]);

    if (!showAvailability) {
        return null;
    }

    if (loading && !data && !error) {
        return (
            <div className={styles.container}>
                <div style={{ padding: '0 0.5rem 1rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 'bold' }}>Henter ledighet...</p>
                    <p style={{ fontSize: '0.625rem', color: '#a0aec0' }}>Dette kan ta litt tid første gang</p>
                </div>
                <div className={styles.grid}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className={styles.slotCard} style={{ backgroundColor: '#f7fafc', minHeight: '50px', animation: 'refreshPulse 2s infinite' }} />
                    ))}
                </div>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    Klarte ikke hente ledighet.
                    <button onClick={() => fetchData()} className={styles.retryButton}>Prøv igjen</button>
                </div>
            </div>
        );
    }

    // Filter available slots
    const availableSlots = data?.slots.filter(s => !onlyAvailable || s.availableSpots > 0) || [];
    const currentData = data || { date: null, slots: [], timestamp: null };

    // Find next available slot
    const nextSlot = currentData.slots.find(s => s.availableSpots > 0);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <div className={styles.titleWrapper}>
                        <h3 className={styles.title}>Ledighet i dag</h3>
                        <div className={styles.badge} title="Denne hentes automatisk hvert 10. minutt">
                            <div className={refreshing ? styles.dotRefreshing : styles.dot} />
                            <span className={styles.badgeText}>
                                {refreshing ? 'Henter...' : 'Live-status'}
                            </span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {(mounted && currentData.timestamp) && (
                            <p className={styles.updatedAt}>
                                Oppdatert {new Date(currentData.timestamp).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        )}
                        {/* MIDLERTIDIG DEBUG KNAPP - KUN FOR ADMINS */}
                        {isAdmin && (
                            <button
                                onClick={() => fetchData(true, true)}
                                disabled={refreshing}
                                title="Denne knappen er kun synlig for deg som er admin"
                                style={{
                                    fontSize: '10px',
                                    padding: '2px 6px',
                                    background: '#edf2f7',
                                    border: '1px solid #cbd5e0',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    opacity: refreshing ? 0.5 : 1
                                }}
                            >
                                {refreshing ? 'Henter...' : 'DEBUG: Force Scrape'}
                            </button>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => setOnlyAvailable(!onlyAvailable)}
                    className={`${styles.toggleButton} ${onlyAvailable ? styles.toggleActive : ''}`}
                >
                    {onlyAvailable ? 'Vis alle timer' : 'Vis bare ledige'}
                </button>
            </div>

            {nextSlot && (
                <div className={styles.nextSlot}>
                    <div className={styles.nextDot} />
                    <span className={styles.nextText}>
                        Neste ledige: <span className={styles.nextTime}>{nextSlot.from}</span>
                    </span>
                </div>
            )}

            <div className={styles.grid}>
                {availableSlots.length > 0 ? (
                    availableSlots.map((slot, i) => (
                        <SlotCard
                            key={i}
                            slot={slot}
                            totalCapacity={capacityDropin}
                            baseBookingUrl={bookingUrlDropin}
                        />
                    ))
                ) : (
                    <div className={styles.empty}>
                        <p className={styles.emptyText}>Ingen ledige timer funnet akkurat nå</p>
                        <button onClick={() => fetchData(true)} className={styles.retryButton} style={{ marginTop: '0.5rem' }}>
                            Oppdater status
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function SlotCard({ slot, totalCapacity, baseBookingUrl }: { slot: ScrapedSlot, totalCapacity: number, baseBookingUrl?: string | null }) {
    const isFull = slot.availableSpots === 0;
    const availablePlaces = slot.availableSpots;

    let stateClass = styles.stateMany;
    const availablePercentage = totalCapacity > 0 ? (availablePlaces / totalCapacity) : 0;

    if (isFull) {
        stateClass = styles.stateFull;
    } else if (availablePercentage <= 0.7) {
        stateClass = styles.stateFew;
    }

    // Construct booking link: [Base URL]/[YYYY-MM-DD]/[HH:MM]
    let bookingLink = '';
    if (baseBookingUrl && baseBookingUrl.includes('periode.no') && !isFull) {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeStr = slot.from; // HH:MM

        const cleanBase = baseBookingUrl.endsWith('/') ? baseBookingUrl.slice(0, -1) : baseBookingUrl;
        bookingLink = `${cleanBase}/${dateStr}/${timeStr}`;
    }

    const cardContent = (
        <>
            <span className={styles.slotTime}>{slot.from}</span>
            <span className={styles.slotCapacity}>
                {isFull ? 'Fullt' : `${availablePlaces} plasser`}
            </span>
        </>
    );

    if (bookingLink) {
        return (
            <a
                href={bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.slotCard} ${styles.slotCardClickable} ${stateClass}`}
            >
                {cardContent}
            </a>
        );
    }

    return (
        <div className={`${styles.slotCard} ${stateClass}`}>
            {cardContent}
        </div>
    );
}
