import { getSession } from './auth'

/**
 * Guard for server actions to ensure the user is authenticated as an admin.
 * Throws an error if no valid session is found.
 */
export async function requireAdmin() {
    const session = await getSession()

    if (!session || !session.user) {
        throw new Error('Unauthorized: Admin access required')
    }

    if (!['admin', 'demo'].includes(session.user.role)) {
        throw new Error('Unauthorized: Admin access required')
    }

    return session.user
}

export async function assertNotDemo() {
    const user = await requireAdmin()

    if (user.role === 'demo') {
        throw new Error('Demo-modus: Endringer lagres ikke')
    }

    return user
}
