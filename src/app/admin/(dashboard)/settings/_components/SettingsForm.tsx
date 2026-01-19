'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { saveSettings } from '../actions'
import { Save, AlertTriangle, Check, Undo } from 'lucide-react'

interface SettingsFormProps {
    initialSettings: Record<string, string>
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [settings, setSettings] = useState(initialSettings)
    const [isDirty, setIsDirty] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target

        let newValue = value
        if (type === 'checkbox') {
            // @ts-ignore
            newValue = e.target.checked ? 'true' : 'false'
        }

        setSettings(prev => ({ ...prev, [name]: newValue }))
        setIsDirty(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setMessage('')

        const formData = new FormData()
        Object.entries(settings).forEach(([key, val]) => {
            formData.append(key, val)
        })

        try {
            await saveSettings(formData)
            setIsDirty(false)
            setMessage('Endringer lagret!')
            setTimeout(() => setMessage(''), 3000)
        } catch (error) {
            setMessage('Feil ved lagring.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleReset = () => {
        setSettings(initialSettings)
        setIsDirty(false)
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Alert Bar Section */}
            <section style={sectionStyle}>
                <h2 style={sectionTitleStyle}>
                    <AlertTriangle size={20} className="text-amber-500" />
                    Varslingslinje (Topp)
                </h2>
                <p style={sectionDescStyle}>Vises øverst på alle sider hvis aktivert.</p>

                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            name="alert_enabled"
                            checked={settings['alert_enabled'] === 'true'}
                            onChange={handleChange}
                            style={{ width: '1.25rem', height: '1.25rem' }}
                        />
                        <span style={{ fontWeight: '500' }}>Aktiver varslingslinje</span>
                    </label>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Varslingsmelding</label>
                    <textarea
                        name="alert_text"
                        value={settings['alert_text'] || ''}
                        onChange={handleChange}
                        placeholder="F.eks. 'Vi holder stengt i romjulen. Velkommen tilbake 2. januar!'"
                        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    />
                </div>
            </section>

            {/* Contact Info Section */}
            <section style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Kontaktinformasjon</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div>
                        <label style={labelStyle}>E-post</label>
                        <input
                            type="email"
                            name="contact_email"
                            value={settings['contact_email'] || ''}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Telefon</label>
                        <input
                            type="text"
                            name="contact_phone"
                            value={settings['contact_phone'] || ''}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                    <label style={labelStyle}>Adresse / Lokasjon (Hovedkontor)</label>
                    <input
                        type="text"
                        name="contact_address"
                        value={settings['contact_address'] || ''}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </div>
            </section>

            {/* Social Media Section */}
            <section style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Sosiale Medier</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div>
                        <label style={labelStyle}>Instagram URL</label>
                        <input
                            type="url"
                            name="social_instagram"
                            value={settings['social_instagram'] || ''}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="https://instagram.com/..."
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Facebook URL</label>
                        <input
                            type="url"
                            name="social_facebook"
                            value={settings['social_facebook'] || ''}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="https://facebook.com/..."
                        />
                    </div>
                </div>
            </section>

            {/* Sticky Save Bar */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'white', borderTop: '1px solid #e2e8f0', padding: '1rem 2rem',
                transform: isDirty ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 0.3s ease-out',
                zIndex: 50,
                display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem',
                boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.05)'
            }}>
                <div style={{ marginRight: 'auto', fontWeight: 600, color: '#f59e0b' }}>
                    • Ulagrede endringer
                </div>
                {message && <span style={{ color: '#16a34a', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> {message}</span>}
                <Button type="button" variant="outline" onClick={handleReset}>
                    <Undo size={16} style={{ marginRight: '0.5rem' }} />
                    Angre
                </Button>
                <Button type="submit" disabled={isSaving}>
                    <Save size={16} style={{ marginRight: '0.5rem' }} />
                    {isSaving ? 'Lagrer...' : 'Lagre endringer'}
                </Button>
            </div>

            {/* Spacer for sticky bar */}
            {isDirty && <div style={{ height: '80px' }} />}
        </form>
    )
}

const sectionStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0'
}

const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
}

const sectionDescStyle = {
    fontSize: '0.875rem',
    color: '#64748b',
    marginBottom: '1.5rem',
    marginLeft: '2rem'
}

const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#334155'
}

const inputStyle = {
    width: '100%',
    padding: '0.625rem',
    borderRadius: '0.375rem',
    border: '1px solid #cbd5e1',
    fontSize: '0.9375rem',
    backgroundColor: '#fff'
}
