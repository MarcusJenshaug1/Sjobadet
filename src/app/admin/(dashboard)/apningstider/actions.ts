'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'

export async function updateOpeningHours(saunaId: string, hours: any[]) {
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
