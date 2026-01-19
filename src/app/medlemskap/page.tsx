import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Check, Info } from 'lucide-react';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
    title: 'Medlemskap | Sjøbadet Badstue',
    description: 'Bli medlem hos Sjøbadet Badstue og få gode priser på drop-in og privat booking. Velg mellom månedsabonnement med eller uten binding.',
    openGraph: {
        title: 'Medlemskap | Sjøbadet Badstue',
        description: 'Bli medlem hos Sjøbadet Badstue og få gode priser på drop-in og privat booking.',
        type: 'website',
    }
};

export default async function MembershipPage() {
    const subscriptions = await prisma.subscription.findMany({
        where: { active: true },
        orderBy: { sorting: 'asc' }
    });

    return (
        <>
            <Header />
            <main className="container" style={{ padding: '4rem 1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Medlemskap</h1>
                    <p style={{ fontSize: '1.25rem', color: '#555', maxWidth: '600px', margin: '0 auto' }}>
                        Medlemskap gir deg drop-in til fast pris og rabatt på privat booking. Booking gjøres alltid i forkant.
                    </p>
                </div>

                {subscriptions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
                        <p>Ingen medlemskap tilgjengelig for øyeblikket.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        maxWidth: '900px',
                        margin: '0 auto'
                    }}>
                        {subscriptions.map((sub: any) => {
                            let features: string[] = [];
                            try {
                                features = sub.features ? JSON.parse(sub.features) : [];
                                if (!Array.isArray(features)) features = [];
                            } catch (e) {
                                console.error('Failed to parse features for sub', sub.id, e);
                                features = [];
                            }
                            return (
                                <div key={sub.id} style={{
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius)',
                                    padding: '2rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backgroundColor: 'white',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                                }}>
                                    {sub.binding ? (
                                        <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#1e40af', fontWeight: 600, backgroundColor: '#dbeafe', width: 'fit-content', padding: '0.25rem 0.75rem', borderRadius: '999px', border: '1px solid #93c5fd' }}>
                                            {sub.bindingDescription || "Med binding"}
                                        </div>
                                    ) : (
                                        <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#059669', fontWeight: 600, backgroundColor: '#d1fae5', width: 'fit-content', padding: '0.25rem 0.75rem', borderRadius: '999px', border: '1px solid #6ee7b7' }}>
                                            Uten binding
                                        </div>
                                    )}

                                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{sub.name}</h2>
                                    <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1.5rem' }}>
                                        {sub.price} kr <span style={{ fontSize: '1rem', color: '#666', fontWeight: 400 }}>{sub.period}</span>
                                    </div>

                                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {features.map((feature: string, idx: number) => (
                                            <li key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Check size={20} color="var(--primary)" /> {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <Button href={sub.paymentUrl || "#"} external fullWidth>
                                        Kjøp {sub.price},-
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div style={{
                    maxWidth: '800px',
                    margin: '3rem auto 0',
                    padding: '1.5rem',
                    backgroundColor: '#F0F4F4',
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'start'
                }}>
                    <Info color="var(--primary)" style={{ flexShrink: 0 }} />
                    <div>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Viktig informasjon</p>
                        <ul style={{ paddingLeft: '1.5rem', color: '#555' }}>
                            <li>Medlemskap er personlig.</li>
                            <li>Book tid før du kommer.</li>
                            <li>Refusjon/avbestilling: se <a href="/info/vilkar" style={{ textDecoration: 'underline' }}>salgsbetingelser</a>.</li>
                        </ul>
                    </div>
                </div>
            </main >
            <Footer />
        </>
    );
}
