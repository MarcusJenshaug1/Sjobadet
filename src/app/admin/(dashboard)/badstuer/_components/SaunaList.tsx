'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, MoreVertical, Edit2, Trash2, Power, Clock } from 'lucide-react'
import styles from './SaunaList.module.css'
import { toggleSaunaStatus, deleteSauna } from '../actions'
import { formatSmartOpeningHours } from '@/lib/sauna-utils'

interface Sauna {
    id: string
    name: string
    location: string
    status: string
    driftStatus: string
    updatedAt: Date | string
    openingHours?: any[]
    flexibleHours?: boolean
    hoursMessage?: string
    stengeArsak?: string | null
}

export default function SaunaList({ initialSaunas }: { initialSaunas: Sauna[] }) {
    const [saunas, setSaunas] = useState(initialSaunas)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [driftFilter, setDriftFilter] = useState('all')

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [saunaToDelete, setSaunaToDelete] = useState<Sauna | null>(null)
    const [deleteConfirmation, setDeleteConfirmation] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    // Menu State
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    const router = useRouter()

    useEffect(() => {
        setSaunas(initialSaunas)
    }, [initialSaunas])

    // Click outside to close menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuId(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const filteredSaunas = saunas.filter(sauna => {
        const matchesSearch = sauna.name.toLowerCase().includes(search.toLowerCase()) ||
            sauna.location.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === 'all' || sauna.status === statusFilter
        const matchesDrift = driftFilter === 'all' || sauna.driftStatus === driftFilter
        return matchesSearch && matchesStatus && matchesDrift
    })

    const handleDeleteClick = (sauna: Sauna) => {
        setSaunaToDelete(sauna)
        setDeleteModalOpen(true)
        setDeleteConfirmation('')
        setActiveMenuId(null)
    }

    const confirmDelete = async () => {
        if (!saunaToDelete) return
        setIsDeleting(true)
        try {
            await deleteSauna(saunaToDelete.id)
            setDeleteModalOpen(false)
            setSaunaToDelete(null)
        } catch (error) {
            alert('Kunne ikke slette badstue')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleToggleStatus = async (sauna: Sauna) => {
        await toggleSaunaStatus(sauna.id, sauna.status)
        setActiveMenuId(null)
    }

    const getOpeningHoursSummary = (sauna: Sauna) => {
        if (sauna.driftStatus === 'closed') return sauna.stengeArsak || 'Midlertidig stengt'
        if (sauna.flexibleHours) return sauna.hoursMessage || 'Tilgjengelig ved leie'
        return formatSmartOpeningHours(sauna.openingHours)
    }

    return (
        <div>
            <div className={styles.controls}>
                <div className={styles.searchContainer}>
                    <Search className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Søk badstue eller lokasjon..."
                        className={styles.searchInput}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className={styles.filterSelect}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">Alle statuser</option>
                    <option value="active">Aktiv</option>
                    <option value="inactive">Inaktiv</option>
                </select>
                <select
                    className={styles.filterSelect}
                    value={driftFilter}
                    onChange={(e) => setDriftFilter(e.target.value)}
                >
                    <option value="all">Alle driftstatuser</option>
                    <option value="open">Åpen</option>
                    <option value="closed">Midlertidig Stengt</option>
                </select>
            </div>

            <div className={styles.card}>
                <div className={styles.tableHeader}>
                    <div>Badstue</div>
                    <div>Åpningstider</div>
                    <div>Driftstatus</div>
                    <div>Status</div>
                    <div></div>
                </div>

                {filteredSaunas.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                        Ingen badstuer funnet.
                    </div>
                ) : (
                    <div>
                        {filteredSaunas.map(sauna => (
                            <Link href={`/admin/badstuer/${sauna.id}`} key={sauna.id} className={styles.tableRow}>
                                <div className={styles.nameCell}>
                                    <span className={styles.saunaName}>{sauna.name}</span>
                                    <span className={styles.saunaLocation}>{sauna.location}</span>
                                    <span className={styles.lastEdited}>
                                        Endret {new Date(sauna.updatedAt).toLocaleDateString('no-NO')}
                                    </span>
                                </div>
                                <div className={styles.hoursCell}>
                                    {getOpeningHoursSummary(sauna)}
                                </div>
                                <div>
                                    {sauna.driftStatus === 'closed' ? (
                                        <span className={`${styles.badge} ${styles.badgeClosed}`}>Midlertidig Stengt</span>
                                    ) : (
                                        <span className={`${styles.badge} ${styles.badgeActive}`}>Åpen</span>
                                    )}
                                </div>
                                <div>
                                    {sauna.status === 'active' ? (
                                        <span className={`${styles.badge} ${styles.badgeActive}`}>Aktiv</span>
                                    ) : (
                                        <span className={`${styles.badge} ${styles.badgeInactive}`}>Inaktiv</span>
                                    )}
                                </div>
                                <div
                                    className={styles.actionsCell}
                                    onClick={(e) => {
                                        e.preventDefault() // Prevent navigation
                                        e.stopPropagation()
                                    }}
                                >
                                    <div style={{ position: 'relative' }}>
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => setActiveMenuId(activeMenuId === sauna.id ? null : sauna.id)}
                                        >
                                            <MoreVertical size={18} />
                                        </button>

                                        {activeMenuId === sauna.id && (
                                            <div className={styles.menuPopover} ref={menuRef} onMouseLeave={() => setActiveMenuId(null)}>
                                                <Link href={`/admin/badstuer/${sauna.id}`} className={styles.menuItem}>
                                                    <Edit2 size={14} /> Rediger
                                                </Link>
                                                <button className={styles.menuItem} onClick={() => handleToggleStatus(sauna)}>
                                                    <Power size={14} />
                                                    {sauna.status === 'active' ? 'Deaktiver' : 'Aktiver'}
                                                </button>
                                                <button className={styles.menuItem} onClick={() => router.push('/admin/apningstider')}>
                                                    <Clock size={14} /> Åpningstider
                                                </button>
                                                <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />
                                                <button
                                                    className={`${styles.menuItem} ${styles.menuItemDanger}`}
                                                    onClick={() => handleDeleteClick(sauna)}
                                                >
                                                    <Trash2 size={14} /> Slett
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {deleteModalOpen && saunaToDelete && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Slett badstue</h3>
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
                            >
                                &times;
                            </button>
                        </div>
                        <div className={styles.modalContent}>
                            <p className={styles.modalText}>
                                Er du sikker på at du vil slette <strong>{saunaToDelete.name}</strong>?
                                Dette kan ikke angres.
                                <br /><br />
                                Skriv <strong>{saunaToDelete.name}</strong> for å bekrefte.
                            </p>
                            <input
                                type="text"
                                className={styles.modalInput}
                                placeholder="Skriv navnet her..."
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setDeleteModalOpen(false)}
                            >
                                Avbryt
                            </button>
                            <button
                                className={styles.deleteButton}
                                disabled={deleteConfirmation !== saunaToDelete.name || isDeleting}
                                onClick={confirmDelete}
                            >
                                {isDeleting ? 'Sletter...' : 'Slett badstue'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
