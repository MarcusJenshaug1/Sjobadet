'use client';

import React, { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import {
    MapPin,
    Clock,
    Users,
    ExternalLink,
    Ban,
    AlertTriangle
} from 'lucide-react';
import styles from './SaunaCard.module.css';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { trackEvent } from '@/lib/analytics/tracking';
import { useOptionalRouter } from '@/lib/optional-router';
import { BookingModal } from './BookingModal';

import { formatDateNoShortTitleCase, getRelativeDayLabel } from '@/lib/availability-utils';
import { getOverrideForDate } from '@/lib/sauna-utils';

interface SaunaProps {
    id: string;
    name: string;
    location: string;
    slug: string;
    shortDescription: string;
    imageUrl?: string | null;
    bookingUrlDropin?: string | null;
    bookingUrlPrivat?: string | null;
    driftStatus?: string | null;
    capacityDropin?: number; // Added to help with status calculation
    nextAvailableSlot?: { time: string; availableSpots: number; date: string } | null;
    openingHourOverrides?: {
        date: string | Date;
        opens?: string | null;
        closes?: string | null;
        active?: boolean | null;
        note?: string | null;
    }[];
}

export function SaunaCard({ sauna, isMaintenanceMode = false }: { sauna: SaunaProps; isMaintenanceMode?: boolean }) {
    const router = useOptionalRouter();
    const cardRef = useRef<HTMLDivElement | null>(null);
    const prefetchedRef = useRef(false);
    const [bookingUrl, setBookingUrl] = useState<string | null>(null);
    const targetHref = `/home/${sauna.slug}`;

    useEffect(() => {
        if (prefetchedRef.current) return;
        const node = cardRef.current;
        if (!node) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !prefetchedRef.current) {
                    try {
                        router.prefetch(targetHref);
                    } catch {
                        /* ignore prefetch errors */
                    }
                    prefetchedRef.current = true;
                    observer.disconnect();
                }
            });
        }, { rootMargin: '150px' });

        observer.observe(node);
        return () => observer.disconnect();
    }, [router, targetHref]);

    const handleHover = () => {
        if (prefetchedRef.current) return;
        try {
            router.prefetch(targetHref);
            trackEvent('sauna_card_prefetch', { saunaId: sauna.id, saunaName: sauna.name });
        } catch {
            /* ignore prefetch errors */
        }
        prefetchedRef.current = true;
    };

    const handleCardClick = () => {
        router.push(targetHref);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
        }
    };

    const formatNextSlotLabel = () => {
        if (!sauna.nextAvailableSlot) return null;
        const { time, availableSpots, date } = sauna.nextAvailableSlot;

        const now = new Date();
        const dayLabel = getRelativeDayLabel(date, now);

        const isToday = dayLabel === 'i dag';
        const formattedDate = !isToday ? formatDateNoShortTitleCase(date) : null;

        return {
            time,
            availableSpots,
            dayLabel: formattedDate ? `(${formattedDate})` : null
        };
    };

    const nextSlotLabel = formatNextSlotLabel();
    const isClosed = sauna.driftStatus === 'closed';
    const todayOverride = getOverrideForDate(sauna.openingHourOverrides, new Date(), 'Europe/Oslo');
    const overrideLabel = todayOverride
        ? todayOverride.active === false
            ? 'Stengt i dag (avvik)'
            : todayOverride.opens && todayOverride.closes
                ? `Avvik i dag: ${todayOverride.opens}–${todayOverride.closes}`
                : 'Avvikende åpningstid i dag'
        : null;

    // Status calculation for colors
    const getStatusState = () => {
        if (isClosed) return 'NONE';

        const available = sauna.nextAvailableSlot?.availableSpots;
        if (available === undefined || available === null) return 'PLENTY';

        if (available <= 0) return 'NONE';

        // Use capacity if available, otherwise fallback to absolute numbers
        if (sauna.capacityDropin) {
            if (available / sauna.capacityDropin <= 0.3) return 'LOW';
        } else {
            if (available <= 2) return 'LOW';
        }

        return 'PLENTY';
    };

    const statusState = getStatusState();

    const chipClass =
        statusState === 'NONE' ? styles.chipNone :
            statusState === 'LOW' ? styles.chipFew :
                styles.chipPlenty;

    return (
        <div
            className={styles.card}
            ref={cardRef}
            onMouseEnter={handleHover}
            role="link"
            tabIndex={0}
            aria-label={`Badstue: ${sauna.name}`}
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
        >
            <div className={styles.imageContainer}>
                {sauna.imageUrl ? (
                    <Image
                        src={sauna.imageUrl}
                        alt={`${sauna.name} - badstue`}
                        fill
                        className={styles.image}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                        loading="lazy"
                        quality={75}
                        decoding="async"
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }} role="img" aria-label="Bilde ikke tilgjengelig">
                        <span>Bilde kommer</span>
                    </div>
                )}
                <div className={styles.imageGradient} />

                {isClosed ? (
                    <Badge className={styles.badge} variant="danger" size="sm">
                        <Ban size={14} />
                        Stengt
                    </Badge>
                ) : statusState === 'LOW' ? (
                    <Badge className={styles.badge} variant="warning" size="sm">
                        <AlertTriangle size={14} />
                        Få plasser
                    </Badge>
                ) : null}
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.name}>
                        {sauna.name}
                    </h3>
                    <div className={styles.locationContainer}>
                        <MapPin size={16} />
                        {sauna.location}
                    </div>
                </div>

                {overrideLabel && (
                    <div className={styles.overrideNote} onClick={(e) => e.stopPropagation()}>
                        <Clock size={16} />
                        <span>{overrideLabel}</span>
                    </div>
                )}

                {!isMaintenanceMode && (
                    <div className={styles.chipsContainer} onClick={(e) => e.stopPropagation()}>
                        {nextSlotLabel ? (
                            <div className={`${styles.chip} ${chipClass}`}>
                                <Clock size={16} />
                                <span>Neste ledige: {nextSlotLabel.time}{nextSlotLabel.dayLabel ? ` ${nextSlotLabel.dayLabel}` : ''}</span>
                            </div>
                        ) : (
                            <div className={`${styles.chip} ${styles.chipNone}`}>
                                <Clock size={16} />
                                <span>Ingen ledige timer nå</span>
                            </div>
                        )}

                        {nextSlotLabel && (
                            <div className={`${styles.chip} ${chipClass}`}>
                                <Users size={16} />
                                <span>{nextSlotLabel.availableSpots}/{sauna.capacityDropin || 10} ledige</span>
                            </div>
                        )}
                    </div>
                )}

                <div className={styles.description}>
                    {sauna.shortDescription}
                    <span className={styles.lesMer}>Les mer</span>
                </div>

                <div className={styles.actions}>
                    <div className={styles.bookingGrid}>
                        {sauna.bookingUrlDropin ? (
                            <Button
                                href={sauna.bookingUrlDropin || '#'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setBookingUrl(sauna.bookingUrlDropin || null);
                                    trackEvent('booking_click', { type: 'drop-in', saunaId: sauna.id, saunaName: sauna.name });
                                }}
                                className={styles.btnDropin}
                            >
                                Book Drop-in
                            </Button>
                        ) : (
                            <Button disabled className={`${styles.btnDropin} ${styles.btnDisabled}`}>
                                Kun privat
                            </Button>
                        )}

                        {sauna.bookingUrlPrivat ? (
                            <Button
                                href={sauna.bookingUrlPrivat || '#'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setBookingUrl(sauna.bookingUrlPrivat || null);
                                    trackEvent('booking_click', { type: 'private', saunaId: sauna.id, saunaName: sauna.name });
                                }}
                                className={styles.btnPrivat}
                            >
                                Book Privat
                            </Button>
                        ) : (
                            <Button disabled className={`${styles.btnPrivat} ${styles.btnDisabled}`}>
                                Ikke tilgj.
                            </Button>
                        )}
                    </div>

                    {!isMaintenanceMode && (
                        <button
                            className={styles.btnDetails}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                trackEvent('view_sauna_detail', { saunaId: sauna.id, saunaName: sauna.name });
                                router.push(targetHref);
                            }}
                        >
                            Se badstuen
                            <ExternalLink size={16} />
                        </button>
                    )}
                </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
                <BookingModal
                    open={Boolean(bookingUrl)}
                    url={bookingUrl || ''}
                    onClose={() => setBookingUrl(null)}
                    title={`${sauna.name} booking`}
                />
            </div>
        </div>
    );
}
