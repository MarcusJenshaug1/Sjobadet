'use client';

import { useState } from 'react';
import { Info, ChevronDown } from 'lucide-react';

interface DataQualityBoxProps {
    consentStats: {
        accepted: number;
        declined: number;
        notChosenYet: number;
    };
    sessions: number;
}

export function DataQualityBox({ consentStats, sessions }: DataQualityBoxProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const coveragePercentage = sessions > 0 ? Math.round((consentStats.accepted / sessions) * 100) : 0;

    return (
        <div
            style={{
                padding: '1.5rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '0.75rem',
                marginBottom: '3rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
            }}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Header - Always visible */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Info size={20} color="#3b82f6" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                        Om datakvaliteten
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                        Datadekning: <strong>{coveragePercentage}%</strong> ({consentStats.accepted} av {sessions} sesjoner)
                    </p>
                </div>
                <ChevronDown
                    size={20}
                    color="#64748b"
                    style={{
                        transition: 'transform 0.2s ease',
                        transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                        flexShrink: 0
                    }}
                />
            </div>

            {/* Progress bar - Always visible */}
            <div style={{ marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                    <span>Godtatt: {consentStats.accepted}</span>
                    <span>•</span>
                    <span>Avslått: {consentStats.declined}</span>
                    <span>•</span>
                    <span>Ikke valgt: {consentStats.notChosenYet}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem', height: '8px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                    {consentStats.accepted > 0 && (
                        <div
                            style={{
                                flex: consentStats.accepted,
                                backgroundColor: '#10b981',
                                transition: 'flex 0.3s ease'
                            }}
                            title={`Godtatt: ${consentStats.accepted}`}
                        />
                    )}
                    {consentStats.declined > 0 && (
                        <div
                            style={{
                                flex: consentStats.declined,
                                backgroundColor: '#ef4444',
                                transition: 'flex 0.3s ease'
                            }}
                            title={`Avslått: ${consentStats.declined}`}
                        />
                    )}
                    {consentStats.notChosenYet > 0 && (
                        <div
                            style={{
                                flex: consentStats.notChosenYet,
                                backgroundColor: '#cbd5e1',
                                transition: 'flex 0.3s ease'
                            }}
                            title={`Ikke valgt: ${consentStats.notChosenYet}`}
                        />
                    )}
                </div>
            </div>

            {/* Detailed content - Collapsible */}
            {isExpanded && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', margin: 0 }}>
                        <strong>Hva betyr dette?</strong> Statistikken under viser kun oppførselen til brukere som har godtatt analyse-sporing. 
                        Det totale antallet sesjoner ({sessions.toLocaleString()}) inkluderer alle besøk, men bare {consentStats.accepted.toLocaleString()} med godtatt samtykke er fullt analysert.
                        <br /><br />
                        <strong>Godtatt: {consentStats.accepted}</strong> sesjoner har aktivt godtatt sporing.
                        <br />
                        <strong>Avslått: {consentStats.declined}</strong> sesjoner har eksplisitt avslått.
                        {consentStats.notChosenYet > 0 && (
                            <>
                                <br />
                                <strong>Ikke valgt: {consentStats.notChosenYet}</strong> sesjoner har ikke interagert med samtykkebanneret ennå.
                            </>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}
