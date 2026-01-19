import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

/**
 * Get privacy dashboard statistics.
 */
export async function GET(req: NextRequest) {
    try {
        // Auth check
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const now = new Date();
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const last30Minutes = new Date(now.getTime() - 30 * 60 * 1000); // Active = activity within 30 min

        // Consent statistics
        const [
            totalConsents,
            consents7d,
            consents30d,
            consentsByChoice,
            analysisAccepted7d,
            analysisDeclined7d,
            analysisAccepted30d,
            analysisDeclined30d,
            activeSessions,
            latestPolicyVersion,
        ] = await Promise.all([
            prisma.consentLog.count(),
            prisma.consentLog.count({
                where: { timestamp: { gte: last7Days } }
            }),
            prisma.consentLog.count({
                where: { timestamp: { gte: last30Days } }
            }),
            prisma.consentLog.groupBy({
                by: ['choice'],
                _count: true,
            }),
            prisma.consentLog.count({
                where: { 
                    timestamp: { gte: last7Days },
                    analysis: true 
                }
            }),
            prisma.consentLog.count({
                where: { 
                    timestamp: { gte: last7Days },
                    analysis: false 
                }
            }),
            prisma.consentLog.count({
                where: { 
                    timestamp: { gte: last30Days },
                    analysis: true 
                }
            }),
            prisma.consentLog.count({
                where: { 
                    timestamp: { gte: last30Days },
                    analysis: false 
                }
            }),
            // Active sessions = hasConsent AND lastSeen within 30 minutes
            prisma.privacySession.count({
                where: { 
                    hasConsent: true,
                    lastSeen: { gte: last30Minutes }
                }
            }),
            prisma.consentLog.findFirst({
                orderBy: { timestamp: 'desc' },
                select: { consentVersion: true }
            }),
        ]);

        // Calculate consent rates
        const consentRate7d = consents7d > 0 
            ? Math.round((analysisAccepted7d / consents7d) * 100) 
            : 0;
        const consentRate30d = consents30d > 0 
            ? Math.round((analysisAccepted30d / consents30d) * 100) 
            : 0;

        // Calculate "ignored" (no choice yet) - sessions without any consent log
        const totalSessions = await prisma.privacySession.count();
        const analysisIgnored30d = Math.max(0, totalSessions - analysisAccepted30d - analysisDeclined30d);

        return NextResponse.json({
            overview: {
                totalConsents,
                consents7d,
                consents30d,
                consentRate7d,
                consentRate30d,
                activeSessions,
                latestPolicyVersion: latestPolicyVersion?.consentVersion || 'v1',
            },
            consentBreakdown: {
                byChoice: consentsByChoice.map(c => ({
                    choice: c.choice,
                    count: c._count,
                })),
                analysis: {
                    accepted7d: analysisAccepted7d,
                    declined7d: analysisDeclined7d,
                    accepted30d: analysisAccepted30d,
                    declined30d: analysisDeclined30d,
                    ignored30d: analysisIgnored30d,
                }
            }
        }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
            }
        });
    } catch (error) {
        console.error('Error fetching privacy stats:', error);
        console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
        return NextResponse.json(
            { error: "Failed to fetch statistics", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
