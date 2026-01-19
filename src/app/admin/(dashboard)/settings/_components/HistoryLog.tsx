'use client'

import { useEffect, useState } from 'react'
import { getAdminLogs } from '../actions'
import { RefreshCw, Clock, Activity } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type LogEntry = {
    id: string
    action: string
    details: string | null
    status: string
    createdAt: Date
    performedBy: string | null
}

export default function HistoryLog() {
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [loading, setLoading] = useState(true)

    const fetchLogs = async () => {
        setLoading(true)
        const data = await getAdminLogs()
        setLogs(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Siste aktivitet</h3>
                <Button size="sm" variant="secondary" onClick={fetchLogs} disabled={loading}>
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </Button>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={thStyle}>Tid</th>
                            <th style={thStyle}>Handling</th>
                            <th style={thStyle}>Detaljer</th>
                            <th style={thStyle}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                                    Ingen historikk enda.
                                </td>
                            </tr>
                        ) : (
                            logs.map(log => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Clock size={12} color="#94a3b8" />
                                            {new Date(log.createdAt).toLocaleString('no-NO', {
                                                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </div>
                                    </td>
                                    <td style={{ ...tdStyle, fontWeight: 500 }}>{log.action}</td>
                                    <td style={tdStyle}>{log.details}</td>
                                    <td style={tdStyle}>
                                        <StatusBadge status={log.status} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    let color = '#64748b'
    let bg = '#f1f5f9'

    if (status === 'SUCCESS') {
        color = '#16a34a'
        bg = '#dcfce7'
    } else if (status === 'FAILURE') {
        color = '#dc2626'
        bg = '#fee2e2'
    } else if (status === 'WARNING') {
        color = '#d97706'
        bg = '#fef3c7'
    }

    return (
        <span style={{
            background: bg, color: color,
            padding: '0.15rem 0.5rem', borderRadius: '99px',
            fontSize: '0.75rem', fontWeight: 600,
            display: 'inline-block'
        }}>
            {status}
        </span>
    )
}

const thStyle = {
    padding: '0.75rem 1rem',
    textAlign: 'left' as const,
    fontWeight: 600,
    color: '#64748b'
}

const tdStyle = {
    padding: '0.75rem 1rem',
    verticalAlign: 'top',
    color: '#334155'
}
