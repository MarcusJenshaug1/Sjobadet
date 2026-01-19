import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from './SaunaDetail.module.css';
import { MapPin, Users, Check, AlertTriangle, Gift, CreditCard } from 'lucide-react';
import { Metadata } from 'next';
import { getSaunaBySlug, getActiveSaunas, getGlobalSettings } from '@/lib/sauna-service';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { SaunaGallery } from '@/components/sauna/SaunaGallery';
import Image from 'next/image';
import SaunaAvailability from '@/components/sauna/SaunaAvailability';
import SaunaBookingOptions from '@/components/sauna/SaunaBookingOptions';
import { getSession } from '@/lib/auth';
import { SaunaCard } from '@/components/sauna/SaunaCard';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    try {
        const sauna = await getSaunaBySlug(slug);
        if (!sauna) return { title: 'Fant ikke badstue' };

        const title = sauna.seoTitle || `${sauna.name} | Sjøbadet Badstue`;
        const description = sauna.seoDescription || sauna.shortDescription;

        return {
            title,
            description,
            openGraph: {
                title,
                description: description || '',
                images: sauna.imageUrl ? [
                    {
                        url: sauna.imageUrl,
                        width: 1200,
                        height: 630,
                        alt: sauna.name,
                    }
                ] : [],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description: description || '',
                images: sauna.imageUrl ? [sauna.imageUrl] : [],
            }
        };
    } catch (error) {
        return { title: 'Sjøbadet Badstue' };
    }
}

