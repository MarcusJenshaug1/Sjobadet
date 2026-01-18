import React from 'react';
import { Hero } from '@/components/home/Hero';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SaunaCard } from '@/components/sauna/SaunaCard';
import { Button } from '@/components/ui/Button';
import { Clock, MapPin, Sparkles, Droplets, Users, AlertTriangle } from 'lucide-react';
import { getActiveSaunas } from '@/lib/sauna-service';

// Revalidate this page every 60 seconds (ISR)
export const revalidate = 60;

export default async function Home() {
  let saunas: any[] = [];
  let dbError = false;

  try {
    saunas = await getActiveSaunas();
  } catch (error) {
    console.error('Failed to fetch saunas:', error);
    dbError = true;
  }

  const mappedSaunas = saunas.map((s: any) => ({
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {dbError ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', backgroundColor: '#fff5f5', borderRadius: '1rem', border: '1px solid #feb2b2' }}>
                <AlertTriangle size={48} color="#f56565" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#c53030', marginBottom: '0.5rem' }}>Midlertidig utilgjengelig</h3>
                <p style={{ color: '#9b2c2c' }}>Vi har problemer med å hente badstue-data akkurat nå. Vennligst prøv igjen senere.</p>
              </div>
            ) : (
              mappedSaunas.map((sauna) => (
                <SaunaCard key={sauna.id} sauna={sauna} />
              ))
            )}
          </div>
        </section>

        {/* Membership CTA */}
        <section style={{ backgroundColor: 'var(--secondary)', padding: '4rem 1rem' }}>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Abonner på badstue</h2>
            <p style={{ maxWidth: '600px', marginBottom: '2rem', fontSize: '1.25rem' }}>
              Bli medlem og få tilgang til drop-in til fast pris, samt rabatterte priser på privat booking.
            </p>
            <Button href="/medlemskap" variant="primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Se medlemskap
            </Button>
          </div>
        </section>

        {/* Trust/Info Section */}
        <section className="container" style={{ padding: '4rem 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <Clock size={40} color="var(--primary)" />
              <h3 style={{ fontSize: '1.25rem' }}>Lange åpningstider</h3>
              <p>Morgenfugl eller kveldsbad? Vi har åpent fra 06:00 til 23:00 de fleste dager.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <Droplets size={40} color="var(--primary)" />
              <h3 style={{ fontSize: '1.25rem' }}>Dusj & Fasiliteter</h3>
              <p>Tilgang til dusj (både varm og kald avhengig av lokasjon) og skifterom.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <Users size={40} color="var(--primary)" />
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
