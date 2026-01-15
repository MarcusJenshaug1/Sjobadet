'use client';

import React from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import styles from './SaunaCard.module.css';
import { Button } from '../ui/Button';
import { trackEvent } from '@/lib/analytics/tracking';

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
}

export function SaunaCard({ sauna }: { sauna: SaunaProps }) {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                {sauna.imageUrl ? (
                    <Image
                        src={sauna.imageUrl}
                        alt={sauna.name}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                        <span>Bilde kommer</span>
                    </div>
                )}
                {sauna.driftStatus === 'closed' && (
                    <span className={styles.badge}>
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

                <div className={styles.actions}>
                    <Button href={`/badstue/${sauna.slug}`} variant="outline" fullWidth>
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
