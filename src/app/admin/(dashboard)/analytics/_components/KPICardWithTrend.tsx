'use client';

import React, { useState } from 'react';
import { HelpCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardWithTrendProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    subtitle?: string;
    trend?: {
        value: number; // percentage change
        label: string; // "vs. forrige 30 dager"
    };
    definition?: string; // tooltip definition
}

export function KPICardWithTrend({
    title,
    value,
    icon,
    subtitle,
    trend,
    definition
}: KPICardWithTrendProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    const cardStyle = {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '1.25rem',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        border: '1px solid #f1f5f9'
    };

    const isPositiveTrend = trend && trend.value >= 0;

    return (
        <div style={cardStyle} className="kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#64748b', margin: 0 }}>
                            {title}
                        </h3>
                        {definition && (
                            <div
                                style={{ position: 'relative', cursor: 'pointer' }}
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                                   onFocus={() => setShowTooltip(true)}
                                   onBlur={() => setShowTooltip(false)}
                                   tabIndex={0}
                                   role="button"
                                   aria-label={`Info: ${definition}`}
                            >
                                <HelpCircle size={16} color="#94a3b8" />
                                {showTooltip && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: '100%',
                                            left: 0,
                                            marginBottom: '0.5rem',
                                            backgroundColor: '#1e293b',
                                            color: 'white',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.8rem',
                                            maxWidth: '200px',
                                            zIndex: 10,
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                            whiteSpace: 'normal',
                                            lineHeight: '1.4'
                                        }}
                                    >
                                        {definition}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: '-4px',
                                                left: '8px',
                                                width: '8px',
                                                height: '8px',
                                                backgroundColor: '#1e293b',
                                                transform: 'rotate(45deg)'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <p style={{ fontSize: '2.25rem', fontWeight: '900', color: '#1e293b', marginTop: '0.25rem', letterSpacing: '-0.025em' }}>
                        {value}
                    </p>
                </div>
                <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                    {icon}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', margin: 0 }}>
                    {subtitle}
                </p>
                {trend && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: isPositiveTrend ? '#10b981' : '#ef4444'
                        }}
                    >
                        {isPositiveTrend ? (
                            <TrendingUp size={14} />
                        ) : (
                            <TrendingDown size={14} />
                        )}
                        <span>
                            {isPositiveTrend ? '+' : ''}{trend.value}%
                        </span>
                        <span style={{ color: '#94a3b8' }}>
                            {trend.label}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
