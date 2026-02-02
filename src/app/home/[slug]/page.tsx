import { Header } from '@/components/layout/Header';
import styles from './SaunaDetail.module.css';
import { MapPin, Check, AlertTriangle, Gift, CreditCard, Clock, Users, Car, Bath, Accessibility, Droplet } from 'lucide-react';
import { Metadata } from 'next';
import { getSaunaBySlug, getActiveSaunas, getGlobalSettings, SaunaDetail, ActiveSauna } from '@/lib/sauna-service';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import nextDynamic from 'next/dynamic';
import { getSession } from '@/lib/auth';
import { getOverrideForDate, getTodayOpeningHours } from '@/lib/sauna-utils';
import { getWaterTemperatureForSauna, type WaterTemperatureData } from '@/lib/water-temperature-service';
import { WaterTemperatureCard } from '@/components/sauna/WaterTemperatureCard';
import { ShareButton } from '@/components/sauna/ShareButton';

// Lazy load non-critical components
const Footer = nextDynamic(() => import('@/components/layout/Footer').then(mod => mod.Footer));
const ReactMarkdown = nextDynamic(() => import('react-markdown'));
const SaunaGallery = nextDynamic(() => import('@/components/sauna/SaunaGallery').then(mod => mod.SaunaGallery));
const SaunaAvailability = nextDynamic(() => import('@/components/sauna/SaunaAvailability'));
const SaunaBookingOptions = nextDynamic(() => import('@/components/sauna/SaunaBookingOptions'));
const SaunaCard = nextDynamic(() => import('@/components/sauna/SaunaCard').then(mod => mod.SaunaCard));
const SaunaMap = nextDynamic(() => import('@/components/sauna/SaunaMap').then(mod => mod.SaunaMap));
// Enable public caching (CDN) with a 5-minute revalidation period
export const revalidate = 300;
export const dynamic = 'force-static';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    try {
        const sauna = await getSaunaBySlug(slug) as SaunaDetail | null;
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

    let sauna: SaunaDetail | null = null;
    let isAdmin = false;
    let dbError = false;
    let otherSaunas: ActiveSauna[] = [];
    let settings: Record<string, string> = {};
    let isMaintenanceMode = false;
    let waterTemperature: WaterTemperatureData | null = null;

    try {
        const [saunaData, allSaunas, session, globalSettings, maintenanceSetting] = await Promise.all([
            getSaunaBySlug(slug) as Promise<SaunaDetail | null>,
            getActiveSaunas() as Promise<ActiveSauna[]>,
            getSession(),
            getGlobalSettings(),
            prisma.siteSetting.findUnique({ where: { key: 'maintenance_mode' } })
        ]);

        sauna = saunaData;
        otherSaunas = allSaunas.filter(s => s.slug !== slug).slice(0, 3);
        isAdmin = !!session?.user;
        settings = globalSettings;
        isMaintenanceMode = maintenanceSetting?.value === 'true';

        if (saunaData?.latitude != null && saunaData?.longitude != null) {
            waterTemperature = await getWaterTemperatureForSauna(saunaData);
        }
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
    const shareUrlBase = settings['site_url'] || '';
    const shareUrl = `${shareUrlBase}/home/${slug}`.replace(/(^\/\/)|(?<!:)\/\//g, '/');
    const todayOverride = sauna ? getOverrideForDate(sauna.openingHourOverrides) : null;
    const todayHours = sauna?.openingHours ? getTodayOpeningHours(sauna.openingHours) : null;
    const overrideLabel = todayOverride
        ? todayOverride.active === false
            ? 'Stengt i dag (avvikende åpningstid)'
            : todayOverride.opens && todayOverride.closes
                ? `Avvikende åpningstid i dag: ${todayOverride.opens}–${todayOverride.closes}`
                : 'Avvikende åpningstid i dag'
        : null;
    const todayHoursLabel = (() => {
        if (todayOverride) {
            if (todayOverride.active === false) return 'Stengt i dag';
            if (todayOverride.opens && todayOverride.closes) return `${todayOverride.opens}–${todayOverride.closes}`;
            return 'Avvikende åpningstid';
        }
        if (sauna?.flexibleHours && sauna?.hoursMessage) return sauna.hoursMessage;
        if (todayHours?.active && todayHours.opens && todayHours.closes) return `${todayHours.opens}–${todayHours.closes}`;
        return 'Kontakt oss for åpningstider';
    })();
    const weeklyHours = sauna?.openingHours?.filter((h) => h.type === 'weekly') || [];
    const currency = sauna?.priceCurrency || 'NOK';
    const practicalInfoItems = [
        { label: 'Dagens åpningstid', value: `Åpningstid: ${todayHoursLabel}`, icon: Clock },
        { label: 'Kapasitet drop-in', value: `Drop-in: ${sauna?.capacityDropin ?? 0} personer`, icon: Users },
        { label: 'Kapasitet privat', value: `Privat: ${sauna?.capacityPrivat ?? 0} personer`, icon: Users },
        { label: 'Adresse', value: sauna?.address ? sauna.address.split(',')[0] : null, icon: MapPin },
        { label: 'Parkering', value: sauna?.parkingInfo, icon: Car },
        { label: 'Garderobe / dusj', value: sauna?.lockerInfo, icon: Bath },
        { label: 'Tilgjengelighet', value: sauna?.accessibilityInfo, icon: Accessibility },
        { label: 'Kald-stup / hav', value: sauna?.coldPlungeInfo, icon: Droplet },
    ].filter((item) => item.value);
    const hasDropinAvailability = (sauna as SaunaDetail | null)?.hasDropinAvailability ?? true;
    const showAvailability = !isMaintenanceMode && (hasDropinAvailability || !!sauna?.bookingUrlDropin);

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

                                {todayOverride && (
                                    <div style={{
                                        padding: '1rem 1.25rem',
                                        backgroundColor: '#eff6ff',
                                        border: '1px solid #bfdbfe',
                                        borderRadius: '0.75rem',
                                        color: '#1e3a8a',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Avvikende åpningstid</p>
                                        <p style={{ fontWeight: 600 }}>{overrideLabel}</p>
                                        {todayOverride.note && (
                                            <p style={{ marginTop: '0.5rem' }}>{todayOverride.note}</p>
                                        )}
                                    </div>
                                )}

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
                                        {showAvailability ? (
                                            <SaunaAvailability
                                                saunaId={sauna.id}
                                                bookingUrlDropin={sauna.bookingUrlDropin}
                                                capacityDropin={sauna.capacityDropin || 0}
                                                isAdmin={isAdmin}
                                                showAvailability={showAvailability}
                                            />
                                        ) : (
                                            <div style={{
                                                padding: '1rem 1.25rem',
                                                backgroundColor: '#f8fafc',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '0.75rem',
                                                color: '#475569'
                                            }}>
                                                Drop-in ledighet er ikke tilgjengelig for denne badstuen.
                                            </div>
                                        )}
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
                                    <SaunaMap
                                        address={sauna.address || ''}
                                        mapEmbedUrl={sauna.mapEmbedUrl || null}
                                        saunaName={sauna.name}
                                    />
                                </div>
                            </div>

                            {/* Right Column: Sidebar */}
                            <div className={styles.sidebar}>
                                {/* Real-time Availability (Desktop Sidebar) */}
                                {(sauna.bookingUrlDropin || sauna.bookingUrlPrivat) && (
                                    <div className={`${styles.sidebarCard} ${styles.desktopOnly}`} style={{ marginBottom: '1.5rem', padding: 0, border: 'none' }}>
                                        {showAvailability ? (
                                            <SaunaAvailability
                                                saunaId={sauna.id}
                                                bookingUrlDropin={sauna.bookingUrlDropin}
                                                capacityDropin={sauna.capacityDropin || 0}
                                                isAdmin={isAdmin}
                                                showAvailability={showAvailability}
                                            />
                                        ) : (
                                            <div style={{
                                                padding: '1rem 1.25rem',
                                                backgroundColor: '#f8fafc',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '0.75rem',
                                                color: '#475569'
                                            }}>
                                                Drop-in ledighet er ikke tilgjengelig for denne badstuen.
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Praktisk Info */}
                                {(practicalInfoItems.length > 0 || facilities.length > 0) && (
                                    <div className={styles.sidebarCard}>
                                        <h3 className={styles.sidebarTitle}>Praktisk & fasiliteter</h3>
                                        {practicalInfoItems.length > 0 && (
                                            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: facilities.length > 0 ? '1rem' : 0 }}>
                                                {practicalInfoItems.map((item) => {
                                                    const Icon = item.icon;
                                                    return (
                                                        <div key={item.label} className={styles.infoItem}>
                                                            <Icon size={18} className={styles.infoIcon} />
                                                            <span className={styles.infoValue}>{item.value}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {facilities.length > 0 ? (
                                            <div>
                                                <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '0.5rem', fontWeight: 700 }}>
                                                    Fasiliteter
                                                </div>
                                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                                    {facilities.map((facility: string, index: number) => (
                                                        <div key={index} className={styles.facilityItem}>
                                                            <Check size={16} />
                                                            <span>{facility}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <span style={{ color: '#94a3b8' }}>Ingen fasiliteter oppført</span>
                                        )}
                                    </div>
                                )}

                                {/* Priser */}

                                <WaterTemperatureCard data={waterTemperature} saunaId={sauna.id} isAdmin={isAdmin} />

                                {/* Actions */}
                                <div style={{ marginTop: '0.5rem' }}>
                                    <Link href="/medlemskap" className={styles.actionButton}>
                                        <CreditCard size={18} style={{ marginRight: '0.5rem' }} />
                                        Se medlemskap
                                    </Link>
                                    <Link href="/info/regler" className={styles.actionButton}>
                                        <Check size={18} style={{ marginRight: '0.5rem' }} />
                                        Se badsturegler
                                    </Link>
                                    <ShareButton
                                        url={shareUrl}
                                        title={sauna?.name || 'Sjøbadet Badstue'}
                                        className={styles.actionButton}
                                    />
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
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: '1.5rem'
                            }}>
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
