'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './SaunaAvailability.module.css';

interface ScrapedSlot {
    from: string;
    to: string;
    availableSpots: number;
}

interface AvailabilityArea {
    days?: Record<string, ScrapedSlot[]>;
    timestamp: string | null;
    isInitial?: boolean;
    displaySlots?: ScrapedSlot[];
    displayDate?: string;
}

interface SaunaAvailabilityProps {
    saunaId: string;
    bookingUrlDropin?: string | null;
    capacityDropin: number;
    isAdmin?: boolean;
    showAvailability?: boolean;
}

export default function SaunaAvailability({
    saunaId,
    bookingUrlDropin,
    capacityDropin = 10,
    isAdmin = false,
    showAvailability = true
}: SaunaAvailabilityProps) {
    const [data, setData] = useState<AvailabilityArea | null>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(false);
    const [onlyAvailable, setOnlyAvailable] = useState(true);
    const hasDataRef = useRef(false);
    const [mounted, setMounted] = useState(false);
    const abortRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(false);
    const loaderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setMounted(true);
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
            abortRef.current?.abort();
            if (loaderTimeoutRef.current) {
                clearTimeout(loaderTimeoutRef.current);
                loaderTimeoutRef.current = null;
            }
        };
    }, []);

    const fetchData = useCallback(async (force = false, silent = false) => {
        if (showAvailability === false) {
            setLoading(false);
            if (loaderTimeoutRef.current) {
                clearTimeout(loaderTimeoutRef.current);
                loaderTimeoutRef.current = null;
            }
            return;
        }
        if (isMountedRef.current) setError(false);
        if (!silent) {
            if (!hasDataRef.current) {
                if (loaderTimeoutRef.current) {
                    clearTimeout(loaderTimeoutRef.current);
                }
                loaderTimeoutRef.current = setTimeout(() => {
                    if (isMountedRef.current && !hasDataRef.current) {
                        setLoading(true);
                    }
                    loaderTimeoutRef.current = null;
                }, 250);
            } else {
                setLoading(false);
            }
        }
        if (silent) setRefreshing(true);

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            // Support external Azure API if configured
            const externalApiUrl = process.env.NEXT_PUBLIC_AVAILABILITY_API_URL;
            const url = externalApiUrl
                ? `${externalApiUrl}?saunaId=${saunaId}${force ? '&force=true' : ''}`
                : `/api/availability/today?saunaId=${saunaId}${force ? '&force=true' : ''}`;

            const res = await fetch(url, {
                cache: 'no-store',
                signal: controller.signal,
            });
            if (!res.ok) throw new Error('Failed to fetch');
            const json = await res.json() as AvailabilityArea;

            if (json.isInitial && !hasDataRef.current) {
                // Keep loading if first fetch only returns "initial" placeholder
                if (isMountedRef.current) setLoading(true);
            } else {
                const now = new Date();
                const currentTime = now.getHours() * 60 + now.getMinutes();

                const getDateKey = (offsetDays = 0) => {
                    const target = new Date(now);
                    target.setDate(now.getDate() + offsetDays);
                    const parts = new Intl.DateTimeFormat('sv-SE', {
                        timeZone: 'Europe/Oslo',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    }).formatToParts(target);

                    const year = parts.find(p => p.type === 'year')?.value ?? '';
                    const month = parts.find(p => p.type === 'month')?.value ?? '';
                    const day = parts.find(p => p.type === 'day')?.value ?? '';
                    return `${year}-${month}-${day}`;
                };

                const todayStr = getDateKey(0);
                const tomorrowStr = getDateKey(1);

                let slotsToShow: ScrapedSlot[] = [];
                let activeDate = todayStr;

                if (json.days) {
                    const dayKeys = Object.keys(json.days).sort();

                    const pickDateKey = () => {
                        if (dayKeys.includes(todayStr)) return todayStr;
                        const future = dayKeys.find((d) => d >= todayStr);
                        if (future) return future;
                        return dayKeys[dayKeys.length - 1];
                    };

                    const targetDate = pickDateKey();
                    const targetSlots = json.days[targetDate] || [];

                    if (targetDate === todayStr) {
                        const filteredToday = targetSlots.filter((s: ScrapedSlot) => {
                            const parts = (s.from).split(/[:.]/).map(Number);
                            const slotStartTime = parts[0] * 60 + parts[1];
                            // Lead time: 60 minutes
                            return slotStartTime > currentTime + 60;
                        });

                        if (now.getHours() >= 22) {
                            slotsToShow = json.days[tomorrowStr] || [];
                            activeDate = tomorrowStr;
                        } else {
                            slotsToShow = filteredToday;
                            activeDate = todayStr;
                        }
                    } else {
                        slotsToShow = targetSlots;
                        activeDate = targetDate;
                    }
                }

                if (isMountedRef.current) {
                    setData({
                        ...json,
                        displaySlots: slotsToShow,
                        displayDate: activeDate
                    });
                    hasDataRef.current = true;
                    setLoading(false);
                }
            }
            if (isMountedRef.current) setError(false);
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                return;
            }
            console.error('Error fetching availability:', err);
            if (isMountedRef.current && !hasDataRef.current) setError(true);
            if (isMountedRef.current) setLoading(false);
        } finally {
            if (abortRef.current === controller) {
                abortRef.current = null;
            }
            if (isMountedRef.current) setRefreshing(false);
            if (loaderTimeoutRef.current) {
                clearTimeout(loaderTimeoutRef.current);
                loaderTimeoutRef.current = null;
            }
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

        // Refresh every 60 seconds, rely on server-side cache to throttle heavy work
        const interval = setInterval(() => fetchData(false, true), 60_000);
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
    const availableSlots = (data?.displaySlots || []).filter((s: ScrapedSlot) => !onlyAvailable || s.availableSpots > 0);
    const currentData = data || { timestamp: null, displayDate: '' };

    const osloFormatter = new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'Europe/Oslo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    const todayOslo = osloFormatter.format(new Date());
    const tomorrowOslo = (() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return osloFormatter.format(d);
    })();

    const headingText = (() => {
        const displayDate = currentData.displayDate;
        if (!displayDate) return 'Drop-in ledighet';
        if (displayDate === todayOslo) return 'Drop-in ledighet i dag';
        if (displayDate === tomorrowOslo) return 'Drop-in ledighet i morgen';

        try {
            const [y, m, d] = displayDate.split('-').map(Number);
            const pretty = new Intl.DateTimeFormat('nb-NO', {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
            }).format(new Date(Date.UTC(y, (m ?? 1) - 1, d)));
            return `Drop-in ledighet ${pretty}`;
        } catch {
            return `Drop-in ledighet ${displayDate}`;
        }
    })();

    const isTomorrow = currentData.displayDate === tomorrowOslo;

    // Find next available slot
    const nextSlot = (data?.displaySlots || []).find((s: ScrapedSlot) => s.availableSpots > 0);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <div className={styles.titleWrapper}>
                        <h3 className={styles.title}>{headingText}</h3>
                        <div className={styles.badge} title="Denne hentes automatisk hvert minutt">
                            <div className={refreshing ? styles.dotRefreshing : styles.dot} />
                            <span className={styles.badgeText}>
                                {refreshing ? 'Henter...' : 'Live-status'}
                            </span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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

                <div className={styles.actions}>
                    <button
                        className={`${styles.toggleButton} ${onlyAvailable ? styles.toggleActive : ''}`}
                        onClick={() => setOnlyAvailable((v) => !v)}
                    >
                        {onlyAvailable ? 'Vis alle timer' : 'Vis bare ledige'}
                    </button>
                </div>
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
                    availableSlots.map((slot: ScrapedSlot, i: number) => (
                        <SlotCard
                            key={i}
                            slot={slot}
                            totalCapacity={capacityDropin}
                            baseBookingUrl={bookingUrlDropin}
                            isTomorrow={isTomorrow}
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

function SlotCard({ slot, totalCapacity, baseBookingUrl, isTomorrow }: { slot: ScrapedSlot, totalCapacity: number, baseBookingUrl?: string | null, isTomorrow: boolean }) {
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
        const targetDate = new Date();
        if (isTomorrow) targetDate.setDate(targetDate.getDate() + 1);

        const dateStr = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD
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
