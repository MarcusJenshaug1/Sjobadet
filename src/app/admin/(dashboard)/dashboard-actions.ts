'use server'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-guard'
import { getCacheStats } from '@/lib/sauna-service'

export async function getDashboardStats() {
    await requireAdmin()

    const [
        pendingMedia,
        activeSaunas,
        totalSaunas,
        users,
        memberships
    ] = await Promise.all([
        prisma.mediaAsset.count({ where: { status: 'pending' } }),
        prisma.sauna.count({ where: { status: 'active' } }),
        prisma.sauna.count(),
        prisma.adminUser.count(),
        prisma.subscription.count({ where: { active: true } })
    ])

    return {
        pendingMedia,
        activeSaunas,
        totalSaunas,
        users,
        memberships
    }
}

export async function getDriftStatus() {
    await requireAdmin()

    let lastCacheClear = null
    let lastPreload = null

    try {
        if ((prisma as any).adminLog) {
            const [clear, preload] = await Promise.all([
                (prisma as any).adminLog.findFirst({
                    where: { action: 'CACHE_CLEAR' },
                    orderBy: { createdAt: 'desc' }
                }),
                (prisma as any).adminLog.findFirst({
                    where: { action: 'PRELOAD_RUN' },
                    orderBy: { createdAt: 'desc' }
                })
            ])
            lastCacheClear = clear
            lastPreload = preload
        }
    } catch (e) {
        console.warn('[Dashboard] Could not fetch admin logs, model might be missing:', e)
    }

    const cacheStats = await getCacheStats()

    return {
        lastCacheClear,
        lastPreload,
        cacheStats,
        lighthouse: {
            mobile: 92,
            desktop: 98,
            trend: +2,
            lastScan: new Date().toISOString() // Mock for now
        }
    }
}

export async function getRecentActivity(limit = 7) {
    await requireAdmin()
    try {
        if ((prisma as any).adminLog) {
            return await (prisma as any).adminLog.findMany({
                take: limit,
                orderBy: { createdAt: 'desc' }
            })
        }
    } catch (e) {
        console.warn('[Dashboard] Could not fetch recent activity:', e)
    }
    return []
}
