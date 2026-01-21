import prisma from '@/lib/prisma';
import { AvailabilityResponse } from './availability-scraper';

export type ScraperTrigger = 'cron' | 'on_demand' | 'manual';
export type ScraperStatus = 'running' | 'success' | 'partial' | 'failed' | 'cancelled';
export type ScraperLogLevel = 'debug' | 'info' | 'warn' | 'error';
export type ScraperLogScope = 'run' | 'sauna' | 'scraper' | 'db' | 'ui';

export class ScraperService {
    /**
     * Create a new ScrapeRun
     */
    static async createRun(trigger: ScraperTrigger, note?: string) {
        return prisma.scrapeRun.create({
            data: {
                trigger,
                status: 'running',
                notes: note,
                startedAt: new Date(),
            },
        });
    }

    /**
     * Log an event (info, warn, error)
     */
    static async logEvent(
        runId: string,
        level: ScraperLogLevel,
        scope: ScraperLogScope,
        message: string,
        data?: any,
        saunaId?: string
    ) {
        // Redact sensitive data if needed (basic implementation)
        const safeData = data ? JSON.stringify(data, (key, value) => {
            if (['password', 'token', 'secret', 'key'].includes(key.toLowerCase())) return '***';
            return value;
        }) : undefined;

        return prisma.scrapeLogEvent.create({
            data: {
                runId,
                level,
                scope,
                message,
                saunaId,
                dataJson: safeData,
            },
        });
    }

    /**
     * Update or create a ScrapeRunItem for a specific sauna
     */
    static async updateItem(
        runId: string,
        saunaId: string,
        status: 'success' | 'failed' | 'empty' | 'skipped',
        result?: {
            durationMs?: number;
            slotsFound?: number;
            daysScraped?: number;
            errorCode?: string;
            reason?: string;
            targetUrl?: string; // Should be redacted before passing if contains tokens
            diagnostics?: AvailabilityResponse['diagnostics'];
        }
    ) {
        const diagnosticsJson = result?.diagnostics ? JSON.stringify(result.diagnostics) : undefined;

        // We use upsert to handle multiple updates (e.g. start -> finish)
        // But typically we might just create one at the end or update an existing one.
        // For simplicity, let's assume we find by runId + saunaId or create.
        const existing = await prisma.scrapeRunItem.findFirst({
            where: { runId, saunaId }
        });

        if (existing) {
            return prisma.scrapeRunItem.update({
                where: { id: existing.id },
                data: {
                    status,
                    finishedAt: new Date(),
                    durationMs: result?.durationMs,
                    slotsFound: result?.slotsFound,
                    daysScraped: result?.daysScraped,
                    errorCode: result?.errorCode,
                    reason: result?.reason,
                    targetUrl: result?.targetUrl,
                    diagnosticsJson,
                }
            });
        } else {
            return prisma.scrapeRunItem.create({
                data: {
                    runId,
                    saunaId,
                    status,
                    startedAt: new Date(), // approximate if created at end
                    finishedAt: new Date(),
                    durationMs: result?.durationMs,
                    slotsFound: result?.slotsFound ?? 0,
                    daysScraped: result?.daysScraped ?? 0,
                    errorCode: result?.errorCode,
                    reason: result?.reason,
                    targetUrl: result?.targetUrl,
                    diagnosticsJson,
                }
            });
        }
    }

    /**
     * Mark the run as finished and calculate stats
     */
    static async finishRun(runId: string, finalStatus: ScraperStatus) {
        const now = new Date();

        // Calculate stats aggregates
        const items = await prisma.scrapeRunItem.findMany({
            where: { runId }
        });

        const totalSaunas = items.length;
        const successCount = items.filter(i => i.status === 'success').length;
        const failCount = items.filter(i => i.status === 'failed').length;
        const emptyCount = items.filter(i => i.status === 'empty').length;

        // Get start time to calc duration
        const run = await prisma.scrapeRun.findUnique({ where: { id: runId } });
        const durationMs = run ? now.getTime() - run.startedAt.getTime() : 0;

        return prisma.scrapeRun.update({
            where: { id: runId },
            data: {
                status: finalStatus,
                finishedAt: now,
                durationMs,
                totalSaunas,
                successCount,
                failCount,
                emptyCount,
            }
        });
    }
}
