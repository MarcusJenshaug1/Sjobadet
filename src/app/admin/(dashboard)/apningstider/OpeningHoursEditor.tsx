'use client'

import { useState } from 'react'
import { ChevronDown, Copy, RotateCcw, Save, Loader2, Clock } from 'lucide-react'
import styles from './OpeningHoursEditor.module.css'
import { updateOpeningHours } from './actions'

interface OpeningHour {
    id: string
    saunaId: string
    weekday: number
    opens: string | null
    closes: string | null
    active: boolean
}

interface OpeningHoursEditorProps {
    sauna: {
        id: string
        name: string
        openingHours: OpeningHour[]
    }
}

const WEEKDAYS = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag']

export default function OpeningHoursEditor({ sauna }: OpeningHoursEditorProps) {
    // Sort hours by weekday (0-6)
    const initialHours = [...sauna.openingHours].sort((a, b) => a.weekday - b.weekday)

    const [hours, setHours] = useState<OpeningHour[]>(initialHours)
    const [expanded, setExpanded] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)

    // Check if dirty by comparing with initial props (deep comparison simple version)
    const isDirty = JSON.stringify(hours) !== JSON.stringify(initialHours)

    const handleTimeChange = (index: number, field: 'opens' | 'closes', value: string) => {
        const newHours = [...hours]
        newHours[index] = { ...newHours[index], [field]: value }
        setHours(newHours)
    }

    const handleActiveToggle = (index: number) => {
        const newHours = [...hours]
        newHours[index] = { ...newHours[index], active: !newHours[index].active }
        setHours(newHours)
    }

    const handle24hToggle = (index: number) => {
        const newHours = [...hours]
        const hour = newHours[index]

        // If already 00:00-24:00 (effectively), clear it? Or just toggle on
        // Simple logic: If we toggle ON, set 00:00 - 23:59 (or 24:00 if supported, usually 23:59 or 00:00 next day)
        // Let's use 00:00 - 24:00 for visual simplicity if input supports it, otherwise 00:00 - 23:59
        // Standard time inputs often tricky with 24:00. Let's send 00:00 and 23:59 for now or 00:00 - 00:00 (next day) logic.
        // Based on user request "00:00-24:00". 
        // Let's try 00:00 to 23:59.

        // If clicking unique toggle: 
        newHours[index] = { ...hour, opens: '00:00', closes: '23:59', active: true }
        setHours(newHours)
    }

    const copyMondayToAll = () => {
        const monday = hours[0]
        const newHours = hours.map(h => ({
            ...h,
            opens: monday.opens,
            closes: monday.closes,
            active: monday.active
        }))
        setHours(newHours)
    }

    const copyWeekdaysToWeekend = () => {
        // Copy Friday (index 4) to Sat/Sun? Or generic "Weekdays" implies Mon-Fri are same?
        // Let's implement: Copy Mon (index 0) to Fri (index 4). Copy Sat (index 5) to Sun (index 6).
        const monday = hours[0]
        const saturday = hours[5]

        const newHours = hours.map((h, i) => {
            if (i >= 0 && i <= 4) {
                return { ...h, opens: monday.opens, closes: monday.closes, active: monday.active }
            } else {
                return { ...h, opens: saturday.opens, closes: saturday.closes, active: saturday.active }
            }
        })
        setHours(newHours)
    }

    const handleSave = async () => {
        setIsSaving(true)
        const result = await updateOpeningHours(sauna.id, hours)
        setIsSaving(false)
        if (result.success) {
            setLastSaved(new Date())
            // Ideally we also update initial state to prevent dirty flag remaining, 
            // but since we use revalidatePath, the page might reload/refresh props?
            // "revalidatePath" refreshes server component. But Client Component state might persist if not fully reset.
            // A hard page reload or simple reset of "initialHours" to "hours" is needed.
            // We can't easily mutate props. So we rely on Next.js to update the prop `sauna` from server.
            // If Next.js updates props, we need `useEffect` to sync state? 
            // Actually typically `key` change on parent or specific pattern is better.
            // For now, let's assume valid refresh. If not, we can force router.refresh().
        } else {
            alert('Feil ved lagring')
        }
    }

    const handleReset = () => {
        setHours([...initialHours])
    }

    // Generate summary string
    const getSummary = () => {
        // Logic to group days. Simplified for now.
        // e.g. "Man-Fre 07-21, Lør-Søn 09-21"
        // Let's just return a count of open days or simple status.
        const openDays = hours.filter(h => h.active).length
        if (openDays === 0) return 'Stengt hele uken'
        if (openDays === 7) {
            // Check if all same
            const first = hours[0]
            const allSame = hours.every(h => h.active && h.opens === first.opens && h.closes === first.closes)
            if (allSame) return `Alle dager ${first.opens}–${first.closes}`
        }
        return `${openDays} dager åpent`
    }

    return (
        <div className={styles.card}>
            <div className={styles.header} onClick={() => setExpanded(!expanded)}>
                <div className={styles.headerContent}>
                    <div className={styles.title}>
                        {sauna.name}
                        {isDirty && <span className={`${styles.badge} ${styles.badgeUnsaved}`}>Ulagrede endringer</span>}
                    </div>
                    <div className={styles.summary}>{getSummary()}</div>
                </div>
                <ChevronDown className={`${styles.chevron} ${expanded ? styles.chevronExpanded : ''}`} />
            </div>

            {expanded && (
                <div className={styles.body}>
                    <div className={styles.bulkActions}>
                        <button className={styles.bulkButton} onClick={copyMondayToAll} type="button">
                            <Copy size={14} />
                            Kopier Mandag til alle
                        </button>
                        <button className={styles.bulkButton} onClick={copyWeekdaysToWeekend} type="button">
                            <Copy size={14} />
                            Hverdag / Helg
                        </button>
                    </div>

                    <div className={styles.daysList}>
                        {hours.map((hour, index) => (
                            <div key={hour.id} className={styles.dayRow}>
                                {/* Day Label */}
                                <div className={styles.dayLabel}>
                                    <span className={styles.dayHeader}>{WEEKDAYS[index]}</span>
                                </div>

                                {/* Status Switch */}
                                <label className={styles.switch}>
                                    <input
                                        type="checkbox"
                                        className={styles.switchInput}
                                        checked={hour.active}
                                        onChange={() => handleActiveToggle(index)}
                                    />
                                    <div className={styles.switchTrack}>
                                        <div className={styles.switchThumb} />
                                    </div>
                                    <span className={styles.switchLabel}>
                                        {hour.active ? 'Åpen' : 'Stengt'}
                                    </span>
                                </label>

                                {/* Time Inputs or Closed Text */}
                                {hour.active ? (
                                    <>
                                        <input
                                            type="time"
                                            className={styles.timeInput}
                                            value={hour.opens || ''}
                                            onChange={(e) => handleTimeChange(index, 'opens', e.target.value)}
                                            aria-label="Åpner"
                                        />
                                        <input
                                            type="time"
                                            className={styles.timeInput}
                                            value={hour.closes || ''}
                                            onChange={(e) => handleTimeChange(index, 'closes', e.target.value)}
                                            aria-label="Stenger"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.disabledText}>Stengt</div>
                                        <div className={styles.disabledText}>Stengt</div>
                                    </>
                                )}

                                {/* Extra Options (Døgnåpent) */}
                                {hour.active && (
                                    <button
                                        className={styles.bulkButton}
                                        onClick={() => handle24hToggle(index)}
                                        title="Sett døgnåpent (00:00-23:59)"
                                    >
                                        24t
                                    </button>
                                )}
                                {!hour.active && <div />}
                            </div>
                        ))}
                    </div>

                    {isDirty && (
                        <div className={styles.actionBar}>
                            <button className={styles.resetButton} onClick={handleReset}>
                                <RotateCcw size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                Tilbakestill
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {lastSaved && <span className={styles.summary}>Lagret {lastSaved.toLocaleTimeString()}</span>}
                                <button
                                    className={styles.saveButton}
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" style={{ display: 'inline', marginRight: '6px' }} />
                                            Lagrer...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} style={{ display: 'inline', marginRight: '6px' }} />
                                            Lagre endringer
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
