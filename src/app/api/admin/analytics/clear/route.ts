import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (session.user?.role === 'demo') {
        return NextResponse.json({ error: 'Demo-modus: Endringer lagres ikke' }, { status: 403 })
    }

    // Only allow Marcus to clear analytics
    const username = session.user?.username || session.user?.name || ''
    if (username !== 'Marcus') {
        return NextResponse.json(
            { error: 'Kun Marcus kan slette analytikk' },
            { status: 403 }
        )
    }

    try {
        // Delete all analytics events and sessions
        const deletedEvents = await prisma.analyticsEvent.deleteMany({})
        const deletedSessions = await prisma.analyticsSession.deleteMany({})

        console.log(`[AUDIT] Marcus cleared analytics: ${deletedEvents.count} events, ${deletedSessions.count} sessions deleted`)

        return NextResponse.json({
            success: true,
            message: 'All analytics data has been cleared',
            deleted: {
                events: deletedEvents.count,
                sessions: deletedSessions.count
            }
        })
    } catch (error) {
        console.error('Error clearing analytics:', error)
        return NextResponse.json(
            { error: 'Failed to clear analytics' },
            { status: 500 }
        )
    }
}
