import { NextResponse } from 'next/server';
import { getActiveSaunas } from '@/lib/sauna-service';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get('secret');
    const authHeader = request.headers.get('authorization');
    const secret = process.env.CRON_SECRET;

    // Security check: Match either Bearer token (classic) or query param (convenience)
    const isAuthorized = secret && (
        querySecret === secret ||
        authHeader === `Bearer ${secret}`
    );

    if (secret && !isAuthorized) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = request.headers.get('host');
    const baseUrl = `${protocol}://${host}`;

    const routesToWarm = [
        '/',
        '/medlemskap',
        '/info',
        '/info/apningstider',
        '/gavekort'
    ];

    try {
        // Fetch dynamic sauna slugs
        const saunas = await getActiveSaunas();
        saunas.forEach(s => routesToWarm.push(`/home/${s.slug}`));

        const uniqueRoutes = [...new Set(routesToWarm)];

        // Trigger all fetches in parallel (fire and forget on the server side)
        // Note: Using Promise.allSettled to ensure failure of one doesn't stop others
        const results = await Promise.allSettled(
            uniqueRoutes.map(route =>
                fetch(`${baseUrl}${route}`, {
                    headers: { 'User-Agent': 'SjobadetCacheWarmer/1.0' },
                    cache: 'no-cache' // Ensure we don't hit a local cache but reach the edge/ISR
                })
            )
        );

        const successCount = results.filter(r => r.status === 'fulfilled').length;

        return NextResponse.json({
            message: 'Cache warming triggered',
            routes: uniqueRoutes.length,
            successful: successCount
        });
    } catch (error) {
        console.error('Cache warming failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
