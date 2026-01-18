'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'
import { clearSaunaCaches } from '@/lib/sauna-service'
import { headers } from 'next/headers'

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

export async function clearPublicCaches() {
    await requireAdmin()
    clearSaunaCaches()
    revalidatePath('/', 'layout')
    revalidatePath('/home')
    revalidatePath('/info')
    revalidatePath('/bedrift')
    revalidatePath('/gavekort')
    revalidatePath('/medlemskap')
}

export async function preloadPublicPages() {
    await requireAdmin()

    // Derive base URL from headers or fallback to localhost
    const hdrs = await headers()
    const host = hdrs.get('x-forwarded-host') || hdrs.get('host') || 'localhost:3000'
    const protocol = (hdrs.get('x-forwarded-proto') || 'https') as 'http' | 'https'
    const base = `${protocol}://${host}`

    // Core public routes to warm
    const staticPaths = [
        '/',
        '/bedrift',
        '/gavekort',
        '/medlemskap',
        '/info/om-oss',
        '/info/apningstider',
    ]

    // Warm sauna detail pages
    const saunas = await prisma.sauna.findMany({ select: { slug: true }, where: { status: 'active' } })
    const saunaPaths = saunas.map((s) => `/home/${s.slug}`)

    const targets = [...staticPaths, ...saunaPaths]

    await Promise.all(
        targets.map(async (path) => {
            try {
                await fetch(`${base}${path}`, { cache: 'no-store' })
            } catch (e) {
                console.error('Preload failed for', path, e)
            }
        })
    )
}
