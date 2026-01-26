/**
 * Sjøbadet Cache Warmer
 * This script "hits" the most important routes to ensure they are pre-generated
 * and cached in the Edge (CDN) and Server (ISR).
 */

const BASE_URL = process.env.SITE_URL || 'http://localhost:3000';

async function warmRoutes() {
    console.log(`🚀 Starting cache warming for ${BASE_URL}...`);

    const internalRoutes = [
        '/',
        '/medlemskap',
        '/info',
        '/info/apningstider',
        '/gavekort'
    ];

    try {
        // Fetch dynamic sauna slugs first
        const slugRes = await fetch(`${BASE_URL}/api/saunas/slugs`);
        if (slugRes.ok) {
            const { slugs } = await slugRes.json();
            slugs.forEach(slug => internalRoutes.push(`/home/${slug}`));
        }
    } catch (e) {
        console.error('⚠️ Could not fetch sauna slugs, warming static routes only.');
    }

    const uniqueRoutes = [...new Set(internalRoutes)];

    for (const route of uniqueRoutes) {
        const url = `${BASE_URL}${route}`;
        try {
            const start = Date.now();
            const res = await fetch(url, {
                headers: { 'User-Agent': 'SjobadetCacheWarmer/1.0' }
            });
            const duration = Date.now() - start;
            console.log(`✅ [${res.status}] ${url} (${duration}ms)`);
        } catch (err) {
            console.error(`❌ Failed to warm ${url}:`, err.message);
        }
    }

    console.log('✨ Cache warming complete.');
}

warmRoutes();
