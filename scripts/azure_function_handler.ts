import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { chromium } from 'playwright';

export async function GetAvailability(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const saunaId = request.query.get('saunaId');
    const url = "https://periode.no/badstuer/sjobadet"; // Or get from a mapping/DB

    if (!saunaId) {
        return { status: 400, body: "Please pass a saunaId on the query string" };
    }

    const browser = await chromium.launch({ headless: true });

    try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Logic for extracting slots (simplified for this example)
        const slots = await page.evaluate(() => {
            const results: any[] = [];
            // ... (Insert the slot extraction logic from azure_scraper.ts here)
            return results;
        });

        return {
            status: 200,
            jsonBody: {
                saunaId,
                slots,
                timestamp: new Date().toISOString()
            }
        };
    } catch (error: any) {
        return { status: 500, body: error.message };
    } finally {
        await browser.close();
    }
}

app.http('GetAvailability', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetAvailability
});
