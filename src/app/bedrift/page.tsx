import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Metadata } from 'next';
import { getGlobalSettings } from '@/lib/sauna-service';
import nextDynamic from 'next/dynamic';

const Footer = nextDynamic(() => import('@/components/layout/Footer').then(mod => mod.Footer));
const Briefcase = nextDynamic(() => import('lucide-react').then(mod => mod.Briefcase));

export const metadata: Metadata = {
    title: 'Bedriftsmedlemskap | Sjøbadet Badstue',
    description: 'Bedriftsavtale for badstue i Tønsberg.',
};

export default async function CorporatePage() {
    const settings = await getGlobalSettings();
    const phone = settings['contact_phone'] || '+47 401 55 365';
    const email = settings['contact_email'] || 'booking@sjobadet.com';

    return (
        <>
            <Header />
            <main className="container" style={{ padding: '6rem 1rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    maxWidth: '700px',
                    width: '100%',
                    padding: '3rem',
                }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Briefcase size={40} />
                        Bedriftsmedlemskap
                    </h1>

                    <p style={{ fontSize: '1.25rem', color: '#555', marginBottom: '3rem' }}>
                        Vi jobber med et eget tilbud for bedrifter. Ta kontakt for forespørsel.
                    </p>

                    <div style={{
                        backgroundColor: '#F8F9FA',
                        padding: '2rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Kontakt oss</h2>
                        <p style={{ marginBottom: '1rem' }}>
                            <strong>Telefon:</strong> <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
                        </p>
                        <p style={{ marginBottom: '2rem' }}>
                            <strong>E-post:</strong> <a href={`mailto:${email}`}>{email}</a>
                        </p>

                        <form action={`mailto:${email}`} method="post" encType="text/plain" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Navn</label>
                                <input type="text" name="name" required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>E-post</label>
                                <input type="email" name="email" required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Melding</label>
                                <textarea name="message" rows={4} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}></textarea>
                            </div>
                            <Button type="submit">Send forespørsel</Button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
