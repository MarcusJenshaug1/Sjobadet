import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

/**
 * API to fetch aggregated analytics stats for the admin dashboard.
 */
export async function GET(req: NextRequest) {
    // Audit finding #1: Secure API exposure
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get('days') || '30');

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Prisma client might be out of date, so we use any to bypass types if needed
        const analytics = prisma as any;

        // Fetch basic KPIs
        const totalPageviews = await analytics.analyticsEvent.count({
            where: { type: 'pageview', timestamp: { gte: startDate } }
        });

        const totalSessions = await analytics.analyticsSession.count({
            where: { startTime: { gte: startDate } }
        });

        // Top Pages
        // SQLite doesn't support GROUP BY with aggregations as easily in Prisma without raw queries 
        // to get specific counts, but we can try basic grouping if supported.
        // Falling back to raw SQL if needed, but Prisma 5+ handles basic groupBy well.
        const topPages = await analytics.analyticsEvent.groupBy({
            by: ['path'],
            where: { type: 'pageview', timestamp: { gte: startDate } },
            _count: { _all: true },
            orderBy: { _count: { _all: 'desc' } },
            take: 10
        });

        // Top Events
        const topEvents = await analytics.analyticsEvent.groupBy({
            by: ['eventName'],
            where: { type: 'event', timestamp: { gte: startDate } },
            _count: { _all: true },
            orderBy: { _count: { _all: 'desc' } },
            take: 10
        });

        // Time series (Visits per day) - For simplicity, we fetch all sessions and group in JS
        // or we could use raw SQL for performance on larger datasets.
        const sessions = await analytics.analyticsSession.findMany({
            where: { startTime: { gte: startDate } },
            select: { startTime: true }
        });

        const dailyStats = sessions.reduce((acc: any, sess: any) => {
            const date = sess.startTime.toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        // Device stats
        const deviceStats = await analytics.analyticsSession.groupBy({
            by: ['deviceType'],
            where: { startTime: { gte: startDate } },
            _count: { _all: true }
        });

        return NextResponse.json({
            kpis: {
                pageviews: totalPageviews,
                sessions: totalSessions,
            },
            topPages: topPages.map((p: any) => ({ path: p.path, count: p._count._all })),
            topEvents: topEvents.map((e: any) => ({ name: e.eventName, count: e._count._all })),
            dailyStats: Object.entries(dailyStats).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date)),
            deviceStats: deviceStats.map((d: any) => ({ type: d.deviceType, count: d._count._all }))
        }, {
            headers: {
                "Cache-Control": "no-store, max-age=0",
            }
        });

    } catch (error) {
        console.error("Analytics stats error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
