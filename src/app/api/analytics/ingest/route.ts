import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";
import { LRUCache } from "lru-cache";

// Rate limiting setup (Audit finding #2)
const rateLimit = new LRUCache({
    max: 1000, // 1000 IPs
    ttl: 1000 * 60 * 15, // 15 minutes
});

const IngestSchema = z.object({
    sessionId: z.string().optional(),
    type: z.enum(["pageview", "event"]),
    eventName: z.string().max(50).optional(),
    path: z.string().max(255),
    payload: z.any().optional().transform(p => {
        // Strip potential PII or oversized objects from payload
        if (typeof p === 'object' && p !== null) {
            const safe: any = {};
            const keys = Object.keys(p).slice(0, 10); // Max 10 keys
            for (const k of keys) {
                if (typeof p[k] === 'string' && p[k].length > 100) continue; // Skip long strings
                safe[k] = p[k];
            }
            return safe;
        }
        return p;
    }),
    metadata: z.object({
        utmSource: z.string().max(50).nullable().optional(),
        utmMedium: z.string().max(50).nullable().optional(),
        utmCampaign: z.string().max(50).nullable().optional(),
    }).optional(),
});

/**
 * First-party tracking ingest endpoint.
 * Strictly no PII, no raw IP, no email/names.
 */
export async function POST(req: NextRequest) {
    try {
        const h = await headers();
        const ip = h.get("x-forwarded-for") || "unknown";

        // Simple Rate Limit (Audit finding #2)
        const count = (rateLimit.get(ip) as number || 0) + 1;
        rateLimit.set(ip, count);
        if (count > 50) { // 50 requests per 15 mins
            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }

        const body = await req.json();

        // Audit finding #2: Zod Validation
        const result = IngestSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: "Invalid payload", details: result.error.format() }, { status: 400 });
        }

        const { sessionId, type, eventName, path, payload, metadata } = result.data;

        // Special case: anonymous consent choice doesn't need a sessionId
        const isConsentChoice = type === 'event' && eventName === 'consent_choice';

        if (!sessionId && !isConsentChoice) {
            console.warn("Analytics ingest blocked: Missing sessionId for non-consent event.");
            return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
        }

        const ua = h.get("user-agent") || "";
        const referer = h.get("referer") || "";

        // Basic UA parsing (Privacy-friendly)
        const deviceType = ua.includes("Mobi") ? "mobile" : "desktop";
        const browser = ua.includes("Chrome") ? "Chrome" : ua.includes("Firefox") ? "Firefox" : ua.includes("Safari") ? "Safari" : "Other";
        const os = ua.includes("Windows") ? "Windows" : ua.includes("Mac") ? "Mac" : ua.includes("Android") ? "Android" : ua.includes("iOS") ? "iOS" : "Other";

        // Extract UTMs (optional)
        const utmSource = metadata?.utmSource || null;
        const utmMedium = metadata?.utmMedium || null;
        const utmCampaign = metadata?.utmCampaign || null;

        // Note: Using any here because prisma client might not be generated yet due to dev server lock
        const analytics = prisma as any;

        // Safety check: skip if models are missing (e.g. generate failed)
        if (!analytics.analyticsSession || !analytics.analyticsEvent) {
            console.warn("Analytics models missing in Prisma client. Please run prisma generate.");
            return NextResponse.json({ success: false, message: "Analytics models missing" });
        }

        // Upsert session to ensure it exists and track activity
        if (sessionId) {
            await analytics.analyticsSession.upsert({
                where: { id: sessionId },
                create: {
                    id: sessionId,
                    deviceType,
                    browser,
                    os,
                    referrer: referer,
                    utmSource,
                    utmMedium,
                    utmCampaign,
                },
                update: {
                    endTime: new Date(),
                },
            });

            // CRITICAL: Update PrivacySession lastSeen for live tracking
            // Only if the session has consent (don't create if it doesn't exist)
            try {
                // Check if session exists first
                const existingSession = await analytics.privacySession.findFirst({
                    where: {
                        id: sessionId,
                        hasConsent: true,
                    },
                });

                if (existingSession) {
                    const updateData: any = { lastSeen: new Date() };
                    
                    if (type === 'pageview') {
                        updateData.pageviewCount = { increment: 1 };
                    } else if (type === 'event') {
                        updateData.eventCount = { increment: 1 };
                    }

                    await analytics.privacySession.update({
                        where: { id: sessionId },
                        data: updateData
                    });
                }
            } catch (e) {
                // Ignore if PrivacySession doesn't exist (user declined consent)
                console.warn('Failed to update PrivacySession:', e);
            }
        }

        // Record the event
        await analytics.analyticsEvent.create({
            data: {
                sessionId: sessionId || null,
                type, // "pageview" or "event"
                eventName: eventName || null,
                path,
                payload: payload ? JSON.stringify(payload) : null,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Analytics ingest error:", error);
        console.error("Stack:", error instanceof Error ? error.stack : 'No stack');
        return NextResponse.json({ 
            error: "Internal server error",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
