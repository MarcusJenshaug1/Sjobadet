import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { cookies } from 'next/headers'

const SECRET_KEY = process.env.SESSION_SECRET || 'fallback-secret-for-build-only'
if (!process.env.SESSION_SECRET && process.env.NODE_ENV === 'production') {
    console.warn('WARNING: SESSION_SECRET is not set in production!')
}
const key = new TextEncoder().encode(SECRET_KEY)

export interface SessionUser {
    id: string;
    username: string;
    name: string;
    role: string;
    avatarUrl?: string | null;
}

export interface SessionPayload extends JWTPayload {
    user: SessionUser;
    expires: string | number | Date;
}

export async function encrypt(payload: SessionPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key)
}

export async function decrypt(input: string): Promise<SessionPayload> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    })
    return payload as SessionPayload
}

export async function getSession(): Promise<SessionPayload | null> {
    const session = (await cookies()).get('session')?.value
    if (!session) return null
    try {
        return await decrypt(session)
    } catch {
        return null
    }
}

export async function login(userData: SessionUser) {
    // Create the session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({ user: userData, expires })

        // Save the session in a cookie
        ; (await cookies()).set('session', session, {
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        })
}

export async function logout() {
    // Destroy the session
    ; (await cookies()).set('session', '', {
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    })
}
