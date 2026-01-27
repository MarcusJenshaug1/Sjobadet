import { NextResponse } from 'next/server';
import { assertNotDemo } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { deleteMediaFiles } from '@/lib/media-service';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await assertNotDemo();
        const { id } = await params;

        const asset = await prisma.mediaAsset.findUnique({ where: { id } });
        if (!asset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }

        const { saunaId, kind } = asset;

        // Delete files
        await deleteMediaFiles([
            asset.storageKeyOriginal,
            asset.storageKeyLarge,
            asset.storageKeyThumb
        ]);

        // Delete Record
        await prisma.mediaAsset.delete({ where: { id } });

        // Update Sauna record for compatibility
        if (saunaId) {
            if (kind === 'PRIMARY') {
                await prisma.sauna.update({
                    where: { id: saunaId },
                    data: { imageUrl: null }
                });
            } else {
                const remainingGallery = await prisma.mediaAsset.findMany({
                    where: { saunaId, kind: 'GALLERY', status: 'confirmed' },
                    orderBy: { orderIndex: 'asc' }
                });
                const urls = remainingGallery.map(a => a.storageKeyLarge);
                await prisma.sauna.update({
                    where: { id: saunaId },
                    data: { gallery: JSON.stringify(urls) }
                });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
