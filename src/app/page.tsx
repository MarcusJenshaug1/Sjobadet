import React from 'react';
import { Hero } from '@/components/home/Hero';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SaunaCard } from '@/components/sauna/SaunaCard';
import { Button } from '@/components/ui/Button';
import { Clock, MapPin, Sparkles, Droplets, Users, AlertTriangle, RotateCw } from 'lucide-react';
import { getActiveSaunas } from '@/lib/sauna-service';
import { Metadata } from 'next';

// Revalidate this page every 5 minutes (ISR)
export const revalidate = 300;

// Cache strategy: Tag-based for fine-grained control
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Sjøbadet Badstue | Badstue i Tønsberg",
  description: "Book badstue hos Sjøbadet. Avslappende og rolige badstuer på Tønsberg Brygge og Hjemseng Brygge.",
  openGraph: {
    title: "Sjøbadet Badstue",
    description: "Book badstue hos Sjøbadet",
    type: "website",
  },
};

export default async function Home() {
  let saunas: Awaited<ReturnType<typeof getActiveSaunas>> = [];
  let dbError = false;

  try {
    saunas = await getActiveSaunas();
  } catch (error) {
    console.error('Failed to fetch saunas:', error);
    dbError = true;
  }

  const mappedSaunas = saunas.map((s) => ({
    ...s,
  }));

  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* Sauna Grid Section */}
        <section id="saunas" className="container" style={{ padding: '4rem 1rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--primary)' }}>Tilgjengelige Badstuer</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
            '@media (min-width: 768px)': {
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem',
            }
          }}>
            {dbError ? (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '2rem 1.5rem', 
                backgroundColor: '#fff5f5', 
                borderRadius: '1rem', 
                border: '1px solid #feb2b2' 
              }} role="alert">
                <AlertTriangle size={48} color="#f56565" style={{ marginBottom: '1rem' }} aria-hidden="true" />
                <h3 style={{ color: '#c53030', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Midlertidig utilgjengelig</h3>
                <p style={{ color: '#9b2c2c', marginBottom: '1.5rem' }}>Vi har problemer med å hente badstue-data akkurat nå. Vennligst prøv igjen senere.</p>
                <button 
                  onClick={() => window.location.reload()} 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
                  aria-label="Prøv å laste siden på nytt"
                >
                  <RotateCw size={18} />
                  Prøv igjen
                </button>
              </div>
            ) : mappedSaunas.length > 0 ? (
              mappedSaunas.map((sauna) => (
                <SaunaCard key={sauna.id} sauna={sauna} />
              ))
            ) : (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '2rem 1.5rem', 
                backgroundColor: '#f0f9ff', 
                borderRadius: '1rem', 
                border: '1px solid #bfdbfe' 
              }}>
                <Sparkles size={48} color="#3b82f6" style={{ marginBottom: '1rem', margin: '0 auto 1rem' }} aria-hidden="true" />
                <h3 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>Ingen badstuer tilgjengelig</h3>
                <p style={{ color: '#1e3a8a' }}>Det finnes ingen aktive badstuer akkurat nå.</p>
              </div>
            )}
          </div>
        </section>

        {/* Membership CTA */}
        <section style={{ backgroundColor: 'var(--secondary)', padding: '4rem 1rem' }} aria-label="Medlemskap tilbud">
          <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>Abonner på badstue</h2>
            <p style={{ maxWidth: '600px', marginBottom: '2rem', fontSize: '1.25rem' }}>
              Bli medlem og få tilgang til drop-in til fast pris, samt rabatterte priser på privat booking.
            </p>
            <Button href="/medlemskap" variant="primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Se medlemskap
            </Button>
          </div>
        </section>

        {/* Trust/Info Section */}
        <section className="container" style={{ padding: '4rem 1rem' }} aria-label="Fordeler">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <Clock size={40} color="var(--primary)" aria-hidden="true" />
              <h3 style={{ fontSize: '1.25rem' }}>Lange åpningstider</h3>
              <p>Morgenfugl eller kveldsbad? Vi har åpent fra 06:00 til 23:00 de fleste dager.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <Droplets size={40} color="var(--primary)" aria-hidden="true" />
              <h3 style={{ fontSize: '1.25rem' }}>Dusj & Fasiliteter</h3>
              <p>Tilgang til dusj (både varm og kald avhengig av lokasjon) og skifterom.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <Users size={40} color="var(--primary)" aria-hidden="true" />
              <h3 style={{ fontSize: '1.25rem' }}>Drop-in & Privat</h3>
              <p>Velg mellom fellesskap på drop-in eller lei hele badstuen privat.</p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
