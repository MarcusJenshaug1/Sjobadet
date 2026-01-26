import Prisma from '@/lib/prisma'
import SaunaForm from '../_components/SaunaForm'
import { notFound } from 'next/navigation'

export default async function EditSaunaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const sauna = await Prisma.sauna.findUnique({
        where: { id },
        include: {
            mediaAssets: {
                orderBy: [
                    { kind: 'desc' }, // PRIMARY first
                    { orderIndex: 'asc' }
                ]
            },
            openingHours: true
        }
    })

    if (!sauna) {
        notFound()
    }

    // Serialize sauna for client component
    const serializedSauna = {
        ...sauna,
        updatedAt: sauna.updatedAt.toISOString(),
        createdAt: sauna.createdAt.toISOString(),
        openingHours: sauna.openingHours.map(h => ({
            ...h,
            createdAt: h.createdAt?.toISOString() ?? null,
            date: h.date?.toISOString() ?? null
        }))
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Rediger Badstue</h1>
            <SaunaForm sauna={serializedSauna as any} />
        </div>
    )
}
