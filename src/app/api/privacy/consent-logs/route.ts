import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

/**
 * Get consent logs for admin dashboard.
 * Supports filtering and pagination.
 */
export async function GET(req: NextRequest) {
    try {
        // Auth check
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        
        // Filters
        const version = searchParams.get('version');
        const choice = searchParams.get('choice');
        const analysis = searchParams.get('analysis'); // 'true', 'false', or null
        const from = searchParams.get('from'); // ISO date
        const to = searchParams.get('to'); // ISO date
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Build where clause
        const where: any = {};
        
        if (version) where.consentVersion = version;
        if (choice) where.choice = choice;
        if (analysis !== null) {
            where.analysis = analysis === 'true';
        }
        if (from || to) {
            where.timestamp = {};
            if (from) where.timestamp.gte = new Date(from);
            if (to) where.timestamp.lte = new Date(to);
        }

        // Fetch logs
        const [logs, total] = await Promise.all([
            prisma.consentLog.findMany({
                where,
                orderBy: { timestamp: 'desc' },
                take: limit,
                skip: offset,
            }),
            prisma.consentLog.count({ where }),
        ]);

        // Fetch statistics
        const stats = await prisma.consentLog.groupBy({
            by: ['choice'],
            _count: true,
            where: from || to ? where : undefined,
        });

        const analysisStats = await prisma.consentLog.groupBy({
            by: ['analysis'],
            _count: true,
            where: from || to ? where : undefined,
        });

        return NextResponse.json({
            logs,
            total,
            limit,
            offset,
            stats: {
                byChoice: stats.map(s => ({ choice: s.choice, count: s._count })),
                byAnalysis: analysisStats.map(s => ({ analysis: s.analysis, count: s._count })),
            }
        });
    } catch (error) {
        console.error('Error fetching consent logs:', error);
        return NextResponse.json(
            { error: "Failed to fetch consent logs" },
            { status: 500 }
        );
    }
}
