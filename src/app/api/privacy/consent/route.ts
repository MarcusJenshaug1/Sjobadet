import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";
import crypto from "crypto";

const ConsentSchema = z.object({
    consentVersion: z.string(),
    essential: z.boolean(),
    analysis: z.boolean(),
    functional: z.boolean(),
    marketing: z.boolean(),
    choice: z.enum(['accepted', 'declined', 'custom']),
    source: z.string().optional(),
    sessionId: z.string().optional(), // Session ID sent from client
});

/**
 * Log consent choices to database.
 * CRITICAL: Only stores personal data (IP hash, sessionId) if analysis consent = true
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = ConsentSchema.safeParse(body);
        
        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid consent data", details: result.error.format() },
                { status: 400 }
            );
        }

        const { consentVersion, essential, analysis, functional, marketing, choice, source, sessionId: clientSessionId } = result.data;

        const h = await headers();
        const ip = h.get("x-forwarded-for") || h.get("x-real-ip") || "unknown";

        // Hash IP for privacy (only if analysis consent given)
        const ipHash = analysis ? crypto.createHash('sha256').update(ip).digest('hex') : null;

        // Use sessionId from client (generated after consent was set)
        let sessionId = clientSessionId || null;

        // Create consent log (minimal data if declined)
        await prisma.consentLog.create({
            data: {
                consentVersion,
                essential,
                analysis,
                functional,
                marketing,
                choice,
                source: source || 'unknown',
                // ONLY store identifying data if analysis consent given
                sessionId: analysis ? sessionId : null,
                ipAddressHash: ipHash,
            }
        });

        // If analysis consent given and we have a sessionId, create/update PrivacySession
        if (analysis && sessionId) {
            const ua = h.get("user-agent") || "";
            const referer = h.get("referer") || "";

            // Parse UA
            const deviceType = ua.includes("Mobi") ? "mobile" : "desktop";
            const browser = ua.includes("Chrome") ? "Chrome" 
                : ua.includes("Firefox") ? "Firefox" 
                : ua.includes("Safari") ? "Safari" 
                : "Other";
            const os = ua.includes("Windows") ? "Windows" 
                : ua.includes("Mac") ? "Mac" 
                : ua.includes("Android") ? "Android" 
                : ua.includes("iOS") ? "iOS" 
                : "Other";

            await prisma.privacySession.upsert({
                where: { id: sessionId },
                update: {
                    hasConsent: true,
                    lastSeen: new Date(),
                    ipAddress: ip !== 'unknown' ? ip : null,
                    ipAddressHash: ipHash,
                    userAgent: ua.substring(0, 500), // Limit length
                    deviceType,
                    browser,
                    os,
                },
                create: {
                    id: sessionId,
                    hasConsent: true,
                    ipAddress: ip !== 'unknown' ? ip : null,
                    ipAddressHash: ipHash,
                    userAgent: ua.substring(0, 500),
                    deviceType,
                    browser,
                    os,
                    referrer: referer || null,
                    firstSeen: new Date(),
                    lastSeen: new Date(),
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Consent logging error:', error);
        return NextResponse.json(
            { error: "Failed to log consent" },
            { status: 500 }
        );
    }
}
