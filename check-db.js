
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking database content...');
    try {
        const saunas = await prisma.sauna.findMany();
        console.log('Found saunas:', saunas.length);
        saunas.forEach(s => console.log(`- ID: ${s.id}, Name: ${s.name}, Slug: ${s.slug}`));

        if (saunas.length === 0) {
            console.log('WARNING: No saunas found in database!');
        }
    } catch (e) {
        console.error('Error fetching saunas:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
