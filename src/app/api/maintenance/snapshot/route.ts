import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * Generate and save maintenance mode snapshot
 * Called when maintenance mode is activated or snapshot is manually updated
 */
export async function POST(req: NextRequest) {
    try {
        // Auth check - only admin can generate snapshots
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        if (session.user?.role === 'demo') {
            return NextResponse.json({ error: 'Demo-modus: Endringer lagres ikke' }, { status: 403 })
        }

        // Fetch all active saunas with booking info
        const saunas = await prisma.sauna.findMany({
            where: { status: 'active' },
            select: {
                id: true,
                slug: true,
                name: true,
                location: true,
                imageUrl: true,
                bookingUrlDropin: true,
                bookingUrlPrivat: true,
                driftStatus: true,
                stengeArsak: true,
            },
            orderBy: { sorting: 'asc' }
        })

        // Create snapshot payload
        const snapshot = {
            generatedAt: new Date().toISOString(),
            saunas: saunas.map(s => ({
                id: s.id,
                slug: s.slug,
                name: s.name,
                location: s.location,
                imageUrl: s.imageUrl,
                bookingUrlDropin: s.bookingUrlDropin,
                bookingUrlPrivat: s.bookingUrlPrivat,
                driftStatus: s.driftStatus,
                stengeArsak: s.stengeArsak,
            }))
        }

        // Save snapshot to SiteSetting
        await prisma.siteSetting.upsert({
            where: { key: 'maintenance_snapshot' },
            create: {
                key: 'maintenance_snapshot',
                value: JSON.stringify(snapshot),
                description: 'Snapshot of saunas for maintenance mode'
            },
            update: {
                value: JSON.stringify(snapshot)
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Maintenance snapshot generated',
            generatedAt: snapshot.generatedAt,
            saunaCount: snapshot.saunas.length
        })
    } catch (error) {
        console.error('Error generating maintenance snapshot:', error)
        return NextResponse.json(
            { error: 'Failed to generate snapshot', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
