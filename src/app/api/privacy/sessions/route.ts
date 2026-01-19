import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

/**
 * Get privacy sessions for admin dashboard.
 * ONLY shows sessions where hasConsent = true.
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
        const deviceType = searchParams.get('deviceType');
        const browser = searchParams.get('browser');
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');
        const maskIp = searchParams.get('maskIp') !== 'false'; // Default true

        // Build where clause - ONLY consented sessions
        const where: any = {
            hasConsent: true,
        };
        
        if (deviceType) where.deviceType = deviceType;
        if (browser) where.browser = browser;
        if (from || to) {
            where.firstSeen = {};
            if (from) where.firstSeen.gte = new Date(from);
            if (to) where.firstSeen.lte = new Date(to);
        }

        // Fetch sessions
        const [sessions, total] = await Promise.all([
            prisma.privacySession.findMany({
                where,
                orderBy: { lastSeen: 'desc' },
                take: limit,
                skip: offset,
                select: {
                    id: true,
                    firstSeen: true,
                    lastSeen: true,
                    hasConsent: true,
                    ipAddress: true,
                    ipAddressHash: true,
                    userAgent: true,
                    deviceType: true,
                    browser: true,
                    os: true,
                    referrer: true,
                    utmSource: true,
                    utmMedium: true,
                    utmCampaign: true,
                    pageviewCount: true,
                    eventCount: true,
                    createdAt: true,
                }
            }),
            prisma.privacySession.count({ where }),
        ]);

        // Mask IP addresses if requested
        const maskedSessions = sessions.map(s => {
            let maskedIp = s.ipAddress;
            if (maskIp && s.ipAddress) {
                if (s.ipAddress.includes(':')) {
                    // IPv6 (e.g., ::1)
                    maskedIp = s.ipAddress === '::1' ? 'localhost (IPv6)' : s.ipAddress.substring(0, 10) + ':xxx:xxx';
                } else if (s.ipAddress.includes('.')) {
                    // IPv4
                    const parts = s.ipAddress.split('.');
                    maskedIp = parts.slice(0, 2).join('.') + '.xxx.xxx';
                } else {
                    maskedIp = 'unknown';
                }
            }
            return {
                ...s,
                ipAddress: maskedIp,
                ipAddressFull: s.ipAddress, // Keep for unmask functionality
            };
        });

        // Statistics
        const stats = {
            total,
            byDevice: await prisma.privacySession.groupBy({
                by: ['deviceType'],
                _count: true,
                where: { hasConsent: true },
            }),
            byBrowser: await prisma.privacySession.groupBy({
                by: ['browser'],
                _count: true,
                where: { hasConsent: true },
            }),
        };

        return NextResponse.json({
            sessions: maskIp ? maskedSessions.map(({ ipAddressFull, ...rest }) => rest) : maskedSessions,
            total,
            limit,
            offset,
            stats,
        });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        return NextResponse.json(
            { error: "Failed to fetch sessions" },
            { status: 500 }
        );
    }
}
