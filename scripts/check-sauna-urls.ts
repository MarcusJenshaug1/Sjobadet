/**
 * Check which saunas have booking URLs configured
 */

import prisma from '../src/lib/prisma'

async function checkSaunaUrls() {
    try {
        const saunas = await prisma.sauna.findMany({
            where: { status: 'active' },
            select: {
                name: true,
                bookingUrlDropin: true,
                bookingAvailabilityUrlDropin: true,
                hasDropinAvailability: true
            }
        })

        console.log('\n=== Aktive saunas og deres booking-URLs ===\n')
        
        saunas.forEach(sauna => {
            console.log(`📍 ${sauna.name}`)
            console.log(`   Booking URL (dropin): ${sauna.bookingUrlDropin || '❌ Ikke satt'}`)
            console.log(`   Availability URL (scraping): ${sauna.bookingAvailabilityUrlDropin || '❌ Ikke satt'}`)
            console.log(`   Has dropin availability: ${sauna.hasDropinAvailability ? '✅' : '❌'}`)
            console.log('')
        })

        const withAvailabilityUrl = saunas.filter(s => s.bookingAvailabilityUrlDropin?.trim())
        console.log(`\n📊 Total: ${saunas.length} aktive saunas`)
        console.log(`📊 Med availability URL (blir scrapet): ${withAvailabilityUrl.length}`)
        console.log(`📊 Uten availability URL: ${saunas.length - withAvailabilityUrl.length}`)

    } catch (err) {
        console.error('Failed:', err)
    } finally {
        await prisma.$disconnect()
    }
}

checkSaunaUrls()
