'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { getPreloadTargets, logPreloadResult } from '../actions'
import { Play, StopCircle, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function PreloadManager() {
    const [running, setRunning] = useState(false)
    const [progress, setProgress] = useState(0)
    const [total, setTotal] = useState(0)
    const [currentUrl, setCurrentUrl] = useState('')
    const [stats, setStats] = useState({ success: 0, fail: 0 })
    const [logs, setLogs] = useState<string[]>([])
    const [abortController, setAbortController] = useState<AbortController | null>(null)

    const startPreload = async () => {
        setRunning(true)
        setProgress(0)
        setStats({ success: 0, fail: 0 })
        setLogs([])

        try {
            const { targets } = await getPreloadTargets()
            setTotal(targets.length)

            const controller = new AbortController()
            setAbortController(controller)

            const errors: string[] = []
            let s = 0;
            let f = 0;

            // Process one by one (or small batches) to avoid overwhelming server
            for (let i = 0; i < targets.length; i++) {
                if (controller.signal.aborted) break;

                const url = targets[i]
                setCurrentUrl(url)

                try {
                    // Cache: no-store to force revalidation/generation if needed
                    const res = await fetch(url, { cache: 'no-store', signal: controller.signal })
                    if (res.ok) {
                        s++
                    } else {
                        f++
                        errors.push(`${url} (${res.status})`)
                    }
                } catch (e) {
                    if (controller.signal.aborted) throw e;
                    f++
                    errors.push(`${url} (Net Error)`)
                }

                setStats({ success: s, fail: f })
                setProgress(i + 1)
            }

            if (!controller.signal.aborted) {
                await logPreloadResult(s, f, errors)
                setLogs(prev => [`Ferdig! Suksess: ${s}, Feil: ${f}`])
            }

        } catch (e: any) {
            if (e.name === 'AbortError') {
                setLogs(prev => ['Avbrutt av bruker.'])
            } else {
                setLogs(prev => ['En feil oppstod: ' + e.message])
            }
        } finally {
            setRunning(false)
            setAbortController(null)
            setCurrentUrl('')
        }
    }

    const stopPreload = () => {
        if (abortController) {
            abortController.abort()
        }
    }

    const percent = total > 0 ? Math.round((progress / total) * 100) : 0

    return (
        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Preload Jobb</h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Varmer opp cachen ved å besøke alle offentlige sider.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {running ? (
                        <Button variant="danger" size="sm" onClick={stopPreload}>
                            <StopCircle size={16} style={{ marginRight: '0.5rem' }} />
                            Avbryt
                        </Button>
                    ) : (
                        <Button variant="primary" size="sm" onClick={startPreload}>
                            <Play size={16} style={{ marginRight: '0.5rem' }} />
                            Start Preload
                        </Button>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            {(running || progress > 0) && (
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem', color: '#475569' }}>
                        <span>{running ? `Jobber: ${currentUrl.split('/').pop() || '...'}` : (stats.fail > 0 ? 'Ferdig med feil' : 'Ferdig')}</span>
                        <span>{progress} / {total} ({percent}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${percent}%`,
                            height: '100%',
                            background: running ? '#3b82f6' : (stats.fail > 0 ? '#f59e0b' : '#16a34a'),
                            transition: 'width 0.2s'
                        }} />
                    </div>
                </div>
            )}

            {/* Stats */}
            {progress > 0 && (
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a' }}>
                        <CheckCircle size={16} />
                        <span style={{ fontWeight: 600 }}>{stats.success}</span> OK
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: stats.fail > 0 ? '#ef4444' : '#94a3b8' }}>
                        <AlertCircle size={16} />
                        <span style={{ fontWeight: 600 }}>{stats.fail}</span> Feilet
                    </div>
                </div>
            )}

            {/* Logs/Message */}
            {logs.length > 0 && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: '0.875rem', color: '#334155' }}>
                    {logs.map((log, i) => <div key={i}>{log}</div>)}
                </div>
            )}
        </div>
    )
}
