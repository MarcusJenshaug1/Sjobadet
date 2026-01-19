'use client'

import { useState } from 'react'
import CacheManager from './CacheManager'
import PreloadManager from './PreloadManager'
import HistoryLog from './HistoryLog'
import { Server, Activity, Database } from 'lucide-react'

export default function OperationsManager() {
    const [activeTab, setActiveTab] = useState<'drift' | 'logg'>('drift')

    return (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            {/* Header / Tabs */}
            <div style={{ borderBottom: '1px solid #e2e8f0', display: 'flex' }}>
                <button
                    onClick={() => setActiveTab('drift')}
                    style={{
                        flex: 1, padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.95rem',
                        background: activeTab === 'drift' ? 'white' : '#f8fafc',
                        color: activeTab === 'drift' ? '#2563eb' : '#64748b',
                        borderBottom: activeTab === 'drift' ? '2px solid #2563eb' : 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                    }}
                >
                    <Server size={18} />
                    Drift & Ytelse
                </button>
                <button
                    onClick={() => setActiveTab('logg')}
                    style={{
                        flex: 1, padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.95rem',
                        background: activeTab === 'logg' ? 'white' : '#f8fafc',
                        color: activeTab === 'logg' ? '#2563eb' : '#64748b',
                        borderBottom: activeTab === 'logg' ? '2px solid #2563eb' : 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                    }}
                >
                    <Activity size={18} />
                    Logg & Historikk
                </button>
            </div>

            {/* Content */}
            <div style={{ padding: '2rem' }}>
                {activeTab === 'drift' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Preload Section */}
                        <section>
                            <h2 style={subHeaderStyle}>
                                <Database size={20} className="text-indigo-600" />
                                Preload / Oppvarming
                            </h2>
                            <PreloadManager />
                        </section>

                        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9' }} />

                        {/* Cache Section */}
                        <section>
                            <h2 style={subHeaderStyle}>
                                <Server size={20} className="text-emerald-600" />
                                Cache Styring
                            </h2>
                            <CacheManager />
                        </section>
                    </div>
                )}

                {activeTab === 'logg' && (
                    <HistoryLog />
                )}
            </div>
        </div>
    )
}

const subHeaderStyle = {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
}
