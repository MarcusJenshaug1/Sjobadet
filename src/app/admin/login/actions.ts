'use server'

import { login } from '@/lib/auth'
import prisma from '@/lib/prisma'
import * as bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: any, formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (!username || !password) {
        return { error: 'Fyll ut alle felt' }
    }

    try {
        const user = await prisma.adminUser.findUnique({
            where: { username }
        })

        if (!user) {
            return { error: 'Feil brukernavn eller passord' }
        }

        const isValid = await bcrypt.compare(password, user.passwordHash)

        if (!isValid) {
            return { error: 'Feil brukernavn eller passord' }
        }

        await login({ username: user.username, id: user.id })

    } catch (error) {
        return { error: 'En feil oppstod' }
    }

    redirect('/admin')
}
