'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HardDrive, Play, Activity, RefreshCw, CheckCircle, AlertTriangle, XCircle, Gauge, Shield, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { clearCacheAction, getPreloadTargets, logPreloadResult } from '../settings/actions'
import { useRouter } from 'next/navigation'

type Props = {
    lastCacheClear: { createdAt: Date } | null
    lastPreload: { createdAt: Date; status: string; details: string | null } | null
    cacheStats: { activeSaunas: number; saunaDetails: number; settings: number }
    lighthouse: { mobile: number; desktop: number; trend: number; lastScan: string }
    privacyStats: { consentRate7d: number; consentChanges24h: number; activeSessions: number; policyVersion: string } | null
}

export default function DriftStatus({ lastCacheClear, lastPreload, cacheStats, lighthouse, privacyStats }: Props) {
    const router = useRouter()
    const [preloadRunning, setPreloadRunning] = useState(false)
    const [preloadProgress, setPreloadProgress] = useState(0)
    const [preloadTotal, setPreloadTotal] = useState(0)
    const [clearingCache, setClearingCache] = useState(false)

    // Derived states
    const cacheStatus = cacheStats.activeSaunas > 0 ? 'OK' : 'Empty'
    const preloadStatus = lastPreload?.status || 'Idle'

    const handleClearCache = async () => {
        setClearingCache(true)
        await clearCacheAction('all')
        setClearingCache(false)
        router.refresh()
    }

    const handleStartPreload = async () => {
        setPreloadRunning(true)
        setPreloadProgress(0)

        try {
            const { targets } = await getPreloadTargets()
            setPreloadTotal(targets.length)

            let s = 0, f = 0
            const errors: string[] = []

            for (let i = 0; i < targets.length; i++) {
                try {
                    const res = await fetch(targets[i], { cache: 'no-store' })
                    if (res.ok) s++
                    else {
                        f++
                        errors.push(targets[i])
                    }
                } catch (e) {
                    f++
                    errors.push(targets[i])
                }
                setPreloadProgress(i + 1)
            }

            await logPreloadResult(s, f, errors)
            router.refresh()
        } catch (e) {
            console.error(e)
        } finally {
            setPreloadRunning(false)
        }
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>

            {/* Cache Card */}
            <DriftCard
                icon={<HardDrive size={20} />}
                title="Cache Status"
                status={cacheStatus === 'OK' ? 'success' : 'warning'}
                statusText={cacheStatus}
            >
                <div style={statRow}>
                    <span style={label}>Active Items:</span>
                    <span style={value}>{cacheStats.activeSaunas + cacheStats.saunaDetails}</span>
                </div>
                <div style={statRow}>
                    <span style={label}>Sist tømt:</span>
                    <span style={value}>{lastCacheClear ? new Date(lastCacheClear.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                    <Button
                        size="sm"
                        variant="outline"
                        style={{ width: '100%' }}
                        onClick={handleClearCache}
                        disabled={clearingCache}
                    >
                        {clearingCache ? <RefreshCw className="animate-spin" size={14} /> : <RefreshCw size={14} />}
                        <span style={{ marginLeft: '0.5rem' }}>Tøm Cache</span>
                    </Button>
                </div>
            </DriftCard>

            {/* Preload Card */}
            <DriftCard
                icon={<Activity size={20} />}
                title="Preload Jobb"
                status={preloadRunning ? 'info' : (preloadStatus === 'SUCCESS' ? 'success' : (preloadStatus === 'Idle' ? 'neutral' : 'error'))}
                statusText={preloadRunning ? 'Kjører...' : preloadStatus}
            >
                {preloadRunning ? (
                    <div style={{ padding: '0.5rem 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                            <span>Progress</span>
                            <span>{preloadProgress} / {preloadTotal}</span>
                        </div>
                        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${(preloadProgress / preloadTotal) * 100}%`, background: '#3b82f6', height: '100%', transition: 'width 0.2s' }} />
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={statRow}>
                            <span style={label}>Sist kjørt:</span>
                            <span style={value}>{lastPreload ? new Date(lastPreload.createdAt).toLocaleDateString() : 'Aldri'}</span>
                        </div>
                        <div style={statRow}>
                            <span style={label}>Resultat:</span>
                            <span style={value}>{lastPreload ? (lastPreload.status === 'SUCCESS' ? '100% OK' : 'Feil oppdaget') : '-'}</span>
                        </div>
                    </>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                    <Button
                        size="sm"
                        variant={preloadRunning ? 'secondary' : 'outline'}
                        style={{ width: '100%' }}
                        onClick={handleStartPreload}
                        disabled={preloadRunning}
                    >
                        {preloadRunning ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} />}
                        <span style={{ marginLeft: '0.5rem' }}>Start Preload</span>
                    </Button>
                </div>
            </DriftCard>

            {/* Lighthouse Card */}
            <DriftCard
                icon={<Gauge size={20} />}
                title="Lighthouse"
                status={lighthouse.mobile > 90 ? 'success' : 'warning'}
                statusText="God ytelse"
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: getScoreColor(lighthouse.mobile) }}>{lighthouse.mobile}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Mobil</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: getScoreColor(lighthouse.desktop) }}>{lighthouse.desktop}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Desktop</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 600, color: lighthouse.trend > 0 ? '#16a34a' : '#ef4444' }}>
                            {lighthouse.trend > 0 ? '+' : ''}{lighthouse.trend}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Trend</div>
                    </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
                    Sist sjekket: {new Date(lighthouse.lastScan).toLocaleDateString()}
                </div>
            </DriftCard>

            {/* Privacy & Consent Card */}
            {privacyStats && (
                <DriftCard
                    icon={<Shield size={20} />}
                    title="Personvern & Samtykke"
                    status={privacyStats.consentRate7d >= 50 ? 'success' : 'warning'}
                    statusText={`${privacyStats.consentRate7d}% samtykke`}
                >
                    <div style={statRow}>
                        <span style={label}>Samtykke-rate (7d):</span>
                        <span style={value}>{privacyStats.consentRate7d}%</span>
                    </div>
                    <div style={statRow}>
                        <span style={label}>Endringer (24t):</span>
                        <span style={value}>{privacyStats.consentChanges24h}</span>
                    </div>
                    <div style={statRow}>
                        <span style={label}>Policy-versjon:</span>
                        <span style={value}><code style={{ fontSize: '0.85rem' }}>{privacyStats.policyVersion}</code></span>
                    </div>
                    <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <Link href="/admin/privacy" style={{ display: 'block', width: '100%', textDecoration: 'none' }}>
                            <Button size="sm" variant="outline" style={{ width: '100%' }}>
                                Gå til personvern
                            </Button>
                        </Link>
                    </div>
                </DriftCard>
            )}

            {/* Sessions Card */}
            {privacyStats && (
                <DriftCard
                    icon={<Users size={20} />}
                    title="Sessions"
                    status="info"
                    statusText={`${privacyStats.activeSessions} aktive`}
                >
                    <div style={statRow}>
                        <span style={label}>Aktive sessions:</span>
                        <span style={value}>{privacyStats.activeSessions}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', fontStyle: 'italic' }}>
                        Kun sessions med analyse-samtykke
                    </div>
                    <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <Link href="/admin/privacy?tab=sessions" style={{ display: 'block', width: '100%', textDecoration: 'none' }}>
                            <Button size="sm" variant="outline" style={{ width: '100%' }}>
                                Se sessions
                            </Button>
                        </Link>
                    </div>
                </DriftCard>
            )}

        </div>
    )
}

// --- Subcomponents ---

function DriftCard({ icon, title, status, statusText, children }: any) {
    return (
        <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a', fontWeight: 600 }}>
                    <span style={{ color: '#64748b' }}>{icon}</span>
                    {title}
                </div>
                <StatusBadge status={status} text={statusText} />
            </div>
            {children}
        </div>
    )
}

function StatusBadge({ status, text }: { status: 'success' | 'warning' | 'error' | 'info' | 'neutral', text: string }) {
    const colors = {
        success: { bg: '#dcfce7', text: '#16a34a' },
        warning: { bg: '#fef3c7', text: '#d97706' },
        error: { bg: '#fee2e2', text: '#dc2626' },
        info: { bg: '#dbeafe', text: '#2563eb' },
        neutral: { bg: '#f1f5f9', text: '#64748b' }
    }
    const c = colors[status]
    return (
        <span style={{
            background: c.bg, color: c.text,
            padding: '0.2rem 0.6rem', borderRadius: '99px',
            fontSize: '0.75rem', fontWeight: 600
        }}>
            {text}
        </span>
    )
}

const statRow = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    marginBottom: '0.5rem',
    color: '#334155'
}

const label = { color: '#64748b' }
const value = { fontWeight: 500 }

function getScoreColor(score: number) {
    if (score >= 90) return '#16a34a'
    if (score >= 50) return '#d97706'
    return '#dc2626'
}
