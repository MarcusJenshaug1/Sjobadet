'use client'

import { useState } from 'react'
import { Plus, Search, MoreVertical, Edit2, Trash2, Power, Eye, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import styles from '../SubscriptionManager.module.css'
import SubscriptionEditor from './SubscriptionEditor'
import { toggleStatus, deleteSubscription } from '../actions'

interface Subscription {
    id: string
    name: string
    price: number
    period: string
    active: boolean
    features: string
    binding: boolean
    bindingDescription?: string
    description?: string
    sorting: number
    paymentUrl?: string
}

export default function SubscriptionList({ initialSubscriptions }: { initialSubscriptions: Subscription[] }) {
    const [subscriptions, setSubscriptions] = useState(initialSubscriptions)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [editingSub, setEditingSub] = useState<Subscription | null>(null)
    const [search, setSearch] = useState('')
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

    const handleEdit = (sub: Subscription) => {
        setEditingSub(sub)
        setIsDrawerOpen(true)
        setActiveMenuId(null)
    }

    const handleCreate = () => {
        setEditingSub(null)
        setIsDrawerOpen(true)
    }

    const closeDrawer = () => {
        setIsDrawerOpen(false)
        setEditingSub(null)
    }

    const filteredSubs = subscriptions.filter(sub =>
        sub.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        if (!confirm('Er du sikker på at du vil slette dette abonnementet?')) return;
        const formData = new FormData()
        formData.append('id', id)
        await deleteSubscription(formData)
        setActiveMenuId(null)
    }

    const handleToggle = async (sub: Subscription) => {
        await toggleStatus(sub.id, sub.active)
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
                        placeholder="Søk abonnement..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button onClick={handleCreate}>
                    <Plus size={18} style={{ marginRight: '0.5rem' }} />
                    Ny Plan
                </Button>
            </div>

            {/* List */}
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div>Plan</div>
                    <div>Pris</div>
                    <div>Periode</div>
                    <div>Binding</div>
                    <div>Status</div>
                    <div></div>
                </div>
                {filteredSubs.map(sub => (
                    <div
                        key={sub.id}
                        className={styles.tableRow}
                        style={{
                            position: 'relative',
                            zIndex: activeMenuId === sub.id ? 20 : 1
                        }}
                    >
                        <div style={{ fontWeight: 600 }}>{sub.name}</div>
                        <div>{sub.price},-</div>
                        <div style={{ color: '#64748b' }}>{sub.period}</div>
                        <div>
                            {sub.binding ? (
                                <span style={{ fontSize: '0.875rem' }}>
                                    {sub.bindingDescription}
                                </span>
                            ) : (
                                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Ingen</span>
                            )}
                        </div>
                        <div>
                            {sub.active ? (
                                <span className={`${styles.badge} ${styles.badgeActive}`}>Aktiv</span>
                            ) : (
                                <span className={`${styles.badge} ${styles.badgeInactive}`}>Inaktiv</span>
                            )}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setActiveMenuId(activeMenuId === sub.id ? null : sub.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                            >
                                <MoreVertical size={16} color="#64748b" />
                            </button>

                            {activeMenuId === sub.id && (
                                <div style={{
                                    position: 'absolute', right: 0, top: '100%',
                                    background: 'white', border: '1px solid #e2e8f0',
                                    borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                    zIndex: 10, minWidth: '150px', overflow: 'hidden'
                                }}>
                                    <button onClick={() => handleEdit(sub)} style={menuItemStyle}>
                                        <Edit2 size={14} /> Rediger
                                    </button>
                                    <button onClick={() => handleToggle(sub)} style={menuItemStyle}>
                                        <Power size={14} /> {sub.active ? 'Deaktiver' : 'Aktiver'}
                                    </button>
                                    <div style={{ height: '1px', background: '#e2e8f0' }} />
                                    <button onClick={() => handleDelete(sub.id)} style={{ ...menuItemStyle, color: '#ef4444' }}>
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
                                {editingSub ? `Rediger: ${editingSub.name}` : 'Opprett nytt abonnement'}
                            </div>
                            <button className={styles.closeButton} onClick={closeDrawer}>
                                <X size={20} />
                            </button>
                        </div>
                        <SubscriptionEditor sub={editingSub} onClose={closeDrawer} />
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
