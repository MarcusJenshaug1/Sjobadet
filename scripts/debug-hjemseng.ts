/**
 * Debug Hjemseng brygge scraping
 */

import { fetchAvailability } from '../src/lib/availability-scraper'
import prisma from '../src/lib/prisma'

async function debugHjemseng() {
    try {
        // Get Hjemseng from database
        const hjemseng = await prisma.sauna.findFirst({
            where: { 
                name: { contains: 'Hjemseng', mode: 'insensitive' }
            },
            select: {
                name: true,
                bookingAvailabilityUrlDropin: true,
                availabilityData: true,
                lastScrapedAt: true
            }
        })

        if (!hjemseng) {
            console.log('❌ Kunne ikke finne Hjemseng brygge')
            return
        }

        console.log('\n📍 Hjemseng brygge database info:')
        console.log(`   URL: ${hjemseng.bookingAvailabilityUrlDropin}`)
        console.log(`   Sist scrapet: ${hjemseng.lastScrapedAt}`)
        
        if (hjemseng.availabilityData) {
            const data = JSON.parse(hjemseng.availabilityData)
            console.log(`   Data i database:`, JSON.stringify(data, null, 2))
        }

        console.log('\n🔍 Kjører ny scraping av Hjemseng...\n')

        // Scrape fresh data
        const result = await fetchAvailability(hjemseng.bookingAvailabilityUrlDropin!)

        console.log('\n✅ Scraping resultat:')
        console.log(`   Dato: ${result.date}`)
        console.log(`   Antall slots: ${result.slots?.length || 0}`)
        
        if (result.slots && result.slots.length > 0) {
            console.log('\n📊 Alle tider funnet:')
            result.slots.forEach(slot => {
                console.log(`   ${slot.from} - ${slot.to}: ${slot.availableSpots} plasser`)
            })
        } else {
            console.log('\n⚠️  INGEN SLOTS FUNNET!')
        }

    } catch (err) {
        console.error('❌ Feil:', err)
    } finally {
        await prisma.$disconnect()
    }
}

debugHjemseng()
