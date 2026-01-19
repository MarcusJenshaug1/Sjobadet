import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#f8fafc'
        }}>
            <Header />

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
                        color: '#0f172a',
                        marginBottom: '1rem',
                        lineHeight: 1
                    }}>
                        404
                    </div>
                    
                    <h1 style={{
                        fontSize: '1.875rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '0.5rem'
                    }}>
                        Siden finnes ikke
                    </h1>

                    <p style={{
                        fontSize: '1rem',
                        color: '#64748b',
                        marginBottom: '2rem',
                        lineHeight: 1.6
                    }}>
                        Beklager, vi fant ikke siden du letet etter. Den kan ha blitt flytta eller slettet.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        marginBottom: '2rem'
                    }}>
                        <Button href="/" variant="primary">
                            Gå til forsiden
                        </Button>
                        <Button href="/#saunas" variant="outline">
                            Se badstuer
                        </Button>
                    </div>

                    <p style={{
                        fontSize: '0.875rem',
                        color: '#94a3b8',
                        lineHeight: 1.6
                    }}>
                        Har du spørsmål? <Link href="/info/contact" style={{ color: '#3b82f6', textDecoration: 'none' }}>Kontakt oss</Link>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    )
}
