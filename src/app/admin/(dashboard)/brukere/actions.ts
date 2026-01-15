'use server'

import prisma from '@/lib/prisma'
import * as bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'

export async function saveUser(formData: FormData) {
    await requireAdmin()
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const id = formData.get('id') as string

    if (!username) {
        throw new Error('Brukernavn er påkrevd')
    }

    if (!id && !password) {
        throw new Error('Passord er påkrevd for nye brukere')
    }

    const data: any = {
        username,
    }

    if (password) {
        data.passwordHash = await bcrypt.hash(password, 10)
    }

    if (id) {
        await prisma.adminUser.update({
            where: { id },
            data
        })
    } else {
        await prisma.adminUser.create({
            data
        })
    }

    revalidatePath('/admin/brukere')
}

export async function deleteUser(id: string) {
    await requireAdmin()
    await prisma.adminUser.delete({
        where: { id }
    })
    revalidatePath('/admin/brukere')
}
