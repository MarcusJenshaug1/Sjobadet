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

        // Fetch privacy stats
        if ((prisma as any).consentLog && (prisma as any).privacySession) {
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
                (prisma as any).consentLog.count({
                    where: { timestamp: { gte: last7Days } }
                }),
                (prisma as any).consentLog.count({
                    where: { 
                        timestamp: { gte: last7Days },
                        analysis: true 
                    }
                }),
                (prisma as any).consentLog.count({
                    where: { timestamp: { gte: last24Hours } }
                }),
                (prisma as any).privacySession.count({
                    where: { hasConsent: true }
                }),
                (prisma as any).consentLog.findFirst({
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
