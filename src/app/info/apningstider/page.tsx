import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getActiveSaunas, formatSmartOpeningHours } from "@/lib/sauna-service";
import { Metadata } from 'next';
import styles from '../OpeningHours.module.css';
import { Clock, Info, AlertCircle, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Åpningstider | Sjøbadet Badstue',
    description: 'Se våre åpningstider for alle badstuer.',
};

export default async function OpeningHoursPage() {
    const saunas = await getActiveSaunas();

    return (
        <>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>Åpningstider</h1>
                <p className={styles.subtitle}>
                    Velkommen til våre badstuer! Her finner du en oversikt over når vi har åpent og eventuelle driftsmeldinger for de ulike lokasjonene.
                </p>

                <div className={styles.saunaGrid}>
                    {saunas.map((sauna: any) => (
                        <div key={sauna.id} className={styles.saunaCard}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.saunaName}>
                                    {sauna.name}
                                    {sauna.driftStatus === 'closed' && (
                                        <span className={`${styles.badge} ${styles.badgeClosed}`}>
                                            Stengt
                                        </span>
                                    )}
                                </h2>
                            </div>

                            <div className={styles.cardContent}>
                                {sauna.driftStatus === 'closed' && sauna.kundeMelding && (
                                    <div className={styles.alertBox}>
                                        <AlertCircle size={20} style={{ flexShrink: 0 }} />
                                        <p>{sauna.kundeMelding}</p>
                                    </div>
                                )}

                                <div className={styles.summarySection}>
                                    <span className={styles.summaryLabel}>Hovedregel</span>
                                    <div className={styles.smartHours}>
                                        <Clock size={24} />
                                        {sauna.flexibleHours || sauna.driftStatus === 'closed' ? (
                                            <span>
                                                {sauna.driftStatus === 'closed' ? (sauna.stengeArsak || 'Midlertidig stengt') : (sauna.hoursMessage || 'Tilgjengelig ved leie')}
                                            </span>
                                        ) : (
                                            <span>{formatSmartOpeningHours(sauna.openingHours)}</span>
                                        )}
                                    </div>
                                </div>

                                {!sauna.flexibleHours && sauna.driftStatus !== 'closed' && (
                                    <div className={styles.detailsSection}>
                                        <h4>
                                            <Calendar size={18} style={{ marginRight: '0.5rem', display: 'inline' }} />
                                            Fullstendig ukesoversikt
                                        </h4>
                                        <table className={styles.hoursTable}>
                                            <tbody>
                                                {sauna.openingHours
                                                    .sort((a: any, b: any) => (a.weekday ?? 0) - (b.weekday ?? 0))
                                                    .map((hour: any) => (
                                                        <tr key={hour.id} className={styles.hoursRow}>
                                                            <td className={styles.dayCell}>
                                                                {['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'][hour.weekday ?? 0]}
                                                            </td>
                                                            <td className={styles.timeCell}>
                                                                {hour.active ? (
                                                                    `${hour.opens} - ${hour.closes}`
                                                                ) : (
                                                                    <span className={styles.closedText}>Stengt</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <div className={styles.cardFooter}>
                                <Link href={`/badstue/${sauna.slug}`} className={styles.ctaLink}>
                                    Gå til booking
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '5rem', backgroundColor: '#f0fdfa', padding: '2rem', borderRadius: '16px', border: '1px solid #ccfbf1', display: 'flex', gap: '1rem' }}>
                    <Info size={24} color="#0f766e" style={{ flexShrink: 0 }} />
                    <p style={{ color: '#134e4a', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        <strong>Merk for drop-in spill:</strong> Åpningstidene gjelder for våre fellesbadstuer. Privatleie er som regel tilgjengelig hele døgnet ved forhåndsbooking, så lenge badstuen er ledig i kalenderen.
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}
