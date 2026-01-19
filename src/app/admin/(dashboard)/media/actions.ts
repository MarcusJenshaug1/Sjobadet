'use server'

import { getSupabaseAdmin } from '@/lib/supabase'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'

const BUCKET_NAME = 'images'

export type MediaVariant = {
    name: string
    path: string
    url: string
    size?: number
    updated_at?: string
    metadata?: any
}

export type MediaItem = {
    id: string // baseKey or path if not grouped
    baseKey: string // path without variant suffix
    name: string
    path: string
    url: string
    size?: number
    updated_at?: string
    metadata?: any
    variants?: MediaVariant[]
    inUseBy?: { type: 'sauna' | 'user' | 'mediaAsset', id: string, name: string, context?: string }[]
}

export async function listMediaItems(groupVariants: boolean = true) {
    await requireAdmin()
    const supabase = getSupabaseAdmin()

    // Helper for recursive listing
    async function fetchAllFiles(path: string = ''): Promise<any[]> {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .list(path, {
                limit: 1000,
                sortBy: { column: 'name', order: 'asc' },
            })

        if (error) {
            console.error(`Error listing folder ${path}:`, error)
            return []
        }

        let files: any[] = []
        for (const item of data || []) {
            const itemPath = path ? `${path}/${item.name}` : item.name

            if (!item.id) {
                // It's a folder, recurse
                const subFiles = await fetchAllFiles(itemPath)
                files = [...files, ...subFiles]
            } else {
                // It's a file
                files.push({ ...item, name: itemPath })
            }
        }
        return files
    }

    const allFiles = await fetchAllFiles()

    // Filter out non-images
    const imageFiles = allFiles.filter(f =>
        f.name.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i) ||
        f.metadata?.mimetype?.startsWith('image/')
    )

    // Convert to MediaItem format
    const rawItems: MediaItem[] = imageFiles.map(file => {
        const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name)
        const baseKey = file.name.replace(/-(original|large|thumb)\.webp$/i, '')

        return {
            id: file.name,
            baseKey: baseKey,
            name: file.name.split('/').pop() || file.name,
            path: file.name,
            url: publicUrl,
            size: file.metadata?.size,
            updated_at: file.updated_at,
            metadata: file.metadata
        }
    })

    let processedItems: MediaItem[] = rawItems

    if (groupVariants) {
        // Group by baseKey
        const groups = new Map<string, MediaItem[]>()
        rawItems.forEach(item => {
            if (!groups.has(item.baseKey)) groups.set(item.baseKey, [])
            groups.get(item.baseKey)!.push(item)
        })

        processedItems = Array.from(groups.entries()).map(([baseKey, groupItems]) => {
            // Find the best "master"
            // original > large > thumb > first one
            const master = groupItems.find(i => i.path.includes('-original')) ||
                groupItems.find(i => i.path.includes('-large')) ||
                groupItems.find(i => i.path.includes('-thumb')) ||
                groupItems[0]

            const variants: MediaVariant[] = groupItems
                .filter(i => i.path !== master.path)
                .map(i => ({
                    name: i.name,
                    path: i.path,
                    url: i.url,
                    size: i.size,
                    updated_at: i.updated_at,
                    metadata: i.metadata
                }))

            return {
                ...master,
                id: baseKey, // Group ID is the baseKey
                variants: variants.length > 0 ? variants : undefined
            }
        })
    }

    // Enrich with usage info
    const enrichedItems = await enrichMediaWithUsage(processedItems)

    return enrichedItems
}

async function enrichMediaWithUsage(items: MediaItem[]): Promise<MediaItem[]> {
    // Fetch all entities that use images
    const users = await (prisma.adminUser.findMany as any)({
        where: { NOT: { avatarUrl: null } },
        select: { id: true, username: true, avatarUrl: true }
    })

    const saunas = await (prisma.sauna.findMany as any)({
        select: { id: true, name: true, imageUrl: true, gallery: true }
    })

    const assets = await (prisma.mediaAsset.findMany as any)({
        select: { id: true, storageKeyOriginal: true, storageKeyLarge: true, storageKeyThumb: true, sauna: { select: { id: true, name: true } } }
    })

    return items.map(item => {
        const inUseBy: MediaItem['inUseBy'] = []

        // All paths relevant for this item (self + variants)
        const paths = [item.path, ...(item.variants?.map(v => v.path) || [])]

        const checkUsage = (pathToMatch: string) => {
            // Check users
            users.forEach((u: any) => {
                if (u.avatarUrl?.includes(pathToMatch)) {
                    if (!inUseBy.some(usage => usage.id === u.id)) {
                        inUseBy.push({ type: 'user', id: u.id, name: u.username, context: 'Profilbilde' })
                    }
                }
            })

            // Check saunas
            saunas.forEach((s: any) => {
                if (s.imageUrl?.includes(pathToMatch)) {
                    if (!inUseBy.some(usage => usage.id === s.id && usage.context === 'Hovedbilde')) {
                        inUseBy.push({ type: 'sauna', id: s.id, name: s.name, context: 'Hovedbilde' })
                    }
                }
                if (s.gallery) {
                    try {
                        const galleryLinks = JSON.parse(s.gallery) as string[]
                        if (galleryLinks.some(link => link.includes(pathToMatch))) {
                            if (!inUseBy.some(usage => usage.id === s.id && usage.context === 'Galleri')) {
                                inUseBy.push({ type: 'sauna', id: s.id, name: s.name, context: 'Galleri' })
                            }
                        }
                    } catch (e) { }
                }
            })

            // Check MediaAssets
            assets.forEach((a: any) => {
                if (a.storageKeyOriginal === pathToMatch || a.storageKeyLarge === pathToMatch || a.storageKeyThumb === pathToMatch) {
                    const saunaName = a.sauna?.name || 'Tilhørende badstue'
                    if (!inUseBy.some(usage => usage.id === a.id)) {
                        inUseBy.push({ type: 'mediaAsset', id: a.id, name: `${saunaName} (Asset)`, context: 'MediaAsset' })
                    }
                }
            })
        }

        paths.forEach(checkUsage)

        return { ...item, inUseBy: inUseBy.length > 0 ? inUseBy : undefined }
    })
}

export async function deleteMediaFile(pathOrBaseKey: string, isGroup: boolean = false) {
    await requireAdmin()
    const supabase = getSupabaseAdmin()

    let pathsToDelete: string[] = []

    if (isGroup) {
        // If it's a group, we delete variants too
        // Since we don't have the list here, we have to assume the naming convention or fetch again.
        // Fetching again is safer.
        const allItems = await listMediaItems(false)
        pathsToDelete = allItems
            .filter(i => i.baseKey === pathOrBaseKey)
            .map(i => i.path)
    } else {
        pathsToDelete = [pathOrBaseKey]
    }

    if (pathsToDelete.length === 0) return

    const { error } = await supabase.storage.from(BUCKET_NAME).remove(pathsToDelete)

    if (error) {
        throw new Error(`Kunne ikke slette fil(er): ${error.message}`)
    }

    // Clean up any MediaAsset records
    await prisma.mediaAsset.deleteMany({
        where: {
            OR: [
                { storageKeyOriginal: { in: pathsToDelete } },
                { storageKeyLarge: { in: pathsToDelete } },
                { storageKeyThumb: { in: pathsToDelete } }
            ]
        }
    })

    revalidatePath('/admin/media')
}
