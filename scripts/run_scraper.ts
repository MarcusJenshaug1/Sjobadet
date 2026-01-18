import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function scrapeSauna(saunaId: string, url: string) {
    console.log(`[Scraper] Starting scrape for ${saunaId} (${url})`);
    const browser = await chromium.launch({ headless: true });
    try {
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });
        const page = await context.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const daysToScrape = [0, 1]; // 0 = Today, 1 = Tomorrow
    const dailyResults: Record<string, { from: string; to: string; availableSpots: number }[]> = {};

        for (const dayOffset of daysToScrape) {
            const TargetDate = new Date();
            TargetDate.setDate(TargetDate.getDate() + dayOffset);
            const dateStr = TargetDate.toISOString().split('T')[0];
            const dayNum = TargetDate.getDate().toString();

            console.log(`[Scraper] Scraping for ${dateStr} (day ${dayNum})`);

            // Try to find and click the day
            const dayEl = await page.locator(`div:text-is("${dayNum}"), span:text-is("${dayNum}"), button:text-is("${dayNum}"), td:text-is("${dayNum}")`).first();
            if (await dayEl.isVisible()) {
                await dayEl.click();
                await page.waitForTimeout(2000);
            }

            // Scroll down to load lazy-loaded time slots
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            await page.waitForTimeout(3000); // Wait for lazy loading

            const slots = await page.evaluate(() => {
                const normalizeTime = (value: string) => value.replace('.', ':');
                const timeRangeRegex = /(\d{1,2}[:.]?\d{2})\s*[-–]\s*(\d{1,2}[:.]?\d{2})/;
                const availableRegex = /(\d+)\s*(?:ledige?\s*plasse?r?|ledig\s*plass|ledige?|available)/i;

                const upsertSlot = (store: Map<string, { from: string; to: string; availableSpots: number }>, from: string, to: string, availableSpots: number) => {
                    const existing = store.get(from);
                    if (!existing || availableSpots !== undefined) {
                        store.set(from, { from, to, availableSpots: Number.isFinite(availableSpots) ? availableSpots : 0 });
                    }
                };

                const parseRowText = (text: string, target: Map<string, { from: string; to: string; availableSpots: number }>) => {
                    const condensed = text.replace(/\s+/g, ' ').trim();
                    const timeMatch = condensed.match(timeRangeRegex);
                    if (!timeMatch) return;

                    const fromTime = normalizeTime(timeMatch[1]);
                    const toTime = normalizeTime(timeMatch[2]);
                    const availMatch = condensed.match(availableRegex);
                    const availableSpots = availMatch ? parseInt(availMatch[1], 10) : 0;

                    upsertSlot(target, fromTime, toTime, availableSpots);
                };

                const slots = new Map<string, { from: string; to: string; availableSpots: number }>();

                const tableRows = Array.from(document.querySelectorAll('tr'));
                tableRows.forEach(row => {
                    const text = (row as HTMLElement).innerText || '';
                    if (/ledig/i.test(text)) {
                        parseRowText(text, slots);
                    }
                });

                if (slots.size === 0) {
                    const candidates = Array.from(document.querySelectorAll('*')).filter(el => {
                        const txt = (el as HTMLElement).innerText;
                        return txt && timeRangeRegex.test(txt) && /ledig/i.test(txt);
                    });

                    candidates.forEach(el => {
                        const text = (el as HTMLElement).innerText || '';
                        parseRowText(text, slots);
                    });
                }

                const ordered = Array.from(slots.values()).sort((a, b) => a.from.localeCompare(b.from));

                return ordered.map(slot => {
                    if (!slot.to) {
                        const [h, m] = slot.from.split(':').map(Number);
                        const end = new Date();
                        end.setHours(h + 1, m);
                        const hh = `${end.getHours()}`.padStart(2, '0');
                        const mm = `${end.getMinutes()}`.padStart(2, '0');
                        return { ...slot, to: `${hh}:${mm}` };
                    }
                    return slot;
                });
            });

            dailyResults[dateStr] = slots.sort((a, b) => a.from.localeCompare(b.from));
        }

        const resultJson = JSON.stringify({
            days: dailyResults,
            timestamp: new Date().toISOString()
        });

        const { error } = await supabase
            .from('Sauna')
            .update({
                availabilityData: resultJson,
                lastScrapedAt: new Date().toISOString()
            })
            .eq('id', saunaId);

        if (error) throw error;
        console.log(`[Scraper] Updated ${saunaId} successfully`);

    } catch (err) {
        console.error(`[Scraper] Failed to update ${saunaId}:`, err);
    } finally {
        await browser.close();
    }
}

async function runAll() {
    // Fetch all active saunas that have a booking availability URL
    const { data: saunas, error } = await supabase
        .from('Sauna')
        .select('id, bookingAvailabilityUrlDropin')
        .eq('status', 'active');

    if (error) {
        console.error('Error fetching saunas:', error);
        return;
    }

    if (!saunas || saunas.length === 0) {
        console.log('No saunas to scrape.');
        return;
    }

    for (const sauna of saunas) {
        if (sauna.bookingAvailabilityUrlDropin) {
            await scrapeSauna(sauna.id, sauna.bookingAvailabilityUrlDropin);
        }
    }
}

runAll();
