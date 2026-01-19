import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

/**
 * Get pageviews for a specific session.
 * Shows which pages the user visited.
 */
export async function GET(req: NextRequest) {
    try {
        // Auth check
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
        }

        // Verify session has consent before showing pageviews
        const privacySession = await prisma.privacySession.findFirst({
            where: {
                id: sessionId,
                hasConsent: true,
            },
        });

        if (!privacySession) {
            return NextResponse.json({ error: "Session not found or no consent" }, { status: 404 });
        }

        // Fetch pageviews from AnalyticsEvent
        const pageviews = await prisma.analyticsEvent.findMany({
            where: {
                sessionId,
                type: 'pageview',
            },
            orderBy: { timestamp: 'desc' },
            take: 100, // Limit to last 100 pageviews
            select: {
                id: true,
                path: true,
                timestamp: true,
            }
        });

        return NextResponse.json({
            sessionId,
            pageviews: pageviews.map(pv => ({
                path: pv.path,
                timestamp: pv.timestamp,
            })),
            total: pageviews.length,
        });
    } catch (error) {
        console.error('Error fetching session pageviews:', error);
        return NextResponse.json(
            { error: "Failed to fetch pageviews" },
            { status: 500 }
        );
    }
}
