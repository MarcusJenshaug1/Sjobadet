'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth-guard'
import { clearSaunaCaches } from '@/lib/sauna-service'

export async function saveSauna(formData: FormData) {
    await requireAdmin()
    const id = formData.get('id') as string
    const isNew = formData.get('isNew') === 'true'

    const data = {
        name: formData.get('name') as string,
        slug: formData.get('slug') as string,
        location: formData.get('location') as string,
        shortDescription: formData.get('shortDescription') as string,
        description: formData.get('description') as string,
        imageUrl: formData.get('imageUrl') as string,
        address: formData.get('address') as string,
        mapEmbedUrl: (formData.get('mapEmbedUrl') as string) ||
            (formData.get('address') ? `https://maps.google.com/maps?q=${encodeURIComponent(formData.get('address') as string)}&output=embed` : ''),
        capacityDropin: parseInt(formData.get('capacityDropin') as string || '0'),
        capacityPrivat: parseInt(formData.get('capacityPrivat') as string || '0'),
        bookingUrlDropin: formData.get('bookingUrlDropin') as string,
        bookingUrlPrivat: formData.get('bookingUrlPrivat') as string,
        bookingAvailabilityUrlDropin: formData.get('bookingAvailabilityUrlDropin') as string,
        bookingAvailabilityUrlPrivat: formData.get('bookingAvailabilityUrlPrivat') as string,
        status: formData.get('status') as string,
        sorting: parseInt(formData.get('sorting') as string || '0'),

        driftStatus: formData.get('driftStatus') as string,
        stengeArsak: formData.get('stengeArsak') as string,
        kundeMelding: formData.get('kundeMelding') as string,

        // Flexible hours
        flexibleHours: formData.get('flexibleHours') === 'on',
        hasDropinAvailability: formData.get('hasDropinAvailability') === 'on',
        hoursMessage: formData.get('hoursMessage') as string,

        // Parse JSON fields from textareas (one per line)
        gallery: formData.get('gallery') as string, // Expecting JSON string directly from SaunaMediaManager
        facilities: JSON.stringify((formData.get('facilities') as string).split('\n').filter(Boolean)),
    }

    if (isNew) {
        const sauna = await prisma.sauna.create({ data: { ...data, id } }) // Use provided ID for new sauna

        // Create default opening hours (Mon-Sun)
        const openingHoursData = Array.from({ length: 7 }, (_, i) => ({
            saunaId: sauna.id,
            weekday: i,
            opens: '07:00',
            closes: '21:00',
            active: true
        }))

        await prisma.openingHour.createMany({
            data: openingHoursData
        })
    } else {
        await prisma.sauna.update({
            where: { id },
            data
        })
    }

    // Link any assets that were uploaded during this session
    const assetIdsJson = formData.get('assetIds') as string
    if (assetIdsJson) {
        try {
            const assetIds = JSON.parse(assetIdsJson) as string[]
            if (assetIds.length > 0) {
                await prisma.mediaAsset.updateMany({
                    where: { id: { in: assetIds } },
                    data: { saunaId: id }
                })
            }
        } catch (e) {
            console.error('Failed to link assets', e)
        }
    }

    clearSaunaCaches(data.slug)
    revalidatePath('/admin/badstuer')
    revalidatePath('/')
    revalidatePath(`/badstue/${data.slug}`)
    redirect('/admin/badstuer')
}

export async function toggleSaunaStatus(id: string, currentStatus: string) {
    await requireAdmin()
    await prisma.sauna.update({
        where: { id },
        data: { status: currentStatus === 'active' ? 'inactive' : 'active' }
    })
    clearSaunaCaches()
    revalidatePath('/admin/badstuer')
    revalidatePath('/')
}

export async function deleteSauna(id: string) {
    await requireAdmin()
    await prisma.sauna.delete({
        where: { id }
    })
    clearSaunaCaches()
    revalidatePath('/admin/badstuer')
    revalidatePath('/')
}
