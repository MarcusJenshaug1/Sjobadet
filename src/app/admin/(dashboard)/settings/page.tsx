import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/Button'
import { saveSettings, clearPublicCaches } from './actions'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
    const settings = await prisma.siteSetting.findMany()
    const settingsMap = settings.reduce((acc: Record<string, string>, curr: any) => {
        acc[curr.key] = curr.value
        return acc
    }, {} as Record<string, string>)

    const getVal = (key: string) => settingsMap[key] || ''

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Innstillinger</h1>

            <form action={clearPublicCaches} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', background: '#f8fafc' }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem', color: '#0f172a' }}>Tøm cache for public sider</h2>
                    <p style={{ fontSize: '0.9rem', color: '#475569' }}>Aktive badstuer og detaljer caches i ca. 10 min. Ledighet har egen 5-min cache. Trykk for å tvinge ny data nå.</p>
                </div>
                <Button type="submit" variant="secondary">Tøm cache nå</Button>
            </form>

            <form action={saveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>

                {/* Alert Bar Section */}
                <section style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>Varslingslinje (Topp)</h2>
                    <p style={sectionDescStyle}>Vises øverst på alle sider hvis aktivert.</p>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <input type="hidden" name="alert_enabled" value="false" />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="alert_enabled"
                                value="true"
                                defaultChecked={getVal('alert_enabled') === 'true'}
                                style={{ width: '1.25rem', height: '1.25rem' }}
                            />
                            <span style={{ fontWeight: '500' }}>Aktiver varslingslinje</span>
                        </label>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Varslingsmelding</label>
                        <textarea
                            name="alert_text"
                            defaultValue={getVal('alert_text')}
                            placeholder="F.eks. 'Vi holder stengt i romjulen. Velkommen tilbake 2. januar!'"
                            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                        />
                    </div>
                </section>

                {/* Contact Info Section */}
                <section style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>Kontaktinformasjon</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={labelStyle}>E-post</label>
                            <input
                                type="email"
                                name="contact_email"
                                defaultValue={getVal('contact_email')}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Telefon</label>
                            <input
                                type="text"
                                name="contact_phone"
                                defaultValue={getVal('contact_phone')}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                        <label style={labelStyle}>Adresse / Lokasjon (Hovedkontor)</label>
                        <input
                            type="text"
                            name="contact_address"
                            defaultValue={getVal('contact_address')}
                            style={inputStyle}
                        />
                    </div>
                </section>

                {/* Social Media Section */}
                <section style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>Sosiale Medier</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={labelStyle}>Instagram URL</label>
                            <input
                                type="url"
                                name="social_instagram"
                                defaultValue={getVal('social_instagram')}
                                style={inputStyle}
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Facebook URL</label>
                            <input
                                type="url"
                                name="social_facebook"
                                defaultValue={getVal('social_facebook')}
                                style={inputStyle}
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                    </div>
                </section>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '2rem' }}>
                    <Button type="submit" size="lg">Lagre alle innstillinger</Button>
                </div>
            </form>
        </div>
    )
}

const sectionStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    border: '1px solid #e5e7eb'
}

const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#111827'
}

const sectionDescStyle = {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1.5rem'
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
    padding: '0.625rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    backgroundColor: '#f9fafb'
}
