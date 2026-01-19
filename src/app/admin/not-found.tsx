'use client'

import Link from 'next/link'

export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: '#f8fafc',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
            <div style={{ textAlign: 'center', maxWidth: '600px' }}>
                <div style={{
                    fontSize: '4rem',
                    fontWeight: 900,
                    color: '#0f172a',
                    marginBottom: '1rem',
                    lineHeight: 1
                }}>
                    404
                </div>
                
                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '0.5rem'
                }}>
                    Admin-siden finnes ikke
                </h1>

                <p style={{
                    fontSize: '0.95rem',
                    color: '#64748b',
                    marginBottom: '2rem',
                    lineHeight: 1.6
                }}>
                    Denne siden eksisterer ikke i admin-panelet.
                </p>

                <Link href="/admin" style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    transition: 'background-color 0.2s'
                }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}>
                    Til oversikt
                </Link>
            </div>
        </div>
    )
}
