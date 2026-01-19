'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { saveSettings } from '../actions'
import { Save, AlertTriangle, Check, Undo, Mail, Phone, MapPin, Instagram, Facebook, Globe } from 'lucide-react'
import styles from './SettingsForm.module.css'

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
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* Alert Bar Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <AlertTriangle size={20} className="text-amber-500" />
                    Varslingslinje (Topp)
                </h2>
                <p className={styles.sectionDesc}>Vises øverst på alle sider hvis aktivert. Bruk denne for viktige meldinger til kundene.</p>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            name="alert_enabled"
                            checked={settings['alert_enabled'] === 'true'}
                            onChange={handleChange}
                            className={styles.checkbox}
                        />
                        <span className={styles.checkboxLabel}>Aktiver varslingslinje</span>
                    </label>
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Varslingsmelding</label>
                    <textarea
                        name="alert_text"
                        value={settings['alert_text'] || ''}
                        onChange={handleChange}
                        placeholder="F.eks. 'Vi holder stengt i romjulen. Velkommen tilbake 2. januar!'"
                        className={styles.textarea}
                        rows={3}
                    />
                </div>
            </section>

            {/* Contact Info Section */}
            <section className={styles.section}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'var(--secondary)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                        <Globe size={20} color="var(--primary)" />
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Kontaktinformasjon</h2>
                </div>

                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label className={styles.label}>
                            <Mail size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />
                            E-post
                        </label>
                        <input
                            type="email"
                            name="contact_email"
                            value={settings['contact_email'] || ''}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>
                            <Phone size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />
                            Telefon
                        </label>
                        <input
                            type="text"
                            name="contact_phone"
                            value={settings['contact_phone'] || ''}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.field} style={{ marginTop: '1.5rem' }}>
                    <label className={styles.label}>
                        <MapPin size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />
                        Adresse / Lokasjon (Hovedkontor)
                    </label>
                    <input
                        type="text"
                        name="contact_address"
                        value={settings['contact_address'] || ''}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
            </section>

            {/* Social Media Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Sosiale Medier</h2>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label className={styles.label}>
                            <Instagram size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />
                            Instagram URL
                        </label>
                        <input
                            type="url"
                            name="social_instagram"
                            value={settings['social_instagram'] || ''}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="https://instagram.com/..."
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>
                            <Facebook size={14} style={{ display: 'inline', marginRight: '0.375rem' }} />
                            Facebook URL
                        </label>
                        <input
                            type="url"
                            name="social_facebook"
                            value={settings['social_facebook'] || ''}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="https://facebook.com/..."
                        />
                    </div>
                </div>
            </section>

            {/* Floating Action Bar */}
            <div className={`${styles.stickyFooter} ${isDirty ? styles.footerVisible : ''}`}>
                <div className={styles.dirtyStatus}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                    Ulagrede endringer
                </div>

                <div className={styles.actions}>
                    {message && (
                        <span className={styles.message}>
                            <Check size={18} />
                            {message}
                        </span>
                    )}
                    <Button type="button" variant="outline" onClick={handleReset}>
                        <Undo size={16} style={{ marginRight: '0.5rem' }} />
                        Angre
                    </Button>
                    <Button type="submit" disabled={isSaving} style={{ borderRadius: '0.75rem', padding: '0.625rem 1.25rem' }}>
                        <Save size={18} style={{ marginRight: '0.5rem' }} />
                        {isSaving ? 'Lagrer...' : 'Lagre endringer'}
                    </Button>
                </div>
            </div>
        </form>
    )
}
