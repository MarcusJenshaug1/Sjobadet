/**
 * Update Hjemseng brygge to have availability URL for scraping
 */

import prisma from '../src/lib/prisma'

async function updateHjemsengUrl() {
    try {
        const hjemseng = await prisma.sauna.findFirst({
            where: { 
                name: { contains: 'Hjemseng', mode: 'insensitive' }
            }
        })

        if (!hjemseng) {
            console.log('❌ Kunne ikke finne Hjemseng brygge')
            return
        }

        console.log(`✅ Fant: ${hjemseng.name}`)
        console.log(`   Booking URL: ${hjemseng.bookingUrlDropin}`)
        
        // Update with availability URL (same as booking URL for Periode.no)
        const updated = await prisma.sauna.update({
            where: { id: hjemseng.id },
            data: {
                bookingAvailabilityUrlDropin: hjemseng.bookingUrlDropin,
                hasDropinAvailability: true
            }
        })

        console.log(`\n✅ Oppdatert ${updated.name}:`)
        console.log(`   Availability URL satt til: ${updated.bookingAvailabilityUrlDropin}`)
        console.log(`   Has dropin availability: ${updated.hasDropinAvailability}`)
        console.log('\n🎉 Hjemseng brygge vil nå bli inkludert i automatisk scraping!')

    } catch (err) {
        console.error('Failed:', err)
    } finally {
        await prisma.$disconnect()
    }
}

updateHjemsengUrl()
