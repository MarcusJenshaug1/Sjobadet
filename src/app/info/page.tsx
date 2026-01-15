import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowRight, HelpCircle, FileText, Scale, Users, Clock } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Informasjon | Sjøbadet Badstue',
    description: 'Alt du trenger å vite om Sjøbadet Badstue.',
};

export default function InfoHubPage() {
    const cards = [
        { href: '/info/faq', label: 'Ofte stilte spørsmål', icon: HelpCircle, desc: 'Svar på det meste du lurer på.' },
        { href: '/info/regler', label: 'Badstueregler', icon: FileText, desc: 'Trivselsregler for en god opplevelse.' },
        { href: '/info/vilkar', label: 'Salgsbetingelser', icon: Scale, desc: 'Vilkår for kjøp og booking.' },
        { href: '/info/om-oss', label: 'Om oss', icon: Users, desc: 'Hvem er vi og vår historie.' },
        { href: '/info/apningstider', label: 'Åpningstider', icon: Clock, desc: 'Oversikt over når vi har åpent.' },
    ];

    return (
        <>
            <Header />
            <main className="container" style={{ padding: '4rem 1rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--primary)', textAlign: 'center' }}>Informasjon</h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {cards.map((card) => (
                        <Link key={card.href} href={card.href} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '2rem',
                            backgroundColor: 'white',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}>
                            <div style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
                                <card.icon size={32} />
                            </div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{card.label}</h2>
                            <p style={{ color: '#666', marginBottom: '1.5rem', flex: 1 }}>{card.desc}</p>
                            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: 500 }}>
                                Les mer <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}
