'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { X, Check, Trash, Plus, GripVertical, AlertCircle } from 'lucide-react'
import styles from '../SubscriptionManager.module.css'
import { saveSubscription } from '../actions'

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

interface SubscriptionEditorProps {
    sub?: Subscription | null
    onClose: () => void
}

export default function SubscriptionEditor({ sub, onClose }: SubscriptionEditorProps) {
    const isNew = !sub
    const [name, setName] = useState(sub?.name || '')
    const [price, setPrice] = useState(sub?.price || 0)
    const [period, setPeriod] = useState(sub?.period || '/ mnd')
    const [active, setActive] = useState(sub?.active ?? false)
    const [binding, setBinding] = useState(sub?.binding ?? false)
    const [bindingDescription, setBindingDescription] = useState(sub?.bindingDescription || '')
    const [paymentUrl, setPaymentUrl] = useState(sub?.paymentUrl || '')
    const [sorting, setSorting] = useState(sub?.sorting || 0)

    // Features with drag and drop
    const initialFeatures = sub?.features ? JSON.parse(sub.features) : []
    const [features, setFeatures] = useState<string[]>(initialFeatures)

    // To track dirty state
    const [isDirty, setIsDirty] = useState(false)
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null)

    const handleDirty = () => setIsDirty(true)

    const addFeature = () => {
        setFeatures([...features, ''])
        handleDirty()
    }

    const removeFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index))
        handleDirty()
    }

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...features]
        newFeatures[index] = value
        setFeatures(newFeatures)
        handleDirty()
    }

    // Drag and Drop handlers
    const onDragStart = (e: React.DragEvent, index: number) => {
        setDraggedItemIndex(index)
        e.dataTransfer.effectAllowed = "move"
    }

    const onDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        if (draggedItemIndex === null || draggedItemIndex === index) return

        const newFeatures = [...features]
        const draggedItem = newFeatures[draggedItemIndex]
        newFeatures.splice(draggedItemIndex, 1)
        newFeatures.splice(index, 0, draggedItem)

        setFeatures(newFeatures)
        setDraggedItemIndex(index)
        handleDirty()
    }

    const onDragEnd = () => {
        setDraggedItemIndex(null)
    }

    return (
        <div className={styles.drawerContent}>
            <form action={async (formData) => {
                await saveSubscription(formData)
                onClose()
            }} onChange={handleDirty}>
                {sub && <input type="hidden" name="id" value={sub.id} />}

                {/* Basic Info */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Navn på abonnement</label>
                    <input
                        className={styles.input}
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="F.eks. Årskort, Månedskort..."
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Pris (NOK)</label>
                        <div className={styles.currencyInput}>
                            <span className={styles.currencyPrefix}>kr</span>
                            <input
                                type="number"
                                className={`${styles.input} ${styles.inputCurrency}`}
                                name="price"
                                value={price}
                                onChange={(e) => setPrice(parseFloat(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Periode</label>
                        <select
                            className={styles.input}
                            name="period"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                        >
                            <option value="/ mnd">Per måned (/ mnd)</option>
                            <option value="/ år">Per år (/ år)</option>
                            <option value="">Ingen periode (Engangs)</option>
                        </select>
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Betalingslenke (URL)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            className={styles.input}
                            name="paymentUrl"
                            value={paymentUrl}
                            onChange={(e) => setPaymentUrl(e.target.value)}
                            placeholder="https://..."
                        />
                        {paymentUrl && (
                            <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
                                <Button type="button" variant="outline" style={{ height: '100%' }}>Åpne</Button>
                            </a>
                        )}
                    </div>
                </div>

                {/* Binding Logic */}
                <div style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', marginBottom: '1.5rem', background: '#f8fafc' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: binding ? '1rem' : 0 }}>
                        <input
                            type="checkbox"
                            name="binding"
                            checked={binding}
                            onChange={(e) => { setBinding(e.target.checked); handleDirty() }}
                        />
                        Med Bindingstid
                    </label>

                    {binding && (
                        <div style={{ animation: 'fadeIn 0.2s' }}>
                            <label className={styles.label}>Bindingstid og beskrivelse</label>
                            <select
                                className={styles.input}
                                style={{ marginBottom: '0.75rem' }}
                                value={bindingDescription} // Use state to control inputs strictly if needed, simplified here
                                onChange={(e) => { setBindingDescription(e.target.value); handleDirty() }}
                            >
                                <option value="">Velg standard...</option>
                                <option value="6 måneders binding">6 mnd binding</option>
                                <option value="12 måneders binding">12 mnd binding</option>
                            </select>
                            <input
                                className={styles.input}
                                name="bindingDescription"
                                value={bindingDescription}
                                onChange={(e) => setBindingDescription(e.target.value)}
                                placeholder="Eller skriv egen (f.eks '3 mnd binding')"
                            />
                        </div>
                    )}
                </div>

                {/* Features */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Fordeler (Det kunden får)</label>
                    <div className={styles.featuresList}>
                        {features.map((feat, index) => (
                            <div
                                key={index}
                                className={styles.featureItem}
                                draggable
                                onDragStart={(e) => onDragStart(e, index)}
                                onDragOver={(e) => onDragOver(e, index)}
                                onDragEnd={onDragEnd}
                                style={{ opacity: draggedItemIndex === index ? 0.5 : 1 }}
                            >
                                <div style={{ cursor: 'grab', color: '#94a3b8' }}><GripVertical size={16} /></div>
                                <Check size={16} className="text-green-600" />
                                <input
                                    className={styles.input}
                                    style={{ padding: '0.4rem 0.5rem', fontSize: '0.875rem' }}
                                    value={feat}
                                    onChange={(e) => updateFeature(index, e.target.value)}
                                    placeholder="F.eks. Fri tilgang til badstue"
                                />
                                <button type="button" onClick={() => removeFeature(index)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <Trash size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addFeature} style={{ marginTop: '0.5rem' }}>
                        <Plus size={14} style={{ marginRight: '0.25rem' }} /> Legg til fordel
                    </Button>
                    <input type="hidden" name="features" value={JSON.stringify(features.filter(f => f.trim()))} />
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Sortering & Status</label>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <label className={styles.label}>Status</label>
                            <select
                                className={styles.input}
                                name="active"
                                value={active ? 'true' : 'false'}
                                onChange={(e) => setActive(e.target.value === 'true')}
                            >
                                <option value="true">Aktiv</option>
                                <option value="false">Inaktiv (Skjult)</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className={styles.label}>Rekkefølge</label>
                            <input
                                type="number"
                                className={styles.input}
                                name="sorting"
                                value={sorting}
                                onChange={(e) => setSorting(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                {/* Sticky Bar */}
                {isDirty && (
                    <div className={styles.stickyBar} style={{ position: 'sticky', bottom: '-2rem', margin: '0 -2rem -2rem -2rem', boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: 'auto' }}>
                            <AlertCircle size={16} /> Ulagrede endringer
                        </span>
                        <Button type="button" variant="outline" onClick={onClose}>Avbryt</Button>
                        <Button type="submit">Lagre endringer</Button>
                    </div>
                )}

                {!isDirty && (
                    <div className={styles.stickyBar} style={{ position: 'sticky', bottom: '-2rem', margin: '0 -2rem -2rem -2rem', borderTop: 'none' }}>
                        <Button type="button" variant="secondary" onClick={onClose}>Lukk</Button>
                        <Button type="submit">Lagre</Button>
                    </div>
                )}

            </form>
        </div>
    )
}
