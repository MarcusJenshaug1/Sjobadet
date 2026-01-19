import puppeteer, { Browser, ConsoleMessage, HTTPRequest } from 'puppeteer-core';
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
    let browser: Browser | null = null;

    try {
        let executablePath: string | undefined;
        let useChromiumBundle = true;

        try {
            executablePath = await chromium.executablePath();
        } catch (err) {
            useChromiumBundle = false;
            console.log('[Scraper] sparticuz/chromium-min failed, using fallback executable path', err);
        }

        // Accept any valid path returned by chromium; only fallback if empty
        const isWindows = process.platform === 'win32';
        const isMac = process.platform === 'darwin';
        if (!executablePath) {
            useChromiumBundle = false;
            if (isWindows) {
                executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
            } else if (process.env.CHROME_PATH) {
                executablePath = process.env.CHROME_PATH;
            } else if (isMac) {
                executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
            } else {
                console.error('[Scraper] Chromium path is missing on this environment; set CHROME_PATH to a valid binary.');
                throw new Error('Chromium executable not found');
            }
        }

        const launchArgs = useChromiumBundle ? chromium.args : ['--no-sandbox', '--disable-setuid-sandbox'];

        browser = await puppeteer.launch({
            args: launchArgs,
            // @ts-expect-error chromium typings in sparticuz package omit defaultViewport
            defaultViewport: useChromiumBundle ? chromium.defaultViewport : undefined,
            executablePath,
            headless: true,
            // @ts-expect-error puppeteer LaunchOptions typing omits ignoreHTTPSErrors here
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    page.on('console', (msg: ConsoleMessage) => console.log('[Browser Console]:', msg.text()));

        await page.setRequestInterception(true);
        page.on('request', (req: HTTPRequest) => {
            if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 4000));

        // Scroll to force lazy load
        await page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 150;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight || totalHeight > 4000) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 120);
            });
        });

        // Click Today
        await page.evaluate(() => {
            const todayNum = new Date().getDate().toString();
            const elements = Array.from(document.querySelectorAll('div, span, button, td, a'));
            const todayEl = elements.find(el => {
                const text = (el as HTMLElement).innerText?.trim();
                return text === todayNum && el.getBoundingClientRect().width < 80;
            });
            if (todayEl) (todayEl as HTMLElement).click();
        });

    await new Promise((r) => setTimeout(r, 3500));

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

            const today = new Date();
            const parts = new Intl.DateTimeFormat('sv-SE', {
                timeZone: 'Europe/Oslo',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).formatToParts(today);

            const year = parts.find(p => p.type === 'year')?.value ?? '';
            const month = parts.find(p => p.type === 'month')?.value ?? '';
            const day = parts.find(p => p.type === 'day')?.value ?? '';
            const dateKey = `${year}-${month}-${day}`;

            return { date: dateKey, slots: normalized };
        });

        await browser.close();
        return scrapedData as AvailabilityResponse;

    } catch (error) {
        console.error('[Scraper] Error:', error);
        if (browser) await browser.close();
        return { date: null, slots: [] };
    }
}
