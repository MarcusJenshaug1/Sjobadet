'use client'

import { Button } from '@/components/ui/Button'
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

    useEffect(() => {
        setIsMounted(true)
        if (!id && !sauna) {
            setId(crypto.randomUUID())
        }
    }, [id, sauna])

    const [description, setDescription] = useState(sauna?.description || '')

    const onChange = useCallback((value: string) => {
        setDescription(value);
    }, []);

    const facilitiesString = sauna?.facilities ? JSON.parse(sauna.facilities).join('\n') : ''

    return (
        <form action={saveSauna} style={{ maxWidth: '800px', backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="isNew" value={isNew ? 'true' : 'false'} />

            {!isMounted && <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>Laster skjema...</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <LabelInput label="Navn" name="name" defaultValue={sauna?.name} required />
                <LabelInput label="Slug (URL)" name="slug" defaultValue={sauna?.slug} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <LabelInput label="Lokasjon" name="location" defaultValue={sauna?.location} required />
                <LabelInput label="Sortering (Tall)" name="sorting" type="number" defaultValue={sauna?.sorting ?? 0} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Status</label>
                <select name="status" defaultValue={sauna?.status ?? 'active'} style={inputStyle}>
                    <option value="active">Aktiv</option>
                    <option value="inactive">Inaktiv</option>
                </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <LabelInput label="Kort beskrivelse" name="shortDescription" defaultValue={sauna?.shortDescription} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Beskrivelse (Markdown)</label>
                <div className="prose-editor">
                    <SimpleMDE
                        value={description}
                        onChange={onChange}
                        options={{
                            spellChecker: false,
                            placeholder: 'Skriv beskrivelse her...',
                            status: false,
                        }}
                    />
                    <input type="hidden" name="description" value={description} />
                </div>
            </div>

            <div style={{ marginBottom: '2rem', border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Bilder</h3>
                <SaunaMediaManager
                    saunaId={id}
                    initialAssets={sauna?.mediaAssets || []}
                />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Fasiliteter (En per linje)</label>
                <textarea name="facilities" defaultValue={facilitiesString} style={{ ...inputStyle, minHeight: '100px' }} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '2rem 0 1rem' }}>Booking & Kapasitet</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <LabelInput label="Kapasitet Drop-in" name="capacityDropin" type="number" defaultValue={sauna?.capacityDropin} />
                <LabelInput label="Kapasitet Privat" name="capacityPrivat" type="number" defaultValue={sauna?.capacityPrivat} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <LabelInput label="Booking URL Drop-in (Knapp på siden)" name="bookingUrlDropin" defaultValue={sauna?.bookingUrlDropin} />
                <LabelInput label="Booking URL Privat (Knapp på siden)" name="bookingUrlPrivat" defaultValue={sauna?.bookingUrlPrivat} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <LabelInput label="Ledighet-skraping URL Drop-in (Periode.no)" name="bookingAvailabilityUrlDropin" defaultValue={sauna?.bookingAvailabilityUrlDropin} />
                <LabelInput label="Ledighet-skraping URL Privat (Periode.no)" name="bookingAvailabilityUrlPrivat" defaultValue={sauna?.bookingAvailabilityUrlPrivat} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <LabelInput label="Adresse" name="address" defaultValue={sauna?.address} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '2rem 0 1rem', color: '#2563eb' }}>Åpningstider</h3>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #dbeafe', borderRadius: '0.5rem', backgroundColor: '#eff6ff' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 600 }}>
                    <input type="checkbox" name="flexibleHours" defaultChecked={sauna?.flexibleHours} />
                    Fleksible åpningstider (f.eks. kun ved leie)
                </label>
                <LabelInput
                    label="Melding om åpningstider (vises i stedet for faste tider)"
                    name="hoursMessage"
                    defaultValue={sauna?.hoursMessage}
                    placeholder="F.eks: Tilgjengelig ved leie - kontakt oss for booking"
                />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '2rem 0 1rem', color: '#dc2626' }}>Driftstatus / Stenging</h3>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #fee2e2', borderRadius: '0.5rem', backgroundColor: '#fef2f2' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Driftstatus</label>
                    <select name="driftStatus" defaultValue={sauna?.driftStatus ?? 'open'} style={inputStyle}>
                        <option value="open">Åpen</option>
                        <option value="closed">Midlertidig Stengt</option>
                    </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <LabelInput label="Stengeårsak" name="stengeArsak" defaultValue={sauna?.stengeArsak} />
                    <LabelInput label="Kundemelding (Vises på siden)" name="kundeMelding" defaultValue={sauna?.kundeMelding} />
                </div>
            </div>

            <Button type="submit" size="lg">Lagre Badstue</Button>
        </form>
    )
}

function LabelInput({ label, style, ...props }: any) {
    return (
        <div style={style}>
            <label style={labelStyle}>{label}</label>
            <input style={inputStyle} {...props} />
        </div>
    )
}

const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
}

const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    fontSize: '1rem'
}
