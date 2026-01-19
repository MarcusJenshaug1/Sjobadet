import prisma from '../src/lib/prisma';

async function checkRawData() {
    console.log('=== Rå Database Data ===\n');

    const reports = await prisma.lighthouseReport.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
    });

    console.log('Antall rapporter:', reports.length);
    
    reports.forEach((report, i) => {
        console.log(`\n${i + 1}. ${report.url} (${report.device})`);
        console.log('   RAW VALUES:');
        console.log('   performance:', report.performance, typeof report.performance);
        console.log('   accessibility:', report.accessibility, typeof report.accessibility);
        console.log('   bestPractices:', report.bestPractices, typeof report.bestPractices);
        console.log('   seo:', report.seo, typeof report.seo);
        console.log('   pwa:', report.pwa, typeof report.pwa);
    });

    await prisma.$disconnect();
}

checkRawData().catch(console.error);
