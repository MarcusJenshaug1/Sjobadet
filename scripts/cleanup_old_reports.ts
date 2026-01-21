// @ts-nocheck
import prisma from '../src/lib/prisma';

async function deleteOldReports() {
    console.log('Sletter gamle rapporter...\n');

    // Delete all reports with old URL
    const deleted = await prisma.lighthouseReport.deleteMany({
        where: {
            url: {
                contains: 'sjobadet.no'
            }
        }
    });

    console.log(`✓ Slettet ${deleted.count} gamle rapporter med sjobadet.no`);

    // Delete old scans
    const deletedScans = await prisma.lighthouseScan.deleteMany({
        where: {
            startedAt: {
                lt: new Date('2026-01-19T11:00:00')
            }
        }
    });

    console.log(`✓ Slettet ${deletedScans.count} gamle scans`);

    await prisma.$disconnect();
}

deleteOldReports().catch(console.error);
