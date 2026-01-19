'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface PopularPagesCardProps {
    pages: Array<{
        path: string;
        _count: { id: number };
    }>;
}

export function PopularPagesCard({ pages }: PopularPagesCardProps) {
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    const handleCopyUrl = (path: string) => {
        navigator.clipboard.writeText(path);
        setCopiedUrl(path);
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    if (!pages || pages.length === 0) {
        return (
            <div style={{
                padding: '2rem',
                backgroundColor: '#fff',
                border: '1px solid #f1f5f9',
                borderRadius: '0.75rem'
            }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Populære Sider</h2>
                <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>Ingen data tilgjengelig ennå.</p>
            </div>
        );
    }

    // Find max count for scaling bars
    const maxCount = Math.max(...pages.map(p => p._count.id));

    return (
        <div style={{
            padding: '1.5rem',
            backgroundColor: '#fff',
            border: '1px solid #f1f5f9',
            borderRadius: '0.75rem'
        }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>
                Populære Sider
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pages.map((page, idx) => {
                    const percentage = (page._count.id / maxCount) * 100;
                    const label = page.path === '/' ? 'Forside' : page.path;
                    const displayPath = label.length > 40 ? label.substring(0, 37) + '...' : label;

                    return (
                        <div key={page.path} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            {/* Rank */}
                            <div style={{
                                width: '28px',
                                height: '28px',
                                backgroundColor: idx < 3 ? ['#fbbf24', '#d1d5db', '#cd7f32'][idx] : '#f1f5f9',
                                color: idx < 3 ? '#fff' : '#64748b',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                flexShrink: 0
                            }}>
                                {idx + 1}
                            </div>

                            {/* Bar chart + info */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <div
                                        style={{
                                            fontSize: '0.85rem',
                                            fontWeight: 500,
                                            color: '#475569',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            transition: 'color 0.2s'
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = '#1e293b')}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                                        title={page.path}
                                        onClick={() => handleCopyUrl(page.path)}
                                    >
                                        <span>{displayPath}</span>
                                        {copiedUrl === page.path ? (
                                            <Check size={14} color="#10b981" />
                                        ) : (
                                            <Copy size={14} opacity={0.5} />
                                        )}
                                    </div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b' }}>
                                        {page._count.id.toLocaleString()}
                                    </span>
                                </div>

                                {/* Bar */}
                                <div style={{
                                    height: '6px',
                                    backgroundColor: '#f1f5f9',
                                    borderRadius: '3px',
                                    overflow: 'hidden'
                                }}>
                                    <div
                                        style={{
                                            height: '100%',
                                            width: `${percentage}%`,
                                            backgroundColor: idx === 0 ? '#3b82f6' : idx === 1 ? '#8b5cf6' : idx === 2 ? '#06b6d4' : '#6366f1',
                                            transition: 'width 0.3s ease',
                                            borderRadius: '3px'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {pages.length >= 8 && (
                <button
                    style={{
                        marginTop: '1.5rem',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'transparent',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        color: '#3b82f6',
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f0f4f8';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    Vis alle populære sider →
                </button>
            )}
        </div>
    );
}
