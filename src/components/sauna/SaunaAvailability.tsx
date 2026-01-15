'use client';

import { useState, useEffect } from 'react';
import { BookingSlot } from '@/lib/availability-scraper';
import styles from './SaunaAvailability.module.css';

interface AvailabilityResponse {
    dropin: BookingSlot[];
    privat: BookingSlot[];
    timestamp: string;
    isInitial?: boolean;
}

export default function SaunaAvailability({
    saunaId,
    capacityDropin = 10,
    bookingUrlDropin
}: {
    saunaId: string;
    bookingUrlDropin?: string | null;
    bookingUrlPrivat?: string | null;
    capacityDropin?: number;
}) {
    const [data, setData] = useState<AvailabilityResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(false);
    const [onlyAvailable, setOnlyAvailable] = useState(true);

    useEffect(() => {
        async function fetchData(isBackground = false) {
            if (isBackground) setRefreshing(true);
            try {
                // Fetch from our local API which has instant DB-first logic
                const res = await fetch(`/api/availability/today?saunaId=${saunaId}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();

                // If it's the very first time (no data in DB yet), it might return isInitial: true
                if (json.isInitial && !data) {
                    setLoading(true);
                } else {
                    // Filter out past slots
                    const filteredData: AvailabilityResponse = {
                        ...json,
                        dropin: (json.dropin || []).filter((s: BookingSlot) => !s.isPassed),
                        privat: []
                    };
                    setData(filteredData);
                    setLoading(false);
                }
                setError(false);
            } catch (err) {
                console.error('Error fetching availability:', err);
                if (!data) setError(true);
            } finally {
                if (isBackground) setRefreshing(false);
                // If we got isInitial, it means the background refresh just started.
                // We should poll again sooner in that case.
            }
        }

        fetchData();

        // Refresh every 2 minutes to catch background updates without excessive spamming
        const interval = setInterval(() => fetchData(true), 1000 * 60 * 2);
        return () => clearInterval(interval);
    }, [saunaId]);

    // Only show loading state if we have ABSOLUTELY no data to show
    if (loading && !data && !error) {
        return (
            <div className={styles.container}>
                <div style={{ padding: '0 0.5rem 1rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 'bold' }}>Henter ledighet for første gang...</p>
                    <p style={{ fontSize: '0.625rem', color: '#a0aec0' }}>Dette kan ta 10-20 sekunder</p>
                </div>
                <div className={styles.grid}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className={styles.slotCard} style={{ backgroundColor: '#f7fafc', minHeight: '50px', animation: 'refreshPulse 2s infinite' }} />
                    ))}
                </div>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className={styles.container} style={{ borderColor: '#fed7d7', backgroundColor: '#fff5f5' }}>
                <p style={{ fontSize: '0.75rem', color: '#c53030', fontWeight: 'bold', textAlign: 'center' }}>
                    Kunne ikke hente ledighet.
                </p>
            </div>
        );
    }

    // Default empty data if API returned isInitial but we want to show something
    const currentData = data || { dropin: [], privat: [], timestamp: new Date().toISOString() };
    const availableSlots = currentData.dropin.filter(s => onlyAvailable ? s.isAvailable : true);
    const nextSlot = currentData.dropin.find(s => s.isNext && s.isAvailable);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <div className={styles.titleWrapper}>
                        <h3 className={styles.title}>Ledighet i dag</h3>
                        <div className={styles.badge}>
                            <div className={refreshing ? styles.dotRefreshing : styles.dot} />
                            <span className={styles.badgeText}>
                                {refreshing ? 'Oppdaterer...' : 'Sanntid'}
                            </span>
                        </div>
                    </div>
                    <p className={styles.updatedAt}>
                        Oppdatert {new Date(currentData.timestamp).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <button
                    onClick={() => setOnlyAvailable(!onlyAvailable)}
                    className={`${styles.toggleButton} ${onlyAvailable ? styles.toggleActive : ''}`}
                >
                    {onlyAvailable ? 'Vis alle' : 'Bare ledige'}
                </button>
            </div>

            {nextSlot && (
                <div className={styles.nextSlot}>
                    <div className={styles.nextDot} />
                    <span className={styles.nextText}>
                        Neste ledige: <span className={styles.nextTime}>{nextSlot.startTime}</span>
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
                        <p className={styles.emptyText}>Ingen ledige timer funnet</p>
                    </div>
                )}
            </div>

            <p className={styles.footer}>
                Hentes automatisk i bakgrunnen
            </p>
        </div>
    );
}

function SlotCard({ slot, totalCapacity, baseBookingUrl }: { slot: BookingSlot, totalCapacity: number, baseBookingUrl?: string | null }) {
    const isFull = !slot.isAvailable;
    const capacityMatch = slot.capacityText?.match(/(\d+)/);
    const availablePlaces = capacityMatch ? parseInt(capacityMatch[1], 10) : 0;

    // Relative color coding
    // GREEN (Many): > 70% available
    // YELLOW (Few): 10% - 70% available
    // RED (Full): < 10% or 0 places

    let stateClass = styles.stateMany;
    const availablePercentage = totalCapacity > 0 ? (availablePlaces / totalCapacity) : 0;

    if (isFull || availablePlaces === 0) {
        stateClass = styles.stateFull;
    } else if (availablePercentage <= 0.7) {
        // Less than or equal to 70% becomes yellow/few
        stateClass = styles.stateFew;
    }

    // Construct booking link: [Base URL]/[YYYY-MM-DD]/[HH:MM]
    let bookingLink = '';
    if (baseBookingUrl && baseBookingUrl.includes('periode.no') && !isFull) {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeStr = slot.startTime; // HH:MM

        // Remove trailing slash if present on base URL
        const cleanBase = baseBookingUrl.endsWith('/') ? baseBookingUrl.slice(0, -1) : baseBookingUrl;
        bookingLink = `${cleanBase}/${dateStr}/${timeStr}`;
    }

    const cardContent = (
        <>
            <span className={styles.slotTime}>{slot.startTime}</span>
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
