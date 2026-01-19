import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function analyzeReports() {
  try {
    // Get all reports
    const reports = await prisma.lighthouseReport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    console.log(`Found ${reports.length} reports\n`);

    // Analyze each report
    const issues: any[] = [];
    
    reports.forEach((report) => {
      const url = report.url;
      const device = report.device;
      const perf = report.performance;
      const access = report.accessibility;
      const bp = report.bestPractices;
      const seo = report.seo;

      console.log(`\n${url} (${device})`);
      console.log(`  Performance: ${perf}`);
      console.log(`  Accessibility: ${access}`);
      console.log(`  Best Practices: ${bp}`);
      console.log(`  SEO: ${seo}`);

      // Parse fullReport to find issues
      let fullReport;
      try {
        fullReport = typeof report.fullReport === 'string' 
          ? JSON.parse(report.fullReport) 
          : report.fullReport;
      } catch (e) {
        console.log(`  ❌ Failed to parse fullReport`);
        return;
      }

      if (!fullReport || !fullReport.audits) {
        console.log(`  ❌ No audits found in fullReport`);
        return;
      }

      // Find failing audits
      const failingAudits = Object.entries(fullReport.audits).filter(([_, audit]: any) => {
        return audit.score && audit.score < 0.9;
      });

      if (failingAudits.length > 0) {
        console.log(`  ⚠️  ${failingAudits.length} failing audits:`);
        failingAudits.slice(0, 5).forEach(([id, audit]: any) => {
          console.log(`    - ${audit.title} (${(audit.score * 100).toFixed(0)}%)`);
          issues.push({
            url,
            device,
            audit: audit.title,
            score: audit.score,
          });
        });
      }
    });

    console.log('\n\n=== SUMMARY OF TOP ISSUES ===');
    const issueCounts: Record<string, number> = {};
    issues.forEach((issue) => {
      const key = issue.audit;
      issueCounts[key] = (issueCounts[key] || 0) + 1;
    });

    Object.entries(issueCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .forEach(([audit, count]) => {
        console.log(`${audit}: ${count} occurrences`);
      });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeReports();
