const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
    console.log('Starting image migration...');
    const saunas = await prisma.sauna.findMany({
        include: { mediaAssets: true }
    });

    for (const sauna of saunas) {
        console.log(`Processing sauna: ${sauna.name} (${sauna.id})`);

        // 1. Primary Image
        if (sauna.imageUrl && !sauna.mediaAssets.find(a => a.kind === 'PRIMARY')) {
            console.log(`  Adding primary image: ${sauna.imageUrl}`);
            await prisma.mediaAsset.create({
                data: {
                    saunaId: sauna.id,
                    kind: 'PRIMARY',
                    storageKeyOriginal: sauna.imageUrl,
                    storageKeyLarge: sauna.imageUrl,
                    storageKeyThumb: sauna.imageUrl,
                    mimeType: 'image/unknown',
                    sizeBytes: 0,
                    width: 0,
                    height: 0,
                    status: 'confirmed'
                }
            });
        }

        // 2. Gallery
        if (sauna.gallery) {
            try {
                const gallery = JSON.parse(sauna.gallery);
                if (Array.isArray(gallery)) {
                    for (let i = 0; i < gallery.length; i++) {
                        const url = gallery[i];
                        if (!sauna.mediaAssets.find(a => a.storageKeyLarge === url)) {
                            console.log(`  Adding gallery image: ${url}`);
                            await prisma.mediaAsset.create({
                                data: {
                                    saunaId: sauna.id,
                                    kind: 'GALLERY',
                                    storageKeyOriginal: url,
                                    storageKeyLarge: url,
                                    storageKeyThumb: url,
                                    mimeType: 'image/unknown',
                                    sizeBytes: 0,
                                    width: 0,
                                    height: 0,
                                    orderIndex: i,
                                    status: 'confirmed'
                                }
                            });
                        }
                    }
                }
            } catch (e) {
                console.error(`  Error parsing gallery for sauna ${sauna.id}:`, e.message);
            }
        }
    }

    console.log('Migration complete!');
    process.exit(0);
}

migrate().catch(err => {
    console.error(err);
    process.exit(1);
});
