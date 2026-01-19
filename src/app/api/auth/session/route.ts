import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const session = await getSession();
        return NextResponse.json({ isAdmin: Boolean(session?.user) });
    } catch (error) {
        console.error('[Auth] session check failed', error);
        return NextResponse.json({ isAdmin: false }, { status: 500 });
    }
}
