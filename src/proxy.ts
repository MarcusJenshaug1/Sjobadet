import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './lib/auth'
import { cookies } from 'next/headers'
import { decrypt } from './lib/auth'

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Check if it's an admin route
    if (path.startsWith('/admin')) {
        // Allow access to login page
        if (path === '/admin/login') {
            return NextResponse.next()
        }

        // Verify session
        const cookie = request.cookies.get('session')?.value
        let session = null
        if (cookie) {
            try {
                session = await decrypt(cookie)
            } catch (e) {
                // invalid session
            }
        }

        if (!session?.user) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
