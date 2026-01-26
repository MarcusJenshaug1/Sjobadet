import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/home/Hero';
import { SaunaCardSkeleton } from '@/components/sauna/SaunaCardSkeleton';
import { getActiveSaunas } from '@/lib/sauna-service';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import nextDynamic from 'next/dynamic';
import { SaunaCard } from '@/components/sauna/SaunaCard';

// Lazy load non-critical components
const Footer = nextDynamic(() => import('@/components/layout/Footer').then(mod => mod.Footer));
const MaintenanceContent = nextDynamic(() => import('@/components/maintenance/MaintenanceContent').then(mod => mod.MaintenanceContent));
const Button = nextDynamic(() => import('@/components/ui/Button').then(mod => mod.Button));
const Clock = nextDynamic(() => import('lucide-react').then(mod => mod.Clock));
const Droplets = nextDynamic(() => import('lucide-react').then(mod => mod.Droplets));
const Users = nextDynamic(() => import('lucide-react').then(mod => mod.Users));
const Sparkles = nextDynamic(() => import('lucide-react').then(mod => mod.Sparkles));

// Enable public caching (CDN) with a 5-minute revalidation period
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Sjøbadet Badstue | Badstue i Tønsberg",
  description: "Book badstue hos Sjøbadet. Avslappende og rolige badstuer på Tønsberg Brygge og Hjemseng Brygge.",
  openGraph: {
    title: "Sjøbadet Badstue",
    description: "Book badstue hos Sjøbadet",
    type: "website",
  },
};

import { Suspense } from 'react';
import { MapPin } from 'lucide-react';

export default async function Home() {
  // Check maintenance mode immediately
  let isMaintenanceMode = false;
  let maintenanceSnapshot: any = null;
  let snapshotGeneratedAt = '';

  try {
    const [maintenanceSetting, snapshotSetting] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: 'maintenance_mode' } }),
      prisma.siteSetting.findUnique({ where: { key: 'maintenance_snapshot' } })
    ]);

    isMaintenanceMode = maintenanceSetting?.value === 'true';

    if (isMaintenanceMode && snapshotSetting?.value) {
      try {
        maintenanceSnapshot = JSON.parse(snapshotSetting.value);
        snapshotGeneratedAt = maintenanceSnapshot.generatedAt || '';
      } catch (e) {
        console.error('Failed to parse maintenance snapshot:', e);
      }
    }
  } catch (e) {
    console.error('Failed to check maintenance mode:', e);
  }

  if (isMaintenanceMode) {
    const saunas = maintenanceSnapshot?.saunas || [];
    return (
      <>
        <Header />
        <MaintenanceContent
          saunas={saunas}
          generatedAt={snapshotGeneratedAt || 'Ukjent tidspunkt'}
        />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <Hero />

        <section id="saunas" className="container" style={{ padding: '4rem 1rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--primary)' }}>Tilgjengelige Badstuer</h2>

          <Suspense fallback={
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {[1, 2, 3].map(i => <SaunaCardSkeleton key={i} />)}
            </div>
          }>
            <SaunaGrid />
          </Suspense>
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

async function SaunaGrid() {
  let saunas: Awaited<ReturnType<typeof getActiveSaunas>> = [];
  let dbError = false;

  try {
    saunas = await getActiveSaunas();
  } catch (error) {
    console.error('Failed to fetch saunas:', error);
    dbError = true;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem',
      contain: 'layout style paint'
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
          <h3 style={{ color: '#c53030', marginBottom: '0.5rem', fontSize: '1.25rem' }}>⚠️ Midlertidig utilgjengelig</h3>
          <p style={{ color: '#9b2c2c', marginBottom: '1.5rem' }}>Vi har problemer med å hente badstue-data akkurat nå. Vennligst prøv igjen senere.</p>
        </div>
      ) : saunas.length > 0 ? (
        saunas.map((sauna) => (
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
  );
}
