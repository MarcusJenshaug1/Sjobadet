import puppeteer, { Browser, ConsoleMessage, HTTPRequest } from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

export interface ScrapedSlot {
    from: string;
    to: string;
    availableSpots: number;
}

export interface AvailabilityResponse {
    days: Record<string, ScrapedSlot[]>;
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

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise((r) => setTimeout(r, 2000));

        const osloNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Oslo' }));
        const formatter = new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'Europe/Oslo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

        const buildDateKey = (offsetDays: number) => {
            const target = new Date(osloNow);
            target.setDate(target.getDate() + offsetDays);
            return formatter.format(target);
        };

        const targets = [0, 1].map((offset) => ({
            offset,
            dateKey: buildDateKey(offset),
            dayNum: new Date(osloNow.getFullYear(), osloNow.getMonth(), osloNow.getDate() + offset).getDate().toString(),
        }));

        const scrapeSlots = async () => {
            // Wait for the availability grid to appear
            try {
                await page.waitForSelector('label.ant-radio-button-wrapper', { timeout: 10000 });
            } catch (e) {
                console.log('[Scraper] WARNING: Timeout waiting for slots, proceeding anyway...');
            }

            await new Promise((r) => setTimeout(r, 1500));

            return page.evaluate(() => {
                const slots: Record<string, { from: string; to: string; availableSpots: number }> = {};
                const timeRangeRegex = /(\d{1,2}[:.]\d{2})\s*[-–]\s*(\d{1,2}[:.]\d{2})/;

                const labelList = document.querySelectorAll('label.ant-radio-button-wrapper');
                const labelData: Array<{ time: string; toTime: string; spots: number; isAvailable: boolean }> = [];

                for (let i = 0; i < labelList.length; i++) {
                    const label = labelList[i] as HTMLElement;
                    const fullText = label.innerText?.trim() || '';
                    const timeMatch = fullText.match(timeRangeRegex);

                    if (!timeMatch) continue;

                    const availMatch = fullText.match(/(\d+)\s*(?:ledige?\s*plasser?|ledig\s*plass|ledige?|available)/i);
                    if (!availMatch) continue;

                    const style = window.getComputedStyle(label);
                    const isDisabled = label.hasAttribute('aria-disabled') && label.getAttribute('aria-disabled') === 'true';
                    const isGrayedOut = style.opacity === '0' || style.pointerEvents === 'none' || isDisabled;
                    const isAvailable = !isGrayedOut;

                    const fromTime = timeMatch[1].replace('.', ':');
                    const toTime = timeMatch[2].replace('.', ':');
                    const spots = parseInt(availMatch[1], 10);

                    labelData.push({ time: fromTime, toTime: toTime, spots: spots, isAvailable: isAvailable });
                }

                for (const entry of labelData) {
                    if (!slots[entry.time] && entry.isAvailable) {
                        slots[entry.time] = { from: entry.time, to: entry.toTime, availableSpots: entry.spots };
                    }
                }

                return Object.values(slots).sort((a, b) => a.from.localeCompare(b.from));
            });
        };

        const days: Record<string, ScrapedSlot[]> = {};

        for (const target of targets) {
            console.log(`[Scraper] Selecting day ${target.dateKey}...`);
            await page.evaluate((dayNumber) => {
                const elements = Array.from(document.querySelectorAll('div, span, button, td, a'));
                const dayEl = elements.find(el => {
                    const text = (el as HTMLElement).innerText?.trim();
                    return text === dayNumber && el.getBoundingClientRect().width < 80;
                });
                if (dayEl) (dayEl as HTMLElement).click();
            }, target.dayNum);

            await new Promise((r) => setTimeout(r, 2500));
            const slots = await scrapeSlots();
            days[target.dateKey] = slots;
            console.log(`[Scraper] ${target.dateKey}: ${slots.length} slots`);
        }

        await browser.close();
        return { days };

    } catch (error) {
        console.error('[Scraper] Error:', error);
        if (browser) await browser.close();
        return { days: {} };
    }
}
