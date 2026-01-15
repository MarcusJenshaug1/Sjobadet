import { Button } from '@/components/ui/Button'
import { logout } from '@/lib/auth'
import Link from 'next/link'
import styles from './AdminLayout.module.css'
import { redirect } from 'next/navigation'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    Sjøbadet Admin
                </div>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.link} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#10b981', fontWeight: 'bold' }}>
                        ← Gå til nettsted
                    </Link>
                    <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '0.5rem 0' }}></div>
                    <Link href="/admin" className={styles.link}>Oversikt</Link>
                    <Link href="/admin/badstuer" className={styles.link}>Badstuer</Link>
                    <Link href="/admin/apningstider" className={styles.link}>Åpningstider</Link>
                    <Link href="/admin/medlemskap" className={styles.link}>Medlemskap</Link>
                    <Link href="/admin/brukere" className={styles.link}>Brukere</Link>
                    <Link href="/admin/settings" className={styles.link}>Innstillinger</Link>
                    <Link href="/admin/analytics" className={styles.link} style={{ color: 'var(--primary)', fontWeight: '600' }}>Analyse</Link>
                </nav>
                <div className={styles.footer}>
                    <form action={async () => {
                        'use server'
                        await logout()
                        redirect('/admin/login')
                    }}>
                        <Button variant="outline" size="sm" fullWidth>Logg ut</Button>
                    </form>
                </div>
            </aside>
            <main className={styles.content}>
                {children}
            </main>
        </div>
    )
}
