'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth-guard'

export async function saveSubscription(formData: FormData) {
    await requireAdmin()
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const price = parseFloat(formData.get('price') as string) || 0
    const period = formData.get('period') as string
    const features = formData.get('features') as string // JSON string
    const description = formData.get('description') as string
    const active = formData.get('active') === 'true'
    const sorting = parseInt(formData.get('sorting') as string) || 0
    const binding = formData.get('binding') === 'on'
    const bindingDescription = formData.get('bindingDescription') as string
    const paymentUrl = formData.get('paymentUrl') as string

    const data = {
        name,
        price,
        period,
        features,
        description,
        active,
        sorting,
        binding,
        bindingDescription,
        paymentUrl
    }

    if (id) {
        await prisma.subscription.update({
            where: { id },
            data
        })
    } else {
        await prisma.subscription.create({
            data
        })
    }

    revalidatePath('/admin/medlemskap')
    revalidatePath('/medlemskap')
}

export async function deleteSubscription(formData: FormData) {
    await requireAdmin()
    const id = formData.get('id') as string
    if (id) {
        await prisma.subscription.delete({ where: { id } })
        revalidatePath('/admin/medlemskap')
        revalidatePath('/medlemskap')
    }
}

export async function toggleStatus(id: string, currentStatus: boolean) {
    await requireAdmin()
    await prisma.subscription.update({
        where: { id },
        data: { active: !currentStatus }
    })
    revalidatePath('/admin/medlemskap')
    revalidatePath('/medlemskap')
}
