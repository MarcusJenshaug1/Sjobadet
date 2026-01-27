'use server'

import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function getUserInfo() {
  const session = await getSession()
  const roleValue = session?.user?.role || 'admin'
  const isAdmin = roleValue === 'admin'
  const isDemo = roleValue === 'demo'
  const roleLabel = isDemo ? 'Demo' : 'Administrator'
  const sessionId = session?.user?.id

  if (!session?.user?.username) {
    return { id: sessionId, name: 'Admin', role: roleLabel, avatarUrl: null, isAdmin, isDemo }
  }

  // Always fetch fresh data from DB to avoid stale session info (like avatarUrl)
  const user = await prisma.adminUser.findUnique({
    where: { username: session.user.username },
    select: { id: true, username: true, avatarUrl: true, role: true }
  })

  if (!user) {
    return { id: sessionId, name: 'Admin', role: roleLabel, avatarUrl: null, isAdmin, isDemo }
  }

  // Capitalize first letter of username for display
  const name = user.username.charAt(0).toUpperCase() + user.username.slice(1)

  return {
    id: user.id,
    name,
    role: user.role === 'demo' ? 'Demo' : 'Administrator',
    username: user.username,
    avatarUrl: user.avatarUrl,
    isAdmin,
    isDemo: user.role === 'demo'
  }
}
