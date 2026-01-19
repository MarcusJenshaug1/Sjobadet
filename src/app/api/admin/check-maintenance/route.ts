import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * Check if maintenance mode is active
 * Used by middleware and client-side checks
 */
export async function GET(req: NextRequest) {
    try {
        const maintenanceSetting = await prisma.siteSetting.findUnique({
            where: { key: 'maintenance_mode' }
        })

        const isMaintenanceMode = maintenanceSetting?.value === 'true'
        
        console.log('[check-maintenance] Setting:', maintenanceSetting)
        console.log('[check-maintenance] Is maintenance mode:', isMaintenanceMode)

        return NextResponse.json(
            { isMaintenanceMode },
            {
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Pragma': 'no-cache'
                }
            }
        )
    } catch (error) {
        console.error('Error checking maintenance mode:', error)
        // If there's an error checking, assume NOT in maintenance mode
        return NextResponse.json({ isMaintenanceMode: false })
    }
}
