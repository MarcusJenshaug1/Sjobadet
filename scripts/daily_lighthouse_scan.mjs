import { PrismaClient } from '@prisma/client';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const prisma = new PrismaClient();

const MOBILE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile',
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
    formFactor: 'desktop',
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

async function runLighthouse(url, device) {
  let chrome;
  
  try {
    chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
    });

    const config = device === 'mobile' ? MOBILE_CONFIG : DESKTOP_CONFIG;
    
    const runnerResult = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'silent',
    }, config);

    if (!runnerResult) {
      console.error('Lighthouse returned no results');
      return null;
    }

    const { lhr } = runnerResult;

    const performance = Math.round((lhr.categories.performance?.score ?? 0) * 100);
    const accessibility = Math.round((lhr.categories.accessibility?.score ?? 0) * 100);
    const bestPractices = Math.round((lhr.categories['best-practices']?.score ?? 0) * 100);
    const seo = Math.round((lhr.categories.seo?.score ?? 0) * 100);
    const pwa = lhr.categories.pwa ? Math.round((lhr.categories.pwa.score ?? 0) * 100) : null;

    const fcp = lhr.audits['first-contentful-paint']?.numericValue;
    const lcp = lhr.audits['largest-contentful-paint']?.numericValue;
    const tbt = lhr.audits['total-blocking-time']?.numericValue;
    const cls = lhr.audits['cumulative-layout-shift']?.numericValue;
    const si = lhr.audits['speed-index']?.numericValue;

    return {
      url,
      device,
      performance,
      accessibility,
      bestPractices,
      seo,
      pwa,
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
        console.warn('Chrome cleanup warning (non-critical):', killError.message);
      }
    }
  }
}

async function getAllUrls() {
  // Try to get base URL from database settings first
  let baseUrl = process.env.LIGHTHOUSE_BASE_URL || 'https://sjobadet.marcusjenshaug.no';
  
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'lighthouse_base_url' },
    });
    if (setting?.value) {
      baseUrl = setting.value;
      console.log(`Using base URL from settings: ${baseUrl}`);
    }
  } catch (error) {
    console.warn('Failed to fetch base URL from settings, using default');
  }

  // Check which page types to scan from environment variables
  const scanHomepage = process.env.SCAN_HOMEPAGE !== 'false';
  const scanSaunas = process.env.SCAN_SAUNAS !== 'false';
  const scanSubpages = process.env.SCAN_SUBPAGES !== 'false';

  console.log(`Scan options: Homepage=${scanHomepage}, Saunas=${scanSaunas}, Subpages=${scanSubpages}`);
  
  const urls = [];

  // Homepage
  if (scanHomepage) {
    urls.push('/');
  }

  // Subpages (info pages, membership, business, gift cards)
  if (scanSubpages) {
    urls.push(
      '/info',
      '/info/apningstider',
      '/info/faq',
      '/info/om-oss',
      '/info/personvern',
      '/info/regler',
      '/info/vilkar',
      '/medlemskap',
      '/bedrift',
      '/gavekort'
    );
  }

  // Sauna pages
  if (scanSaunas) {
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
  }

  console.log(`Will scan ${urls.length} URLs`);
  return urls.map(path => `${baseUrl}${path}`);
}

async function runFullScan() {
  const scanId = await prisma.lighthouseScan.create({
    data: {
      status: 'running',
      totalUrls: 0,
      completedUrls: 0,
      failedUrls: 0,
    },
  });

  try {
    const urls = await getAllUrls();
    
    await prisma.lighthouseScan.update({
      where: { id: scanId.id },
      data: { totalUrls: urls.length * 2 },
    });

    let completed = 0;
    let failed = 0;

    for (const url of urls) {
      console.log(`\n🔍 Scanning: ${url}`);
      
      // Mobile scan
      try {
        const mobileResult = await runLighthouse(url, 'mobile');
        if (mobileResult) {
          console.log(`Mobile scores: P:${mobileResult.performance} A:${mobileResult.accessibility} BP:${mobileResult.bestPractices} S:${mobileResult.seo}`);
          
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
          console.log(`✅ Mobile scan completed`);
        } else {
          failed++;
          console.log(`❌ Mobile scan failed`);
        }
      } catch (error) {
        failed++;
        console.error(`❌ Mobile scan error:`, error.message);
      }

      await prisma.lighthouseScan.update({
        where: { id: scanId.id },
        data: { completedUrls: completed, failedUrls: failed },
      });

      // Desktop scan
      try {
        const desktopResult = await runLighthouse(url, 'desktop');
        if (desktopResult) {
          console.log(`Desktop scores: P:${desktopResult.performance} A:${desktopResult.accessibility} BP:${desktopResult.bestPractices} S:${desktopResult.seo}`);
          
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
          console.log(`✅ Desktop scan completed`);
        } else {
          failed++;
          console.log(`❌ Desktop scan failed`);
        }
      } catch (error) {
        failed++;
        console.error(`❌ Desktop scan error:`, error.message);
      }

      await prisma.lighthouseScan.update({
        where: { id: scanId.id },
        data: { completedUrls: completed, failedUrls: failed },
      });
    }

    await prisma.lighthouseScan.update({
      where: { id: scanId.id },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });
    
    console.log('\n✅ Full scan completed!');
  } catch (error) {
    console.error('Full scan error:', error);
    await prisma.lighthouseScan.update({
      where: { id: scanId.id },
      data: {
        status: 'failed',
        completedAt: new Date(),
        error: error.message,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

runFullScan();
