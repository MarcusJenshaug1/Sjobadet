import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        await requireAdmin();
        const body = await request.json();
        const { assetId, saunaId, kind, orderIndex } = body;

        if (!assetId || !saunaId || !kind) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const asset = await prisma.mediaAsset.findUnique({ where: { id: assetId } });
        if (!asset || asset.status !== 'uploaded') {
            return NextResponse.json({ error: 'Asset not ready or not found' }, { status: 400 });
        }

        // Begin transaction to ensure consistency
        const result = await prisma.$transaction(async (tx) => {
            // 1. Confirm the asset
            const confirmedAsset = await tx.mediaAsset.update({
                where: { id: assetId },
                data: {
                    status: 'confirmed',
                    orderIndex: orderIndex ?? 0
                }
            });

            // 2. If PRIMARY, update the Sauna.imageUrl and ensure ONLY ONCE primary
            if (kind === 'PRIMARY') {
                // Demote other primary assets for this sauna
                await tx.mediaAsset.updateMany({
                    where: { saunaId, kind: 'PRIMARY', id: { not: assetId } },
                    data: { kind: 'GALLERY' } // Or just delete? Requirement says "behold, promoter ikke automatisk". 
                    // I'll set them to GALLERY so they aren't lost, or just leave them as non-primary assets.
                });

                await tx.sauna.update({
                    where: { id: saunaId },
                    data: { imageUrl: confirmedAsset.storageKeyOriginal } // Use original for hero to ensure max quality
                });
            }

            // 3. For GALLERY, update the Sauna.gallery JSON string for backward compatibility
            const allGalleryAssets = await tx.mediaAsset.findMany({
                where: { saunaId, kind: 'GALLERY', status: 'confirmed' },
                orderBy: { orderIndex: 'asc' }
            });

            const galleryUrls = allGalleryAssets.map(a => a.storageKeyLarge);

            await tx.sauna.update({
                where: { id: saunaId },
                data: { gallery: JSON.stringify(galleryUrls) }
            });

            return confirmedAsset;
        });

        // Return the updated list of assets for the sauna as requested
        const assets = await prisma.mediaAsset.findMany({
            where: { saunaId, status: 'confirmed' },
            orderBy: [{ kind: 'desc' }, { orderIndex: 'asc' }]
        });

        return NextResponse.json({ asset: result, allAssets: assets });
    } catch (error: any) {
        console.error('Confirm error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
