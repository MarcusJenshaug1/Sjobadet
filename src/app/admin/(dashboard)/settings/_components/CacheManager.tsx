'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { clearCacheAction, getCacheStatsAction, CacheType } from '../actions'
import { RefreshCw, CheckCircle, AlertTriangle, Loader2, Trash2 } from 'lucide-react'



export default function CacheManager() {
    const [loading, setLoading] = useState<CacheType | null>(null)
    const [status, setStatus] = useState<Record<string, string>>({})
    const [stats, setStats] = useState<{ activeSaunas: number; saunaDetails: number; settings: number } | null>(null)

    const fetchStats = async () => {
        try {
            const data = await getCacheStatsAction()
            setStats(data)
        } catch (e) {
            console.error('Failed to fetch stats', e)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    const handleClear = async (type: CacheType) => {
        setLoading(type)
        setStatus(prev => ({ ...prev, [type]: '' }))

        try {
            const res = await clearCacheAction(type)
            if (res.success) {
                setStatus(prev => ({ ...prev, [type]: 'Suksess: ' + res.message }))
                await fetchStats()
            } else {
                setStatus(prev => ({ ...prev, [type]: 'Feil: ' + res.error }))
            }
        } catch (e) {
            setStatus(prev => ({ ...prev, [type]: 'Kritisk feil' }))
        } finally {
            setLoading(null)
        }
    }

    const rows = [
        {
            id: 'public',
            label: 'Public sider',
            description: 'Forside, infosider og statisk innhold (ISR)',
            approx: 'Forside, Info',
            count: null
        },
        {
            id: 'sauna-details',
            label: 'Badstue detaljer',
            description: 'Bilder, beskrivelser og fasiliteter',
            approx: 'Alle aktive badstuer',
            count: stats ? `${stats.saunaDetails} elementer` : '...'
        },
        {
            id: 'availability',
            label: 'Ledighet & Booking',
            description: 'Kortlevd cache for tilgjengelighet (5 min)',
            approx: 'Live data',
            count: stats ? `${stats.activeSaunas} lister` : '...'
        },
    ] as const

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <th style={thStyle}>Cache Type</th>
                        <th style={thStyle}>Innhold</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Handling</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={tdStyle}>
                                <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.label}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{row.description}</div>
                            </td>
                            <td style={tdStyle}>
                                <span style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', color: '#475569', marginRight: '0.5rem' }}>
                                    {row.approx}
                                </span>
                                {row.count && (
                                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                        ({row.count})
                                    </span>
                                )}
                            </td>
                            <td style={tdStyle}>
                                {status[row.id] ? (
                                    <span style={{ fontSize: '0.85rem', color: status[row.id].startsWith('Feil') ? '#ef4444' : '#16a34a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        {status[row.id].startsWith('Feil') ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                                        {status[row.id].replace('Suksess: ', '')}
                                    </span>
                                ) : (
                                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>-</span>
                                )}
                            </td>
                            <td style={tdStyle}>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleClear(row.id as CacheType)}
                                    disabled={loading !== null}
                                >
                                    {loading === row.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                    <span style={{ marginLeft: '0.5rem' }}>Tøm</span>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {/* Global Clear */}
                    <tr style={{ background: '#f8fafc' }}>
                        <td style={tdStyle} colSpan={3}>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>Tøm all cache</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Nullstiller alt innhold (kan gi midlertidig treghet)</div>
                        </td>
                        <td style={tdStyle}>
                            <Button
                                size="sm"
                                variant="secondary"
                                style={{ borderColor: '#e2e8f0' }}
                                onClick={() => handleClear('all')}
                                disabled={loading !== null}
                            >
                                {loading === 'all' ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                                <span style={{ marginLeft: '0.5rem' }}>Tøm alt</span>
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

const thStyle = {
    padding: '1rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#64748b'
}

const tdStyle = {
    padding: '1rem',
    verticalAlign: 'middle'
}
