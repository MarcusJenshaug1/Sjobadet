import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Personvern | Sjøbadet Badstue',
    description: 'Personvernerklæring for Sjøbadet Badstue.',
};

export default function PrivacyPage() {
    return (
        <>
            <Header />
            <main className="container" style={{ padding: '6rem 1rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--primary)' }}>Personvern</h1>
                <p>Her kommer personvernerklæring.</p>
            </main>
            <Footer />
        </>
    );
}
