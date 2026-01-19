'use server'

import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function getUserInfo() {
  const session = await getSession()

  if (!session?.user?.username) {
    return { name: 'Admin', role: 'Administrator', avatarUrl: null }
  }

  // Always fetch fresh data from DB to avoid stale session info (like avatarUrl)
  // Casting to any to avoid lint errors while client is out of sync
  const user = await (prisma.adminUser.findUnique as any)({
    where: { username: session.user.username },
    select: { username: true, avatarUrl: true }
  })

  if (!user) {
    return { name: 'Admin', role: 'Administrator', avatarUrl: null }
  }

  // Capitalize first letter of username for display
  const name = user.username.charAt(0).toUpperCase() + user.username.slice(1)

  return {
    name,
    role: 'Administrator',
    username: user.username,
    avatarUrl: user.avatarUrl
  }
}
