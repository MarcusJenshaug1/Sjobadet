'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface ClearAnalyticsButtonProps {
    username?: string;
}

export function ClearAnalyticsButton({ username }: ClearAnalyticsButtonProps) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Only show for Marcus
    if (username !== 'Marcus') {
        return null;
    }

    const handleClear = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/analytics/clear', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    type: 'success',
                    text: `Statistikk slettet! ${data.deleted.events} events, ${data.deleted.sessions} sesjoner fjernet.`
                });
                setShowConfirm(false);
                // Reload page after 2 seconds
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setMessage({
                    type: 'error',
                    text: data.error || 'Feil ved sletting av statistikk'
                });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Nettverksfeil ved sletting av statistikk'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setShowConfirm(true)}
                   data-clear-analytics-button
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#fee2e2',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fca5a5';
                    e.currentTarget.style.borderColor = '#f87171';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                    e.currentTarget.style.borderColor = '#fecaca';
                }}
                title="Kun Marcus kan slette all statistikk"
            >
                <Trash2 size={18} />
                Tøm statistikk
            </button>

            {showConfirm && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    }}
                    onClick={() => setShowConfirm(false)}
                >
                    <div
                        style={{
                            padding: '2rem',
                            borderRadius: '1rem',
                            border: '1px solid #fee2e2',
                            backgroundColor: '#fef2f2',
                            maxWidth: '400px',
                            textAlign: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Trash2 size={48} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ color: '#991b1b', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                            Slette all statistikk?
                        </h3>
                        <p style={{ color: '#7f1d1d', marginBottom: '1.5rem' }}>
                            Dette vil permanent slette all analytics-data. Denne handlingen kan ikke angres.
                        </p>

                        {message && (
                            <div
                                style={{
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    marginBottom: '1rem',
                                    backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                                    color: message.type === 'success' ? '#15803d' : '#991b1b',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {message.text}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={loading}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#e5e7eb',
                                    color: '#374151',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    opacity: loading ? 0.5 : 1
                                }}
                            >
                                Avbryt
                            </button>
                            <button
                                onClick={handleClear}
                                disabled={loading}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontWeight: '600',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? 'Sletter...' : 'Ja, slett alt'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
