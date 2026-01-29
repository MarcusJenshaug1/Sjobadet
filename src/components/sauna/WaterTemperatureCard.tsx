'use client';

import { useState } from 'react';
import type { WaterTemperatureData } from '@/lib/water-temperature-service';
import styles from './WaterTemperatureCard.module.css';

type WaterTemperatureCardProps = {
    data: WaterTemperatureData | null;
    saunaId?: string;
    isAdmin?: boolean;
};

function formatTemperature(value: number) {
    return new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 1 }).format(value);
}

function formatDistance(value: number) {
    return new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 1 }).format(value);
}

function formatTimestamp(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    const dateLabel = date.toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit' });
    const timeLabel = date.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' });
    return `${dateLabel} kl. ${timeLabel}`;
}

export function WaterTemperatureCard({ data, saunaId, isAdmin = false }: WaterTemperatureCardProps) {
    const [showDetails, setShowDetails] = useState(false);
    const [refreshStatus, setRefreshStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
    const [refreshMessage, setRefreshMessage] = useState('');
    const timestamp = data?.time ? formatTimestamp(data.time) : null;
    const temperature = data?.temperature;
    const locationName = data?.locationName;
    const distanceKm = data?.distanceKm ?? null;
    const hasData = typeof temperature === 'number' && !!timestamp;
    const hasLocation = !!locationName;
    const hasDistance = typeof distanceKm === 'number';
    const inferredSource = data?.source ?? ((hasLocation || hasDistance) ? 'yr' : null);
    const sourceLabel = inferredSource === 'open-meteo'
        ? 'Sjøtemperatur (modell) levert av Open-Meteo'
        : inferredSource === 'yr'
            ? 'Badetemperaturer levert av Yr'
            : 'Temperaturkilde ukjent';

    const handleRefresh = async () => {
        if (!saunaId) return;
        setRefreshStatus('loading');
        setRefreshMessage('Henter badetemperatur...');

        try {
            const response = await fetch('/api/admin/water-temperature/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ saunaId }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                setRefreshStatus('error');
                setRefreshMessage(payload?.message || 'Fant ingen temperatur.');
                return;
            }

            setRefreshStatus('success');
            setRefreshMessage('Badetemperatur oppdatert. Oppdater siden.');
        } catch (error) {
            setRefreshStatus('error');
            setRefreshMessage('Kunne ikke hente temperatur.');
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.headerRow}>
                <span className={styles.title}>Badetemperatur</span>
                {hasData ? (
                    <span className={styles.statusBadge}>Oppdatert</span>
                ) : (
                    <span className={styles.statusBadgeMuted}>Ingen data</span>
                )}
            </div>

            <div className={styles.temperatureRow}>
                <span className={styles.temperatureValue}>
                    {hasData ? `${formatTemperature(temperature)} °C` : '-- °C'}
                </span>
                <span className={styles.temperatureHint}>
                    {hasData ? 'Nærmeste måling' : 'Venter på måling'}
                </span>
            </div>

            <button
                type="button"
                className={styles.toggleButton}
                onClick={() => setShowDetails((prev) => !prev)}
            >
                {showDetails ? 'Skjul info' : 'Vis mer info'}
            </button>

            {showDetails && (
                <>
                    <div className={styles.metaRow}>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Siste måling</span>
                            <span className={styles.metaValue}>{timestamp ?? 'Ikke tilgjengelig'}</span>
                        </div>
                        {hasLocation && (
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Målt ved</span>
                                <span className={styles.metaValue}>{locationName}</span>
                            </div>
                        )}
                        {hasDistance && (
                            <div className={styles.metaItem}>
                                <span className={styles.metaLabel}>Avstand</span>
                                <span className={styles.metaValue}>
                                    {`ca. ${formatDistance(distanceKm)} km unna`}
                                </span>
                            </div>
                        )}
                    </div>

                    {!hasData && (
                        <p className={styles.emptyState}>
                            Ingen registrerte badetemperaturer innen 50 km akkurat nå.
                        </p>
                    )}
                </>
            )}

            {isAdmin && saunaId && (
                <div className={styles.adminRow}>
                    <button type="button" className={styles.adminButton} onClick={handleRefresh}>
                        Hent badetemperatur nå
                    </button>
                    {refreshStatus !== 'idle' && (
                        <span className={styles.adminMessage} data-status={refreshStatus}>
                            {refreshMessage}
                        </span>
                    )}
                </div>
            )}

            <p className={styles.sourceLabel}>{sourceLabel}</p>
        </div>
    );
}