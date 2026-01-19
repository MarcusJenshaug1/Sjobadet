'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import styles from './AdminLayout.module.css'
import { logoutAction } from './actions'
import { getUserInfo } from './user-info'
import Image from 'next/image'
import {
  LayoutDashboard,
  Waves,
  Clock,
  Users,
  Image as ImageIcon,
  CreditCard,
  Settings,
  BarChart3,
  Zap,
  ExternalLink,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
  Shield
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'Drift',
    items: [
      { href: '/admin', label: 'Oversikt', icon: LayoutDashboard },
      { href: '/admin/badstuer', label: 'Badstuer', icon: Waves },
      { href: '/admin/apningstider', label: 'Åpningstider', icon: Clock },
      { href: '/admin/media', label: 'Bilder', icon: ImageIcon },
    ]
  },
  {
    title: 'Administrasjon',
    items: [
      { href: '/admin/medlemskap', label: 'Medlemskap', icon: CreditCard },
      { href: '/admin/brukere', label: 'Brukere', icon: Users },
      { href: '/admin/settings', label: 'Innstillinger', icon: Settings },
    ]
  },
  {
    title: 'Analyse',
    items: [
      { href: '/admin/analytics', label: 'Sidestatistikk', icon: BarChart3 },
      { href: '/admin/privacy', label: 'Personvern', icon: Shield },
      { href: '/admin/lighthouse', label: 'Lighthouse', icon: Zap },
    ]
  },
]

function AdminSidebar({ onClose, collapsed }: { onClose?: () => void; collapsed?: boolean }) {
  const pathname = usePathname()
  const [userInfo, setUserInfo] = useState<{ name: string; role: string; username?: string; avatarUrl?: string | null }>({ name: 'Admin', role: 'Administrator' })

  useEffect(() => {
    getUserInfo().then(info => {
      console.log('[Sidebar] User Info:', info)
      setUserInfo(info)
    })
  }, [])

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  // Get first letter for avatar fallback
  const avatarLetter = userInfo.name.charAt(0).toUpperCase()

  const UserAvatar = ({ className }: { className: string }) => (
    <div className={className} style={userInfo.avatarUrl ? { background: 'none' } : {}}>
      {userInfo.avatarUrl ? (
        <img
          src={userInfo.avatarUrl}
          alt={userInfo.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
        />
      ) : (
        avatarLetter
      )}
    </div>
  )

  return (
    <>
      {/* Header */}
      <div className={styles.header}>
        {!collapsed && (
          <>
            <div>
              <div className={styles.headerTitle}>Sjøbadet Admin</div>
              <div className={styles.headerSubtitle}>sjobadet.marcusjenshaug.no</div>
            </div>
            <a
              href="https://sjobadet.marcusjenshaug.no"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.externalLink}
            >
              <ExternalLink size={16} />
              <span>Åpne nettsted</span>
            </a>
          </>
        )}
        {collapsed && (
          <div className={styles.headerCollapsed}>
            <div className={styles.logoIcon}>
              <Image
                src="/favicon.ico"
                alt="Sjøbadet"
                width={32}
                height={32}
                priority
              />
            </div>
            <a
              href="https://sjobadet.marcusjenshaug.no"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.externalLinkCollapsed}
              title="Åpne nettsted"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {navSections.map((section) => (
          <div key={section.title} className={styles.navSection}>
            {!collapsed && <div className={styles.navSectionTitle}>{section.title}</div>}
            <ul className={styles.navList}>
              {section.items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.navItem} ${active ? styles.navItemActive : ''} ${collapsed ? styles.navItemCollapsed : ''}`}
                      aria-current={active ? 'page' : undefined}
                      onClick={onClose}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon size={18} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className={styles.userSection}>
        {!collapsed && (
          <>
            <div className={styles.userInfo}>
              <UserAvatar className={styles.userAvatar} />
              <div className={styles.userDetails}>
                <div className={styles.userName}>{userInfo.name}</div>
                <div className={styles.userRole}>{userInfo.role}</div>
              </div>
            </div>
            <form action={logoutAction}>
              <button type="submit" className={styles.logoutButton}>
                Logg ut
              </button>
            </form>
          </>
        )}
        {collapsed && (
          <div title={userInfo.name}>
            <UserAvatar className={styles.userAvatarCollapsed} />
          </div>
        )}
      </div>
    </>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className={styles.container}>
      {/* Desktop Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <AdminSidebar collapsed={sidebarCollapsed} />

        {/* Collapse Toggle Button */}
        <button
          className={styles.collapseButton}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? "Utvid sidebar" : "Kollaps sidebar"}
          title={sidebarCollapsed ? "Utvid sidebar" : "Kollaps sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </aside>

      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <div className={styles.mobileHeaderContent}>
          <div className={styles.headerTitle}>Sjøbadet Admin</div>
          <button
            className={styles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className={styles.mobileOverlay}
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className={styles.mobileDrawer}>
            <AdminSidebar onClose={() => setMobileMenuOpen(false)} />
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className={`${styles.content} ${sidebarCollapsed ? styles.contentExpanded : ''}`}>
        {children}
      </main>
    </div>
  )
}
