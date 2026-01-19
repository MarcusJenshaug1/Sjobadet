'use client'

import { useState, useMemo, useEffect } from 'react'
import {
    Search, Filter, Copy, ExternalLink, Trash2, Info, X,
    CheckCircle, AlertCircle, Image as ImageIcon, LayoutGrid, List,
    ChevronDown, ArrowUpDown, Layers, Link as LinkIcon
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { MediaItem, deleteMediaFile, listMediaItems } from '../actions'
import styles from '../../brukere/UserManager.module.css'

interface MediaGridProps {
    initialItems: MediaItem[]
}

type ViewMode = 'grid' | 'list'
type SortField = 'newest' | 'oldest' | 'name' | 'size'

export default function MediaGrid({ initialItems }: MediaGridProps) {
    const [items, setItems] = useState(initialItems)
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [isGrouped, setIsGrouped] = useState(true)
    const [loading, setLoading] = useState(false)

    // Filters
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [usageFilter, usageSetFilter] = useState('all')
    const [sortBy, setSortBy] = useState<SortField>('newest')

    // Selection
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
    const [deleting, setDeleting] = useState(false)

    // Re-fetch when grouping changes
    useEffect(() => {
        const refresh = async () => {
            setLoading(true)
            try {
                const newItems = await listMediaItems(isGrouped)
                setItems(newItems)
            } catch (err) {
                console.error("Failed to re-fetch items:", err)
            } finally {
                setLoading(false)
            }
        }
        refresh()
    }, [isGrouped])

    const categories = useMemo(() => {
        const dirs = new Set<string>()
        items.forEach(item => {
            const parts = item.path.split('/')
            if (parts.length > 1) dirs.add(parts[0])
            else dirs.add('root')
        })
        return Array.from(dirs).sort()
    }, [items])

    const processedItems = useMemo(() => {
        let filtered = items.filter(item => {
            const matchesSearch = item.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = categoryFilter === 'all' ||
                (categoryFilter === 'root' ? !item.path.includes('/') : item.path.startsWith(categoryFilter + '/'))
            const matchesUsage = usageFilter === 'all' ||
                (usageFilter === 'in-use' ? !!item.inUseBy : !item.inUseBy)

            return matchesSearch && matchesCategory && matchesUsage
        })

        // Sorting
        return filtered.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
            if (sortBy === 'oldest') return new Date(a.updated_at || 0).getTime() - new Date(b.updated_at || 0).getTime()
            if (sortBy === 'name') return a.name.localeCompare(b.name)
            if (sortBy === 'size') return (b.size || 0) - (a.size || 0)
            return 0
        })
    }, [items, searchTerm, categoryFilter, usageFilter, sortBy])

    const handleDelete = async (item: MediaItem) => {
        if (!window.confirm(`Er du sikker på at du vil slette ${isGrouped && item.variants ? 'denne bilde-gruppen' : 'dette bildet'} permanent?`)) return

        setDeleting(true)
        try {
            await deleteMediaFile(item.id, isGrouped)
            setItems(prev => prev.filter(i => i.id !== item.id))
            setSelectedItem(null)
        } catch (err: any) {
            alert('Feil ved sletting: ' + err.message)
        } finally {
            setDeleting(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert('Kopiert til utklippstavle!')
    }

    const formatSize = (bytes?: number) => {
        if (!bytes) return 'Ukjent'
        const kb = bytes / 1024
        if (kb < 1024) return `${kb.toFixed(1)} KB`
        return `${(kb / 1024).toFixed(1)} MB`
    }

    return (
        <div>
            {/* Toolbar */}
            <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'sticky',
                top: '1rem',
                zIndex: 50,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                        <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                        <input
                            className={styles.input}
                            style={{ paddingLeft: '2.5rem', margin: 0, width: '100%' }}
                            placeholder="Søk i filnavn eller sti..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <select
                            className={styles.input}
                            style={{ margin: 0, width: 'auto', paddingRight: '2rem' }}
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">Alle mapper</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            className={styles.input}
                            style={{ margin: 0, width: 'auto' }}
                            value={usageFilter}
                            onChange={e => usageSetFilter(e.target.value)}
                        >
                            <option value="all">Bruk (Alle)</option>
                            <option value="in-use">I bruk</option>
                            <option value="unused">Ubrukt</option>
                        </select>

                        <select
                            className={styles.input}
                            style={{ margin: 0, width: 'auto' }}
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as SortField)}
                        >
                            <option value="newest">Nyest først</option>
                            <option value="oldest">Eldst først</option>
                            <option value="name">Filnavn (A-Å)</option>
                            <option value="size">Størrelse</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1px', background: '#e2e8f0', borderRadius: '0.5rem', padding: '2px' }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            style={{
                                padding: '0.5rem',
                                background: viewMode === 'grid' ? 'white' : 'transparent',
                                border: 'none',
                                borderRadius: '0.4rem',
                                cursor: 'pointer',
                                color: viewMode === 'grid' ? '#2563eb' : '#64748b',
                                display: 'flex', alignItems: 'center'
                            }}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{
                                padding: '0.5rem',
                                background: viewMode === 'list' ? 'white' : 'transparent',
                                border: 'none',
                                borderRadius: '0.4rem',
                                cursor: 'pointer',
                                color: viewMode === 'list' ? '#2563eb' : '#64748b',
                                display: 'flex', alignItems: 'center'
                            }}
                        >
                            <List size={18} />
                        </button>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        background: isGrouped ? '#eff6ff' : '#f8fafc',
                        border: `1px solid ${isGrouped ? '#bfdbfe' : '#e2e8f0'}`,
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: isGrouped ? '#2563eb' : '#64748b'
                    }} onClick={() => setIsGrouped(!isGrouped)}>
                        <Layers size={16} />
                        Gruppér varianter
                        <div style={{
                            width: '2rem', height: '1.1rem', background: isGrouped ? '#2563eb' : '#cbd5e1',
                            borderRadius: '1rem', position: 'relative', transition: '0.2s'
                        }}>
                            <div style={{
                                position: 'absolute', top: '2px', left: isGrouped ? 'calc(100% - 16px)' : '2px',
                                width: '12px', height: '12px', background: 'white', borderRadius: '50%', transition: '0.2s'
                            }} />
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
                    <div className={styles.spinner} style={{ margin: '0 auto 1rem' }}></div>
                    <p>Henter bilder...</p>
                </div>
            ) : processedItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8', background: 'white', borderRadius: '1rem', border: '1px dashed #cbd5e1' }}>
                    <ImageIcon size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                    <p style={{ fontSize: '1.1rem' }}>Ingen bilder funnet med valgte filtre.</p>
                </div>
            ) : viewMode === 'grid' ? (
                /* Grid View */
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {processedItems.map(item => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            style={{
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '1rem',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                position: 'relative'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-4px)'
                                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{ height: '180px', background: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
                                <img
                                    src={item.url}
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />

                                <div style={{
                                    position: 'absolute', top: '0.75rem', right: '0.75rem',
                                    display: 'flex', gap: '0.4rem', flexDirection: 'column', alignItems: 'flex-end'
                                }}>
                                    {item.inUseBy ? (
                                        <div style={{
                                            background: '#dcfce7', color: '#166534',
                                            padding: '0.25rem 0.6rem', borderRadius: '1rem',
                                            fontSize: '0.7rem', fontWeight: 700,
                                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}>
                                            <CheckCircle size={10} /> I bruk
                                        </div>
                                    ) : (
                                        <div style={{
                                            background: '#f1f5f9', color: '#64748b',
                                            padding: '0.25rem 0.6rem', borderRadius: '1rem',
                                            fontSize: '0.7rem', fontWeight: 600,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}>
                                            Ubrukt
                                        </div>
                                    )}

                                    {isGrouped && item.variants && (
                                        <div style={{
                                            background: '#eff6ff', color: '#1e40af',
                                            padding: '0.25rem 0.6rem', borderRadius: '1rem',
                                            fontSize: '0.7rem', fontWeight: 800,
                                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                            border: '1px solid #bfdbfe'
                                        }}>
                                            <Layers size={10} /> +{item.variants.length}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ padding: '1rem' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {item.name}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <span style={{
                                        background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', fontSize: '0.65rem'
                                    }}>
                                        {item.path.includes('/') ? item.path.split('/')[0] : 'root'}
                                    </span>
                                    <span>•</span>
                                    <span>{formatSize(item.size)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '1rem', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>Fil</th>
                                <th style={{ padding: '1rem' }}>Mappe</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Brukt av</th>
                                <th style={{ padding: '1rem' }}>Størrelse</th>
                                <th style={{ padding: '1rem' }}>Sist endret</th>
                                <th style={{ padding: '1rem' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {processedItems.map(item => (
                                <tr
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: '0.1s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '0.4rem', overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                                                <img src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div style={{ fontWeight: 600, color: '#1e293b' }}>
                                                {item.name}
                                                {isGrouped && item.variants && (
                                                    <span style={{ color: '#2563eb', fontSize: '0.7rem', marginLeft: '0.5rem' }}>(+{item.variants.length} varianter)</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#64748b' }}>
                                        {item.path.includes('/') ? item.path.split('/')[0] : 'root'}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {item.inUseBy ? (
                                            <span style={{ background: '#dcfce7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>I bruk</span>
                                        ) : (
                                            <span style={{ background: '#f1f5f9', color: '#64748b', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>Ubrukt</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', color: '#1e293b', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.inUseBy ? item.inUseBy[0].name : '-'}
                                        {item.inUseBy && item.inUseBy.length > 1 && ` (+${item.inUseBy.length - 1})`}
                                    </td>
                                    <td style={{ padding: '1rem', color: '#64748b' }}>{formatSize(item.size)}</td>
                                    <td style={{ padding: '1rem', color: '#64748b' }}>
                                        {item.updated_at ? new Date(item.updated_at).toLocaleDateString('no-NO') : '-'}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedItem(item)
                                            }}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                                        >
                                            <ChevronDown size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail Drawer */}
            {selectedItem && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end', animation: 'fadeIn 0.2s' }}
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        style={{ width: '550px', background: 'white', height: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '-4px 0 20px rgba(0,0,0,0.1)', overflowY: 'auto' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Bildedetaljer</h2>
                            <button onClick={() => setSelectedItem(null)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.5rem', borderRadius: '50%' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc', height: '350px', position: 'relative' }}>
                            <img src={selectedItem.url} alt={selectedItem.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filnavn</label>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>{selectedItem.name}</div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full sti</label>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                                    <code style={{ fontSize: '0.85rem', background: '#f1f5f9', color: '#475569', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {selectedItem.path}
                                    </code>
                                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(selectedItem.path)} title="Kopier sti">
                                        <Copy size={14} />
                                    </Button>
                                </div>
                            </div>

                            {selectedItem.inUseBy && (
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Brukt av</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                                        {selectedItem.inUseBy.map((usage, idx) => (
                                            <a
                                                key={idx}
                                                href={usage.type === 'sauna' ? `/admin/badstuer/${usage.id}` : (usage.type === 'user' ? '/admin/brukere' : '#')}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none',
                                                    fontSize: '0.9rem', color: '#1e293b', background: '#f0f9ff', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid #e0f2fe',
                                                    transition: '0.2s'
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#e0f2fe'}
                                                onMouseLeave={e => e.currentTarget.style.background = '#f0f9ff'}
                                            >
                                                <div style={{ background: '#0284c7', color: 'white', padding: '0.4rem', borderRadius: '0.4rem', display: 'flex' }}>
                                                    {usage.type === 'sauna' ? <ImageIcon size={14} /> : (usage.type === 'user' ? <CheckCircle size={14} /> : <LinkIcon size={14} />)}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600 }}>{usage.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#0369a1' }}>{usage.context || (usage.type === 'sauna' ? 'Badstue' : 'System')}</div>
                                                </div>
                                                <ExternalLink size={14} color="#0284c7" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {isGrouped && selectedItem.variants && selectedItem.variants.length > 0 && (
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Varianter</label>
                                    <div style={{ marginTop: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden' }}>
                                        {selectedItem.variants.map((variant, idx) => (
                                            <div key={idx} style={{
                                                padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem',
                                                borderBottom: idx === selectedItem.variants!.length - 1 ? 'none' : '1px solid #e2e8f0',
                                                background: 'white'
                                            }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '0.25rem', overflow: 'hidden', flexShrink: 0 }}>
                                                    <img src={variant.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div style={{ flex: 1, fontSize: '0.85rem' }}>
                                                    <div style={{ fontWeight: 600, color: '#475569' }}>{variant.name}</div>
                                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{formatSize(variant.size)}</div>
                                                </div>
                                                <button onClick={() => copyToClipboard(variant.path)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }} title="Kopier sti">
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!selectedItem.inUseBy && (
                                <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '1.25rem', borderRadius: '0.75rem', display: 'flex', gap: '0.75rem' }}>
                                    <AlertCircle size={20} color="#d97706" style={{ flexShrink: 0 }} />
                                    <div style={{ fontSize: '0.9rem', color: '#92400e', lineHeight: '1.4' }}>
                                        <div style={{ fontWeight: 700 }}>Ikke i bruk</div>
                                        Denne filen ser ikke ut til å være i bruk av noen badstuer eller brukere. Den kan trolig slettes trygt.
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                            <Button
                                variant="outline"
                                style={{ flex: 1 }}
                                onClick={() => window.open(selectedItem.url, '_blank')}
                            >
                                <ExternalLink size={16} style={{ marginRight: '0.5rem' }} /> Full bilde
                            </Button>
                            <Button
                                variant="danger"
                                style={{ flex: 1 }}
                                disabled={deleting}
                                onClick={() => handleDelete(selectedItem)}
                            >
                                <Trash2 size={16} style={{ marginRight: '0.5rem' }} /> Slett {isGrouped && selectedItem.variants ? 'gruppe' : ''}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    )
}
