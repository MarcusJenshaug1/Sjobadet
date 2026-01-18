import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

export interface ScrapedSlot {
    from: string;
    to: string;
    availableSpots: number;
}

export interface AvailabilityResponse {
    date: string | null;
    slots: ScrapedSlot[];
}

export async function fetchAvailability(url: string): Promise<AvailabilityResponse> {
    console.log(`[Scraper] Starting fetch for ${url}`);

    let browser = null;
    try {
        let executablePath = '';

        try {
            executablePath = await chromium.executablePath();
        } catch {
            console.log('[Scraper] sparticuz/chromium-min failed, using local Chrome path');
        }

        // Local Windows fallback
        const isWindows = process.platform === 'win32';
        if (!executablePath || executablePath.includes('node_modules')) {
            if (isWindows) {
                executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
            } else {
                // On Linux/Vercel, if chromium.executablePath() failed, 
                // we should NOT fallback to a Windows path.
                console.error('[Scraper] Chromium path is missing on Linux environment!');
                throw new Error('Chromium executable not found');
            }
        }

        browser = await puppeteer.launch({
            args: [...chromium.args, '--disable-blink-features=AutomationControlled', '--no-sandbox', '--disable-setuid-sandbox'],
            // @ts-expect-error chromium typings in sparticuz package omit defaultViewport
            defaultViewport: chromium.defaultViewport,
            executablePath: executablePath,
            headless: true,
            // @ts-expect-error puppeteer LaunchOptions typing omits ignoreHTTPSErrors here
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        page.on('console', msg => console.log('[Browser Console]:', msg.text()));

        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });

        // Scroll
        await page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight || totalHeight > 3000) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        // Click Today
        await page.evaluate(() => {
            const todayNum = new Date().getDate().toString();
            const elements = Array.from(document.querySelectorAll('div, span, button, td, a'));
            const todayEl = elements.find(el => {
                const text = (el as HTMLElement).innerText?.trim();
                return text === todayNum && el.getBoundingClientRect().width < 60;
            });
            if (todayEl) (todayEl as HTMLElement).click();
        });

        await new Promise(r => setTimeout(r, 2000));

        const scrapedData = await page.evaluate(() => {
            const normalizeTime = (value: string) => value.replace('.', ':');
            const timeRangeRegex = /(\d{1,2}[:.]\d{2})\s*[-–]\s*(\d{1,2}[:.]\d{2})/;
            const availableRegex = /(\d+)\s*(?:ledige?\s*plasser?|ledig\s*plass|ledige?|available)/i;

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

            // Preferred: table rows with explicit availability text
            const tableRows = Array.from(document.querySelectorAll('tr'));
            tableRows.forEach(row => {
                const text = (row as HTMLElement).innerText || '';
                if (/ledig/i.test(text)) {
                    parseRowText(text, slots);
                }
            });

            // Fallback: generic elements with time ranges and availability wording
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

            const normalized = ordered.map(slot => {
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

            return { date: null, slots: normalized };
        });

        await browser.close();
        return scrapedData as AvailabilityResponse;

    } catch (error) {
        console.error('[Scraper] Error:', error);
        if (browser) await browser.close();
        return { date: null, slots: [] };
    }
}
