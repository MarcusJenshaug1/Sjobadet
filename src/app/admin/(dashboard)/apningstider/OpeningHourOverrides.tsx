'use client'

import { useMemo, useState } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import {
    createOpeningHourOverride,
    deleteOpeningHourOverride,
    updateOpeningHourOverride
} from './actions'

interface OpeningHourOverride {
    id: string
    saunaId: string
    date: string
    opens?: string | null
    closes?: string | null
    active: boolean
    note?: string | null
}

interface SaunaWithOverrides {
    id: string
    name: string
    openingHourOverrides: OpeningHourOverride[]
}

type OverrideDraft = {
    date: string
    active: boolean
    opens: string
    closes: string
    note: string
}

export default function OpeningHourOverrides({ saunas }: { saunas: SaunaWithOverrides[] }) {
    const initialOverrides = useMemo(() => {
        return saunas.reduce<Record<string, OpeningHourOverride[]>>((acc, sauna) => {
            acc[sauna.id] = [...sauna.openingHourOverrides]
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            return acc
        }, {})
    }, [saunas])

    const [overridesBySauna, setOverridesBySauna] = useState(initialOverrides)
    const [draftBySauna, setDraftBySauna] = useState<Record<string, OverrideDraft>>(() =>
        saunas.reduce<Record<string, OverrideDraft>>((acc, sauna) => {
            acc[sauna.id] = { date: '', active: true, opens: '07:00', closes: '21:00', note: '' }
            return acc
        }, {})
    )

    const updateDraft = (saunaId: string, patch: Partial<OverrideDraft>) => {
        setDraftBySauna((prev) => ({
            ...prev,
            [saunaId]: { ...prev[saunaId], ...patch }
        }))
    }

    const updateOverrideState = (saunaId: string, id: string, patch: Partial<OpeningHourOverride>) => {
        setOverridesBySauna((prev) => ({
            ...prev,
            [saunaId]: prev[saunaId].map((override) =>
                override.id === id ? { ...override, ...patch } : override
            )
        }))
    }

    const handleCreate = async (saunaId: string) => {
        const draft = draftBySauna[saunaId]
        const result = await createOpeningHourOverride(saunaId, {
            date: draft.date,
            active: draft.active,
            opens: draft.active ? draft.opens : null,
            closes: draft.active ? draft.closes : null,
            note: draft.note || null,
        })

        if (!result.success || !result.override) {
            alert(result.error || 'Kunne ikke lagre avvik')
            return
        }

        setOverridesBySauna((prev) => ({
            ...prev,
            [saunaId]: [...prev[saunaId], result.override].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        }))

        updateDraft(saunaId, { date: '', note: '' })
    }

    const handleSave = async (saunaId: string, override: OpeningHourOverride) => {
        const result = await updateOpeningHourOverride(override.id, {
            date: override.date,
            active: override.active,
            opens: override.active ? override.opens ?? '' : null,
            closes: override.active ? override.closes ?? '' : null,
            note: override.note || null,
        })

        if (!result.success || !result.override) {
            alert(result.error || 'Kunne ikke oppdatere avvik')
            return
        }

        updateOverrideState(saunaId, override.id, result.override)
    }

    const handleDelete = async (saunaId: string, id: string) => {
        const result = await deleteOpeningHourOverride(id)
        if (!result.success) {
            alert(result.error || 'Kunne ikke slette avvik')
            return
        }

        setOverridesBySauna((prev) => ({
            ...prev,
            [saunaId]: prev[saunaId].filter((override) => override.id !== id)
        }))
    }

    return (
        <div style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Avvikende åpningstider</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                Bruk denne seksjonen for dager som ikke følger ukesplanen.
            </p>

            {saunas.map((sauna) => {
                const overrides = overridesBySauna[sauna.id] || []
                const draft = draftBySauna[sauna.id]

                return (
                    <div key={sauna.id} style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.75rem',
                        padding: '1.25rem',
                        marginBottom: '1.5rem',
                        background: 'white'
                    }}>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.75rem' }}>{sauna.name}</div>

                        {overrides.length === 0 ? (
                            <div style={{ color: '#94a3b8', marginBottom: '1rem' }}>Ingen registrerte avvik.</div>
                        ) : (
                            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
                                {overrides.map((override) => (
                                    <div key={override.id} style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '0.75rem',
                                        alignItems: 'center',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        background: '#f8fafc'
                                    }}>
                                        <input
                                            type="date"
                                            value={override.date.slice(0, 10)}
                                            onChange={(e) => updateOverrideState(sauna.id, override.id, { date: e.target.value })}
                                            style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', minWidth: '140px' }}
                                        />
                                        <select
                                            value={override.active ? 'open' : 'closed'}
                                            onChange={(e) => updateOverrideState(sauna.id, override.id, { active: e.target.value === 'open' })}
                                            style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', minWidth: '120px' }}
                                        >
                                            <option value="open">Åpen</option>
                                            <option value="closed">Stengt</option>
                                        </select>
                                        {override.active ? (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input
                                                    type="time"
                                                    value={override.opens ?? ''}
                                                    onChange={(e) => updateOverrideState(sauna.id, override.id, { opens: e.target.value })}
                                                    style={{ padding: '0.4rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', minWidth: '96px' }}
                                                />
                                                <input
                                                    type="time"
                                                    value={override.closes ?? ''}
                                                    onChange={(e) => updateOverrideState(sauna.id, override.id, { closes: e.target.value })}
                                                    style={{ padding: '0.4rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', minWidth: '96px' }}
                                                />
                                            </div>
                                        ) : (
                                            <div style={{ color: '#ef4444', fontWeight: 600 }}>Stengt</div>
                                        )}
                                        <input
                                            type="text"
                                            placeholder="Notat (valgfritt)"
                                            value={override.note ?? ''}
                                            onChange={(e) => updateOverrideState(sauna.id, override.id, { note: e.target.value })}
                                            style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', minWidth: '200px', flex: '1 1 200px' }}
                                        />
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                            <button
                                                onClick={() => handleSave(sauna.id, override)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    padding: '0.4rem 0.6rem',
                                                    borderRadius: '0.5rem',
                                                    border: '1px solid #93c5fd',
                                                    background: '#eff6ff',
                                                    color: '#1d4ed8',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Save size={14} />
                                                Lagre
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sauna.id, override.id)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    padding: '0.4rem 0.6rem',
                                                    borderRadius: '0.5rem',
                                                    border: '1px solid #fecaca',
                                                    background: '#fef2f2',
                                                    color: '#b91c1c',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Trash2 size={14} />
                                                Slett
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{
                            borderTop: '1px solid #e2e8f0',
                            paddingTop: '1rem',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                            alignItems: 'center'
                        }}>
                            <input
                                type="date"
                                value={draft.date}
                                onChange={(e) => updateDraft(sauna.id, { date: e.target.value })}
                                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', minWidth: '140px' }}
                            />
                            <select
                                value={draft.active ? 'open' : 'closed'}
                                onChange={(e) => updateDraft(sauna.id, { active: e.target.value === 'open' })}
                                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', minWidth: '120px' }}
                            >
                                <option value="open">Åpen</option>
                                <option value="closed">Stengt</option>
                            </select>
                            {draft.active ? (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="time"
                                        value={draft.opens}
                                        onChange={(e) => updateDraft(sauna.id, { opens: e.target.value })}
                                        style={{ padding: '0.4rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', minWidth: '96px' }}
                                    />
                                    <input
                                        type="time"
                                        value={draft.closes}
                                        onChange={(e) => updateDraft(sauna.id, { closes: e.target.value })}
                                        style={{ padding: '0.4rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', minWidth: '96px' }}
                                    />
                                </div>
                            ) : (
                                <div style={{ color: '#ef4444', fontWeight: 600 }}>Stengt</div>
                            )}
                            <input
                                type="text"
                                placeholder="Notat (valgfritt)"
                                value={draft.note}
                                onChange={(e) => updateDraft(sauna.id, { note: e.target.value })}
                                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', minWidth: '200px', flex: '1 1 200px' }}
                            />
                            <button
                                onClick={() => handleCreate(sauna.id)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    padding: '0.45rem 0.7rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #0ea5e9',
                                    background: '#e0f2fe',
                                    color: '#0c4a6e',
                                    cursor: 'pointer'
                                }}
                            >
                                <Plus size={14} />
                                Legg til
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
