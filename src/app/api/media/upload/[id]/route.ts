import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { processImage } from '@/lib/media-service';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id } = await params;

        const asset = await prisma.mediaAsset.findUnique({
            where: { id },
            include: { sauna: { select: { slug: true } } }
        });
        if (!asset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }

        const contentType = request.headers.get('content-type');
        if (!contentType?.startsWith('image/')) {
            return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
        }

        const arrayBuffer = await request.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Process image (Original, Large, Thumb)
        const folderName = asset.sauna?.slug || 'misc';
        const processed = await processImage(buffer, id, folderName);

        // Update DB record
        const updatedAsset = await prisma.mediaAsset.update({
            where: { id },
            data: {
                storageKeyOriginal: processed.original,
                storageKeyLarge: processed.large,
                storageKeyThumb: processed.thumb,
                width: processed.width,
                height: processed.height,
                mimeType: processed.mimeType,
                sizeBytes: processed.sizeBytes,
                status: 'uploaded' // Still pending confirmation
            }
        });

        return NextResponse.json(updatedAsset);
    } catch (error: any) {
        console.error('Upload processing error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
