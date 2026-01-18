import { chromium } from 'playwright';

interface ScrapedSlot {
    from: string;
    to: string;
    availableSpots: number;
}

interface SaunaScrapeResult {
    saunaId: string;
    url: string;
    date: string | null;
    slots: ScrapedSlot[];
    timestamp: string;
    error?: string;
}

export async function scrapeSauna(saunaId: string, url: string): Promise<SaunaScrapeResult> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    try {
        console.log(`[Scraper] Scraping ${saunaId} at ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Wait for potential loading
        await page.waitForTimeout(2000);

        // Click Today (same logic as internal scraper but using Playwright)
        const todayNum = new Date().getDate().toString();
        const todayEl = await page.locator(`div:text-is("${todayNum}"), span:text-is("${todayNum}"), button:text-is("${todayNum}")`).first();
        if (await todayEl.isVisible()) {
            await todayEl.click();
            await page.waitForTimeout(2000);
        }

        const slots = await page.evaluate(() => {
            const results: any[] = [];
            const timeRegex = /(\d{1,2}[:.]\d{2})/;
            const elements = Array.from(document.querySelectorAll('*')).filter(el => {
                const txt = (el as HTMLElement).innerText;
                return txt && timeRegex.test(txt) && txt.length < 50;
            });

            elements.forEach(el => {
                const text = (el as HTMLElement).innerText;
                const match = text.match(timeRegex);
                if (match) {
                    const fromTime = match[1].replace('.', ':');
                    const [hours, minutes] = fromTime.split(':').map(Number);
                    const toDate = new Date();
                    toDate.setHours(hours + 1, minutes);

                    const toTime = `${String(toDate.getHours()).padStart(2, '0')}:${String(toDate.getMinutes()).padStart(2, '0')}`;

                    let current: HTMLElement | null = el as HTMLElement;
                    let availableSpots = 0;
                    let depth = 0;

                    while (current && current !== document.body && depth < 5) {
                        const txt = current.innerText || '';
                        const capMatch = txt.match(/(\d+)\s*(?:ledig|plass|stk|available)/i);
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

        return {
            saunaId,
            url,
            date: new Date().toISOString().split('T')[0],
            slots: slots.sort((a, b) => a.from.localeCompare(b.from)),
            timestamp: new Date().toISOString()
        };

    } catch (err: any) {
        console.error(`[Scraper] Error scraping ${saunaId}:`, err.message);
        return {
            saunaId,
            url,
            date: null,
            slots: [],
            timestamp: new Date().toISOString(),
            error: err.message
        };
    } finally {
        await browser.close();
    }
}

// Example usage / entry point for Azure Function (HTTP trigger)
// In a real Azure Function, this would be exported as the main handler
export async function runScraper(saunas: { id: string, url: string }[]) {
    const results = [];
    for (const sauna of saunas) {
        results.push(await scrapeSauna(sauna.id, sauna.url));
    }
    return results;
}
