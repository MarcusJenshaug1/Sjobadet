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
            // @ts-ignore - chromium.executablePath() can fail locally
            executablePath = await chromium.executablePath();
        } catch (e) {
            console.log('[Scraper] sparticuz/chromium-min failed, using local Chrome path');
        }

        // Local Windows fallback
        if (!executablePath || executablePath.includes('node_modules')) {
            // Common local paths for Windows
            executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
            // If not there, maybe Edge?
            // executablePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
        }

        browser = await puppeteer.launch({
            args: [...chromium.args, '--disable-blink-features=AutomationControlled', '--no-sandbox', '--disable-setuid-sandbox'],
            // @ts-ignore
            defaultViewport: chromium.defaultViewport,
            executablePath: executablePath,
            headless: true,
            // @ts-ignore
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
            const slots: any[] = [];
            const timeRegex = /(\d{1,2}[:.]\d{2})/;
            const candidates = Array.from(document.querySelectorAll('*')).filter(el => {
                const txt = (el as HTMLElement).innerText;
                return txt && timeRegex.test(txt) && txt.length < 50;
            });

            candidates.forEach(el => {
                const text = (el as HTMLElement).innerText;
                const match = text.match(timeRegex);
                if (match) {
                    const fromTime = match[1].replace('.', ':'); // Normalize to HH:MM with colon
                    const [hours, minutes] = fromTime.split(':').map(Number);
                    const toDate = new Date();
                    toDate.setHours(hours + 1, minutes);

                    const toH = String(toDate.getHours()).padStart(2, '0');
                    const toM = String(toDate.getMinutes()).padStart(2, '0');
                    const toTime = `${toH}:${toM}`;

                    let current: HTMLElement | null = el as HTMLElement;
                    let availableSpots = 0;
                    let depth = 0;

                    while (current && current !== document.body && depth < 5) {
                        const txt = current.innerText || '';
                        const lowerText = txt.toLowerCase();

                        // Look for numerical capacity first
                        const capMatch = txt.match(/(\d+)\s*(?:ledig|plass|stk|available)/i);
                        if (capMatch) {
                            availableSpots = parseInt(capMatch[1], 10);
                            break;
                        }

                        // Look for "full" indicators
                        if (lowerText.includes('fullt') || lowerText.includes('venteliste') || lowerText.includes('0 ledig')) {
                            availableSpots = 0;
                            break;
                        }

                        // Heuristic: If we hit a container with many slots, we've gone too far
                        if (depth > 0) {
                            const timesInContainer = (txt.match(/\d{2}:\d{2}/g) || []).length;
                            if (timesInContainer > 10) break; // Increased threshold
                        }

                        current = current.parentElement;
                        depth++;
                    }

                    if (!slots.find(s => s.from === fromTime)) {
                        slots.push({ from: fromTime, to: toTime, availableSpots });
                    }
                }
            });

            return { date: null, slots: slots.sort((a, b) => a.from.localeCompare(b.from)) };
        });

        await browser.close();
        return scrapedData as AvailabilityResponse;

    } catch (error) {
        console.error('[Scraper] Error:', error);
        if (browser) await browser.close();
        return { date: null, slots: [] };
    }
}
