const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const saunas = await prisma.sauna.findMany({
        select: {
            id: true,
            slug: true,
            name: true,
            bookingAvailabilityUrlDropin: true,
            bookingAvailabilityUrlPrivat: true,
        }
    });
    console.log(JSON.stringify(saunas, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
