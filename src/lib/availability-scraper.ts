import puppeteer, { Browser, ConsoleMessage, HTTPRequest } from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

export interface ScrapedSlot {
    from: string;
    to: string;
    availableSpots: number;
}

export interface AvailabilityResponse {
    days: Record<string, ScrapedSlot[]>;
    timestamp: string;
    diagnostics?: Record<string, {
        finalUrl: string;
        dom: {
            totalLabels: number;
            processedCount: number;
            slotsExtracted: number;
            sampleTexts: string[];
        };
        responses: Array<{ url: string; status: number; contentType: string }>;
    }>;
}

type FetchAvailabilityOptions = {
    browser?: Browser;
    daysToFetch?: number;
    timeZone?: string;
};

type CapturedResponse = {
    url: string;
    status: number;
    contentType: string;
    payload: unknown;
};

const TIME_ZONE_DEFAULT = 'Europe/Oslo';

const getDateKey = (offsetDays: number, timeZone: string) => {
    const now = new Date();
    const target = new Date(now);
    target.setDate(now.getDate() + offsetDays);
    const parts = new Intl.DateTimeFormat('sv-SE', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(target);

    const year = parts.find(p => p.type === 'year')?.value ?? '';
    const month = parts.find(p => p.type === 'month')?.value ?? '';
    const day = parts.find(p => p.type === 'day')?.value ?? '';
    return `${year}-${month}-${day}`;
};

const normalizeBaseUrl = (rawUrl: string) => {
    const urlObj = new URL(rawUrl);
    const datePathRegex = /\/\d{4}-\d{2}-\d{2}(?:\/[^/]*)?$/;
    if (datePathRegex.test(urlObj.pathname)) {
        urlObj.pathname = urlObj.pathname.replace(datePathRegex, '');
    }
    urlObj.pathname = urlObj.pathname.replace(/\/$/, '');
    return urlObj.toString();
};

const buildDateUrl = (baseUrl: string, date: string) => {
    const urlObj = new URL(baseUrl);
    urlObj.pathname = urlObj.pathname.replace(/\/$/, '');
    urlObj.pathname = `${urlObj.pathname}/${date}`;
    return urlObj.toString();
};

const normalizeTime = (value: string | null | undefined) => {
    if (!value) return null;
    const match = value.trim().match(/(\d{1,2})[:.](\d{2})/);
    if (!match) return null;
    const hh = match[1].padStart(2, '0');
    const mm = match[2];
    return `${hh}:${mm}`;
};

const extractSlotsFromJson = (payload: unknown): ScrapedSlot[] => {
    const slots: ScrapedSlot[] = [];
    const timeRegex = /\d{1,2}[:.]\d{2}/;

    const getNumber = (value: unknown) => {
        if (typeof value === 'number' && Number.isFinite(value)) return value;
        if (typeof value === 'string') {
            const parsed = parseInt(value, 10);
            if (Number.isFinite(parsed)) return parsed;
        }
        return null;
    };

    const toSlot = (item: any): ScrapedSlot | null => {
        if (!item || typeof item !== 'object') return null;
        const fromRaw = item.from ?? item.start ?? item.startTime ?? item.startsAt ?? item.fromTime;
        const toRaw = item.to ?? item.end ?? item.endTime ?? item.endsAt ?? item.toTime;
        const from = normalizeTime(typeof fromRaw === 'string' ? fromRaw : null);
        const to = normalizeTime(typeof toRaw === 'string' ? toRaw : null);

        const available =
            getNumber(item.availableSpots ?? item.available ?? item.free ?? item.spots ?? item.remaining ?? item.availableSlots ?? item.spotsRemaining) ??
            (getNumber(item.capacity) !== null && getNumber(item.booked) !== null
                ? Math.max(0, (getNumber(item.capacity) as number) - (getNumber(item.booked) as number))
                : null);

        if (!from || !to || available === null) return null;
        return { from, to, availableSpots: available };
    };

    const walk = (node: any) => {
        if (!node) return;
        if (Array.isArray(node)) {
            const candidate: ScrapedSlot[] = [];
            for (const entry of node) {
                const slot = toSlot(entry);
                if (slot) candidate.push(slot);
            }
            if (candidate.length > slots.length) {
                slots.splice(0, slots.length, ...candidate);
            }
            for (const entry of node) {
                walk(entry);
            }
            return;
        }
        if (typeof node === 'object') {
            const values = Object.values(node);
            for (const value of values) {
                if (typeof value === 'string' && timeRegex.test(value)) {
                    // keep traversing
                }
                walk(value);
            }
        }
    };

    walk(payload);
    return slots;
};

import fs from 'fs';

export async function createScraperBrowser(): Promise<Browser> {
    let executablePath: string | undefined;
    let useChromiumBundle = true;

    // 1. Try sparticuz/chromium-min (Standard for Vercel/Production)
    try {
        executablePath = await chromium.executablePath();
        if (executablePath) {
            console.log('[Scraper] Using @sparticuz/chromium-min executable:', executablePath);
        }
    } catch (err) {
        useChromiumBundle = false;
        console.log('[Scraper] @sparticuz/chromium-min failed, falling back to local discovery');
    }

    // 2. Local Discovery (Windows, Mac, Linux, WSL)
    if (!executablePath) {
        useChromiumBundle = false;

        const isWindows = process.platform === 'win32';
        const isMac = process.platform === 'darwin';
        const isLinux = process.platform === 'linux';

        const possiblePaths: string[] = [];

        if (isWindows) {
            possiblePaths.push(
                'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
                'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
            );
        } else if (isMac) {
            possiblePaths.push(
                '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
            );
        } else if (isLinux) {
            // Check for WSL (Windows Subsystem for Linux)
            const isWSL = fs.existsSync('/proc/version') && fs.readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft');
            if (isWSL) {
                console.log('[Scraper] WSL detected, searching Windows paths...');
                possiblePaths.push(
                    '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe',
                    '/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe',
                    '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
                );
            }

            // Standard Linux paths
            possiblePaths.push(
                '/usr/bin/google-chrome',
                '/usr/bin/chromium',
                '/usr/bin/chromium-browser',
                '/usr/bin/brave-browser'
            );
        }

        // Add env-specific path
        if (process.env.CHROME_PATH) {
            possiblePaths.unshift(process.env.CHROME_PATH);
        }

        // Find first existing path
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                executablePath = p;
                console.log(`[Scraper] Found browser at: ${p}`);
                break;
            }
        }
    }

    if (!executablePath) {
        const envInfo = `Platform: ${process.platform}, Arch: ${process.arch}, Node: ${process.version}`;
        console.error(`[Scraper] FATAL: Browser not found. ${envInfo}`);
        throw new Error(`Chromium executable not found. Checked ${process.platform} paths. Environment: ${envInfo}`);
    }

    const launchArgs = useChromiumBundle ? chromium.args : ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'];

    return puppeteer.launch({
        args: launchArgs,
        // @ts-expect-error chromium typings in sparticuz package omit defaultViewport
        defaultViewport: useChromiumBundle ? chromium.defaultViewport : { width: 1280, height: 800 },
        executablePath,
        headless: true,
        // @ts-expect-error puppeteer LaunchOptions typing omits ignoreHTTPSErrors here
        ignoreHTTPSErrors: true,
    });
}

