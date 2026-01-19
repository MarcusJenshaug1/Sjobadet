import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

async function getLatestReports() {
  const reports = await prisma.lighthouseReport.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const grouped = new Map<string, any>();
  
  for (const report of reports) {
    const key = `${report.url}-${report.device}`;
    if (!grouped.has(key)) {
      grouped.set(key, report);
    }
  }

  return Array.from(grouped.values());
}

async function getReportHistory(url: string, device: string, days: number) {
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

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'latest';
    const url = searchParams.get('url');
    const device = searchParams.get('device');
    const days = parseInt(searchParams.get('days') || '30');

    if (type === 'history' && url && device) {
      const history = await getReportHistory(url, device, days);
      return NextResponse.json({ reports: history });
    }

    if (type === 'scans') {
      const scans = await prisma.lighthouseScan.findMany({
        orderBy: { startedAt: 'desc' },
        take: 20,
      });
      return NextResponse.json({ scans });
    }

    // Default: latest reports
    const reports = await getLatestReports();
    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Lighthouse reports error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
