import { NextResponse } from 'next/server';
import { fetchNearestWaterTemperature } from '@/lib/water-temperature-service';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const latParam = searchParams.get('lat');
    const lonParam = searchParams.get('lon');

    const latitude = latParam ? Number.parseFloat(latParam) : null;
    const longitude = lonParam ? Number.parseFloat(lonParam) : null;

    const isValidLatitude = typeof latitude === 'number' && Number.isFinite(latitude) && latitude >= -90 && latitude <= 90;
    const isValidLongitude = typeof longitude === 'number' && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;

    if (!isValidLatitude || !isValidLongitude) {
        return NextResponse.json({ message: 'Ugyldig latitude/longitude.' }, { status: 400 });
    }

    const data = await fetchNearestWaterTemperature(latitude, longitude);
    return NextResponse.json({ data });
}