'use client'

import { Users, Flame, Image as ImageIcon, CreditCard, ArrowRight, Shield } from 'lucide-react'
import Link from 'next/link'

type Props = {
    stats: {
        pendingMedia: number
        activeSaunas: number
        totalSaunas: number
        users: number
        memberships: number
        totalMedia: number
        prices?: number
    }
}

export default function ActionableKPIs({ stats }: Props) {
    const cards = [
        {
            title: 'Badstuer',
            value: `${stats.activeSaunas} / ${stats.totalSaunas}`,
            label: 'Aktive',
            icon: <Flame size={20} />,
            href: '/admin/badstuer',
            action: 'Administrer',
            warning: stats.activeSaunas === 0
        },
        {
            title: 'Bilder',
            value: stats.totalMedia,
            label: stats.pendingMedia > 0 ? `${stats.pendingMedia} venter` : 'I galleri',
            icon: <ImageIcon size={20} />,
            href: '/admin/media',
            action: stats.pendingMedia > 0 ? 'Godkjenn nå' : 'Gå til galleri',
            warning: stats.pendingMedia > 0,
            highlight: stats.pendingMedia > 0
        },
        {
            title: 'Medlemskap',
            value: stats.memberships,
            label: 'Aktive typer',
            icon: <CreditCard size={20} />,
            href: '/admin/medlemskap',
            action: 'Administrer',
            warning: stats.memberships === 0
        },
        {
            title: 'Administratorer',
            value: stats.users,
            label: 'Aktive brukere',
            icon: <Users size={20} />,
            href: '/admin/brukere',
            action: 'Se liste',
            warning: false
        }

    ]

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {cards.map((card, i) => (
                <Link key={i} href={card.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{
                        background: card.highlight ? '#f0f9ff' : 'white',
                        border: card.highlight ? '1px solid #bae6fd' : '1px solid #e2e8f0',
                        borderRadius: '0.75rem',
                        padding: '1.25rem',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.1s, box-shadow 0.1s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                        className="hover:shadow-md hover:-translate-y-1"
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div style={{
                                padding: '0.5rem', borderRadius: '0.5rem',
                                background: card.warning ? '#fee2e2' : (card.highlight ? '#0284c7' : '#f1f5f9'),
                                color: card.warning ? '#dc2626' : (card.highlight ? 'white' : '#64748b')
                            }}>
                                {card.icon}
                            </div>
                            {card.warning && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }} />}
                        </div>

                        <div>
                            <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>{card.title}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: '0.1rem 0' }}>{card.value}</div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{card.label}</div>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '1.25rem', display: 'flex', alignItems: 'center', fontSize: '0.875rem', fontWeight: 600, color: card.highlight ? '#0284c7' : '#3b82f6' }}>
                            {card.action}
                            <ArrowRight size={14} style={{ marginLeft: '0.4rem' }} />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
