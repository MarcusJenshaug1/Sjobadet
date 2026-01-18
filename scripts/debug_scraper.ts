import { chromium } from 'playwright';

async function debugScraper() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    const url = 'https://minside.periode.no/booking/aZNzpP9Mk1XohfwTswm1/5TIMrEsAib93g4fNtiO0';
    console.log(`Navigating to ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/Users/Eiendomsavtaler/.gemini/antigravity/brain/81484208-6ef4-49c2-b5b3-0698bbd32019/scraper_debug.png', fullPage: true });

    // Get all text content
    const allText = await page.evaluate(() => {
        return document.body.innerText;
    });

    console.log('Page text sample:', allText.substring(0, 500));

    // Try to find time elements
    const timeRegex = /(\d{1,2}[:.]?\d{2})\s*[-–]\s*(\d{1,2}[:.]?\d{2})/;
    const slots = await page.evaluate(() => {
        const results: any[] = [];
        const timeRegex = /(\d{1,2}[:.]?\d{2})\s*[-–]\s*(\d{1,2}[:.]?\d{2})/;
        const elements = Array.from(document.querySelectorAll('*')).filter(el => {
            const txt = (el as HTMLElement).innerText;
            return txt && timeRegex.test(txt) && txt.length < 100;
        });

        console.log(`Found ${elements.length} elements with times`);

        elements.slice(0, 5).forEach((el, i) => {
            console.log(`Element ${i}:`, (el as HTMLElement).innerText);
        });

        return { count: elements.length };
    });

    console.log('Result:', slots);

    await page.waitForTimeout(5000);
    await browser.close();
}

debugScraper();
