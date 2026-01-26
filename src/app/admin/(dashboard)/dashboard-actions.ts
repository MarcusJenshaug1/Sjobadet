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
        memberships,
        totalMedia
    ] = await Promise.all([
        prisma.mediaAsset.count({ where: { status: 'pending' } }),
        prisma.sauna.count({ where: { status: 'active' } }),
        prisma.sauna.count(),
        prisma.adminUser.count(),
        prisma.subscription.count({ where: { active: true } }),
        prisma.mediaAsset.count()
    ])

    return {
        pendingMedia,
        activeSaunas,
        totalSaunas,
        users,
        memberships,
        totalMedia
    }
}

export async function getDriftStatus() {
    await requireAdmin()

    let lastCacheClear = null
    let lastPreload = null
    let privacyStats = null

    try {
        const [clear, preload] = await Promise.all([
            prisma.adminLog.findFirst({
                where: { action: 'CACHE_CLEAR' },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.adminLog.findFirst({
                where: { action: 'PRELOAD_RUN' },
                orderBy: { createdAt: 'desc' }
            })
        ])
        lastCacheClear = clear
        lastPreload = preload

        // Fetch privacy stats
        const now = new Date()
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)

        const [
            consents7d,
            analysisAccepted7d,
            consentChanges24h,
            activeSessions,
            latestVersion
        ] = await Promise.all([
            prisma.consentLog.count({
                where: { timestamp: { gte: last7Days } }
            }),
            prisma.consentLog.count({
                where: {
                    timestamp: { gte: last7Days },
                    analysis: true
                }
            }),
            prisma.consentLog.count({
                where: { timestamp: { gte: last24Hours } }
            }),
            prisma.privacySession.count({
                where: { hasConsent: true }
            }),
            prisma.consentLog.findFirst({
                orderBy: { timestamp: 'desc' },
                select: { consentVersion: true }
            })
        ])

        const consentRate = consents7d > 0 ? Math.round((analysisAccepted7d / consents7d) * 100) : 0

        privacyStats = {
            consentRate7d: consentRate,
            consentChanges24h,
            activeSessions,
            policyVersion: latestVersion?.consentVersion || 'v1'
        }
    } catch (e) {
        console.warn('[Dashboard] Could not fetch drift stats:', e)
    }

    const cacheStats = await getCacheStats()

    return {
        lastCacheClear,
        lastPreload,
        cacheStats,
        privacyStats,
        lighthouse: {
            mobile: 92,
            desktop: 98,
            trend: +2,
            lastScan: new Date().toISOString() // Mock for now
        }
    }
}

export async function getRecentActivity(limit = 5) {
    await requireAdmin()
    try {
        return await prisma.adminLog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' }
        })
    } catch (e) {
        console.warn('[Dashboard] Could not fetch recent activity:', e)
    }
    return []
}
