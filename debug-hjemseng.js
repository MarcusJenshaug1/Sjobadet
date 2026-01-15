const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const sauna = await prisma.sauna.findUnique({
        where: { slug: 'hjemseng-brygge' }
    });
    console.log(JSON.stringify(sauna, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
