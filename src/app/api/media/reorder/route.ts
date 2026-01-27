import { NextResponse } from 'next/server';
import { assertNotDemo } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';

export async function PATCH(request: Request) {
    try {
        await assertNotDemo();
        const body = await request.json();
        const { saunaId, assetOrders } = body; // assetOrders: { id: string, orderIndex: number }[]

        if (!saunaId || !assetOrders) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        await prisma.$transaction(
            assetOrders.map((item: any) =>
                prisma.mediaAsset.update({
                    where: { id: item.id },
                    data: { orderIndex: item.orderIndex }
                })
            )
        );

        // Sync back to Sauna gallery string
        const allGalleryAssets = await prisma.mediaAsset.findMany({
            where: { saunaId, kind: 'GALLERY', status: 'confirmed' },
            orderBy: { orderIndex: 'asc' }
        });

        const galleryUrls = allGalleryAssets.map(a => a.storageKeyLarge);

        await prisma.sauna.update({
            where: { id: saunaId },
            data: { gallery: JSON.stringify(galleryUrls) }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
