import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'lighthouse_base_url' },
    });

    return NextResponse.json({
      baseUrl: setting?.value || 'https://sjobadet.marcusjenshaug.no',
    });
  } catch (error) {
    console.error('Failed to fetch lighthouse settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.user?.role === 'demo') {
      return NextResponse.json({ error: 'Demo-modus: Endringer lagres ikke' }, { status: 403 });
    }

    const { baseUrl } = await request.json();

    if (!baseUrl || !baseUrl.startsWith('http')) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    await prisma.siteSetting.upsert({
      where: { key: 'lighthouse_base_url' },
      create: {
        key: 'lighthouse_base_url',
        value: baseUrl,
        description: 'Base URL for Lighthouse scanning',
      },
      update: {
        value: baseUrl,
      },
    });

    return NextResponse.json({ success: true, baseUrl });
  } catch (error) {
    console.error('Failed to save lighthouse settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
