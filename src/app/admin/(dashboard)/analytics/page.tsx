import prisma from "@/lib/prisma";
import { Users, MousePointer2, TrendingUp, Monitor, Download, Calendar, Shield } from "lucide-react";
import RangeSelector from "./_components/RangeSelector";

export const dynamic = 'force-dynamic';

/**
 * Admin Analytics Dashboard Page.
 * Displays real-time and historical visitor activity with per-sauna breakdown.
 */
export default async function AnalyticsPage({
    searchParams
}: {
    searchParams: Promise<{ days?: string }>
}) {
    const params = await searchParams;
    const days = parseInt(params.days || '30');

    // Note: Using any here because prisma client might not be generate-ready yet
    const analytics = prisma as any;

    // Safety check: If prisma client hasn't been updated yet, show error state instead of crashing
    if (!analytics.analyticsEvent || !analytics.analyticsSession) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#fff', borderRadius: '1rem', border: '1px solid #fee2e2' }}>
                <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>Analytics er ikke klar</h1>
                <p style={{ color: '#64748b' }}>Prisma-klienten mangler analytics-modellene (AnalyticsEvent/AnalyticsSession).</p>
                <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', display: 'inline-block', textAlign: 'left' }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Løsning:</p>
                    <ol style={{ fontSize: '0.9rem', color: '#475569' }}>
                        <li>Stopp <code>npm run dev</code></li>
                        <li>Kjør <code>npx prisma generate</code></li>
                        <li>Start <code>npm run dev</code> på nytt</li>
                    </ol>
                </div>
            </div>
        );
    }

    const now = new Date();
    // If days is 0, we want "all time" (no date filter)
    const startDate = days > 0 ? new Date(now.getTime() - days * 24 * 60 * 60 * 1000) : undefined;

    // Construct where clauses
    const eventWhere = startDate ? { timestamp: { gte: startDate } } : {};
    const sessionWhere = startDate ? { startTime: { gte: startDate } } : {};

    // Fetch data directly for the dashboard
    let pageviews = 0;
    let sessions = 0;
    let topPages = [];
    let deviceStats = [];
    let bookingClicks: any[] = [];
    let saunaViews: any[] = [];
    let consentEvents: any[] = [];

    try {
        const [pvCount, sessCount, pages, devices, events, sViews, cEvents] = await Promise.all([
            analytics.analyticsEvent.count({
                where: { type: 'pageview', ...eventWhere }
            }),
            analytics.analyticsSession.count({
                where: { ...sessionWhere }
            }),
            analytics.analyticsEvent.groupBy({
                by: ['path'],
                where: { type: 'pageview', ...eventWhere },
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } },
                take: 10
            }),
            analytics.analyticsSession.groupBy({
                by: ['deviceType'],
                where: { ...sessionWhere },
                _count: { id: true }
            }),
            // Fetch booking clicks to aggregate manually
            analytics.analyticsEvent.findMany({
                where: {
                    type: 'event',
                    eventName: 'booking_click',
                    ...eventWhere
                }
            }),
            // Fetch sauna pageviews to aggregate
            analytics.analyticsEvent.findMany({
                where: {
                    type: 'pageview',
                    path: { startsWith: '/badstue/' },
                    ...eventWhere
                }
            }),
            // Fetch consent choices
            analytics.analyticsEvent.findMany({
                where: {
                    type: 'event',
                    eventName: 'consent_choice',
                    ...eventWhere
                }
            })
        ]);
        pageviews = pvCount;
        sessions = sessCount;
        topPages = pages;
        deviceStats = devices;
        bookingClicks = events;
        saunaViews = sViews;
        consentEvents = cEvents;
    } catch (e) {
        console.error("Analytics fetch error:", e);
    }

    // Process consent stats
    const consentStats = {
        accepted: 0,
        declined: 0,
        custom: 0
    };
    consentEvents.forEach(e => {
        try {
            const choice = JSON.parse(e.payload || '{}').choice;
            if (choice === 'accepted') consentStats.accepted++;
            else if (choice === 'declined') consentStats.declined++;
            else if (choice === 'custom') consentStats.custom++;
        } catch (e) { }
    });

    const totalConsentActions = consentStats.accepted + consentStats.declined + consentStats.custom;
    const totalPossibleVisitors = totalConsentActions; // Approximated by consent banner interactions

    // Map sauna IDs to slugs and names dynamically
    let saunas: any[] = [];
    try {
        saunas = await prisma.sauna.findMany({
            select: { id: true, slug: true, name: true }
        });
    } catch (e) { }

    const idToSlug: Record<string, string> = {};
    const nameMap: Record<string, string> = {};
    saunas.forEach(s => {
        idToSlug[s.id] = s.slug;
        nameMap[s.slug] = s.name;
    });

    // Process per-sauna metrics
    const saunaMetrics: Record<string, { name: string, views: number, dropinClicks: number, privateClicks: number, uniqueDropinSessions: Set<string>, uniquePrivateSessions: Set<string> }> = {};

    // Process views
    saunaViews.forEach(v => {
        const parts = v.path.split('/');
        const slug = parts[parts.length - 1];
        if (!slug) return;
        if (!saunaMetrics[slug]) {
            saunaMetrics[slug] = {
                name: nameMap[slug] || slug,
                views: 0,
                dropinClicks: 0,
                privateClicks: 0,
                uniqueDropinSessions: new Set(),
                uniquePrivateSessions: new Set()
            };
        }
        saunaMetrics[slug].views++;
    });

    // Process clicks
    bookingClicks.forEach(c => {
        try {
            const payload = JSON.parse(c.payload || '{}');
            let saunaId = payload.saunaId || 'ukjent';
            const type = payload.type;
            const sessionId = c.sessionId;

            // Normalize saunaId: if it's an ID, map it to slug. If it has a prefix, strip it.
            let slug = idToSlug[saunaId] || saunaId;
            if (slug.includes('/')) {
                const parts = slug.split('/');
                slug = parts[parts.length - 1];
            }

            if (!saunaMetrics[slug]) {
                saunaMetrics[slug] = {
                    name: nameMap[slug] || slug,
                    views: 0,
                    dropinClicks: 0,
                    privateClicks: 0,
                    uniqueDropinSessions: new Set(),
                    uniquePrivateSessions: new Set()
                };
            }

            // Raw click counts
            if (type === 'drop-in') {
                saunaMetrics[slug].dropinClicks++;
                if (sessionId) saunaMetrics[slug].uniqueDropinSessions.add(sessionId);
            }
            if (type === 'private') {
                saunaMetrics[slug].privateClicks++;
                if (sessionId) saunaMetrics[slug].uniquePrivateSessions.add(sessionId);
            }
        } catch (e) { }
    });

    const saunaStats = Object.entries(saunaMetrics).map(([id, data]) => {
        const uniqueTotal = data.uniqueDropinSessions.size + data.uniquePrivateSessions.size;
        return {
            id,
            ...data,
            uniqueDropin: data.uniqueDropinSessions.size,
            uniquePrivate: data.uniquePrivateSessions.size,
            conversion: data.views > 0 ? (uniqueTotal / data.views * 100).toFixed(1) : "0"
        };
    }).sort((a, b) => b.views - a.views);

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
                        Besøksstatistikk
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                        <Calendar size={16} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Tidsperiode:</span>
                        <RangeSelector currentDays={days} />
                    </div>
                </div>
                <a
                    href={`/api/analytics/export?days=${days}`}
                    download
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: 'white',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '0.75rem',
                        border: '1px solid #e2e8f0',
                        color: '#475569',
                        fontWeight: 600,
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                    }}
                >
                    <Download size={18} />
                    Last ned CSV-eksport
                </a>
            </div>

            {/* KPI Cards Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                <KPICard
                    title="Sidevisninger"
                    value={pageviews.toLocaleString()}
                    icon={<TrendingUp size={24} color="#3b82f6" />}
                    subtitle={`Siste ${days} dager`}
                />
                <KPICard
                    title="Totalt Samtykke"
                    value={totalConsentActions.toLocaleString()}
                    icon={<Shield size={24} color="#10b981" />}
                    subtitle={`Godtatt: ${consentStats.accepted} / Avslått: ${consentStats.declined}`}
                />
                <KPICard
                    title="Booking-klikk"
                    value={bookingClicks.length.toLocaleString()}
                    icon={<MousePointer2 size={24} color="#f59e0b" />}
                    subtitle="Totalt (Drop-in + Privat)"
                />
                <KPICard
                    title="Unike Sesjoner"
                    value={sessions.toLocaleString()}
                    icon={<Users size={24} color="#8b5cf6" />}
                    subtitle="Kun godtatt analyse"
                />
                <KPICard
                    title="Snitt sidevisninger"
                    value={sessions ? (pageviews / sessions).toFixed(1) : "0"}
                    icon={<Monitor size={24} color="#64748b" />}
                    subtitle="Per unik sesjon"
                />
            </div>

            {/* Per-Sauna Table */}
            <div style={{ ...cardStyle, marginBottom: '3rem' }}>
                <h2 style={cardTitleStyle}>Badstue-statistikk</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                <th style={thStyle}>Badstue</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Visninger</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Privat booking</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Enkel booking</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Konvertering</th>
                            </tr>
                        </thead>
                        <tbody>
                            {saunaStats.map((s) => (
                                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ ...tdStyle, fontWeight: 600 }}>{s.name}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right' }}>{s.views.toLocaleString()}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right', color: '#7c3aed', fontWeight: 500 }}>
                                        Privat ({s.uniquePrivate})
                                        {s.privateClicks > s.uniquePrivate && <span style={{ fontSize: '0.7rem', opacity: 0.6, display: 'block' }}>({s.privateClicks} totalt)</span>}
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'right', color: '#059669', fontWeight: 500 }}>
                                        Drop-in ({s.uniqueDropin})
                                        {s.dropinClicks > s.uniqueDropin && <span style={{ fontSize: '0.7rem', opacity: 0.6, display: 'block' }}>({s.dropinClicks} totalt)</span>}
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700 }}>{s.conversion}%</td>
                                </tr>
                            ))}
                            {saunaStats.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem', color: '#94a3b8' }}>
                                        Ingen spesifikk badstue-data tilgjengelig ennå.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
                {/* Popular Pages Table */}
                <div style={cardStyle}>
                    <h2 style={cardTitleStyle}>Populære Sider</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={thStyle}>Sti / URL</th>
                                    <th style={{ ...thStyle, textAlign: 'right' }}>Visninger</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topPages.map((p: any) => (
                                    <tr key={p.path} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ ...tdStyle, fontWeight: 500 }}>{p.path}</td>
                                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>
                                            {p._count.id.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {topPages.length === 0 && (
                                    <tr>
                                        <td colSpan={2} style={{ ...tdStyle, textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem', color: '#94a3b8' }}>
                                            Ingen data tilgjengelig ennå.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Device Information */}
                <div style={cardStyle}>
                    <h2 style={cardTitleStyle}>Enheter & Trafikkilder</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '0.5rem' }}>
                        {deviceStats.map((d: any) => {
                            const percentage = sessions ? Math.round((d._count.id / sessions) * 100) : 0;
                            return (
                                <div key={d.deviceType}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.625rem', fontSize: '0.95rem', fontWeight: 600 }}>
                                        <span style={{ textTransform: 'capitalize', color: '#475569' }}>
                                            {d.deviceType === 'mobile' ? 'Mobil' : d.deviceType === 'desktop' ? 'Desktop' : 'Ukjent'}
                                        </span>
                                        <span style={{ color: '#1e293b' }}>{percentage}% ({d._count.id})</span>
                                    </div>
                                    <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                height: '100%',
                                                width: `${percentage}%`,
                                                backgroundColor: d.deviceType === 'mobile' ? '#3b82f6' : '#8b5cf6',
                                                transition: 'width 1s ease-out'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {deviceStats.length === 0 && (
                            <p style={{ textAlign: 'center', color: '#94a3b8' }}>Ingen enhetsdata tilgjengelig.</p>
                        )}
                    </div>

                    <div style={{ marginTop: '2.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #f1f5f9' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                            Personvern-info
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                            Alle data er anonymisert. Vi lagrer ikke IP-adresser eller personidentifiserbar informasjon.
                            Statistikken er basert på valgfritt samtykke fra brukerne.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Reusable KPI Component
 */
function KPICard({ title, value, icon, subtitle }: any) {
    return (
        <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#64748b' }}>{title}</h3>
                    <p style={{ fontSize: '2.25rem', fontWeight: '900', color: '#1e293b', marginTop: '0.25rem', letterSpacing: '-0.025em' }}>
                        {value}
                    </p>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                    {icon}
                </div>
            </div>
            <p style={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8' }}>{subtitle}</p>
        </div>
    );
}

// Styling components
const cardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '1.25rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    border: '1px solid #f1f5f9'
};

const cardTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '1.75rem',
    letterSpacing: '-0.01em'
};

const thStyle = {
    padding: '1rem 0',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
};

const tdStyle = {
    padding: '1rem 0',
    fontSize: '0.925rem',
    color: '#475569'
};
