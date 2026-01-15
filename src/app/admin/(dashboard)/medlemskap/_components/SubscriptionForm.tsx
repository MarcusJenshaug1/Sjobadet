'use client'

import { Button } from '@/components/ui/Button'
import { saveSubscription, deleteSubscription } from '../actions'
import { useState } from 'react'
import { Trash, Check } from 'lucide-react'

export default function SubscriptionForm({ sub }: { sub?: any }) {
    const [features, setFeatures] = useState<string[]>(sub?.features ? JSON.parse(sub.features) : [])

    const addFeature = () => setFeatures([...features, ''])
    const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index))
    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...features]
        newFeatures[index] = value
        setFeatures(newFeatures)
    }

    return (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#374151' }}>
                {sub ? `Rediger: ${sub.name}` : 'Opprett nytt abonnement'}
            </h3>

            <form action={saveSubscription}>
                {sub && <input type="hidden" name="id" value={sub.id} />}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <LabelInput label="Navn (f.eks 6 mnd binding)" name="name" defaultValue={sub?.name} required />
                    <LabelInput label="Pris (f.eks 445)" name="price" type="number" defaultValue={sub?.price} required />
                    <LabelInput label="Periode (f.eks / mnd)" name="period" defaultValue={sub?.period || '/ mnd'} required />
                    <LabelInput label="Sortering" name="sorting" type="number" defaultValue={sub?.sorting || 0} />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <LabelInput label="Betalingslenke (URL)" name="paymentUrl" defaultValue={sub?.paymentUrl} placeholder="https://..." />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Status</label>
                    <select name="active" defaultValue={sub?.active ? 'true' : 'false'} style={inputStyle}>
                        <option value="true">Aktiv</option>
                        <option value="false">Inaktiv</option>
                    </select>
                </div>

                <div style={{ marginBottom: '1rem', border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                        <input type="checkbox" name="binding" defaultChecked={sub?.binding} />
                        Med Binding
                    </label>
                    <LabelInput label="Beskrivelse av binding (f.eks '6 mnd')" name="bindingDescription" defaultValue={sub?.bindingDescription} placeholder="F.eks: 12 måneder" />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Fordeler / Punkter</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {features.map((feat, index) => (
                            <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <Check size={18} color="green" />
                                <input
                                    style={inputStyle}
                                    value={feat}
                                    onChange={(e) => updateFeature(index, e.target.value)}
                                    placeholder="F.eks: 1 Dropin time per dag"
                                />
                                <button type="button" onClick={() => removeFeature(index)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <Trash size={18} />
                                </button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addFeature} size="sm" style={{ width: 'fit-content' }}>
                            + Legg til punkt
                        </Button>
                        <input type="hidden" name="features" value={JSON.stringify(features.filter(f => f))} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
                    <Button type="submit">{sub ? 'Oppdater' : 'Opprett'}</Button>
                    {sub && (
                        <Button type="submit" formAction={deleteSubscription} variant="secondary" style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none' }}>
                            Slett
                        </Button>
                    )}
                </div>
            </form>
        </div>
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
    marginBottom: '0.25rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
}

const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    fontSize: '0.95rem'
}
