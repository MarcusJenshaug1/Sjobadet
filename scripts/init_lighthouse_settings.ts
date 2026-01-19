import prisma from '../src/lib/prisma';

async function testSettings() {
    console.log('Testing Lighthouse settings...\n');

    // Set base URL
    await prisma.siteSetting.upsert({
        where: { key: 'lighthouse_base_url' },
        create: {
            key: 'lighthouse_base_url',
            value: 'https://sjobadet.marcusjenshaug.no',
            description: 'Base URL for Lighthouse scanning',
        },
        update: {
            value: 'https://sjobadet.marcusjenshaug.no',
        },
    });

    console.log('✓ Lighthouse base URL satt til: https://sjobadet.marcusjenshaug.no');

    // Fetch it back
    const setting = await prisma.siteSetting.findUnique({
        where: { key: 'lighthouse_base_url' },
    });

    console.log('✓ Hentet fra database:', setting?.value);

    await prisma.$disconnect();
}

testSettings().catch(console.error);
