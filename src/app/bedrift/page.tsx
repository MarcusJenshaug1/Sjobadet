import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Briefcase } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bedriftsmedlemskap | Sjøbadet Badstue',
    description: 'Bedriftsavtale for badstue i Tønsberg.',
};

export default function CorporatePage() {
    return (
        <>
            <Header />
            <main className="container" style={{ padding: '6rem 1rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    maxWidth: '700px',
                    width: '100%',
                    padding: '3rem',
                }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Bedriftsmedlemskap</h1>

                    <p style={{ fontSize: '1.25rem', color: '#555', marginBottom: '3rem' }}>
                        Vi jobber med et eget tilbud for bedrifter. Ta kontakt for forespørsel.
                    </p>

                    <div style={{
                        backgroundColor: '#F8F9FA',
                        padding: '2rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Kontakt oss</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            <strong>Telefon:</strong> <a href="tel:+4740155365">+47 401 55 365</a>
                        </p>
                        <p style={{ marginBottom: '2rem' }}>
                            <strong>E-post:</strong> <a href="mailto:booking@sjobadet.com">booking@sjobadet.com</a>
                        </p>

                        <form action="mailto:booking@sjobadet.com" method="post" encType="text/plain" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Navn</label>
                                <input type="text" name="name" required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>E-post</label>
                                <input type="email" name="email" required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Melding</label>
                                <textarea name="message" rows={4} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}></textarea>
                            </div>
                            <Button type="submit">Send forespørsel</Button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
