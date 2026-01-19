'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { formatSmartOpeningHours } from '@/lib/sauna-utils';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { CookieSettingsTrigger } from './CookieSettingsTrigger';

interface FooterViewProps {
    address: string;
    email: string;
    phone: string;
    instagram?: string;
    facebook?: string;
    saunas: any[];
}

export function FooterView({ address, email, phone, instagram, facebook, saunas }: FooterViewProps) {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.section}>
                        <h3>Sjøbadet Badstue</h3>
                        <p>Avslappende badstueopplevelser for kropp og sjel i Tønsberg.</p>
                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
                                <MapPin size={18} className={styles.icon} />
                                <span>{address}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <Mail size={18} className={styles.icon} />
                                <a href={`mailto:${email}`} style={{ color: 'inherit' }}>{email}</a>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <Phone size={18} className={styles.icon} />
                                <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'inherit' }}>{phone}</a>
                            </div>
                        </div>

                        {(instagram || facebook) && (
                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                                {instagram && (
                                    <a href={instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                        <Instagram size={24} />
                                    </a>
                                )}
                                {facebook && (
                                    <a href={facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                        <Facebook size={24} />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.section}>
                        <h3>Åpningstider</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {saunas.map(sauna => {
                                const isClosed = sauna.driftStatus === 'closed';
                                return (
                                    <div key={sauna.id}>
                                        <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {sauna.name}
                                            {isClosed && <span style={{ color: '#ef4444', fontSize: '0.75rem', backgroundColor: '#fee2e2', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>STENGT</span>}
                                        </p>
                                        {isClosed ? (
                                            <p style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                                                {sauna.stengeArsak || 'Midlertidig stengt'}
                                            </p>
                                        ) : (
                                            <p style={{ fontSize: '0.85rem', color: '#444' }}>
                                                {sauna.flexibleHours ? (
                                                    sauna.hoursMessage || 'Tilgjengelig ved leie'
                                                ) : (
                                                    formatSmartOpeningHours(sauna.openingHours)
                                                )}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3>Informasjon</h3>
                        <div className={styles.links}>
                            <Link href="/info/faq">Ofte stilte spørsmål</Link>
                            <Link href="/info/regler">Badstueregler</Link>
                            <Link href="/info/vilkar">Salgsbetingelser</Link>
                            <Link href="/info/om-oss">Om oss</Link>
                            <Link href="/info/apningstider">Åpningstider</Link>
                            <Link href="/info/personvern">Personvernerklæring</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} Sjøbadet AS. Org.nr: 926 084 275.</p>
                    <CookieSettingsTrigger label="Personvernvalg" />
                </div>
            </div>
        </footer>
    );
}
