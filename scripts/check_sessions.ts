// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('=== Sjekker PrivacySession data ===\n');

    const allSessions = await prisma.privacySession.findMany({
        orderBy: { lastSeen: 'desc' },
        take: 10,
    });

    console.log(`Totalt ${allSessions.length} sessions (viser maks 10):\n`);
    
    allSessions.forEach((s, i) => {
        console.log(`${i + 1}. Session ${s.id.substring(0, 12)}...`);
        console.log(`   hasConsent: ${s.hasConsent}`);
        console.log(`   lastSeen: ${s.lastSeen.toISOString()}`);
        console.log(`   firstSeen: ${s.firstSeen.toISOString()}`);
        console.log(`   IP: ${s.ipAddress || 'null'}`);
        console.log(`   Browser: ${s.browser}`);
        console.log(`   Device: ${s.deviceType}`);
        console.log(`   Pageviews: ${s.pageviewCount}`);
        console.log('');
    });

    const last30Minutes = new Date(Date.now() - 30 * 60 * 1000);
    
    const activeCount = await prisma.privacySession.count({
        where: {
            hasConsent: true,
            lastSeen: {
                gte: last30Minutes,
            },
        },
    });

    console.log(`\n=== Aktive sessions (siste 30 min) ===`);
    console.log(`Tidsvindu: ${last30Minutes.toISOString()} til nå`);
    console.log(`Aktive: ${activeCount}`);

    const activeSessions = await prisma.privacySession.findMany({
        where: {
            hasConsent: true,
            lastSeen: {
                gte: last30Minutes,
            },
        },
        orderBy: { lastSeen: 'desc' },
    });

    console.log('\nAktive sessions:');
    activeSessions.forEach((s, i) => {
        console.log(`${i + 1}. ${s.id.substring(0, 12)}... - lastSeen: ${s.lastSeen.toISOString()}`);
    });

    await prisma.$disconnect();
}

main().catch((e) => {
    console.error('Error:', e);
    process.exit(1);
});
