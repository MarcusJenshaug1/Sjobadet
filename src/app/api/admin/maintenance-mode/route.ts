import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const ToggleSchema = z.object({
    enabled: z.boolean()
})

/**
 * Toggle maintenance mode on/off
 * When enabling: generates and saves snapshot first
 */
export async function POST(req: NextRequest) {
    try {
        // Auth check - only admin can toggle
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        if (session.user?.role === 'demo') {
            return NextResponse.json({ error: 'Demo-modus: Endringer lagres ikke' }, { status: 403 })
        }

        const body = await req.json()
        const result = ToggleSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid request', details: result.error.format() },
                { status: 400 }
            )
        }

        const { enabled } = result.data

        if (enabled) {
            // When enabling: generate snapshot first
            try {
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
            } catch (error) {
                console.error('Failed to generate snapshot:', error)
                return NextResponse.json(
                    { error: 'Failed to generate snapshot' },
                    { status: 500 }
                )
            }
        }

        // Toggle the maintenance mode flag
        await prisma.siteSetting.upsert({
            where: { key: 'maintenance_mode' },
            create: {
                key: 'maintenance_mode',
                value: enabled ? 'true' : 'false',
                description: 'Maintenance mode toggle'
            },
            update: {
                value: enabled ? 'true' : 'false'
            }
        })

        return NextResponse.json({
            success: true,
            message: enabled
                ? 'Vedlikeholdsmodus aktivert'
                : 'Vedlikeholdsmodus deaktivert',
            enabled
        })
    } catch (error) {
        console.error('Error toggling maintenance mode:', error)
        return NextResponse.json(
            { error: 'Failed to toggle maintenance mode', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
