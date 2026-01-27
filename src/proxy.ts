import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
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
            } catch {
                // invalid session
            }
        }

        if (!session?.user) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    if (path.startsWith('/storybook')) {
        const cookie = request.cookies.get('session')?.value
        let session = null
        if (cookie) {
            try {
                session = await decrypt(cookie)
            } catch {
                // invalid session
            }
        }

        if (!session?.user) {
            const loginUrl = new URL('/admin/login', request.url)
            loginUrl.searchParams.set('next', `${path}${request.nextUrl.search}`)
            return NextResponse.redirect(loginUrl)
        }
    }

    // NO MORE MAINTENANCE REDIRECTS - handled by banner in layout
    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
}
