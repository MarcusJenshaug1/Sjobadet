import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { nanoid } from 'nanoid';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/saunas');

export interface ProcessedMedia {
    original: string;
    large: string;
    thumb: string;
    width: number;
    height: number;
    sizeBytes: number;
    mimeType: string;
}

/**
 * Ensures the upload directory exists.
 */
async function ensureUploadDir() {
    try {
        await fs.access(UPLOAD_DIR);
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
}

/**
 * Processes an uploaded image into multiple variants.
 * @param buffer The image buffer.
 * @param originalName Original filename to derive extension.
 * @returns Metadata about the processed variants.
 */
export async function processImage(buffer: Buffer, originalName: string): Promise<ProcessedMedia> {
    await ensureUploadDir();

    const id = nanoid();
    const ext = '.webp'; // We convert everything to webp for optimization

    const originalKey = `${id}-original${ext}`;
    const largeKey = `${id}-large${ext}`;
    const thumbKey = `${id}-thumb${ext}`;

    const image = sharp(buffer);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
        throw new Error('Invalid image metadata');
    }

    // Original (converted to WebP)
    await image
        .webp({ quality: 90 })
        .toFile(path.join(UPLOAD_DIR, originalKey));

    // Large (max 2000px)
    await image
        .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(UPLOAD_DIR, largeKey));

    // Thumb (400px)
    await image
        .resize(400, 400, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(path.join(UPLOAD_DIR, thumbKey));

    return {
        original: `/uploads/saunas/${originalKey}`,
        large: `/uploads/saunas/${largeKey}`,
        thumb: `/uploads/saunas/${thumbKey}`,
        width: metadata.width,
        height: metadata.height,
        sizeBytes: buffer.length,
        mimeType: 'image/webp'
    };
}

/**
 * Deletes media files from disk.
 */
export async function deleteMediaFiles(keys: string[]) {
    for (const key of keys) {
        if (!key) continue;

        // Convert public URL back to absolute path
        const filePath = path.join(process.cwd(), 'public', key);
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.error(`Failed to delete file: ${filePath}`, error);
        }
    }
}
