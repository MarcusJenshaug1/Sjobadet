'use client';

import React, { useState, useEffect } from 'react';
import styles from './ConsentBanner.module.css';
import { Button } from '../ui/Button';
import { Shield, Settings, Check, Info } from 'lucide-react';
import { setConsent, getConsent, trackConsentChoice } from '@/lib/analytics/tracking';

export function ConsentBanner() {
    const [showModal, setShowModal] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Audit finding #3: Controlled state for categories
    const [prefs, setPrefs] = useState({
        analysis: false,
        marketing: false,
        functional: false
    });

    useEffect(() => {
        // Only show if no consent is found or version mismatch (handled in getConsent)
        const consent = getConsent();
        if (!consent) {
            setIsVisible(true);
        } else {
            setPrefs({
                analysis: consent.analysis,
                marketing: consent.marketing,
                functional: consent.functional
            });
        }
    }, [showModal]); // Re-sync when modal opens

    const handleAcceptAll = () => {
        const full = { analysis: true, marketing: true, functional: true };
        setPrefs(full);
        setConsent(full);
        trackConsentChoice('accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        const none = { analysis: false, marketing: false, functional: false };
        setPrefs(none);
        setConsent(none);
        trackConsentChoice('declined');
        setIsVisible(false);
    };

    const handleSaveCustom = () => {
        setConsent(prefs);
        trackConsentChoice('custom');
        setShowModal(false);
        setIsVisible(false);
    };

    // Listen for custom event to show banner again
    useEffect(() => {
        const handleOpen = () => {
            setShowModal(true);
            setIsVisible(true);
        };
        window.addEventListener('openConsentSettings', handleOpen);
        return () => window.removeEventListener('openConsentSettings', handleOpen);
    }, []);

    if (!isVisible && !showModal) return null;

    return (
        <>
            {isVisible && !showModal && (
                <div className={styles.banner}>
                    <div className={styles.container}>
                        <div className={styles.text}>
                            <div className={styles.title}>
                                <Shield size={20} />
                                Vi bryr oss om ditt personvern
                            </div>
                            <p className={styles.description}>
                                Sjøbadet bruker infokapsler (cookies) for å gi deg en bedre opplevelse, analysere trafikk og forbedre våre tjenester.
                                Vi lagrer ingen personopplysninger i våre <strong>analyser</strong>, men kontaktinformasjon du oppgir i booking behandles iht. vår <a href="/info/personvern" className={styles.link}>personvernerklæring</a>.
                            </p>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem', fontWeight: 500 }}>
                                <strong>⚠️ Viktig:</strong> Vi sporer IKKE din aktivitet med mindre du aktivt godtar "Analyse" og "Funksjonelt" nedenfor. 
                                Om du klikker "Avslå" eller lukker denne meldingen uten å klikke "Godta alle", vil vi bare bruke nødvendige cookies.
                            </p>
                        </div>
                        <div className={styles.actions}>
                            <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
                                <Settings size={16} /> Tilpass
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDecline}>
                                Avslå
                            </Button>
                            <Button size="sm" onClick={handleAcceptAll}>
                                Godta alle
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className={styles.overlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Innstillinger for infokapsler</h2>
                            <p className={styles.categoryDesc}><strong>Velg hvilke kategorier du ønsker å tillate.</strong> Vi sporer IKKE din aktivitet hvis du ikke godtar "Analyse".</p>
                        </div>

                        <div className={styles.categories}>
                            <div className={styles.category}>
                                <div className={styles.categoryHeader}>
                                    <span className={styles.categoryLabel}><Check size={18} color="#10b981" /> Nødvendig</span>
                                    <label className={styles.switch}>
                                        <input type="checkbox" checked disabled />
                                        <span className={styles.slider}></span>
                                    </label>
                                </div>
                                <p className={styles.categoryDesc}>Helt nødvendige infokapsler for at nettsiden skal fungere (sikkerhet, innlogging og booking).</p>
                            </div>

                            <div className={styles.category}>
                                <div className={styles.categoryHeader}>
                                    <span className={styles.categoryLabel}><Settings size={18} color="#3b82f6" /> Analyse</span>
                                    <label className={styles.switch}>
                                        <input
                                            type="checkbox"
                                            checked={prefs.analysis}
                                            onChange={e => setPrefs({ ...prefs, analysis: e.target.checked })}
                                        />
                                        <span className={styles.slider}></span>
                                    </label>
                                </div>
                                <p className={styles.categoryDesc}>
                                    <strong>🔴 PÅKREVD for sporing:</strong> Uten denne vil vi IKKE registrere noen informasjon om din aktivitet. 
                                    Hjelper oss å se hvordan besøkende bruker siden, slik at vi kan forbedre brukeropplevelsen.
                                </p>
                            </div>

                            <div className={styles.category}>
                                <div className={styles.categoryHeader}>
                                    <span className={styles.categoryLabel}><Settings size={18} color="#f59e0b" /> Funksjonelt</span>
                                    <label className={styles.switch}>
                                        <input
                                            type="checkbox"
                                            checked={prefs.functional}
                                            onChange={e => setPrefs({ ...prefs, functional: e.target.checked })}
                                        />
                                        <span className={styles.slider}></span>
                                    </label>
                                </div>
                                <p className={styles.categoryDesc}>Husker dine valg og preferanser (f.eks. mørkt modus) for et mer personlig besøk.</p>
                            </div>

                            <div className={styles.category}>
                                <div className={styles.categoryHeader}>
                                    <span className={styles.categoryLabel}><Settings size={18} color="#ec4899" /> Markedsføring</span>
                                    <label className={styles.switch}>
                                        <input
                                            type="checkbox"
                                            checked={prefs.marketing}
                                            onChange={e => setPrefs({ ...prefs, marketing: e.target.checked })}
                                        />
                                        <span className={styles.slider}></span>
                                    </label>
                                </div>
                                <p className={styles.categoryDesc}>Brukes for å vise relevante annonser og måle effekten av vår markedsføring.</p>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <Button variant="outline" onClick={() => setShowModal(false)}>Avbryt</Button>
                            <Button onClick={handleSaveCustom}>
                                Lagre mine valg
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
