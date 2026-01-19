'use client';

import React, { useEffect, useRef } from 'react';

import Image from 'next/image';
import { MapPin, Clock } from 'lucide-react';
import styles from './SaunaCard.module.css';
import { Button } from '../ui/Button';
import { trackEvent } from '@/lib/analytics/tracking';
import { useRouter } from 'next/navigation';

interface SaunaProps {
    id: string;
    name: string;
    location: string;
    slug: string;
    shortDescription: string;
    imageUrl?: string;
    bookingUrlDropin?: string;
    bookingUrlPrivat?: string;
    driftStatus?: string;
    nextAvailableSlot?: { time: string; availableSpots: number; date: string } | null;
}

export function SaunaCard({ sauna }: { sauna: SaunaProps }) {
    const router = useRouter();
    const cardRef = useRef<HTMLDivElement | null>(null);
    const prefetchedRef = useRef(false);
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

    const formatNextSlotLabel = () => {
        if (!sauna.nextAvailableSlot) return null;
        const { time, availableSpots } = sauna.nextAvailableSlot;
        return { time, availableSpots };
    };

    const nextSlotLabel = formatNextSlotLabel();

    return (
        <div className={styles.card} ref={cardRef} onMouseEnter={handleHover} role="article" aria-label={`Badstue: ${sauna.name}`}>
            <div className={styles.imageContainer}>
                {sauna.imageUrl ? (
                    <Image
                        src={sauna.imageUrl}
                        alt={`${sauna.name} - badstue`}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                        quality={80}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }} aria-label="Bilde ikke tilgjengelig">
                        <span>Bilde kommer</span>
                    </div>
                )}
                {sauna.driftStatus === 'closed' && (
                    <span className={styles.badge} aria-label="Badstuen er stengt">
                        Stengt
                    </span>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.name}>
                        {sauna.name}
                    </h3>
                    <div className={styles.meta}>
                        <div className={styles.location}>
                            <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            {sauna.location}
                        </div>
                    </div>
                </div>

                <p className={styles.description}>{sauna.shortDescription}</p>

                <div className={styles.nextSlotRow}>
                    {nextSlotLabel ? (
                        <div className={styles.nextSlotBadge}>
                            <div className={styles.nextSlotMain}>
                                <Clock size={16} />
                                <span className={styles.nextSlotText}>
                                    Neste ledige: {nextSlotLabel.time}
                                </span>
                            </div>
                            <span className={styles.nextSlotSpots}>{nextSlotLabel.availableSpots} plasser</span>
                        </div>
                    ) : (
                        <div className={styles.nextSlotFallback}>
                            <Clock size={16} />
                            <span>Ingen ledige timer nå</span>
                        </div>
                    )}
                </div>

                <div className={styles.actions}>
                    <Button 
                        href={`/home/${sauna.slug}`} 
                        variant="outline" 
                        fullWidth
                        onClick={() => trackEvent('view_sauna_detail', { saunaId: sauna.id, saunaName: sauna.name })}
                    >
                        Se badstuen
                    </Button>

                    <div className={styles.bookingButtons}>
                        {sauna.bookingUrlDropin ? (
                            <Button
                                href={sauna.bookingUrlDropin}
                                external
                                variant="primary"
                                style={{ fontSize: '0.9rem', padding: '0.5rem' }}
                                onClick={() => trackEvent('booking_click', { type: 'drop-in', saunaId: sauna.id, saunaName: sauna.name })}
                            >
                                Book Drop-in
                            </Button>
                        ) : (
                            <Button disabled variant="secondary" style={{ fontSize: '0.9rem', padding: '0.5rem', opacity: 0.5 }}>
                                Kun privat
                            </Button>
                        )}

                        {sauna.bookingUrlPrivat ? (
                            <Button
                                href={sauna.bookingUrlPrivat}
                                external
                                variant="secondary"
                                style={{ fontSize: '0.9rem', padding: '0.5rem' }}
                                onClick={() => trackEvent('booking_click', { type: 'private', saunaId: sauna.id, saunaName: sauna.name })}
                            >
                                Book Privat
                            </Button>
                        ) : (
                            <Button disabled variant="secondary" style={{ fontSize: '0.9rem', padding: '0.5rem', opacity: 0.6 }}>
                                Ikke tilgj.
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
