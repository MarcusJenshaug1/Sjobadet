'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { SubmitButton } from './SubmitButton'
import { saveSauna } from '../actions'
import { useState, useCallback, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import 'easymde/dist/easymde.min.css'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })

import { SaunaMediaManager } from '@/components/admin/SaunaMediaManager'

export default function SaunaForm({ sauna }: { sauna?: any }) {
    const [id, setId] = useState(sauna?.id || '')
    const [isMounted, setIsMounted] = useState(false)
    const isNew = !sauna

    // Form State
    const [isDirty, setIsDirty] = useState(false)
    const [status, setStatus] = useState(sauna?.status || 'active')
    const [driftStatus, setDriftStatus] = useState(sauna?.driftStatus || 'open')

    // Facilities State
    const initialFacilities = sauna?.facilities ? JSON.parse(sauna.facilities) : []
    const [facilities, setFacilities] = useState<string[]>(initialFacilities)
    const [facilityInput, setFacilityInput] = useState('')

    // Description
    const [description, setDescription] = useState(sauna?.description || '')
    const onDescriptionChange = useCallback((value: string) => {
        setDescription(value);
        setIsDirty(true)
    }, []);

    // Accordion State
    const [sections, setSections] = useState({
        basic: true,
        content: true,
        images: true,
        seo: false,
        booking: true,
        address: true,
        hours: true,
        status: true
    })

    const toggleSection = (key: keyof typeof sections) => {
        setSections(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleFormChange = () => {
        setIsDirty(true)
    }

    useEffect(() => {
        setIsMounted(true)
        if (!id && !sauna) {
            setId(crypto.randomUUID())
        }
    }, [id, sauna])

    // Facilities Handlers
    const addFacility = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (facilityInput.trim()) {
                setFacilities([...facilities, facilityInput.trim()])
                setFacilityInput('')
                setIsDirty(true)
            }
        }
    }

    const removeFacility = (index: number) => {
        const newFacilities = [...facilities]
        newFacilities.splice(index, 1)
        setFacilities(newFacilities)
        setIsDirty(true)
    }

    // Slug Generator
    const generateSlug = (name: string) => {
        return name.toLowerCase()
            .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
            .replace(/[\s+]/g, '-') // Replace spaces with -
            .replace(/[^a-z0-9-]/g, '') // Remove invalid chars
    }

    return (
        <form action={saveSauna} onChange={handleFormChange}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="isNew" value={isNew ? 'true' : 'false'} />

            {!isMounted && <div style={{ padding: '1rem' }}>Laster skjema...</div>}

            <div className={styles.layout}>
                {/* Main Content Column */}
                <div className={styles.mainColumn}>

                    {/* 1. Basic Info */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader} onClick={() => toggleSection('basic')}>
                            <span>Grunninfo</span>
                            <ChevronDown style={{ transform: sections.basic ? 'rotate(180deg)' : 'rotate(0)' }} />
                        </div>
                        <div className={`${styles.sectionBody} ${!sections.basic && styles.sectionBodyHidden}`}>
                            <div className={styles.fieldGroup}>
                                <LabelInput label="Navn" name="name" defaultValue={sauna?.name} required placeholder="F.eks. Tønsberg Brygge" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className={styles.fieldGroup}>
                                    <LabelInput label="Slug (URL - autogenereres)" name="slug" defaultValue={sauna?.slug} required placeholder="tonsberg-brygge" />
                                </div>
                                <div className={styles.fieldGroup}>
                                    <LabelInput label="Lokasjon" name="location" defaultValue={sauna?.location} required placeholder="Tønsberg" />
                                </div>
                            </div>
                            <div className={styles.fieldGroup}>
                                <LabelInput label="Rekkefølge" name="sorting" type="number" defaultValue={sauna?.sorting ?? 0} />
                                <div className={styles.helperText}>Lavest tall vises først i lister (f.eks. 0, 1, 2)</div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Content */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader} onClick={() => toggleSection('content')}>
                            <span>Innhold</span>
                            <ChevronDown style={{ transform: sections.content ? 'rotate(180deg)' : 'rotate(0)' }} />
                        </div>
                        <div className={`${styles.sectionBody} ${!sections.content && styles.sectionBodyHidden}`}>
                            <div className={styles.fieldGroup}>
                                <LabelInput label="Kort beskrivelse" name="shortDescription" defaultValue={sauna?.shortDescription} placeholder="Vises i kortoversikter" />
                            </div>
                            <div className={styles.fieldGroup} onClick={(e) => e.stopPropagation() /* Prevent close when clicking markdown tools */}>
                                <label className={styles.label}>Beskrivelse (Markdown)</label>
                                <SimpleMDE
                                    value={description}
                                    onChange={onDescriptionChange}
                                    options={{
                                        spellChecker: false,
                                        placeholder: 'Skriv full beskrivelse her...',
                                        status: false,
                                        minHeight: '200px'
                                    }}
                                />
                                <input type="hidden" name="description" value={description} />
                            </div>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Fasiliteter</label>
                                <div className={styles.chipsContainer} onClick={() => document.getElementById('facilityInput')?.focus()}>
                                    {facilities.map((fac, i) => (
                                        <div key={i} className={styles.chip}>
                                            {fac}
                                            <button type="button" className={styles.chipRemove} onClick={() => removeFacility(i)}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <input
                                        id="facilityInput"
                                        type="text"
                                        className={styles.chipInput}
                                        placeholder={facilities.length === 0 ? "Skriv og trykk Enter..." : ""}
                                        value={facilityInput}
                                        onChange={(e) => setFacilityInput(e.target.value)}
                                        onKeyDown={addFacility}
                                    />
                                </div>
                                <input type="hidden" name="facilities" value={facilities.join('\n')} />
                                <div className={styles.helperText}>Skriv inn en fasilitet og trykk Enter for å legge til.</div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Images */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader} onClick={() => toggleSection('images')}>
                            <span>Bilder</span>
                            <ChevronDown style={{ transform: sections.images ? 'rotate(180deg)' : 'rotate(0)' }} />
                        </div>
                        <div className={`${styles.sectionBody} ${!sections.images && styles.sectionBodyHidden}`}>
                            <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                                Anbefalt hovedbilde format: 16:9 breddeformat (minst 1600px bredde).
                            </div>
                            <SaunaMediaManager
                                saunaId={id}
                                initialAssets={sauna?.mediaAssets || []}
                            />
                        </div>
                    </div>

                    {/* 3b. SEO & Social */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader} onClick={() => toggleSection('seo')}>
                            <span>SEO & Nettsted (Link Preview)</span>
                            <ChevronDown style={{ transform: sections.seo ? 'rotate(180deg)' : 'rotate(0)' }} />
                        </div>
                        <div className={`${styles.sectionBody} ${!sections.seo && styles.sectionBodyHidden}`}>
                            <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                                Her kan du overstyre hvordan badstuen ser ut når den deles på sosiale medier eller dukker opp i Google-søk.
                            </p>
                            <div className={styles.fieldGroup}>
                                <LabelInput
                                    label="SEO Tittel (Meta Title)"
                                    name="seoTitle"
                                    defaultValue={sauna?.seoTitle}
                                    placeholder={sauna?.name}
                                    maxLength={60}
                                />
                                <div className={styles.helperText}>Optimal lengde: 50-60 tegn. La stå tom for å bruke badstuens navn.</div>
                            </div>
                            <div className={styles.fieldGroup}>
                                <LabelInput
                                    label="SEO Beskrivelse (Meta Description)"
                                    name="seoDescription"
                                    defaultValue={sauna?.seoDescription}
                                    placeholder={sauna?.shortDescription}
                                    maxLength={160}
                                />
                                <div className={styles.helperText}>Optimal lengde: 120-160 tegn. La stå tom for å bruke den korte beskrivelsen.</div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Booking & Capacity */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader} onClick={() => toggleSection('booking')}>
                            <span>Booking & Kapasitet</span>
                            <ChevronDown style={{ transform: sections.booking ? 'rotate(180deg)' : 'rotate(0)' }} />
                        </div>
                        <div className={`${styles.sectionBody} ${!sections.booking && styles.sectionBodyHidden}`}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <LabelInput label="Kapasitet Drop-in" name="capacityDropin" type="number" defaultValue={sauna?.capacityDropin} />
                                <LabelInput label="Kapasitet Privat" name="capacityPrivat" type="number" defaultValue={sauna?.capacityPrivat} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.25rem' }}>
                                <div className={styles.fieldGroup}>
                                    <LabelInput label="Booking URL (Drop-in)" name="bookingUrlDropin" defaultValue={sauna?.bookingUrlDropin} placeholder="https://..." />
                                </div>
                                <div className={styles.fieldGroup}>
                                    <LabelInput label="Booking URL (Privat)" name="bookingUrlPrivat" defaultValue={sauna?.bookingUrlPrivat} placeholder="https://..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. Address */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader} onClick={() => toggleSection('address')}>
                            <span>Adresse</span>
                            <ChevronDown style={{ transform: sections.address ? 'rotate(180deg)' : 'rotate(0)' }} />
                        </div>
                        <div className={`${styles.sectionBody} ${!sections.address && styles.sectionBodyHidden}`}>
                            <LabelInput label="Gateadresse" name="address" defaultValue={sauna?.address} placeholder="Storgaten 1, 3126 Tønsberg" />
                        </div>
                    </div>

                    {/* 6. Opening Hours Logic */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader} onClick={() => toggleSection('hours')}>
                            <span>Åpningstider</span>
                            <ChevronDown style={{ transform: sections.hours ? 'rotate(180deg)' : 'rotate(0)' }} />
                        </div>
                        <div className={`${styles.sectionBody} ${!sections.hours && styles.sectionBodyHidden}`}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Type åpningstider</label>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input type="radio" name="hoursType" value="fixed" defaultChecked={!sauna?.flexibleHours} />
                                        Faste (administreres separat)
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <input type="radio" name="hoursType" value="flexible" defaultChecked={sauna?.flexibleHours} />
                                        Fleksible (tekstbasert)
                                    </label>
                                </div>
                                {/* Hidden input to map to existing backend field */}
                                {/* Logic: if "flexible" selected -> flexibleHours=true. We need to handle this in JS or form submission */}
                                {/* Since we use native form submit, we can use a script or just name inputs creatively */}
                            </div>

                            {/* We use specific names and handle radio logic visually, or just simplify */}
                            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                                        <input type="checkbox" name="flexibleHours" defaultChecked={sauna?.flexibleHours} />
                                        Aktiver fleksible åpningstider
                                    </label>
                                    <div className={styles.helperText}>
                                        Hvis aktivert, vises teksten under i stedet for de faste åpningstidene.
                                    </div>
                                </div>
                                <LabelInput
                                    label="Melding om åpningstider"
                                    name="hoursMessage"
                                    defaultValue={sauna?.hoursMessage}
                                    placeholder="F.eks: Tilgjengelig ved leie - kontakt oss for booking"
                                />
                            </div>

                            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <Link href="/admin/apningstider" target="_blank">
                                    <Button type="button" variant="outline" size="sm">
                                        <Clock size={14} style={{ marginRight: '0.5rem' }} />
                                        Administrer faste åpningstider
                                    </Button>
                                </Link>
                                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Åpnes i ny fane</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Column (Status Panel) */}
                <div className={styles.sideColumn}>
                    <div className={styles.statusPanel}>
                        <div className={styles.statusRow}>
                            <label className={styles.label} style={{ marginBottom: 0 }}>Status</label>
                            <select
                                name="status"
                                value={status}
                                onChange={(e) => { setStatus(e.target.value); setIsDirty(true) }}
                                style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
                            >
                                <option value="active">Aktiv</option>
                                <option value="inactive">Inaktiv</option>
                            </select>
                        </div>

                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                            <label className={styles.label}>Driftstatus</label>
                            <select
                                name="driftStatus"
                                value={driftStatus}
                                onChange={(e) => { setDriftStatus(e.target.value); setIsDirty(true) }}
                                className={styles.input}
                            >
                                <option value="open">Åpen</option>
                                <option value="closed">Midlertidig Stengt</option>
                            </select>

                            {driftStatus === 'closed' && (
                                <div className={styles.warningBox}>
                                    <div className={styles.fieldGroup}>
                                        <LabelInput label="Stengeårsak" name="stengeArsak" defaultValue={sauna?.stengeArsak} placeholder="Vedlikehold" />
                                    </div>
                                    <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                                        <LabelInput label="Kundemelding" name="kundeMelding" defaultValue={sauna?.kundeMelding} placeholder="Vi holder stengt for..." />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                            <div className={styles.helperText}>
                                Sist lagret: {sauna?.updatedAt ? new Date(sauna.updatedAt).toLocaleString('no-NO') : 'Aldri'}
                            </div>
                        </div>
                    </div>

                    <div className={styles.section} style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <LabelInput label="Innebygd kart URL (valgfri)" name="mapEmbedUrl" defaultValue={sauna?.mapEmbedUrl} placeholder="https://maps.google..." />
                            <div className={styles.helperText}>La stå tom for å autogenerere fra adresse.</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Action Bar */}
            <div className={`${styles.stickyBar} ${isDirty ? styles.stickyBarVisible : ''}`}>
                <div className={styles.stickyBarContent}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ea580c' }}>
                            • Ulagrede endringer
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Button type="button" variant="outline" onClick={() => window.location.reload()}>
                            Angre endringer
                        </Button>
                        <SubmitButton size="default">Lagre endringer</SubmitButton>
                    </div>
                </div>
            </div>
        </form>
    )
}

import { ChevronDown, X, Clock } from 'lucide-react'
import styles from '../SaunaFormLayout.module.css'

function LabelInput({ label, className, ...props }: any) {
    return (
        <div>
            <label className={`${styles.label} ${props.required ? styles.labelRequired : ''}`}>{label}</label>
            <input className={styles.input} {...props} />
        </div>
    )
}
