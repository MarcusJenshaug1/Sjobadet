import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

type SessionUser = {
  role?: string
}

const SECRET_KEY = process.env.SESSION_SECRET || 'fallback-secret-for-build-only'
const key = new TextEncoder().encode(SECRET_KEY)

async function getSessionUser(request: NextRequest): Promise<SessionUser | null> {
  const token = request.cookies.get('session')?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] })
    return (payload as { user?: SessionUser })?.user ?? null
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (pathname.startsWith('/storybook')) {
    const user = await getSessionUser(request)

    if (!user) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('next', `${pathname}${search}`)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/storybook', '/storybook/:path*'],
}

export default middleware