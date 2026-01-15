import { chromium } from 'playwright';

export interface BookingSlot {
    time: string; // HH:MM - HH:MM
    startTime: string; // HH:MM
    isAvailable: boolean;
    isNext?: boolean;
    isPassed?: boolean;
    capacityText?: string;
}

export interface AvailabilityData {
    dropin: BookingSlot[];
    privat: BookingSlot[];
    timestamp: string;
}

export async function fetchAvailability(url: string): Promise<BookingSlot[]> {
    // Strip trailing date like /2026-01-13 if present to ensure we get today's availability
    const cleanUrl = url.replace(/\/(\d{4}-\d{2}-\d{2})$/, '');

    console.log(`[Scraper] Starting fetch for: ${cleanUrl}`);

    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });
        const page = await context.newPage();

        await page.goto(cleanUrl, { waitUntil: 'load', timeout: 30000 });

        // Wait for the specific text that indicates slots have loaded or the empty state
        try {
            await page.waitForFunction(() =>
                document.body.innerText.includes('Ledige plasser') ||
                document.body.innerText.includes('Ingen ledige timer'),
                { timeout: 15000 }
            );
        } catch (e) {
            console.warn(`[Scraper] Timeout waiting for availability text. Proceeding to check DOM anyway.`);
        }

        const slotsData = await page.evaluate(() => {
            const wrappers = document.querySelectorAll('label.ant-radio-button-wrapper');
            return Array.from(wrappers).map(el => {
                const text = (el as HTMLElement).innerText || '';
                return { text };
            });
        });

        console.log(`[Scraper] Found ${slotsData.length} potential slot elements.`);

        const slots: BookingSlot[] = [];
        slotsData.forEach((data) => {
            const text = data.text.trim();
            const timeMatch = text.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);

            if (timeMatch) {
                const time = timeMatch[0];
                const startTime = timeMatch[1];

                // Availability check: Look for "X Ledige plasser" or "X Ledig plass"
                const availMatch = text.match(/(\d+)\s+Ledig[e]*\s+plass[er]*/i);
                const availableCount = availMatch ? parseInt(availMatch[1], 10) : 0;

                const isAvailable = availableCount > 0;
                const capacityText = availMatch ? availMatch[0] : '';

                slots.push({
                    time,
                    startTime,
                    isAvailable,
                    capacityText
                });
            }
        });

        if (slots.length === 0) {
            console.log(`[Scraper] No slots found for: ${cleanUrl}`);
        } else {
            const availCount = slots.filter(s => s.isAvailable).length;
            console.log(`[Scraper] Found ${slots.length} slots, ${availCount} available.`);
        }

        // Sort by start time
        slots.sort((a, b) => a.startTime.localeCompare(b.startTime));

        // Handle time-based filtering (Norway time)
        const now = new Date();
        const norwayTime = new Intl.DateTimeFormat('no-NO', {
            timeZone: 'Europe/Oslo',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(now);

        let nextFound = false;
        const processedSlots = slots.map(slot => {
            const isPassed = slot.startTime < norwayTime;
            let isNext = false;

            if (!isPassed && !nextFound && slot.isAvailable) {
                isNext = true;
                nextFound = true;
            }

            return {
                ...slot,
                isPassed,
                isNext
            };
        });

        return processedSlots;
    } catch (error) {
        console.error('[Scraper] ERROR scraping availability:', error);
        return [];
    } finally {
        if (browser) await browser.close();
    }
}
