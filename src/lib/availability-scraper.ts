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

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise((r) => setTimeout(r, 2000));

        // Detect if we are already on a specific date URL (e.g. ends in /2026-01-19)
        const hasDateInUrl = /\/\d{4}-\d{2}-\d{2}$/.test(url);

        if (!hasDateInUrl) {
            console.log('[Scraper] No date in URL, clicking "Today"...');
            await page.evaluate(() => {
                const todayNum = new Date().getDate().toString();
                const elements = Array.from(document.querySelectorAll('div, span, button, td, a'));
                const todayEl = elements.find(el => {
                    const text = (el as HTMLElement).innerText?.trim();
                    return text === todayNum && el.getBoundingClientRect().width < 80;
                });
                if (todayEl) (todayEl as HTMLElement).click();
            });
            await new Promise((r) => setTimeout(r, 3000));
        } else {
            console.log('[Scraper] Date already in URL, skipping day click.');
        }

        // Wait for the availability grid to appear
        console.log('[Scraper] Waiting for booking slots to load...');
        try {
            await page.waitForSelector('label.ant-radio-button-wrapper', { timeout: 10000 });
            console.log('[Scraper] Booking slots loaded!');
        } catch (e) {
            console.log('[Scraper] WARNING: Timeout waiting for slots, proceeding anyway...');
        }

        // Wait for a few more seconds for the grid to render
        await new Promise((r) => setTimeout(r, 2000));

        console.log('[Scraper] About to extract data from page...');
        const scrapedData = await page.evaluate(() => {
            const slots: Record<string, { from: string; to: string; availableSpots: number }> = {};
            const timeRangeRegex = /(\d{1,2}[:.]\d{2})\s*[-–]\s*(\d{1,2}[:.]\d{2})/;

            // Target specifically the ant-radio-button-wrapper labels
            const labelList = document.querySelectorAll('label.ant-radio-button-wrapper');

            // Collect all labels with their times and availability
            const labelData: Array<{ time: string; toTime: string; spots: number; isAvailable: boolean }> = [];

            for (let i = 0; i < labelList.length; i++) {
                const label = labelList[i] as HTMLElement;
                const fullText = label.innerText?.trim() || '';
                const timeMatch = fullText.match(timeRangeRegex);
                
                if (!timeMatch) continue;

                const availMatch = fullText.match(/(\d+)\s*(?:ledige?\s*plasser?|ledig\s*plass|ledige?|available)/i);
                if (!availMatch) continue;

                // Check if the slot is available (not grayed out/disabled)
                const style = window.getComputedStyle(label);
                const isDisabled = label.hasAttribute('aria-disabled') && label.getAttribute('aria-disabled') === 'true';
                const isGrayedOut = style.opacity === '0' || style.pointerEvents === 'none' || isDisabled;
                const isAvailable = !isGrayedOut;

                const fromTime = timeMatch[1].replace('.', ':');
                const toTime = timeMatch[2].replace('.', ':');
                const spots = parseInt(availMatch[1], 10);

                labelData.push({ time: fromTime, toTime: toTime, spots: spots, isAvailable: isAvailable });
            }

            // Keep only first occurrence of each time, and only if it's available
            for (const entry of labelData) {
                if (!slots[entry.time] && entry.isAvailable) {
                    slots[entry.time] = { from: entry.time, to: entry.toTime, availableSpots: entry.spots };
                }
            }

            // Convert to array and sort
            const ordered = Object.values(slots).sort((a, b) => a.from.localeCompare(b.from));

            return {
                slots: ordered,
                debug: {
                    totalLabels: labelList.length,
                    processedCount: labelData.length,
                    slotsExtracted: ordered.length,
                    sampleTexts: ordered.slice(0, 5).map(s => `${s.from}: ${s.availableSpots}`)
                }
            };
        });

        console.log('[Scraper] Scraped data:', JSON.stringify(scrapedData.debug, null, 2));

        const todayKey = new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'Europe/Oslo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(new Date());

        await browser.close();
        return { date: todayKey, slots: scrapedData.slots };

    } catch (error) {
        console.error('[Scraper] Error:', error);
        if (browser) await browser.close();
        return { date: null, slots: [] };
    }
}
