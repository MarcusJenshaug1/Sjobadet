import * as cheerio from 'cheerio';

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
    // Strip trailing date like /2026-01-13
    const cleanUrl = url.replace(/\/(\d{4}-\d{2}-\d{2})$/, '');

    console.log(`[Scraper] Starting fetch for: ${cleanUrl}`);

    try {
        // Standard Fetch (cheerio) - Safe for Vercel
        const response = await fetch(cleanUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            next: { revalidate: 60 } // Cache for 60s
        });

        if (!response.ok) {
            console.error(`[Scraper] Failed to fetch URL: ${response.status}`);
            return [];
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // NOTE: Periode.no is often an SPA (Single Page App).
        // Cheerio can only see the initial HTML. If data is loaded via JS/API,
        // this will likely return 0 slots unless we reverse-engineer the API.

        // Try to find slots using the previous logic, adapted for static HTML if present
        const slots: BookingSlot[] = [];

        // Try to find label wrappers if they exist in static HTML
        $('label.ant-radio-button-wrapper').each((_, el) => {
            const text = $(el).text().trim();
            const timeMatch = text.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);

            if (timeMatch) {
                const time = timeMatch[0];
                const startTime = timeMatch[1];
                const availMatch = text.match(/(\d+)\s+Ledig[e]*\s+plass[er]*/i);
                const availableCount = availMatch ? parseInt(availMatch[1], 10) : 0;

                slots.push({
                    time,
                    startTime,
                    isAvailable: availableCount > 0,
                    capacityText: availMatch ? availMatch[0] : ''
                });
            }
        });

        // ... Processing/Sorting logic same as before ...
        if (slots.length === 0) {
            console.log(`[Scraper] No slots found (likely SPA). Returning empty.`);
            // In future: Implement direct API call here if endpoint is found
            return [];
        }

        // Logic for next/passed (same as before)
        const now = new Date();
        const norwayTime = new Intl.DateTimeFormat('no-NO', {
            timeZone: 'Europe/Oslo',
            hour: '2-digit', minute: '2-digit', hour12: false
        }).format(now);

        let nextFound = false;
        return slots.map(slot => {
            const isPassed = slot.startTime < norwayTime;
            let isNext = false;
            if (!isPassed && !nextFound && slot.isAvailable) {
                isNext = true;
                nextFound = true;
            }
            return { ...slot, isPassed, isNext };
        });

    } catch (error) {
        console.error('[Scraper] Error:', error);
        return [];
    }
}
