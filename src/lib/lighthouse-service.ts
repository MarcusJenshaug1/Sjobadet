import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import prisma from './prisma';

interface LighthouseResult {
  url: string;
  device: 'mobile' | 'desktop';
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa?: number;
  fcp?: number;
  lcp?: number;
  tbt?: number;
  cls?: number;
  si?: number;
  fullReport: unknown;
}

const MOBILE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile' as const,
    locale: 'nb-NO',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      requestLatencyMs: 562.5,
      downloadThroughputKbps: 1474.5,
      uploadThroughputKbps: 675,
      cpuSlowdownMultiplier: 4,
    },
  },
};

const DESKTOP_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop' as const,
    locale: 'nb-NO',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
    },
  },
};

export async function runLighthouse(url: string, device: 'mobile' | 'desktop'): Promise<LighthouseResult | null> {
  let chrome;

  try {
    // Launch Chrome
    chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
    });

    const config = device === 'mobile' ? MOBILE_CONFIG : DESKTOP_CONFIG;

    // Run Lighthouse
    const runnerResult = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
    }, config as unknown as Record<string, unknown>);

    if (!runnerResult) {
      console.error('Lighthouse returned no results');
      return null;
    }

    const { lhr } = runnerResult;

    // Extract scores (0-1 scale to 0-100)
    const performance = (lhr.categories.performance?.score ?? 0) * 100;
    const accessibility = (lhr.categories.accessibility?.score ?? 0) * 100;
    const bestPractices = (lhr.categories['best-practices']?.score ?? 0) * 100;
    const seo = (lhr.categories.seo?.score ?? 0) * 100;
    const pwa = lhr.categories.pwa ? (lhr.categories.pwa.score ?? 0) * 100 : undefined;

    // Extract metrics (convert to seconds/milliseconds as appropriate)
    const fcp = lhr.audits['first-contentful-paint']?.numericValue;
    const lcp = lhr.audits['largest-contentful-paint']?.numericValue;
    const tbt = lhr.audits['total-blocking-time']?.numericValue;
    const cls = lhr.audits['cumulative-layout-shift']?.numericValue;
    const si = lhr.audits['speed-index']?.numericValue;

    return {
      url,
      device,
      performance: Math.round(performance),
      accessibility: Math.round(accessibility),
      bestPractices: Math.round(bestPractices),
      seo: Math.round(seo),
      pwa: pwa ? Math.round(pwa) : undefined,
      fcp,
      lcp,
      tbt,
      cls,
      si,
      fullReport: lhr,
    };
  } catch (error) {
    console.error(`Lighthouse error for ${url} (${device}):`, error);
    return null;
  } finally {
    if (chrome) {
      try {
        await chrome.kill();
      } catch (killError) {
        // Ignore cleanup errors on Windows
        console.warn('Chrome cleanup warning (non-critical):', (killError as Error).message);
      }
    }
  }
}

export async function getAllUrls(): Promise<string[]> {
  // Get base URL from site settings or environment
  let baseUrl = 'https://sjobadet.marcusjenshaug.no';

  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'lighthouse_base_url' },
    });
    if (setting?.value) {
      baseUrl = setting.value;
    }
  } catch {
    console.warn('Failed to fetch lighthouse base URL from settings, using default');
  }

  const urls: string[] = [
    '/', // Forside
    '/info',
    '/info/apningstider',
    '/info/faq',
    '/info/om-oss',
    '/info/personvern',
    '/info/regler',
    '/info/vilkar',
    '/medlemskap',
    '/bedrift',
    '/gavekort',
  ];

  // Fetch all active saunas
  try {
    const saunas = await prisma.sauna.findMany({
      where: { status: 'active' },
      select: { slug: true },
    });

    saunas.forEach((sauna) => {
      urls.push(`/home/${sauna.slug}`);
    });
  } catch (error) {
    console.error('Failed to fetch saunas for Lighthouse scan:', error);
  }

  return urls.map(path => `${baseUrl}${path}`);
}

