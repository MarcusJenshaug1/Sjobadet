import type { WaterTemperatureData } from '@/lib/water-temperature-service';
import styles from './WaterTemperatureCard.module.css';

type WaterTemperatureCardProps = {
    data: WaterTemperatureData | null;
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

export function WaterTemperatureCard({ data }: WaterTemperatureCardProps) {
    const timestamp = data?.time ? formatTimestamp(data.time) : null;
    const temperature = data?.temperature;
    const locationName = data?.locationName;
    const distanceKm = data?.distanceKm ?? null;
    const hasData = typeof temperature === 'number' && !!timestamp;

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

            <div className={styles.metaRow}>
                <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Siste måling</span>
                    <span className={styles.metaValue}>{timestamp ?? 'Ikke tilgjengelig'}</span>
                </div>
                <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Målt ved</span>
                    <span className={styles.metaValue}>{locationName || 'Ukjent sted'}</span>
                </div>
                <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Avstand</span>
                    <span className={styles.metaValue}>
                        {typeof distanceKm === 'number' ? `ca. ${formatDistance(distanceKm)} km unna` : 'Ukjent'}
                    </span>
                </div>
            </div>

            {!hasData && (
                <p className={styles.emptyState}>
                    Ingen registrerte badetemperaturer innen 50 km akkurat nå.
                </p>
            )}

            <p className={styles.sourceLabel}>{data?.sourceLabel || 'Badetemperaturer levert av Yr'}</p>
        </div>
    );
}