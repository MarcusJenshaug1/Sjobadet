import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Metadata } from 'next';
import { getGlobalSettings } from '@/lib/sauna-service';

export const metadata: Metadata = {
    title: 'Personvern | Sjøbadet Badstue',
    description: 'Personvernerklæring for Sjøbadet Badstue.',
};

export default async function PrivacyPage() {
    const settings = await getGlobalSettings();
    const phone = settings['contact_phone'] || '+47 401 55 365';
    const email = settings['contact_email'] || 'booking@sjobadet.com';

    return (
        <>
            <Header />
            <main className="container" style={{ padding: '6rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--primary)' }}>Personvern</h1>

                <section style={{ marginBottom: '2rem' }}>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                        Denne personvernerklæringen gjør rede for vår håndtering av personopplysninger som samles inn for å utøve våre tjenester overfor medlemmer og besøkende.
                    </p>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                        Behandlingsansvarlig for personopplysningene vi behandler er Sjøbadet Badstue AS.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: '#1e293b' }}>Kontaktinformasjon</h2>
                    <p style={{ marginBottom: '0.5rem' }}>
                        Har du spørsmål om behandling av personopplysninger, kan du kontakte oss på:
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <strong>E-post:</strong> <a href={`mailto:${email}`} style={{ color: 'var(--primary)' }}>{email}</a>
                        </li>
                        <li>
                            <strong>Telefon:</strong> <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'var(--primary)' }}>{phone}</a>
                        </li>
                    </ul>
                </section>

                <section>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                        For fullstendig informasjon om hvilke data vi samler inn via informasjonskapsler, kan du endre dine innstillinger via lenken i bunnteksten.
                    </p>
                </section>
            </main>
            <Footer />
        </>
    );
}
