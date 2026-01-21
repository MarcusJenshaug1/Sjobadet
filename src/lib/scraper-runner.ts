import prisma from '@/lib/prisma';
import { ScraperService, ScraperTrigger } from './scraper-service'; // Fixed import path if needed, assuming same dir
import { fetchAvailability, createScraperBrowser } from './availability-scraper';

interface ScraperRunOptions {
    mode: 'all' | 'selected';
    saunaIds?: string[];
    trigger?: ScraperTrigger;
    runId?: string; // If already created
}

export async function runScraper(options: ScraperRunOptions) {
    const { mode, saunaIds, trigger = 'manual' } = options;
    let runId = options.runId;

    console.log(`[ScraperRunner] Starting run. Mode: ${mode}, RunID: ${runId}`);

    // Create run if not exists
    if (!runId) {
        const run = await ScraperService.createRun(trigger, `Triggered: ${mode}`);
        runId = run.id;
    }

    // Ensure runId is string (it is, but for strict null checks if something changed)
    if (!runId) throw new Error("Run ID missing");
    const currentRunId = runId; // Capture for closure/strictness

    try {
        // 1. Fetch saunas
        // START DB QUERY
        const where: any = { status: 'active' };
        if (mode === 'selected' && saunaIds?.length) {
            where.id = { in: saunaIds };
        }

        // Select specific fields
        const saunas = await prisma.sauna.findMany({
            where,
            select: {
                id: true,
                name: true,
                bookingAvailabilityUrlDropin: true
            }
        });

        await ScraperService.logEvent(currentRunId, 'info', 'run', `Found ${saunas.length} saunas to scrape`);

        // 2. Initialize Browser
        let browser;
        try {
            browser = await createScraperBrowser();
            await ScraperService.logEvent(currentRunId, 'info', 'scraper', 'Browser launched successfully');
        } catch (e: any) {
            await ScraperService.logEvent(currentRunId, 'error', 'scraper', `Failed to launch browser: ${e.message}`);
            await ScraperService.finishRun(currentRunId, 'failed');
            return;
        }

        // 3. Loop and Scrape
        for (const sauna of saunas) {
            if (!sauna.bookingAvailabilityUrlDropin) {
                await ScraperService.updateItem(currentRunId, sauna.id, 'skipped', { reason: 'No booking URL' });
                continue;
            }

            // We know url is string here
            const bookingUrl: string = sauna.bookingAvailabilityUrlDropin;

            // Mark as running (we pass 'running' casted as any because strict type expects valid status, but service handles upsert)
            // Actually for ScraperService.updateItem we should send a valid status or I should update service type. 
            // Let's just not update status yet, or send 'empty' as placeholder? No.
            // Let's assume 'status' is one of: 'success' | 'failed' | 'empty' | 'skipped'.
            // We'll skip the "in progress" update for the item to avoid type error, just log event.
            await ScraperService.logEvent(currentRunId, 'info', 'sauna', `Starting scrape for ${sauna.name}`, undefined, sauna.id);

            const startTime = Date.now();
            try {
                const result = await fetchAvailability(bookingUrl, { browser });
                const durationMs = Date.now() - startTime;

                // Analyze result
                const daysWithSlots = Object.values(result.days).filter(d => d.length > 0).length;
                const totalSlots = Object.values(result.days).reduce((acc, curr) => acc + curr.length, 0);

                if (totalSlots > 0) {
                    await ScraperService.updateItem(currentRunId, sauna.id, 'success', {
                        durationMs,
                        slotsFound: totalSlots,
                        daysScraped: Object.keys(result.days).length,
                        targetUrl: bookingUrl,
                        diagnostics: result.diagnostics
                    });

                    // UPDATE SAUNA DATA
                    await prisma.sauna.update({
                        where: { id: sauna.id },
                        data: {
                            availabilityData: JSON.stringify(result),
                            lastScrapedAt: new Date()
                        }
                    });

                } else {
                    await ScraperService.updateItem(currentRunId, sauna.id, 'empty', {
                        durationMs,
                        daysScraped: Object.keys(result.days).length,
                        reason: 'No slots found',
                        targetUrl: bookingUrl,
                        diagnostics: result.diagnostics
                    });

                    // Log warning
                    await ScraperService.logEvent(currentRunId, 'warn', 'sauna', `No slots found for ${sauna.name}`, result.diagnostics, sauna.id);

                    // Attempt update, using unchecked if needed or just standard update
                    await prisma.sauna.update({
                        where: { id: sauna.id },
                        data: {
                            lastScrapedAt: new Date() // Just update timestamp to show we checked
                        }
                    });
                }

            } catch (error: any) {
                const durationMs = Date.now() - startTime;
                await ScraperService.updateItem(currentRunId, sauna.id, 'failed', {
                    durationMs,
                    errorCode: 'UNKNOWN',
                    reason: error.message,
                    targetUrl: bookingUrl
                });

                await ScraperService.logEvent(currentRunId, 'error', 'sauna', `Failed to scrape ${sauna.name}: ${error.message}`, undefined, sauna.id);

                await prisma.sauna.update({
                    where: { id: sauna.id },
                    data: {
                        lastScrapedAt: new Date()
                    }
                });
            }
        }

        // 4. Cleanup
        if (browser) await browser.close();

        // 5. Finish
        await ScraperService.finishRun(currentRunId, 'success');

    } catch (error: any) {
        console.error('Runner failed', error);
        if (currentRunId) {
            await ScraperService.logEvent(currentRunId, 'error', 'run', `Runner crashed: ${error.message}`);
            await ScraperService.finishRun(currentRunId, 'failed');
        }
    }
}
