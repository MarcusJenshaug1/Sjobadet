import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        await requireAdmin();
        const body = await request.json();
        const { saunaId, kind, filename, mimeType, fileSize } = body;

        // Validation
        if (!saunaId || !kind || !mimeType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!['PRIMARY', 'GALLERY'].includes(kind)) {
            return NextResponse.json({ error: 'Invalid kind' }, { status: 400 });
        }

        const asset = await prisma.mediaAsset.create({
            data: {
                saunaId,
                kind,
                mimeType,
                sizeBytes: fileSize || 0,
                storageKeyOriginal: 'pending',
                storageKeyLarge: 'pending',
                storageKeyThumb: 'pending',
                width: 0,
                height: 0,
                status: 'pending'
            }
        });

        // In a real S3 scenario, we'd return a pre-signed URL here.
        // For local, we point to our internal upload processor.
        const uploadUrl = `/api/media/upload/${asset.id}`;

        return NextResponse.json({
            assetId: asset.id,
            uploadUrl
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
