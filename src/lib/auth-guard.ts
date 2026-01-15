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

    return session.user
}
