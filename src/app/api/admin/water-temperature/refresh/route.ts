import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guard';
import { refreshWaterTemperatureForSaunaId } from '@/lib/water-temperature-service';

export async function POST(request: Request) {
    await requireAdmin();

    const body = await request.json().catch(() => null) as { saunaId?: string } | null;
    const saunaId = body?.saunaId?.trim();

    if (!saunaId) {
        return NextResponse.json({ message: 'Mangler saunaId.' }, { status: 400 });
    }

    const data = await refreshWaterTemperatureForSaunaId(saunaId);
    if (!data) {
        return NextResponse.json({ ok: false, reason: 'no-data' });
    }

    return NextResponse.json({ ok: true, data });
}