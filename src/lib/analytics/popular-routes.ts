import prisma from '../prisma';

/**
 * Fetches pageview counts for all paths, sorted by popularity.
 * This is used to build "smart" navigation menus.
 */
export async function getPopularityStats() {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Map paths to view counts
        const pageviews = await (prisma as any).analyticsEvent.groupBy({
            by: ['path'],
            where: {
                type: 'pageview',
                timestamp: { gte: thirtyDaysAgo }
            },
            _count: {
                _all: true
            }
        });

        // Convert to a simple Key-Value object for easier lookups
        const stats: Record<string, number> = {};
        pageviews.forEach((p: any) => {
            if (p.path) {
                stats[p.path] = p._count._all;
            }
        });

        return stats;
    } catch (error) {
        console.error('[PopularityStats] Failed to fetch:', error);
        return {};
    }
}
