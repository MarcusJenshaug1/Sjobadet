'use client';

import React from 'react';
import styles from '@/app/home/[slug]/SaunaDetail.module.css';
import { ExternalLink } from 'lucide-react';
import { trackEvent } from '@/lib/analytics/tracking';

interface SaunaBookingOptionsProps {
    saunaId: string;
    saunaName: string;
    capacityDropin: number;
    capacityPrivat: number;
    bookingUrlDropin?: string | null;
    bookingUrlPrivat?: string | null;
}

export default function SaunaBookingOptions({
    saunaId,
    saunaName,
    capacityDropin,
    capacityPrivat,
    bookingUrlDropin,
    bookingUrlPrivat
}: SaunaBookingOptionsProps) {
    const handleTrack = (type: 'drop-in' | 'private') => {
        trackEvent('booking_click', {
            type,
            saunaId,
            saunaName
        });
    };

    return (
        <div className={styles.bookingOptions}>
            <h2 className={styles.sectionTitle}>Velg type booking</h2>
            <div className={styles.bookingCardsGrid}>
                {/* Drop-in Card */}
                {capacityDropin > 0 && (
                    bookingUrlDropin ? (
                        <a
                            href={bookingUrlDropin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.bookingOptionCard} ${styles.dropinCard}`}
                            onClick={() => handleTrack('drop-in')}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.optionTitle}>Enkeltbillett (drop-in)</div>
                                <div className={styles.optionDesc}>Kom alene eller med venner i fellesbadstue</div>
                            </div>
                            <div className={styles.cardFooter}>
                                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Kapasitet: {capacityDropin} pers.</div>
                                <ExternalLink size={20} />
                            </div>
                        </a>
                    ) : (
                        <div className={`${styles.bookingOptionCard} ${styles.dropinCard}`} style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                            <div className={styles.cardHeader}>
                                <div className={styles.optionTitle}>Enkeltbillett (drop-in)</div>
                                <div className={styles.optionDesc}>Ikke tilgjengelig for øyeblikket</div>
                            </div>
                        </div>
                    )
                )}

                {/* Privat Booking Card */}
                {capacityPrivat > 0 && (
                    bookingUrlPrivat ? (
                        <a
                            href={bookingUrlPrivat}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.bookingOptionCard} ${styles.privateCard}`}
                            onClick={() => handleTrack('private')}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.optionTitle}>Privat booking</div>
                                <div className={styles.optionDesc}>Book hele badstuen for ditt selskap</div>
                            </div>
                            <div className={styles.cardFooter}>
                                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Kapasitet: {capacityPrivat} pers.</div>
                                <ExternalLink size={20} color="#719898" />
                            </div>
                        </a>
                    ) : (
                        <div className={`${styles.bookingOptionCard} ${styles.privateCard}`} style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                            <div className={styles.cardHeader}>
                                <div className={styles.optionTitle}>Privat booking</div>
                                <div className={styles.optionDesc}>Ikke tilgjengelig for øyeblikket</div>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
