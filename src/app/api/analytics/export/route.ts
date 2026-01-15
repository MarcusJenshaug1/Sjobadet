import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

/**
 * API to export analytics data as CSV for admins.
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

        const analytics = prisma as any;

        const events = await analytics.analyticsEvent.findMany({
            where: { timestamp: { gte: startDate } },
            include: { session: true },
            orderBy: { timestamp: 'desc' }
        });

        // Generate CSV content
        const headers = ["Timestamp", "Type", "EventName", "Path", "SessionID", "Device", "Browser", "OS", "Referrer", "Payload"];
        const rows = events.map((e: any) => [
            e.timestamp.toISOString(),
            e.type,
            e.eventName || "",
            e.path || "",
            e.sessionId,
            e.session?.deviceType || "",
            e.session?.browser || "",
            e.session?.os || "",
            e.session?.referrer || "",
            e.payload ? e.payload.replace(/"/g, '""') : "" // Escape quotes for CSV
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row: string[]) => row.map((cell: string) => `"${cell}"`).join(",")),
        ].join("\n");

        // Return as downloadable file
        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="analytics_export_${new Date().toISOString().split('T')[0]}.csv"`,
            }
        });

    } catch (error) {
        console.error("Analytics export error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
