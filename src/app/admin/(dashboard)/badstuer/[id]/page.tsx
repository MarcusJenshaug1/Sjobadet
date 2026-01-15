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
            }
        }
    })

    if (!sauna) {
        notFound()
    }

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Rediger Badstue</h1>
            <SaunaForm sauna={sauna} />
        </div>
    )
}