export async function fetchAvailability(url: string, options: FetchAvailabilityOptions = {}): Promise<AvailabilityResponse> {
    const { browser: sharedBrowser, daysToFetch = 7, timeZone = TIME_ZONE_DEFAULT } = options;
    console.log(`[Scraper] Starting fetch for ${url}`);
    let browser: Browser | null = sharedBrowser ?? null;
    const shouldCloseBrowser = !sharedBrowser;

    try {
        if (!browser) {
            browser = await createScraperBrowser();
        }

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

        const baseUrl = normalizeBaseUrl(url);
        const days: Record<string, ScrapedSlot[]> = {};
        const diagnostics: AvailabilityResponse['diagnostics'] = {};
        let activeCapture: CapturedResponse[] = [];

        page.on('response', async (response) => {
            try {
                const request = response.request();
                const contentType = response.headers()['content-type'] || '';
                if (!contentType.includes('application/json') && !['xhr', 'fetch'].includes(request.resourceType())) {
                    return;
                }
                const payload = await response.json().catch(() => null);
                if (!payload) return;
                const entry = {
                    url: response.url(),
                    status: response.status(),
                    contentType,
                    payload,
                };
                activeCapture.push(entry);
            } catch {
                // ignore JSON parse errors
            }
        });

        const dayCount = Math.max(1, Math.min(daysToFetch, 14));

        for (let offset = 0; offset < dayCount; offset++) {
            const dayKey = getDateKey(offset, timeZone);
            const targetUrl = buildDateUrl(baseUrl, dayKey);
            activeCapture = [];

            console.log(`[Scraper] Navigating to ${targetUrl}`);
            await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
            await new Promise((r) => setTimeout(r, 2000));

            console.log('[Scraper] Waiting for booking slots to load...');
            try {
                await page.waitForSelector('label.ant-radio-button-wrapper', { timeout: 10000 });
                console.log('[Scraper] Booking slots loaded!');
            } catch (e) {
                console.log('[Scraper] WARNING: Timeout waiting for slots, proceeding anyway...');
            }

            await new Promise((r) => setTimeout(r, 1000));

            let extractedSlots: ScrapedSlot[] = [];

            if (activeCapture.length > 0) {
                for (const capture of activeCapture) {
                    const candidate = extractSlotsFromJson(capture.payload);
                    if (candidate.length > extractedSlots.length) {
                        extractedSlots = candidate;
                    }
                }
            }

            const domExtraction = await page.evaluate(() => {
                const slots: Record<string, { from: string; to: string; availableSpots: number }> = {};
                const timeRangeRegex = /(\d{1,2}[:.]\d{2})\s*[-–]\s*(\d{1,2}[:.]\d{2})/;

                const labelList = document.querySelectorAll('label.ant-radio-button-wrapper');
                const labelData: Array<{ time: string; toTime: string; spots: number; isAvailable: boolean; text: string }> = [];

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

                    labelData.push({ time: fromTime, toTime: toTime, spots: spots, isAvailable: isAvailable, text: fullText });
                }

                for (const entry of labelData) {
                    if (!slots[entry.time]) {
                        slots[entry.time] = { from: entry.time, to: entry.toTime, availableSpots: entry.spots };
                    }
                }

                const ordered = Object.values(slots).sort((a, b) => a.from.localeCompare(b.from));

                return {
                    slots: ordered,
                    debug: {
                        totalLabels: labelList.length,
                        processedCount: labelData.length,
                        slotsExtracted: ordered.length,
                        sampleTexts: labelData.slice(0, 8).map(s => s.text),
                    }
                };
            });

            if (domExtraction.slots.length > extractedSlots.length) {
                extractedSlots = domExtraction.slots;
            }

            if (extractedSlots.length === 0) {
                const pageUrl = page.url();
                const responseSummary = activeCapture.slice(0, 10).map((r) => ({
                    url: r.url,
                    status: r.status,
                    contentType: r.contentType,
                }));
                console.warn('[Scraper] No slots extracted', {
                    date: dayKey,
                    finalUrl: pageUrl,
                    dom: domExtraction.debug,
                    responses: responseSummary,
                });
                diagnostics[dayKey] = {
                    finalUrl: pageUrl,
                    dom: domExtraction.debug,
                    responses: responseSummary,
                };
            } else {
                console.log(`[Scraper] Extracted ${extractedSlots.length} slots for ${dayKey}`);
                days[dayKey] = extractedSlots;
            }
        }

        await page.close();
        if (shouldCloseBrowser && browser) await browser.close();
        return { days, timestamp: new Date().toISOString(), diagnostics };

    } catch (error) {
        console.error('[Scraper] Error:', error);
        if (shouldCloseBrowser && browser) await browser.close();
        return { days: {}, timestamp: new Date().toISOString(), diagnostics: {} };
    }
}
