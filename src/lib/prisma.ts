import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    const url = process.env.DATABASE_URL;
    console.log('[Prisma] Initializing client. DATABASE_URL is', url ? 'PRESENT' : 'MISSING');

    if (!url) {
        console.error('[Prisma] CRITICAL: DATABASE_URL is missing from process.env!');
    }

    return new PrismaClient({
        datasources: {
            db: {
                url: url
            }
        },
        log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
    })
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

// Graceful shutdown
if (process.env.NODE_ENV === 'production') {
    process.on('beforeExit', async () => {
        await prisma.$disconnect()
    })
}
