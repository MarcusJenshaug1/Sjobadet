import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // 1. Create Admin User
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminUsername || !adminPassword) {
        throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in environment variables for seeding')
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    const user = await prisma.adminUser.upsert({
        where: { username: adminUsername },
        update: {
            passwordHash: hashedPassword,
            role: 'admin'
        },
        create: {
            username: adminUsername,
            passwordHash: hashedPassword,
            role: 'admin'
        },
    })
    console.log({ user })

    // 2. Migrate Saunas from JSON
    const jsonPath = path.join(__dirname, '../src/data/saunas.json')
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8')
    const saunas = JSON.parse(jsonContent)

    for (const s of saunas) {
        const createdSauna = await prisma.sauna.upsert({
            where: { slug: s.slug },
            update: {},
            create: {
                slug: s.slug,
                name: s.name,
                location: s.location,
                shortDescription: s.shortDescription,
                description: s.description,
                imageUrl: s.imageUrl,
                gallery: JSON.stringify(s.gallery || []),
                address: s.address,
                mapEmbedUrl: s.mapEmbedUrl,
                facilities: JSON.stringify(s.facilities || []),
                capacityDropin: s.capacity?.dropin || 0,
                capacityPrivat: s.capacity?.privat || 0,
                bookingUrlDropin: s.bookingUrls?.dropin || '',
                bookingUrlPrivat: s.bookingUrls?.privat || '',
                status: s.active ? 'active' : 'inactive',
                driftStatus: 'open',
            },
        })
        console.log(`Upserted sauna: ${createdSauna.name}`)

        const hoursCount = await prisma.openingHour.count({ where: { saunaId: createdSauna.id } })
        if (hoursCount === 0) {
            for (let i = 0; i <= 6; i++) {
                await prisma.openingHour.create({
                    data: {
                        saunaId: createdSauna.id,
                        type: 'weekly',
                        weekday: i,
                        opens: '06:00',
                        closes: '23:00',
                        active: true
                    }
                })
            }
        }
    }

    // 3. Create Site Settings
    await prisma.siteSetting.upsert({
        where: { key: 'alert_enabled' },
        update: {},
        create: { key: 'alert_enabled', value: 'false', description: 'Show global banner' }
    })

    await prisma.siteSetting.upsert({
        where: { key: 'alert_text' },
        update: {},
        create: { key: 'alert_text', value: 'Velkommen til Sjøbadet!', description: 'Global banner text' }
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
