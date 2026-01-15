'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'

export async function saveSettings(formData: FormData) {
    await requireAdmin()
    const entries = Array.from(formData.entries())
    const settingsMap: Record<string, string> = {}

    for (const [key, value] of entries) {
        if (typeof value === 'string' && !key.startsWith('$')) {
            settingsMap[key] = value
        }
    }

    // We want to update all keys provided in the form
    for (const [key, value] of Object.entries(settingsMap)) {
        await prisma.siteSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        })
    }

    revalidatePath('/', 'layout')
    revalidatePath('/admin/settings')
}
