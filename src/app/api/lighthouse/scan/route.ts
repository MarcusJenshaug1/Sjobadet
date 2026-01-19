import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { exec } from 'child_process';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse scan options from request body (with fallback for empty body)
    let body: { homepage?: boolean; saunas?: boolean; subpages?: boolean } = {};
    try {
      body = await request.json();
    } catch (e) {
      // Body might be empty, use defaults
    }
    const { homepage = true, saunas = true, subpages = true } = body;

  const scan = await prisma.lighthouseScan.create({
      data: {
        status: 'running',
        totalUrls: 0,
        completedUrls: 0,
        failedUrls: 0,
      },
    });

    // Build environment variables for the scan script
    const env = {
      ...process.env,
      SCAN_HOMEPAGE: homepage.toString(),
      SCAN_SAUNAS: saunas.toString(),
      SCAN_SUBPAGES: subpages.toString(),
      SCAN_ID: scan.id,
    };

    // Start scan in background using npm script with options
    exec('npm run lighthouse:scan', {
      cwd: process.cwd(),
      env,
    });

    // Return immediately - scan runs in background
    return NextResponse.json({ 
      success: true,
      message: 'Lighthouse scan startet i bakgrunn. Sjekk progresjon på denne siden.',
      scanId: scan.id,
    });
  } catch (error) {
    console.error('Lighthouse scan error:', error);
    return NextResponse.json(
      { error: 'Failed to start Lighthouse scan' },
      { status: 500 }
    );
  }
}
