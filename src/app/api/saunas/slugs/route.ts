import { NextResponse } from 'next/server';
import { getActiveSaunas } from '@/lib/sauna-service';

export async function GET() {
    try {
        const saunas = await getActiveSaunas();
        const slugs = saunas.map(s => s.slug);

        return NextResponse.json({ slugs }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
            }
        });
    } catch (error) {
        return NextResponse.json({ slugs: [] }, { status: 500 });
    }
}
