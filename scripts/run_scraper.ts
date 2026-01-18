import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface ScrapedSlot {
    from: string;
    to: string;
    availableSpots: number;
}

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
        const dailyResults: Record<string, any> = {};

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
                const results: any[] = [];
                const timeRegex = /(\d{1,2}[:.]?\d{2})\s*[-–]\s*(\d{1,2}[:.]?\d{2})/; // Match "HH:MM - HH:MM" format
                const elements = Array.from(document.querySelectorAll('*')).filter(el => {
                    const txt = (el as HTMLElement).innerText;
                    return txt && timeRegex.test(txt) && txt.length < 100;
                });

                elements.forEach(el => {
                    const text = (el as HTMLElement).innerText;
                    const match = text.match(timeRegex);
                    if (match) {
                        const fromTime = match[1].replace('.', ':');
                        const toTime = match[2].replace('.', ':');

                        let current: HTMLElement | null = el as HTMLElement;
                        let availableSpots = 0;
                        let depth = 0;

                        // Search up the DOM tree for availability info
                        while (current && current !== document.body && depth < 5) {
                            const txt = current.innerText || '';

                            // Match Norwegian patterns: "6 Ledige plasser", "5 ledig plass", etc.
                            const capMatch = txt.match(/(\d+)\s*(?:ledige?\s*plasse?r?|ledig|plasser?|stk|available)/i);
                            if (capMatch) {
                                availableSpots = parseInt(capMatch[1], 10);
                                break;
                            }

                            if (txt.toLowerCase().includes('fullt') || txt.toLowerCase().includes('0 ledig')) {
                                availableSpots = 0;
                                break;
                            }

                            current = current.parentElement;
                            depth++;
                        }

                        if (!results.find(s => s.from === fromTime)) {
                            results.push({ from: fromTime, to: toTime, availableSpots });
                        }
                    }
                });
                return results;
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
