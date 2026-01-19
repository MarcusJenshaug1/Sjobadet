/**
 * Test full availability update for Hjemseng
 */

import { updateSaunaAvailability } from '../src/lib/availability-service'
import prisma from '../src/lib/prisma'

async function testUpdate() {
    try {
        const hjemseng = await prisma.sauna.findFirst({
            where: { name: { contains: 'Hjemseng', mode: 'insensitive' }},
            select: { id: true, name: true }
        })

        if (!hjemseng) {
            console.log('❌ Kunne ikke finne Hjemseng')
            return
        }

        console.log(`\n🔄 Oppdaterer ${hjemseng.name}...\n`)

        await updateSaunaAvailability(hjemseng.id)

        console.log('\n✅ Oppdatering fullført!')

        // Fetch updated data
        const updated = await prisma.sauna.findUnique({
            where: { id: hjemseng.id },
            select: { availabilityData: true, lastScrapedAt: true }
        })

        if (updated?.availabilityData) {
            const data = JSON.parse(updated.availabilityData)
            console.log('\n📊 Oppdatert data i database:')
            const todaySlots = data.days['2026-01-19'] || []
            todaySlots.slice(13, 17).forEach((slot: any) => {
                console.log(`   ${slot.from}: ${slot.availableSpots} plasser`)
            })
        }

    } catch (err) {
        console.error('❌ Feil:', err)
    } finally {
        await prisma.$disconnect()
    }
}

testUpdate()
