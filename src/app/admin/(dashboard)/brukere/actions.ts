'use server'

import prisma from '@/lib/prisma'
import * as bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'

import { deleteAvatarFromStorage } from './avatar-actions'

export async function saveUser(formData: FormData) {
    await requireAdmin()
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const id = formData.get('id') as string
    const avatarUrl = formData.get('avatarUrl') as string

    if (!username) {
        throw new Error('Brukernavn er påkrevd')
    }

    if (!id && !password) {
        throw new Error('Passord er påkrevd for nye brukere')
    }

    const data: any = {
        username,
        avatarUrl: avatarUrl || null
    }

    if (password) {
        data.passwordHash = await bcrypt.hash(password, 10)
    }

    if (id) {
        // Fetch old user to check for orphan avatar
        const oldUser = await (prisma.adminUser.findUnique as any)({
            where: { id },
            select: { avatarUrl: true }
        })

        if (oldUser?.avatarUrl && oldUser.avatarUrl !== data.avatarUrl) {
            await deleteAvatarFromStorage(oldUser.avatarUrl)
        }

        await (prisma.adminUser.update as any)({
            where: { id },
            data
        })
    } else {
        await (prisma.adminUser.create as any)({
            data
        })
    }

    revalidatePath('/admin/brukere')
}

export async function deleteUser(id: string) {
    await requireAdmin()

    // Fetch user to check for avatar
    const user = await (prisma.adminUser.findUnique as any)({
        where: { id },
        select: { avatarUrl: true }
    })

    if (user?.avatarUrl) {
        await deleteAvatarFromStorage(user.avatarUrl)
    }

    await prisma.adminUser.delete({
        where: { id }
    })
    revalidatePath('/admin/brukere')
}