export async function runFullScan(): Promise<string> {
  const scanId = await prisma.lighthouseScan.create({
    data: {
      status: 'running',
      totalUrls: 0,
      completedUrls: 0,
      failedUrls: 0,
    },
  });

  // Run scan in background
  (async () => {
    try {
      const urls = await getAllUrls();

      await prisma.lighthouseScan.update({
        where: { id: scanId.id },
        data: { totalUrls: urls.length * 2 }, // x2 for mobile + desktop
      });

      let completed = 0;
      let failed = 0;

      for (const url of urls) {
        console.log(`\n🔍 Scanning: ${url}`);

        // Mobile scan
        try {
          const mobileResult = await runLighthouse(url, 'mobile');
          if (mobileResult) {
            await prisma.lighthouseReport.create({
              data: {
                url,
                device: 'mobile',
                performance: mobileResult.performance,
                accessibility: mobileResult.accessibility,
                bestPractices: mobileResult.bestPractices,
                seo: mobileResult.seo,
                pwa: mobileResult.pwa,
                firstContentfulPaint: mobileResult.fcp,
                largestContentfulPaint: mobileResult.lcp,
                totalBlockingTime: mobileResult.tbt,
                cumulativeLayoutShift: mobileResult.cls,
                speedIndex: mobileResult.si,
                fullReport: JSON.stringify(mobileResult.fullReport),
              },
            });
            completed++;
            console.log(`✅ Mobile scan completed for ${url}`);
          } else {
            failed++;
            console.log(`❌ Mobile scan failed for ${url}`);
          }
        } catch (error) {
          failed++;
          console.error(`❌ Mobile scan error for ${url}:`, error);
        }

        // Update progress
        await prisma.lighthouseScan.update({
          where: { id: scanId.id },
          data: { completedUrls: completed, failedUrls: failed },
        });

        // Desktop scan
        try {
          const desktopResult = await runLighthouse(url, 'desktop');
          if (desktopResult) {
            await prisma.lighthouseReport.create({
              data: {
                url,
                device: 'desktop',
                performance: desktopResult.performance,
                accessibility: desktopResult.accessibility,
                bestPractices: desktopResult.bestPractices,
                seo: desktopResult.seo,
                pwa: desktopResult.pwa,
                firstContentfulPaint: desktopResult.fcp,
                largestContentfulPaint: desktopResult.lcp,
                totalBlockingTime: desktopResult.tbt,
                cumulativeLayoutShift: desktopResult.cls,
                speedIndex: desktopResult.si,
                fullReport: JSON.stringify(desktopResult.fullReport),
              },
            });
            completed++;
            console.log(`✅ Desktop scan completed for ${url}`);
          } else {
            failed++;
            console.log(`❌ Desktop scan failed for ${url}`);
          }
        } catch (error) {
          failed++;
          console.error(`❌ Desktop scan error for ${url}:`, error);
        }

        // Update progress
        await prisma.lighthouseScan.update({
          where: { id: scanId.id },
          data: { completedUrls: completed, failedUrls: failed },
        });
      }

      // Mark as completed
      await prisma.lighthouseScan.update({
        where: { id: scanId.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Full scan error:', error);
      await prisma.lighthouseScan.update({
        where: { id: scanId.id },
        data: {
          status: 'failed',
          completedAt: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  })();

  return scanId.id;
}

export async function getLatestReports() {
  const reports = await prisma.lighthouseReport.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  // Group by URL and device, get latest for each
  const grouped = new Map<string, unknown>();

  for (const report of reports) {
    const key = `${report.url}-${report.device}`;
    if (!grouped.has(key)) {
      grouped.set(key, report);
    }
  }

  return Array.from(grouped.values()) as typeof reports;
}

export async function getReportHistory(url: string, device: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await prisma.lighthouseReport.findMany({
    where: {
      url,
      device,
      createdAt: { gte: startDate },
    },
    orderBy: { createdAt: 'asc' },
  });
}
