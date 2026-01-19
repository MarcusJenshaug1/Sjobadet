import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/Button'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'

export const dynamic = 'force-dynamic'

import OpeningHoursList from './OpeningHoursList'

export default async function OpeningHoursPage() {
    const saunas = await prisma.sauna.findMany({
        include: { openingHours: true },
        orderBy: { sorting: 'asc' }
    })

    // Create default opening hours for saunas that don't have any
    for (const sauna of saunas) {
        if (sauna.openingHours.length === 0) {
            const openingHoursData = Array.from({ length: 7 }, (_, i) => ({
                saunaId: sauna.id,
                weekday: i,
                opens: '07:00',
                closes: '21:00',
                active: true
            }))

            await prisma.openingHour.createMany({
                data: openingHoursData
            })
        }
    }

    // Re-fetch to get the newly created hours
    const allSaunas = await prisma.sauna.findMany({
        include: { openingHours: true },
        orderBy: { sorting: 'asc' }
    })

    // Filter out saunas with flexible hours (user request)
    const saunasWithHours = allSaunas
        .filter((s: any) => !s.flexibleHours)
        .map((s: any) => ({
            ...s,
            openingHours: s.openingHours.map((h: any) => ({
                ...h,
                weekday: h.weekday ?? 0
            }))
        }))

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem', paddingTop: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Åpningstider (Ukentlig)</h1>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                Administrer faste åpningstider for hver lokasjon. Avvikende åpningstider administreres under "Avvik".
            </p>

            <OpeningHoursList saunas={saunasWithHours} />
        </div>
    )
}
