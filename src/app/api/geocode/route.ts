import { NextResponse } from 'next/server';
import { geocodeAddress } from '@/lib/geocoding-service';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address')?.trim();

    if (!address) {
        return NextResponse.json({ message: 'Mangler adresse.' }, { status: 400 });
    }

    try {
        const result = await geocodeAddress(address);
        if (!result) {
            return NextResponse.json({ message: 'Fant ingen koordinater.' }, { status: 404 });
        }

        return NextResponse.json(result);
    } catch {
        return NextResponse.json({ message: 'Geokoding feilet.' }, { status: 502 });
    }
}