export default async function SaunaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    let sauna = null;
    let isAdmin = false;
    let dbError = false;
    let otherSaunas: Awaited<ReturnType<typeof getActiveSaunas>> = [];
    let settings: Record<string, string> = {};

    try {
        sauna = await getSaunaBySlug(slug);
        const allSaunas = await getActiveSaunas();
        otherSaunas = allSaunas.filter(s => s.slug !== slug).slice(0, 3);
        const session = await getSession();
        isAdmin = !!session?.user;
        settings = await getGlobalSettings();
    } catch (error) {
        console.error('Failed to fetch sauna detail:', error);
        dbError = true;
    }

    if (!sauna && !dbError) {
        notFound();
    }

    // Parse JSON fields
    const parseJSON = (str: string | null | undefined) => {
        try {
            return str ? JSON.parse(str) : [];
        } catch (e) {
            console.error('Failed to parse JSON field', e);
            return [];
        }
    };

    const facilities = sauna ? parseJSON(sauna.facilities) : [];
    const gallery = sauna ? parseJSON(sauna.gallery) : [];
    const phone = settings['contact_phone'] || '+47 401 55 365';

    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* Hero Section */}
                <div className={styles.heroImage}>
                    {sauna?.imageUrl ? (
                        <Image
                            src={sauna.imageUrl}
                            alt={sauna.name}
                            fill
                            priority
                            fetchPriority="high"
                            quality={90}
                            style={{ objectFit: 'cover' }}
                            sizes="100vw"
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {dbError ? 'Info utilgjengelig' : 'Ingen bilde'}
                        </div>
                    )}
                    <div className={styles.heroOverlay}>
                        <div className={styles.heroContentContainer}>
                            <h1 className={styles.title}>{sauna?.name || 'Badstue'}</h1>
                            <div className={styles.heroLocation}>
                                <MapPin size={24} />
                                {sauna?.location || 'Lokasjon...'}
                            </div>
                            {sauna?.driftStatus === 'closed' && (
                                <div style={{
                                    marginTop: '1rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '999px',
                                    fontWeight: '600'
                                }}>
                                    <AlertTriangle size={20} />
                                    Midlertidig Stengt
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.contentContainer}>
                    {dbError ? (
                        <div style={{ textAlign: 'center', padding: '4rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
                            <AlertTriangle size={64} color="#f56565" style={{ marginBottom: '1.5rem' }} />
                            <h2 style={{ fontSize: '2rem', color: '#c53030', marginBottom: '1rem' }}>Midlertidig utilgjengelig</h2>
                            <p style={{ fontSize: '1.25rem', color: '#718096', lineHeight: '1.6', marginBottom: '2rem' }}>
                                Vi klarte ikke å hente informasjon om badstuen akkurat nå.
                                Vennligst prøv igjen om litt.
                            </p>
                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', display: 'inline-block', textAlign: 'left', marginBottom: '2rem' }}>
                                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Trenger du hjelp?</p>
                                <p>Ring oss på: <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{phone}</a></p>
                            </div>
                            <br />
                            <Link href="/" className={styles.actionButton} style={{ display: 'inline-flex', width: 'auto' }}>
                                Tilbake til forsiden
                            </Link>
                        </div>
                    ) : sauna && (
                        <div className={styles.grid}>
                            {/* Left Column: Main Content */}
                            <div className={styles.leftColumn}>

                                {sauna.driftStatus === 'closed' && sauna.kundeMelding && (
                                    <div style={{
                                        padding: '1.5rem',
                                        backgroundColor: '#fff1f2',
                                        border: '1px solid #fecdd3',
                                        borderRadius: '0.75rem',
                                        color: '#9f1239',
                                        marginBottom: '2rem'
                                    }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Melding fra oss:</p>
                                        <p>{sauna.kundeMelding}</p>
                                    </div>
                                )}

                                {/* Booking Options */}
                                <SaunaBookingOptions
                                    saunaId={sauna.id}
                                    saunaName={sauna.name}
                                    capacityDropin={sauna.capacityDropin || 0}
                                    capacityPrivat={sauna.capacityPrivat || 0}
                                    bookingUrlDropin={sauna.bookingUrlDropin}
                                    bookingUrlPrivat={sauna.bookingUrlPrivat}
                                />

                                {/* Real-time Availability (Mobile Only) */}
                                {(sauna.bookingUrlDropin || sauna.bookingUrlPrivat) && (
                                    <div className={styles.mobileOnly} style={{ marginBottom: '2rem' }}>
                                        <SaunaAvailability
                                            saunaId={sauna.id}
                                            bookingUrlDropin={sauna.bookingUrlDropin}
                                            capacityDropin={sauna.capacityDropin || 0}
                                            isAdmin={isAdmin}
                                            showAvailability={(sauna as any).hasDropinAvailability ?? true}
                                        />
                                    </div>
                                )}

                                {/* Description */}
                                <div className={styles.textSection}>
                                    <h2 className={styles.sectionTitle}>Om badstuen</h2>
                                    <div className={styles.description}>
                                        {/* Markdown rendering */}
                                        <ReactMarkdown
                                            components={{
                                                p: ({ node, ...props }) => <p style={{ marginBottom: '1rem', lineHeight: '1.7' }} {...props} />,
                                                ul: ({ node, ...props }) => <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem', listStyle: 'disc' }} {...props} />,
                                                ol: ({ node, ...props }) => <ol style={{ marginLeft: '1.5rem', marginBottom: '1rem', listStyle: 'decimal' }} {...props} />,
                                                li: ({ node, ...props }) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
                                                h1: ({ node, ...props }) => <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '1rem' }} {...props} />,
                                                h2: ({ node, ...props }) => <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '1.25rem', marginBottom: '0.75rem' }} {...props} />,
                                                h3: ({ node, ...props }) => <h5 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem' }} {...props} />,
                                            }}
                                        >
                                            {sauna.description}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                {/* Gallery */}
                                <SaunaGallery
                                    images={gallery}
                                    saunaName={sauna.name}
                                />

                                {/* Map */}
                                <div className={styles.textSection}>
                                    <h2 className={styles.sectionTitle}>Kart og plassering</h2>
                                    <p style={{ marginBottom: '1rem', color: '#475569' }}>{sauna.address}</p>
                                    {sauna.mapEmbedUrl && (
                                        <div className={styles.mapWrapper}>
                                            <iframe
                                                src={sauna.mapEmbedUrl}
                                                title={`Kart over ${sauna.name}`}
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                allowFullScreen
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                            ></iframe>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Sidebar */}
                            <div className={styles.sidebar}>
                                {/* Real-time Availability (Desktop Sidebar) */}
                                {(sauna.bookingUrlDropin || sauna.bookingUrlPrivat) && (
                                    <div className={`${styles.sidebarCard} ${styles.desktopOnly}`} style={{ marginBottom: '1.5rem', padding: 0, border: 'none' }}>
                                        <SaunaAvailability
                                            saunaId={sauna.id}
                                            bookingUrlDropin={sauna.bookingUrlDropin}
                                            capacityDropin={sauna.capacityDropin || 0}
                                            isAdmin={isAdmin}
                                            showAvailability={(sauna as any).hasDropinAvailability ?? true}
                                        />
                                    </div>
                                )}

                                {/* Praktisk Info */}
                                <div className={styles.sidebarCard}>
                                    <h3 className={styles.sidebarTitle}>Praktisk info</h3>

                                    <div className={styles.infoItem}>
                                        <Users size={20} className={styles.infoIcon} />
                                        <div>
                                            <span className={styles.infoLabel}>Kapasitet drop-in</span>
                                            <span className={styles.infoValue}>{sauna?.capacityDropin ?? 0} personer</span>
                                        </div>
                                    </div>

                                    <div className={styles.infoItem}>
                                        <Users size={20} className={styles.infoIcon} />
                                        <div>
                                            <span className={styles.infoLabel}>Kapasitet privat</span>
                                            <span className={styles.infoValue}>{sauna?.capacityPrivat ?? 0} personer</span>
                                        </div>
                                    </div>

                                    <div className={styles.infoItem}>
                                        <MapPin size={20} className={styles.infoIcon} />
                                        <div>
                                            <span className={styles.infoLabel}>Adresse</span>
                                            <span className={styles.infoValue}>{sauna?.address?.split(',')[0] || 'Ikke oppgitt'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Facilities */}
                                <div className={styles.sidebarCard}>
                                    <h3 className={styles.sidebarTitle}>Fasiliteter</h3>
                                    {facilities.map((facility: string, index: number) => (
                                        <div key={index} className={styles.facilityItem}>
                                            <Check size={18} />
                                            <span>{facility}</span>
                                        </div>
                                    ))}
                                    {facilities.length === 0 && <span style={{ color: '#94a3b8' }}>Ingen fasiliteter oppført</span>}
                                </div>

                                {/* Actions */}
                                <div style={{ marginTop: '0.5rem' }}>
                                    <Link href="/medlemskap" className={styles.actionButton}>
                                        <CreditCard size={18} style={{ marginRight: '0.5rem' }} />
                                        Se medlemskap
                                    </Link>
                                    <a
                                        href="https://minside.periode.no/gift-card/s4t6WWP6bYfM4myt4mcd"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.actionButton}
                                    >
                                        <Gift size={18} style={{ marginRight: '0.5rem' }} />
                                        Kjøp gavekort
                                    </a>
                                </div>

                            </div>
                        </div>
                    )}
                </div>

                {/* Other Saunas Section */}
                {otherSaunas.length > 0 && (
                    <div className={styles.contentContainer}>
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 className={styles.sectionTitle} style={{ marginBottom: '1.5rem' }}>Andre badstuer</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                {otherSaunas.map((s) => (
                                    <SaunaCard key={s.id} sauna={s} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
