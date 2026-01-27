'use client'

import { useEffect, useState } from 'react'
import { getAdminLogs } from '../actions'
import { RefreshCw, Clock, Activity, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'

type LogEntry = {
    id: string
    action: string
    details: string | null
    status: string
    createdAt: Date
    performedBy: string | null
}

type LogsResponse = {
    logs: LogEntry[]
    total: number
    page: number
    pageSize: number
}

export default function HistoryLog() {
    const [data, setData] = useState<LogsResponse>({ logs: [], total: 0, page: 1, pageSize: 10 })
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('ALL')

    const fetchLogs = async (page = 1) => {
        setLoading(true)
        const result = await getAdminLogs(page)
        setData(result)
        setLoading(false)
    }

    useEffect(() => {
        fetchLogs(1)
    }, [])

    const logs = data.logs
    const totalPages = Math.ceil(data.total / data.pageSize)
    const uniqueActions = ['ALL', ...Array.from(new Set(logs.map(l => l.action)))]
    const filteredLogs = filter === 'ALL' ? logs : logs.filter(l => l.action === filter)

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Siste aktivitet ({data.total} totalt)</h3>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        size="sm"
                    >
                        {uniqueActions.map(action => (
                            <option key={action} value={action}>{action === 'ALL' ? 'Alle typer' : action}</option>
                        ))}
                    </Select>

                    <Button size="sm" variant="secondary" onClick={() => fetchLogs(data.page)} disabled={loading}>
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </Button>
                </div>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={thStyle}>Tid</th>
                            <th style={thStyle}>Kilde</th>
                            <th style={thStyle}>Handling</th>
                            <th style={thStyle}>Detaljer</th>
                            <th style={thStyle}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                                    Ingen historikk funnet for dette filteret.
                                </td>
                            </tr>
                        ) : (
                            filteredLogs.map(log => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Clock size={12} color="#94a3b8" />
                                            {new Date(log.createdAt).toLocaleString('no-NO', {
                                                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <SourceBadge source={log.performedBy || 'System'} />
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

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => fetchLogs(1)}
                        disabled={loading || data.page === 1}
                        style={{ padding: '0.3rem 0.6rem' }}
                    >
                        Første
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => fetchLogs(Math.max(1, data.page - 1))}
                        disabled={loading || data.page === 1}
                    >
                        <ChevronLeft size={16} />
                    </Button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - data.page) <= 2)
                            .map((page, index, array) => (
                                <div key={page} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    {index > 0 && array[index - 1] !== page - 1 && <span style={{ color: '#94a3b8' }}>...</span>}
                                    <button
                                        onClick={() => fetchLogs(page)}
                                        disabled={loading}
                                        style={{
                                            minWidth: '2rem',
                                            height: '2rem',
                                            borderRadius: '0.375rem',
                                            border: page === data.page ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                                            background: page === data.page ? '#3b82f6' : 'white',
                                            color: page === data.page ? 'white' : '#334155',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            opacity: loading ? 0.5 : 1
                                        }}
                                    >
                                        {page}
                                    </button>
                                </div>
                            ))
                        }
                    </div>

                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => fetchLogs(Math.min(totalPages, data.page + 1))}
                        disabled={loading || data.page === totalPages}
                    >
                        <ChevronRight size={16} />
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => fetchLogs(totalPages)}
                        disabled={loading || data.page === totalPages}
                        style={{ padding: '0.3rem 0.6rem' }}
                    >
                        Siste
                    </Button>
                </div>
            )}
        </div>
    )
}

function SourceBadge({ source }: { source: string }) {
    const isAdmin = source === 'Admin';
    return (
        <Badge
            size="sm"
            variant={isAdmin ? 'info' : 'neutral'}
            style={{ textTransform: 'uppercase' }}
        >
            {source}
        </Badge>
    );
}

function StatusBadge({ status }: { status: string }) {
    let variant: 'success' | 'info' | 'danger' | 'warning' | 'neutral' = 'neutral'

    if (status === 'SUCCESS') {
        variant = 'success'
    } else if (status === 'OK') {
        variant = 'info'
    } else if (status === 'FAILURE') {
        variant = 'danger'
    } else if (status === 'WARNING') {
        variant = 'warning'
    }

    return (
        <Badge size="sm" variant={variant}>
            {status}
        </Badge>
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
