import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Gift } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gavekort | Sjøbadet Badstue',
    description: 'Gi bort et gavekort – den perfekte gaven til en som fortjener litt ekstra velvære.',
};

export default function GiftCardPage() {
    return (
        <>
            <Header />
            <main className="container" style={{ padding: '6rem 1rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    maxWidth: '600px',
                    textAlign: 'center',
                    padding: '3rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'white',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                        <div style={{ padding: '1.5rem', backgroundColor: '#F0F4F4', borderRadius: '50%' }}>
                            <Gift size={48} color="var(--primary)" />
                        </div>
                    </div>

                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Gavekort</h1>

                    <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '2rem', lineHeight: 1.8 }}>
                        Gi bort et gavekort – den perfekte gaven til en som fortjener litt ekstra velvære.
                        <br />
                        <br />
                        <span style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>Vær oppmerksom på at gavekortet ikke kan brukes på medlemskap.</span>
                    </p>

                    <Button href="#" external size="lg" style={{ minWidth: '250px' }}>
                        Kjøp gavekort
                    </Button>
                </div>
            </main>
            <Footer />
        </>
    );
}
