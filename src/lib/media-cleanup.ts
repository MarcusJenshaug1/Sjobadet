import prisma from './prisma';
import { deleteMediaFiles } from './media-service';

/**
 * Removes MediaAsset records and files that have been 'pending' for more than 24 hours.
 * This can be called from a cron job or a manual admin trigger.
 */
export async function cleanupOrphanedUploads() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const orphans = await prisma.mediaAsset.findMany({
        where: {
            status: 'pending',
            createdAt: { lt: twentyFourHoursAgo }
        }
    });

    console.log(`Found ${orphans.length} orphaned uploads to clean up.`);

    for (const asset of orphans) {
        // Delete files if they were partially processed
        if (asset.storageKeyOriginal !== 'pending') {
            await deleteMediaFiles([
                asset.storageKeyOriginal,
                asset.storageKeyLarge,
                asset.storageKeyThumb
            ]);
        }

        // Delete record
        await prisma.mediaAsset.delete({ where: { id: asset.id } });
    }

    return orphans.length;
}
