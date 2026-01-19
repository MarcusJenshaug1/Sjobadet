import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all saunas to create a slug -> name mapping
    const saunas = await prisma.sauna.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    // Create a mapping of slug to name
    const saunaMap: Record<string, string> = {};
    saunas.forEach((sauna) => {
      if (sauna.slug) {
        saunaMap[sauna.slug] = sauna.name;
      }
    });

    return NextResponse.json({ saunaMap });
  } catch (error) {
    console.error('Failed to fetch sauna names:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sauna names' },
      { status: 500 }
    );
  }
}
