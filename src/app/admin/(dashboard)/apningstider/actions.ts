'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'
import { clearSaunaCaches } from '@/lib/sauna-service'

interface OpeningHourUpdate {
    id: string;
    opens: string | null;
    closes: string | null;
    active: boolean;
}

interface OpeningHourOverrideInput {
    date: string;
    opens?: string | null;
    closes?: string | null;
    active?: boolean | null;
    note?: string | null;
}

export async function updateOpeningHours(saunaId: string, hours: OpeningHourUpdate[]) {
    await requireAdmin()

    // Validate inputs
    if (!saunaId) {
        throw new Error('Mangler sauna ID')
    }

    // Update each opening hour record
    // We use a transaction or Promise.all to ensure all updates happen
    try {
        await prisma.$transaction(
            hours.map((hour) =>
                prisma.openingHour.update({
                    where: { id: hour.id },
                    data: {
                        opens: hour.opens,
                        closes: hour.closes,
                        active: hour.active,
                    }
                })
            )
        )

        revalidatePath('/admin/apningstider')
        return { success: true }
    } catch (error) {
        console.error('Error updating opening hours:', error)
        return { success: false, error: 'Kunne ikke lagre åpningstider' }
    }
}

async function revalidateSaunaViews(saunaId: string) {
    try {
        const sauna = await prisma.sauna.findUnique({ where: { id: saunaId }, select: { slug: true } })
        if (sauna?.slug) {
            revalidatePath(`/home/${sauna.slug}`)
        }
    } catch (error) {
        console.warn('Failed to resolve sauna slug for revalidation', error)
    }

    revalidatePath('/')
    revalidatePath('/info/apningstider')
    revalidatePath('/info/om-oss')
    clearSaunaCaches(saunaId)
}

export async function createOpeningHourOverride(saunaId: string, input: OpeningHourOverrideInput) {
    await requireAdmin()

    if (!saunaId) {
        return { success: false, error: 'Mangler sauna ID' }
    }

    const parsedDate = new Date(input.date)
    if (Number.isNaN(parsedDate.getTime())) {
        return { success: false, error: 'Ugyldig dato' }
    }

    const active = input.active ?? true
    const opens = active ? input.opens ?? null : null
    const closes = active ? input.closes ?? null : null

    if (active && (!opens || !closes)) {
        return { success: false, error: 'Åpningstid og stengetid må fylles ut' }
    }

    try {
        const override = await prisma.openingHourOverride.create({
            data: {
                saunaId,
                date: parsedDate,
                opens,
                closes,
                active,
                note: input.note ?? null,
            }
        })

        revalidatePath('/admin/apningstider')
        await revalidateSaunaViews(saunaId)
        return {
            success: true,
            override: {
                id: override.id,
                saunaId: override.saunaId,
                date: override.date.toISOString(),
                opens: override.opens,
                closes: override.closes,
                active: override.active,
                note: override.note,
            }
        }
    } catch (error) {
        console.error('Error creating opening hour override:', error)
        return { success: false, error: 'Kunne ikke lagre avvik' }
    }
}

export async function updateOpeningHourOverride(id: string, input: OpeningHourOverrideInput) {
    await requireAdmin()

    if (!id) {
        return { success: false, error: 'Mangler avvik-ID' }
    }

    const parsedDate = new Date(input.date)
    if (Number.isNaN(parsedDate.getTime())) {
        return { success: false, error: 'Ugyldig dato' }
    }

    const active = input.active ?? true
    const opens = active ? input.opens ?? null : null
    const closes = active ? input.closes ?? null : null

    if (active && (!opens || !closes)) {
        return { success: false, error: 'Åpningstid og stengetid må fylles ut' }
    }

    try {
        const override = await prisma.openingHourOverride.update({
            where: { id },
            data: {
                date: parsedDate,
                opens,
                closes,
                active,
                note: input.note ?? null,
            }
        })

        revalidatePath('/admin/apningstider')
        await revalidateSaunaViews(override.saunaId)
        return {
            success: true,
            override: {
                id: override.id,
                saunaId: override.saunaId,
                date: override.date.toISOString(),
                opens: override.opens,
                closes: override.closes,
                active: override.active,
                note: override.note,
            }
        }
    } catch (error) {
        console.error('Error updating opening hour override:', error)
        return { success: false, error: 'Kunne ikke oppdatere avvik' }
    }
}

export async function deleteOpeningHourOverride(id: string) {
    await requireAdmin()

    if (!id) {
        return { success: false, error: 'Mangler avvik-ID' }
    }

    try {
        const existing = await prisma.openingHourOverride.findUnique({ where: { id }, select: { saunaId: true } })
        await prisma.openingHourOverride.delete({ where: { id } })
        revalidatePath('/admin/apningstider')
        if (existing?.saunaId) {
            await revalidateSaunaViews(existing.saunaId)
        }
        return { success: true }
    } catch (error) {
        console.error('Error deleting opening hour override:', error)
        return { success: false, error: 'Kunne ikke slette avvik' }
    }
}
