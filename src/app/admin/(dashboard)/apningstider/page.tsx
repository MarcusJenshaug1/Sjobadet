import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

import OpeningHoursList from './OpeningHoursList'
import OpeningHourOverrides from './OpeningHourOverrides'

interface OpeningHour {
    id: string;
    saunaId: string;
    weekday: number;
    opens: string | null;
    closes: string | null;
    active: boolean;
}

interface SaunaWithHours {
    id: string;
    name: string;
    flexibleHours?: boolean | null;
    openingHours: OpeningHour[];
    openingHourOverrides: {
        id: string;
        saunaId: string;
        date: string;
        opens: string | null;
        closes: string | null;
        active: boolean;
        note: string | null;
    }[];
}

export default async function OpeningHoursPage() {
    const saunas = await prisma.sauna.findMany({
        include: { openingHours: true, openingHourOverrides: true },
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
        include: { openingHours: true, openingHourOverrides: true },
        orderBy: { sorting: 'asc' }
    })

    // Filter out saunas with flexible hours (user request)
    const serializedSaunas = allSaunas.map((s) => ({
        ...s,
        updatedAt: s.updatedAt.toISOString(),
        createdAt: s.createdAt.toISOString(),
        openingHours: s.openingHours.map((h) => ({
            ...h,
            createdAt: h.createdAt?.toISOString() ?? null
        })),
        openingHourOverrides: s.openingHourOverrides.map((o) => ({
            ...o,
            date: o.date.toISOString(),
            createdAt: o.createdAt?.toISOString() ?? null,
            updatedAt: o.updatedAt?.toISOString() ?? null
        }))
    }))

    const saunasWithHours = serializedSaunas
        .filter((s) => !s.flexibleHours)
        .map((s) => ({
            ...s,
            openingHours: s.openingHours.map((h) => ({
                ...h,
                weekday: h.weekday ?? 0
            }))
        }))

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem', paddingTop: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Åpningstider (Ukentlig)</h1>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                Her kan du overstyre de faste åpningstidene som er satt for hver badstue.
                Klikk på &quot;Rediger&quot; for å endre tidene for en spesifikk badstue.
            </p>

            <OpeningHoursList saunas={saunasWithHours} />
            <OpeningHourOverrides saunas={saunasWithHours} />
        </div>
    )
}
