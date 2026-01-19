import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { PageWrapper } from '@/components/admin/PageWrapper'

import { toggleSaunaStatus, deleteSauna } from './actions'
import SaunaList from './_components/SaunaList'


export default async function AdminSaunasPage() {
    const saunas = await prisma.sauna.findMany({
        orderBy: { sorting: 'asc' },
        include: { openingHours: true }
    })

    // Serialize saunas to avoid "Date cannot be passed to client component" warnings
    const serializedSaunas = saunas.map((s: any) => ({
        ...s,
        updatedAt: s.updatedAt.toISOString(),
        createdAt: s.createdAt.toISOString(),
        openingHours: s.openingHours.map((h: any) => ({
            ...h,
            createdAt: h.createdAt?.toISOString() ?? null
        }))
    }))

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '1rem' }}>
            <PageWrapper
                layout="fluid"
                title="Badstuer"
                actions={
                    <Link href="/admin/badstuer/ny">
                        <Button>Ny Badstue</Button>
                    </Link>
                }
            >
                <SaunaList initialSaunas={serializedSaunas} />
            </PageWrapper>
        </div>
    )
}

