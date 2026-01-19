'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'
import { clearSaunaCaches, getCacheStats } from '@/lib/sauna-service'
import { headers } from 'next/headers'

// --- Types ---
export type CacheType = 'all' | 'public' | 'sauna-details' | 'availability'

// --- Helpers ---
async function logAction(action: string, details: string, status: 'SUCCESS' | 'FAILURE' | 'WARNING' = 'SUCCESS') {
    try {
        if ((prisma as any).adminLog) {
            await (prisma as any).adminLog.create({
                data: {
                    action,
                    details,
                    status,
                    performedBy: 'Admin'
                }
            })
        }
    } catch (e) {
        console.error('Failed to create admin log:', e)
    }
}

// --- Settings Actions ---
export async function saveSettings(formData: FormData) {
    await requireAdmin()
    const entries = Array.from(formData.entries())
    const settingsMap: Record<string, string> = {}
    let changesCount = 0

    for (const [key, value] of entries) {
        if (typeof value === 'string' && !key.startsWith('$')) {
            settingsMap[key] = value
            changesCount++
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

    await logAction('SETTINGS_UPDATE', `Updated ${changesCount} settings keys`)

    revalidatePath('/', 'layout')
    revalidatePath('/admin/settings')
    return { success: true, message: 'Innstillinger lagret' }
}

// --- Operations Actions ---

export async function clearCacheAction(type: CacheType) {
    await requireAdmin()
    const startTime = Date.now()

    try {
        let message = ''

        switch (type) {
            case 'all':
                clearSaunaCaches()
                // Revalidate crucial paths
                revalidatePath('/', 'layout')
                message = 'Tømte all cache (public + detaljer)'
                break
            case 'public':
                revalidatePath('/', 'layout')
                revalidatePath('/home')
                revalidatePath('/info')
                message = 'Tømte public cache (forside, lister)'
                break
            case 'sauna-details':
                clearSaunaCaches() // Clears the internal memory cache for details
                message = 'Tømte badstue-detalj cache'
                break
            case 'availability':
                // Availability is often short-lived or fetched live, but we can force revalidate
                clearSaunaCaches()
                message = 'Tømte ledighet/tilgjengelighet cache'
                break
        }

        const duration = Date.now() - startTime
        await logAction('CACHE_CLEAR', `${message} (${duration}ms)`)
        return { success: true, message, timestamp: new Date().toISOString() }

    } catch (e) {
        await logAction('CACHE_CLEAR', `Failed to clear ${type}: ${e}`, 'FAILURE')
        return { success: false, message: 'Feilet å tømme cache', error: String(e) }
    }
}

export async function getPreloadTargets() {
    await requireAdmin()

    // Derive base URL
    const hdrs = await headers()
    const host = hdrs.get('x-forwarded-host') || hdrs.get('host') || 'localhost:3000'
    const protocol = (hdrs.get('x-forwarded-proto') || 'https') as 'http' | 'https'
    const base = `${protocol}://${host}`

    // Static paths
    const staticPaths = [
        '/',
        '/bedrift',
        '/gavekort',
        '/medlemskap',
        '/info/om-oss',
        '/info/apningstider',
    ]

    // Sauna paths
    const saunas = await prisma.sauna.findMany({ select: { slug: true }, where: { status: 'active' } })
    const saunaPaths = saunas.map((s) => `/home/${s.slug}`)

    const targets = [...staticPaths, ...saunaPaths].map(path => `${base}${path}`)

    return { targets, count: targets.length }
}

export async function logPreloadResult(successCount: number, failCount: number, errors: string[]) {
    await requireAdmin()
    const details = `Preload ferdig. Suksess: ${successCount}. Feil: ${failCount}. ${errors.length > 0 ? 'Feil: ' + errors.slice(0, 3).join(', ') : ''}`
    const status = failCount > 0 ? (successCount > 0 ? 'WARNING' : 'FAILURE') : 'SUCCESS'

    await logAction('PRELOAD_RUN', details, status)
    revalidatePath('/admin/settings')
}

export async function getAdminLogs(limit = 50) {
    await requireAdmin()
    try {
        if ((prisma as any).adminLog) {
            const logs = await (prisma as any).adminLog.findMany({
                take: limit,
                orderBy: { createdAt: 'desc' }
            })
            return logs
        }
    } catch (e) {
        console.error('Failed to fetch logs', e)
    }
    return []
}

export async function getCacheStatsAction() {
    await requireAdmin()
    return await getCacheStats()
}
