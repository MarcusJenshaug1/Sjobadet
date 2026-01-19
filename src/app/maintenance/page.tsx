import prisma from '@/lib/prisma'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SaunaCard } from '@/components/sauna/SaunaCard'

interface SaunaSnapshot {
    id: string
    slug: string
    name: string
    location: string
    imageUrl: string | null
    bookingUrlDropin: string | null
    bookingUrlPrivat: string | null
    driftStatus: string
    stengeArsak: string | null
}

interface Snapshot {
    generatedAt: string
    saunas: SaunaSnapshot[]
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function MaintenancePage() {
    // Check if maintenance mode is active
    const maintenanceSetting = await prisma.siteSetting.findUnique({
        where: { key: 'maintenance_mode' }
    })

    const isMaintenanceMode = maintenanceSetting?.value === 'true'

    if (!isMaintenanceMode) {
        // Not in maintenance mode, redirect to home
        return (
            <>
                <Header />
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    backgroundColor: '#f8fafc',
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ color: '#0f172a', marginBottom: '1rem' }}>Siden er ikke i vedlikeholdsmodus</h1>
                        <p style={{ color: '#64748b' }}>Gå til <a href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>forsiden</a></p>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    // Get snapshot
    const snapshotSetting = await prisma.siteSetting.findUnique({
        where: { key: 'maintenance_snapshot' }
    })

    let snapshot: Snapshot | null = null
    if (snapshotSetting?.value) {
        try {
            snapshot = JSON.parse(snapshotSetting.value)
        } catch (e) {
            console.error('Failed to parse snapshot:', e)
        }
    }

    const saunas = snapshot?.saunas || []
    const generatedAt = snapshot?.generatedAt ? new Date(snapshot.generatedAt).toLocaleString('no-NO') : 'Ukjent'

    return (
        <>
            <Header />
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#f0f4f8',
                padding: '2rem 1rem',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '3rem',
                        paddingTop: '2rem'
                    }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            marginBottom: '0.75rem',
                            letterSpacing: '-0.02em'
                        }}>
                            Sjøbadet er under vedlikehold
                        </h1>
                        <p style={{
                            fontSize: '1.1rem',
                            color: '#475569',
                            marginBottom: '1.5rem',
                            lineHeight: 1.7
                        }}>
                            Vi utfører rutinvedlikehold for å forbedre din opplevelse. Vi er tilbake snart!<br />
                            I mellomtiden kan du se badstuer og booke direkte:
                        </p>
                        <div style={{
                            display: 'inline-block',
                            padding: '0.75rem 1.25rem',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '0.5rem',
                            fontSize: '0.85rem',
                            color: '#6b7280',
                            marginBottom: '2rem',
                            border: '1px solid #d1d5db'
                        }}>
                            Sist oppdatert: {generatedAt}
                        </div>
                    </div>

                    {/* Saunas Grid */}
                    {saunas.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '4rem'
                        }}>
                            {saunas.map((sauna: SaunaSnapshot) => (
                                <SaunaCard 
                                    key={sauna.id} 
                                    sauna={{
                                        id: sauna.id,
                                        slug: sauna.slug,
                                        name: sauna.name,
                                        location: sauna.location,
                                        shortDescription: '',
                                        imageUrl: sauna.imageUrl,
                                        bookingUrlDropin: sauna.bookingUrlDropin,
                                        bookingUrlPrivat: sauna.bookingUrlPrivat,
                                        driftStatus: sauna.driftStatus
                                    }}
                                    isMaintenanceMode={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            backgroundColor: 'white',
                            borderRadius: '0.75rem',
                            color: '#64748b',
                            border: '1px solid #e2e8f0'
                        }}>
                            <p style={{ fontSize: '1.05rem', fontWeight: 500 }}>Ingen badstuer tilgjengelig i vedlikeholdsmodus</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{
                        textAlign: 'center',
                        paddingTop: '2rem',
                        borderTop: '2px solid #e2e8f0',
                        color: '#64748b',
                        fontSize: '1rem'
                    }}>
                        <p style={{ fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
                            Takk for tålmodigheten. Vi er tilbake snart!
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
