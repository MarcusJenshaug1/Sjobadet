'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface ErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#f8fafc'
        }}>
            {/* Simple static header for error page */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 1100,
                width: '100%',
                backgroundColor: 'white',
                borderBottom: '1px solid #e2e8f0',
                padding: '1rem 0',
                boxShadow: '0 1px 3px rgb(0 0 0 / 0.1)'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '60px'
                }}>
                    <Link href="/" style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        textDecoration: 'none'
                    }}>
                        Sjøbadet
                    </Link>
                </div>
            </header>

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}>
                <div style={{ textAlign: 'center', maxWidth: '600px' }}>
                    <div style={{
                        fontSize: '5rem',
                        fontWeight: 900,
                        color: '#ef4444',
                        marginBottom: '1rem',
                        lineHeight: 1
                    }}>
                        500
                    </div>
                    
                    <h1 style={{
                        fontSize: '1.875rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '0.5rem'
                    }}>
                        Noe gikk galt
                    </h1>

                    <p style={{
                        fontSize: '1rem',
                        color: '#64748b',
                        marginBottom: '2rem',
                        lineHeight: 1.6
                    }}>
                        En uventet feil oppstod. Vi har logget problemet og vil undersøke det.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        marginBottom: '2rem'
                    }}>
                        <Button onClick={reset} variant="primary">
                            Prøv igjen
                        </Button>
                        <Button href="/" variant="outline">
                            Gå til forsiden
                        </Button>
                    </div>

                    <p style={{
                        fontSize: '0.875rem',
                        color: '#94a3b8',
                        lineHeight: 1.6
                    }}>
                        Hvis problemet vedvarer, <Link href="/info/contact" style={{ color: '#3b82f6', textDecoration: 'none' }}>kontakt oss</Link>
                    </p>
                </div>
            </div>

            {/* Simple static footer for error page */}
            <footer style={{
                backgroundColor: '#0f172a',
                color: '#cbd5e1',
                padding: '2rem 1rem',
                marginTop: 'auto'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}>
                    <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        Sjøbadet {new Date().getFullYear()} &copy;
                    </p>
                </div>
            </footer>
        </div>
    )
}
