'use client'

import { useState } from 'react'
import { Plus, Search, MoreVertical, Edit2, Trash2, Shield, Power, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import styles from '../UserManager.module.css'
import UserEditor from './UserEditor'
import { deleteUser } from '../actions'

interface User {
    id: string
    username: string
    avatarUrl?: string | null
    role: string
    createdAt: Date
}

export default function UserList({ initialUsers }: { initialUsers: User[] }) {
    const [users, setUsers] = useState(initialUsers)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [search, setSearch] = useState('')
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

    const handleEdit = (user: User) => {
        setEditingUser(user)
        setIsDrawerOpen(true)
        setActiveMenuId(null)
    }

    const handleCreate = () => {
        setEditingUser(null)
        setIsDrawerOpen(true)
    }

    const closeDrawer = () => {
        setIsDrawerOpen(false)
        setEditingUser(null)
        // Ideally re-fetch or use router.refresh() here, handled by parent/action revalidate usually
    }

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = async (user: User) => {
        const confirmName = prompt(`For å slette brukeren "${user.username}", vennligst skriv brukernavnet for å bekrefte:`)
        if (confirmName !== user.username) {
            if (confirmName !== null) alert('Feil brukernavn, sletting avbrutt.')
            return
        }

        try {
            await deleteUser(user.id)
            setActiveMenuId(null)
        } catch (error: any) {
            alert(error?.message || 'Kunne ikke slette bruker')
        }
    }

    const handleDeactivate = (user: User) => {
        alert("Deaktivering er ikke tilgjengelig enda (krever database-oppdatering). \n\nDu kan endre passordet for å stenge tilgang.")
        setActiveMenuId(null)
    }

    return (
        <div className={styles.container}>

            {/* Controls */}
            <div className={styles.controls}>
                <div style={{ flex: 1, position: 'relative', minWidth: '300px' }}>
                    <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', width: '1.25rem' }} />
                    <input
                        className={styles.input}
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="Søk på brukernavn..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {/* Optional Filters could go here */}
                <Button onClick={handleCreate}>
                    <Plus size={18} style={{ marginRight: '0.5rem' }} />
                    Ny bruker
                </Button>
            </div>

            {/* List */}
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div>Brukernavn</div>
                    <div>Rolle</div>
                    <div>Status</div>
                    <div>Opprettet</div>
                    <div></div>
                </div>
                {filteredUsers.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                        Ingen brukere funnet.
                    </div>
                ) : filteredUsers.map(user => (
                    <div
                        key={user.id}
                        className={styles.tableRow}
                        style={{
                            position: 'relative',
                            zIndex: activeMenuId === user.id ? 20 : 1
                        }}
                    >
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{
                                width: '2rem', height: '2rem', borderRadius: '50%',
                                background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#64748b', fontSize: '0.75rem', fontWeight: 700,
                                overflow: 'hidden'
                            }}>
                                {user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.username}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    user.username.substring(0, 2).toUpperCase()
                                )}
                            </div>
                            {user.username}
                        </div>
                        <div>
                            <span className={`${styles.badge} ${user.role === 'demo' ? styles.badgeDemo : styles.badgeAdmin}`}>
                                {user.role === 'demo' ? 'Demo' : 'Administrator'}
                            </span>
                        </div>
                        <div>
                            <span className={`${styles.badge} ${styles.badgeActive}`}>Aktiv</span>
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
                            {new Date(user.createdAt).toLocaleDateString('no-NO')}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setActiveMenuId(activeMenuId === user.id ? null : user.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                            >
                                <MoreVertical size={16} color="#64748b" />
                            </button>

                            {activeMenuId === user.id && (
                                <div style={{
                                    position: 'absolute', right: 0, top: '100%',
                                    background: 'white', border: '1px solid #e2e8f0',
                                    borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                    zIndex: 10, minWidth: '160px', overflow: 'hidden'
                                }}>
                                    <button onClick={() => handleEdit(user)} style={menuItemStyle}>
                                        <Edit2 size={14} /> Rediger
                                    </button>
                                    <div style={{ height: '1px', background: '#e2e8f0' }} />
                                    <button onClick={() => handleDeactivate(user)} style={{ ...menuItemStyle, color: '#f59e0b' }}>
                                        <Power size={14} /> Deaktiver
                                    </button>
                                    <button onClick={() => handleDelete(user)} style={{ ...menuItemStyle, color: '#ef4444' }}>
                                        <Trash2 size={14} /> Slett
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Drawer */}
            {isDrawerOpen && (
                <>
                    <div className={styles.overlay} onClick={closeDrawer} />
                    <div className={styles.drawer}>
                        <div className={styles.drawerHeader}>
                            <div className={styles.drawerTitle}>
                                {editingUser ? `Rediger bruker` : 'Ny bruker'}
                            </div>
                            <button className={styles.closeButton} onClick={closeDrawer}>
                                <X size={20} />
                            </button>
                        </div>
                        <UserEditor user={editingUser} onClose={closeDrawer} />
                    </div>
                </>
            )}
        </div>
    )
}

const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'white',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left' as const,
    fontSize: '0.875rem',
    color: '#475569'
}
