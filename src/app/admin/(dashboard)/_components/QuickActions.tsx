'use client'

import { Plus, Settings, RefreshCw, Zap, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { clearCacheAction } from '../settings/actions'
import { useState } from 'react'

export default function QuickActions() {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)

    const handleClearPublicCache = async () => {
        setLoading('cache')
        await clearCacheAction('public')
        setLoading(null)
        router.refresh()
    }

    return (
        <div style={{ background: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Snarveier</h3>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
                <Shortcut
                    href="/admin/badstuer/ny"
                    icon={<Plus size={16} />}
                    label="Ny badstue"
                    color="blue"
                />

                <Shortcut
                    href="/admin/medlemskap"
                    icon={<CreditCardIcon size={16} />}
                    label="Nytt medlemskap"
                    color="blue"
                />

                <Shortcut
                    href="/admin/brukere"
                    icon={<UserPlus size={16} />}
                    label="Ny adminbruker"
                    color="blue"
                />


                <div style={{ height: '1px', background: '#f1f5f9', margin: '0.25rem 0' }} />

                <button
                    onClick={handleClearPublicCache}
                    disabled={!!loading}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
                        padding: '0.75rem', borderRadius: '0.5rem',
                        fontSize: '0.875rem', fontWeight: 500, color: '#475569',
                        background: loading === 'cache' ? '#f8fafc' : 'transparent',
                        border: 'none', cursor: 'pointer', textAlign: 'left',
                        transition: 'background 0.2s'
                    }}
                    className="hover:bg-slate-50"
                >
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '2.5rem', height: '2.5rem', flexShrink: 0,
                        borderRadius: '0.4rem', background: '#f1f5f9', color: '#64748b'
                    }}>
                        <RefreshCw size={16} className={loading === 'cache' ? 'animate-spin' : ''} />
                    </div>
                    Tøm public cache
                </button>

                <Link href="/admin/settings" style={{ textDecoration: 'none' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
                        padding: '0.75rem', borderRadius: '0.5rem',
                        fontSize: '0.875rem', fontWeight: 500, color: '#475569',
                        transition: 'background 0.2s'
                    }}
                        className="hover:bg-slate-50"
                    >
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '2.5rem', height: '2.5rem', flexShrink: 0,
                            borderRadius: '0.4rem', background: '#f1f5f9', color: '#64748b'
                        }}>
                            <Zap size={16} />
                        </div>
                        Gå til drift & preload
                    </div>
                </Link>
            </div>
        </div>
    )
}

function Shortcut({ href, icon, label }: any) {
    return (
        <Link href={href} style={{ textDecoration: 'none' }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem', borderRadius: '0.5rem',
                fontSize: '0.875rem', fontWeight: 500, color: '#334155',
                border: '1px solid transparent',
                transition: 'all 0.2s'
            }}
                className="hover:bg-slate-50 hover:border-slate-200"
            >
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '2.5rem', height: '2.5rem', flexShrink: 0,
                    borderRadius: '0.4rem',
                    background: '#eff6ff', color: '#3b82f6'
                }}>
                    {icon}
                </div>
                {label}
            </div>
        </Link>
    )
}

function CreditCardIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
    )
}
