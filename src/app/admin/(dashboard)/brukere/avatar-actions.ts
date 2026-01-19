'use server'

import { requireAdmin } from '@/lib/auth-guard'
import { getSupabaseAdmin } from '@/lib/supabase'
import { nanoid } from 'nanoid'
import sharp from 'sharp'

const BUCKET_NAME = 'images'

export async function uploadAvatar(formData: FormData) {
    await requireAdmin()

    const file = formData.get('file') as File
    if (!file) {
        throw new Error('Ingen fil lastet opp')
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const id = nanoid()
    const path = `profiles/${id}.webp`

    // Process image: resize to 400x400 and convert to webp
    const processedBuffer = await sharp(buffer)
        .resize(400, 400, { fit: 'cover' })
        .webp({ quality: 80 })
        .toBuffer()

    const { error: uploadError } = await getSupabaseAdmin().storage
        .from(BUCKET_NAME)
        .upload(path, processedBuffer, {
            contentType: 'image/webp',
            upsert: true,
            cacheControl: '3600'
        })

    if (uploadError) {
        throw new Error(`Feilet å laste opp til Supabase: ${uploadError.message}`)
    }

    const { data } = getSupabaseAdmin().storage
        .from(BUCKET_NAME)
        .getPublicUrl(path)

    return { url: data.publicUrl }
}

export async function deleteAvatarFromStorage(url: string) {
    await requireAdmin()

    try {
        const urlObj = new URL(url)
        const pathParts = urlObj.pathname.split(`/${BUCKET_NAME}/`)
        const path = pathParts[1]

        if (path) {
            await getSupabaseAdmin().storage
                .from(BUCKET_NAME)
                .remove([path])
        }
    } catch (e) {
        console.error('Failed to delete avatar from storage:', e)
    }
}
