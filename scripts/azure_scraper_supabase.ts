import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface ScrapedSlot {
    from: string;
    to: string;
    availableSpots: number;
}

async function scrapeAndSave(saunaId: string, url: string) {
    const browser = await chromium.launch({ headless: true });
    try {
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });
        const page = await context.newPage();
        console.log(`[Azure Scraper] Starting scrape for ${saunaId}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Click Today
        const todayNum = new Date().getDate().toString();
        const todayEl = await page.locator(`div:text-is("${todayNum}"), span:text-is("${todayNum}"), button:text-is("${todayNum}"), td:text-is("${todayNum}")`).first();
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
                    const [h, m] = fromTime.split(':').map(Number);
                    const toDate = new Date();
                    toDate.setHours(h + 1, m);
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

        const resultJson = JSON.stringify({
            date: new Date().toISOString().split('T')[0],
            slots: slots.sort((a, b) => a.from.localeCompare(b.from)),
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
        console.log(`[Azure Scraper] Updated ${saunaId} successfully`);

    } catch (err) {
        console.error(`[Azure Scraper] Failed to update ${saunaId}:`, err);
    } finally {
        await browser.close();
    }
}
