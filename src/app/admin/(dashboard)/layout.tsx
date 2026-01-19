import { Button } from '@/components/ui/Button'
import { logout } from '@/lib/auth'
import Link from 'next/link'
import styles from './AdminLayout.module.css'
import { redirect } from 'next/navigation'

const navLinks = [
    { href: '/', label: 'Gå til nettsted', accent: true },
    { href: '/admin', label: 'Oversikt' },
    { href: '/admin/badstuer', label: 'Badstuer' },
    { href: '/admin/apningstider', label: 'Åpningstider' },
    { href: '/admin/medlemskap', label: 'Medlemskap' },
    { href: '/admin/brukere', label: 'Brukere' },
    { href: '/admin/settings', label: 'Innstillinger' },
    { href: '/admin/analytics', label: 'Analyse', accent: true },
]

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

                <details className={styles.mobileNav}>
                    <summary>≡ Meny</summary>
                    <div className={styles.mobileNavContent}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${styles.link} ${link.accent ? styles.linkAccent : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </details>

                <nav className={styles.navDesktop}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.link} ${link.accent ? styles.linkAccent : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
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
