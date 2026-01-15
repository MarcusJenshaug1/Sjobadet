import sharp from 'sharp';
import { nanoid } from 'nanoid';
import { supabaseAdmin } from './supabase';

const BUCKET_NAME = 'images';

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
 * Uploads a file buffer to Supabase Storage.
 */
async function uploadToSupabase(buffer: Buffer, path: string, mimeType: string) {
    const { error } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(path, buffer, {
            contentType: mimeType,
            upsert: true,
            cacheControl: '3600'
        });

    if (error) {
        throw new Error(`Supabase upload failed: ${error.message}`);
    }

    const { data } = supabaseAdmin.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);

    return data.publicUrl;
}

/**
 * Processes an uploaded image into multiple variants and uploads to Supabase.
 */
export async function processImage(buffer: Buffer, originalName: string): Promise<ProcessedMedia> {
    const id = nanoid();
    const ext = '.webp'; // We convert everything to webp

    const image = sharp(buffer);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
        throw new Error('Invalid image metadata');
    }

    // 1. Prepare buffers
    const originalBuffer = await image
        .webp({ quality: 90 })
        .toBuffer();

    const largeBuffer = await image
        .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

    const thumbBuffer = await image
        .resize(400, 400, { fit: 'cover' })
        .webp({ quality: 80 })
        .toBuffer();

    // 2. Upload to Supabase (Parallel)
    const [originalUrl, largeUrl, thumbUrl] = await Promise.all([
        uploadToSupabase(originalBuffer, `saunas/${id}-original${ext}`, 'image/webp'),
        uploadToSupabase(largeBuffer, `saunas/${id}-large${ext}`, 'image/webp'),
        uploadToSupabase(thumbBuffer, `saunas/${id}-thumb${ext}`, 'image/webp')
    ]);

    return {
        original: originalUrl,
        large: largeUrl,
        thumb: thumbUrl,
        width: metadata.width,
        height: metadata.height,
        sizeBytes: buffer.length,
        mimeType: 'image/webp'
    };
}

/**
 * Deletes media files from Supabase Storage.
 * Expects full URLs.
 */
export async function deleteMediaFiles(urls: string[]) {
    // Extract paths from URLs
    // URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
    // We need just [path]
    const paths = urls.map(url => {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split(`/${BUCKET_NAME}/`);
            return pathParts[1] || ''; // Returns e.g. "saunas/id-original.webp"
        } catch {
            return '';
        }
    }).filter(Boolean);

    if (paths.length === 0) return;

    const { error } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove(paths);

    if (error) {
        console.error('Failed to delete files from Supabase:', error);
    }
}
