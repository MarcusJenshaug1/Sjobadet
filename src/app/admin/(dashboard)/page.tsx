import prisma from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
    const saunaCount = await prisma.sauna.count()
    const activeCount = await prisma.sauna.count({ where: { status: 'active' } })

    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 'bold' }}>Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                    <h2 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '0.5rem' }}>Totalt antall badstuer</h2>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{saunaCount}</p>
                </div>

                <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                    <h2 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '0.5rem' }}>Aktive badstuer</h2>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>{activeCount}</p>
                </div>
            </div>
        </div>
    )
}
