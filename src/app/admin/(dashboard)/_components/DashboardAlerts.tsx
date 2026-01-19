'use client'

import { AlertTriangle, HardDrive, Image as ImageIcon, XCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type Props = {
    pendingMedia: number
    cacheStats: { activeSaunas: number; saunaDetails: number; settings: number }
    lastPreload: { status: string; createdAt: Date } | null
}

export default function DashboardAlerts({ pendingMedia, cacheStats, lastPreload }: Props) {
    const alerts = []

    // 1. Pending Media
    if (pendingMedia > 0) {
        alerts.push({
            id: 'media',
            type: 'warning',
            icon: <ImageIcon size={18} />,
            title: 'Media venter på godkjenning',
            message: `${pendingMedia} bilde(r) laster opp og trenger gjennomgang.`,
            action: { label: 'Gå til Galleri', href: '/admin/saunas' } // Assuming gallery is there or near
        })
    }

    // 2. Empty Cache
    if (cacheStats.activeSaunas === 0 && cacheStats.saunaDetails === 0) {
        alerts.push({
            id: 'cache',
            type: 'critical',
            icon: <HardDrive size={18} />,
            title: 'Cache er tom',
            message: 'Nettsiden kan oppleves treg. Kjør en preload for å varme opp cachen.',
            action: { label: 'Gå til Drift', href: '/admin/settings' }
        })
    }

    // 3. Preload Failure
    if (lastPreload && (lastPreload.status === 'FAILURE' || lastPreload.status === 'WARNING')) {
        alerts.push({
            id: 'preload',
            type: 'error',
            icon: <XCircle size={18} />,
            title: 'Siste preload feilet',
            message: 'Sjekk loggen for å se hvilke sider som ikke lastet.',
            action: { label: 'Se logg', href: '/admin/settings' }
        })
    }

    if (alerts.length === 0) return null

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {alerts.map(alert => (
                <div key={alert.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    background: getBgColor(alert.type),
                    border: `1px solid ${getBorderColor(alert.type)}`,
                    color: getTextColor(alert.type),
                    boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '2.5rem', height: '2.5rem',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.5)'
                    }}>
                        {alert.icon}
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{alert.title}</div>
                        <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>{alert.message}</div>
                    </div>

                    {alert.action && (
                        <Link href={alert.action.href} style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            fontWeight: 600, fontSize: '0.875rem',
                            padding: '0.5rem 1rem',
                            background: 'white',
                            borderRadius: '0.5rem',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            color: 'inherit',
                            textDecoration: 'none'
                        }}>
                            {alert.action.label}
                            <ArrowRight size={14} />
                        </Link>
                    )}
                </div>
            ))}
        </div>
    )
}

function getBgColor(type: string) {
    if (type === 'critical') return '#fee2e2'
    if (type === 'error') return '#fff1f2'
    if (type === 'warning') return '#fffbeb'
    return '#f1f5f9'
}

function getBorderColor(type: string) {
    if (type === 'critical') return '#fca5a5'
    if (type === 'error') return '#fecdd3'
    if (type === 'warning') return '#fde68a'
    return '#e2e8f0'
}

function getTextColor(type: string) {
    if (type === 'critical') return '#991b1b'
    if (type === 'error') return '#9f1239'
    if (type === 'warning') return '#92400e'
    return '#0f172a'
}
