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
        let successCount = 0;
        let failCount = 0;

        for (const sauna of saunas) {
            if (!sauna.bookingAvailabilityUrlDropin) {
                await ScraperService.updateItem(currentRunId, sauna.id, 'skipped', { reason: 'No booking URL' });
                continue;
            }

            const bookingUrl: string = sauna.bookingAvailabilityUrlDropin;
            await ScraperService.logEvent(currentRunId, 'info', 'sauna', `Starting scrape for ${sauna.name}`, undefined, sauna.id);

            const startTime = Date.now();
            try {
                const result = await fetchAvailability(bookingUrl, { browser });
                const durationMs = Date.now() - startTime;
                const totalSlots = Object.values(result.days).reduce((acc, curr) => acc + curr.length, 0);

                if (totalSlots > 0) {
                    successCount++;
                    const dayCount = Object.keys(result.days).length;

                    // Extract a small summary of times
                    const allSlots = Object.values(result.days).flat().sort((a, b) => a.from.localeCompare(b.from));
                    const timeSummary = allSlots.slice(0, 3).map(s => s.from).join(', ') + (allSlots.length > 3 ? '...' : '');

                    await ScraperService.updateItem(currentRunId, sauna.id, 'success', {
                        durationMs,
                        slotsFound: totalSlots,
                        daysScraped: dayCount,
                        targetUrl: bookingUrl,
                        diagnostics: result.diagnostics
                    });

                    await ScraperService.logEvent(
                        currentRunId,
                        'info',
                        'sauna',
                        `Ferdig med ${sauna.name}. Fant ${totalSlots} ledige tider over ${dayCount} dager. (Tider: ${timeSummary})`,
                        undefined,
                        sauna.id
                    );

                    await prisma.sauna.update({
                        where: { id: sauna.id },
                        data: {
                            availabilityData: JSON.stringify(result),
                            lastScrapedAt: new Date()
                        }
                    });
                } else {
                    // Empty is considered a successful check if the site loaded correctly
                    successCount++;
                    const dayCount = Object.keys(result.days).length;

                    await ScraperService.updateItem(currentRunId, sauna.id, 'empty', {
                        durationMs,
                        daysScraped: dayCount,
                        reason: 'No slots found',
                        targetUrl: bookingUrl,
                        diagnostics: result.diagnostics
                    });

                    await ScraperService.logEvent(
                        currentRunId,
                        'info',
                        'sauna',
                        `${sauna.name}: Ingen tider funnet (sjekket ${dayCount} dager). Beholder forrige tilgjengelighet.`,
                        result.diagnostics,
                        sauna.id
                    );

                    await prisma.sauna.update({
                        where: { id: sauna.id },
                        data: {
                            lastScrapedAt: new Date()
                        }
                    });
                }
            } catch (error: any) {
                failCount++;
                const durationMs = Date.now() - startTime;
                await ScraperService.updateItem(currentRunId, sauna.id, 'failed', {
                    durationMs,
                    errorCode: 'UNKNOWN',
                    reason: error.message,
                    targetUrl: bookingUrl
                });

                await ScraperService.logEvent(currentRunId, 'error', 'sauna', `FEIL ved scraping av ${sauna.name}: ${error.message}`, undefined, sauna.id);

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

        // 5. Determine Final Status
        let finalStatus: 'success' | 'partial' | 'failed' = 'success';
        if (failCount > 0) {
            finalStatus = successCount > 0 ? 'partial' : 'failed';
        }
        if (saunas.length === 0) finalStatus = 'success';

        await ScraperService.finishRun(currentRunId, finalStatus);

        const finalMessage = `Kjøring fullført (${finalStatus.toUpperCase()}). Suksess: ${successCount}, Feil: ${failCount}.`;
        await ScraperService.logEvent(currentRunId, finalStatus === 'failed' ? 'error' : 'info', 'run', finalMessage);

    } catch (error: any) {
        console.error('Runner failed', error);
        if (currentRunId) {
            await ScraperService.logEvent(currentRunId, 'error', 'run', `Runner crashed: ${error.message}`);
            await ScraperService.finishRun(currentRunId, 'failed');
        }
    }
}
