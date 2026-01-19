import prisma from '@/lib/prisma'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Activity, Users, Radio, Image as ImageIcon, Clock4, MousePointer2, Gauge, ListChecks } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const cardStyle = {
    padding: '1.25rem',
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    border: '1px solid #edf2f7',
} as const

export default async function AdminDashboard() {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    // Fetch core snapshots in parallel
    const [saunaCount, activeCount, mediaPending, priceItems, subscriptions, sessions, pageviews, consentEvents] = await Promise.all([
        prisma.sauna.count(),
        prisma.sauna.count({ where: { status: 'active' } }),
        prisma.mediaAsset.count({ where: { status: 'pending' } }),
        prisma.priceItem.count({ where: { active: true } }),
        prisma.subscription.count({ where: { active: true } }),
        (prisma as any).analyticsSession?.count ? (prisma as any).analyticsSession.count({ where: { startTime: { gte: since } } }) : 0,
        (prisma as any).analyticsEvent?.count ? (prisma as any).analyticsEvent.count({ where: { type: 'pageview', timestamp: { gte: since } } }) : 0,
        (prisma as any).analyticsEvent?.findMany
            ? (prisma as any).analyticsEvent.findMany({
                  where: { type: 'event', eventName: 'consent_choice', timestamp: { gte: since } },
                  select: { payload: true },
              })
            : [],
    ])

    const consentEventsArray = Array.isArray(consentEvents) ? consentEvents : []
    let consentAccepted = 0
    let consentDeclined = 0
    consentEventsArray.forEach((e: any) => {
        try {
            const choice = JSON.parse(e.payload || '{}').choice
            if (choice === 'accepted') consentAccepted++
            if (choice === 'declined') consentDeclined++
        } catch (err) {}
    })

    const quickLinks = [
        { href: '/admin/analytics', label: 'Analytics', icon: Gauge },
        { href: '/admin/badstuer', label: 'Badstuer', icon: Activity },
        { href: '/admin/badstuer/ny', label: 'Ny badstue', icon: ListChecks },
        { href: '/admin/apningstider', label: 'Åpningstider', icon: Clock4 },
        { href: '/admin/medlemskap', label: 'Medlemskap', icon: Users },
    ]

    return (
        <div style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '1.5rem', fontWeight: 800, color: '#1f2937' }}>Dashboard</h1>

            {/* Snapshot cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <SnapshotCard title="Totalt antall badstuer" value={saunaCount} icon={<Activity size={20} color="#3b82f6" />} />
                <SnapshotCard title="Aktive badstuer" value={activeCount} accent="#16a34a" icon={<Radio size={20} color="#16a34a" />} />
                <SnapshotCard title="Media som venter" value={mediaPending} accent="#f59e0b" icon={<ImageIcon size={20} color="#f59e0b" />} />
                <SnapshotCard title="Aktive priser" value={priceItems} accent="#6366f1" icon={<MousePointer2 size={20} color="#6366f1" />} />
                <SnapshotCard title="Aktive medlemskap" value={subscriptions} accent="#0ea5e9" icon={<Users size={20} color="#0ea5e9" />} />
            </div>

            {/* Analytics mini snapshot */}
            <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>Analytics (siste 7 dager)</h2>
                        <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.25rem 0 0' }}>Kjappe nøkkeltall uten å åpne Analytics-siden.</p>
                    </div>
                    <Link href="/admin/analytics" style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600 }}>Gå til Analytics →</Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                    <MiniStat label="Sidevisninger" value={pageviews} accent="#2563eb" />
                    <MiniStat label="Sesjoner" value={sessions} accent="#16a34a" />
                    <MiniStat label="Samtykke: godtatt" value={consentAccepted} accent="#10b981" />
                    <MiniStat label="Samtykke: avslått" value={consentDeclined} accent="#ef4444" />
                </div>
            </div>

            {/* Quick links */}
            <div style={{ ...cardStyle, marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.75rem' }}>Snarveier</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                    {quickLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.75rem',
                                padding: '0.85rem 1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                color: '#1f2937',
                                textDecoration: 'none',
                                background: '#f8fafc',
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                            }}
                        >
                            <link.icon size={18} />
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{link.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

function SnapshotCard({ title, value, accent = '#3b82f6', icon }: { title: string; value: number; accent?: string; icon: ReactNode }) {
    return (
        <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.95rem', color: '#6b7280', fontWeight: 600 }}>{title}</span>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.5rem', borderRadius: '999px', border: '1px solid #e5e7eb' }}>{icon}</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: accent }}>{value.toLocaleString()}</div>
        </div>
    )
}

function MiniStat({ label, value, accent }: { label: string; value: number; accent: string }) {
    return (
        <div style={{ padding: '0.85rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', background: '#f8fafc' }}>
            <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: accent, marginTop: '0.15rem' }}>{value.toLocaleString()}</div>
        </div>
    )
}
