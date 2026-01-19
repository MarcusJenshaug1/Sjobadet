import { Clock, CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type LogEntry = {
    id: string
    action: string
    details: string | null
    status: string
    createdAt: Date
    performedBy: string | null
}

type Props = {
    logs: LogEntry[]
}

export default function RecentActivity({ logs }: Props) {
    return (
        <div style={{ background: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Siste Aktivitet</h3>
                <Link href="/admin/settings" style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    Se alle <ArrowRight size={14} style={{ marginLeft: '0.2rem' }} />
                </Link>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {logs.length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>Ingen aktivitet registrert.</div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} style={{
                            padding: '0.75rem 1.25rem',
                            borderBottom: '1px solid #f8fafc',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{ color: getStatusColor(log.status) }}>
                                {getStatusIcon(log.status)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.1rem' }}>
                                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '0.875rem' }}>{formatAction(log.action)}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{timeAgo(new Date(log.createdAt))}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' }}>
                                        {log.details || 'Ingen detaljer'}
                                    </div>
                                    <div style={{
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        padding: '0.1rem 0.4rem',
                                        borderRadius: '4px',
                                        background: '#f1f5f9',
                                        color: '#475569',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        {log.performedBy || 'System'}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

function getStatusColor(status: string) {
    if (status === 'SUCCESS') return '#16a34a'
    if (status === 'OK') return '#0ea5e9'
    if (status === 'FAILURE') return '#dc2626'
    return '#d97706'
}

function getStatusIcon(status: string) {
    if (status === 'SUCCESS') return <CheckCircle size={16} />
    if (status === 'OK') return <CheckCircle size={16} />
    if (status === 'FAILURE') return <XCircle size={16} />
    return <AlertTriangle size={16} />
}

function formatAction(action: string) {
    const map: Record<string, string> = {
        'CACHE_CLEAR': 'Cache Tømt',
        'PRELOAD_RUN': 'Preload Kjørt',
        'SETTINGS_UPDATE': 'Innstillinger Endret',
        'PRELOAD_START': 'Preload Startet',
        'LOGIN': 'Innlogging',
        'LOGOUT': 'Utlogging',
        'AVAILABILITY_CHECK': 'Ledighetssjekk',
        'SCRAPER_RUN': 'Ledighetssjekk'
    }
    return map[action] || action
}

function timeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) return Math.floor(interval) + " år siden";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " mnd siden";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " dager siden";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "t siden";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m siden";
    return "Akkurat nå";
}
