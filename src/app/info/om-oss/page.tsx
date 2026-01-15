import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Metadata } from 'next';
import { getActiveSaunas, getGlobalSettings, formatSmartOpeningHours } from "@/lib/sauna-service";
import styles from '../Contact.module.css';
import { Mail, Phone, MapPin, Instagram, Facebook, Clock } from 'lucide-react';
import { SaunaStory } from '@/components/sauna/SaunaStory';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
    title: 'Om oss & Kontakt | Sjøbadet Badstue',
    description: 'Historien om Sjøbadet Badstue, våre åpningstider og kontaktskjema.',
};

export default async function AboutPage() {
    const saunas = await getActiveSaunas();
    const settings = await getGlobalSettings();

    const email = settings['contact_email'] || 'booking@sjobadet.com';
    const phone = settings['contact_phone'] || '+47 401 55 365';
    const address = settings['contact_address'] || 'Nedre Langgate 44, 3126 Tønsberg';
    const instagram = settings['social_instagram'];
    const facebook = settings['social_facebook'];

    return (
        <>
            <Header />
            <main className={styles.pageContainer}>
                <div className={styles.headerSection}>
                    <h1 className={styles.title}>Om oss & Kontakt</h1>
                    <p className={styles.subtitle}>
                        Her finner du alt du trenger for å komme i kontakt med oss, våre åpningstider og historien bak Sjøbadet.
                    </p>
                </div>

                <div className={styles.infoGrid}>
                    <div className={styles.infoCard}>
                        <div className={styles.infoLabel}>E-post</div>
                        <div className={styles.infoValue}>
                            <a href={`mailto:${email}`} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Mail size={18} color="var(--primary)" />
                                {email}
                            </a>
                        </div>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoLabel}>Telefon</div>
                        <div className={styles.infoValue}>
                            <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Phone size={18} color="var(--primary)" />
                                {phone}
                            </a>
                        </div>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoLabel}>Adresse (Hovedkontor)</div>
                        <div className={styles.infoValue} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin size={18} color="var(--primary)" />
                            {address}
                        </div>
                    </div>
                </div>

                <div className={styles.layout}>
                    <div className={styles.leftColumn}>
                        <section>
                            <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1e293b' }}>Vår Historie</h2>
                            <p className={styles.aboutText}>
                                Velkommen til Sjøbadet Badstue, et rolig tilfluktssted som ble etablert i 2024. Vår lidenskap er å tilby kvalitet og avslapning til alle våre gjester.
                            </p>
                            <p className={styles.aboutText}>
                                Sjøbadet eies og drives av André, Jørgen, Kristoffer og Anette. Vi har skapt et pusterom hvor du kan koble helt av fra hverdagens kales og nyte varmen i vakre omgivelser.
                            </p>

                            <SaunaStory />
                        </section>
                    </div>

                    <div className={styles.rightColumn}>
                        <div className={styles.sidebarCard}>
                            <h2 className={styles.sidebarTitle}>
                                <Clock size={24} color="var(--primary)" />
                                Åpningstider
                            </h2>
                            {saunas.map((sauna: any) => (
                                <div key={sauna.id} style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--primary)', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                                        {sauna.name}
                                    </h3>
                                    {sauna.flexibleHours || sauna.driftStatus === 'closed' ? (
                                        <p style={{ fontSize: '0.9rem', color: sauna.driftStatus === 'closed' ? '#ef4444' : '#64748b', fontStyle: 'italic' }}>
                                            {sauna.driftStatus === 'closed' ? (sauna.stengeArsak || 'Midlertidig stengt') : (sauna.hoursMessage || 'Tilgjengelig ved leie')}
                                        </p>
                                    ) : (
                                        <div style={{ paddingLeft: '0.5rem', borderLeft: '2px solid var(--primary)' }}>
                                            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
                                                {formatSmartOpeningHours(sauna.openingHours)}
                                            </p>
                                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                                                Se <a href="/info/apningstider" style={{ color: 'var(--primary)' }}>fullstendig oversikt</a>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <section>
                            <h2 className={styles.sidebarTitle}>Send oss en melding</h2>
                            <ContactForm />
                        </section>
                    </div>
                </div>

                <div className={styles.socialCTA}>
                    <h2 className={styles.socialTitle}>Følg med på våre oppdateringer på sosiale medier!</h2>
                    <p className={styles.socialText}>
                        Bli en del av vårt fellesskap og hold kontakten med oss på sosiale medieplattformer for de siste nyhetene og arrangementene hos Sjøbadet Badstue.
                    </p>
                    <div className={styles.socialButtons}>
                        {instagram && (
                            <a href={instagram} target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
                                <Instagram size={20} />
                                Instagram
                            </a>
                        )}
                        {facebook && (
                            <a href={facebook} target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
                                <Facebook size={20} />
                                Facebook
                            </a>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
