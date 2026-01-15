import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/Button'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'

export const dynamic = 'force-dynamic'

async function updateHours(formData: FormData) {
    'use server'
    await requireAdmin()
    // Iterate over all entries in the form
    const entries = Array.from(formData.entries())
    const updates: Record<string, any> = {}

    // Group by ID
    entries.forEach(([key, value]) => {
        if (typeof value !== 'string') return

        const prefixes = ['opens_', 'closes_', 'active_']
        const prefix = prefixes.find(p => key.startsWith(p))

        if (prefix) {
            const field = prefix.replace('_', '')
            const id = key.substring(prefix.length)

            if (!updates[id]) updates[id] = {}
            updates[id][field] = value
        }
    })

    // Batch update (using updateMany for ID-specific updates avoids "Record not found" errors)
    for (const [id, data] of Object.entries(updates)) {
        await prisma.openingHour.updateMany({
            where: { id },
            data: {
                opens: data.opens,
                closes: data.closes,
                active: data.active === 'on'
            }
        })
    }

    revalidatePath('/admin/apningstider')
}

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
    const saunasWithHours = allSaunas.filter((s: any) => !s.flexibleHours)

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Åpningstider (Ukentlig)</h1>

            {saunasWithHours.map((sauna: any) => (
                <div key={sauna.id} style={{ marginBottom: '3rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>{sauna.name}</h2>
                    <form action={updateHours}>
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Dag</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Åpner</th>
                                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Stenger</th>
                                    <th style={{ textAlign: 'center', padding: '0.5rem' }}>Åpen?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sauna.openingHours
                                    .sort((a: any, b: any) => (a.weekday ?? 0) - (b.weekday ?? 0))
                                    .map((hour: any) => (
                                        <tr key={hour.id}>
                                            <td style={{ padding: '0.5rem' }}>{['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'][hour.weekday ?? 0]}</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <input name={`opens_${hour.id}`} defaultValue={hour.opens || ''} style={{ padding: '0.25rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                                            </td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <input name={`closes_${hour.id}`} defaultValue={hour.closes || ''} style={{ padding: '0.25rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                                            </td>
                                            <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                                <input type="checkbox" name={`active_${hour.id}`} defaultChecked={hour.active} />
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="submit">Lagre endringer for {sauna.name}</Button>
                        </div>
                    </form>
                </div>
            ))}
        </div>
    )
}
