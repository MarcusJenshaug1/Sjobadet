import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../InfoPages.module.css';
import { Metadata } from 'next';
import {
    AlertTriangle,
    Droplets,
    Beer,
    Bath,
    ShowerHead,
    DoorOpen,
    Users,
    RotateCcw,
    PhoneCall,
    Info,
    Check
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Badstueregler | Sjøbadet Badstue',
    description: 'Vilkår og trivselsregler for bruk av badstuen.',
};

export default function RulesPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>Badstueregler</h1>

                <div className={styles.importantCard}>
                    <div className={styles.importantHeader}>
                        <AlertTriangle size={24} color="#f59e0b" />
                        Viktigst
                    </div>
                    <ul className={styles.importantList}>
                        <li className={styles.importantListItem}>
                            <Check size={18} style={{ marginTop: '0.2rem' }} />
                            <span>All bading og bruk av badstuen er på <strong>eget ansvar</strong>.</span>
                        </li>
                        <li className={styles.importantListItem}>
                            <Check size={18} style={{ marginTop: '0.2rem' }} />
                            <span>Kode til døra kommer <strong>KUN på MAIL</strong> 10 min før timen starter.</span>
                        </li>
                        <li className={styles.importantListItem}>
                            <Check size={18} style={{ marginTop: '0.2rem' }} />
                            <span>Kun ferskvann på ovnen. Vann fylles fra kran i en av dusjene.</span>
                        </li>
                        <li className={styles.importantListItem}>
                            <Check size={18} style={{ marginTop: '0.2rem' }} />
                            <span>Vis respekt for andre gjester.</span>
                        </li>
                        <li className={styles.importantListItem}>
                            <Check size={18} style={{ marginTop: '0.2rem' }} />
                            <span>Personer som er synlig beruset kan bli nektet adgang. <strong>Alkohol i fellesbadstue er ikke tillatt.</strong></span>
                        </li>
                    </ul>
                </div>

                <div className={styles.ruleGrid}>
                    <section className={styles.ruleCard}>
                        <div className={styles.ruleHeader}>
                            <Droplets size={24} />
                            <h3 className={styles.ruleTitle}>Vann på ovn</h3>
                        </div>
                        <p className={styles.ruleText}>
                            <strong className={styles.highlight}>KUN FERSKVANN!</strong> Vann kan øses på steinene hvert 10. minutt ca., for å tilføre luftfuktighet og varme til rommet.
                        </p>
                    </section>

                    <section className={styles.ruleCard}>
                        <div className={styles.ruleHeader}>
                            <Beer size={24} />
                            <h3 className={styles.ruleTitle}>Alkohol</h3>
                        </div>
                        <p className={styles.ruleText}>
                            Synlig berusede personer kan bortvises. Vi anbefaler ikke alkohol kombinert med badstue eller bading. <strong className={styles.highlight}>Alkohol i fellesbadstue er forbudt.</strong>
                        </p>
                    </section>

                    <section className={styles.ruleCard}>
                        <div className={styles.ruleHeader}>
                            <Bath size={24} />
                            <h3 className={styles.ruleTitle}>Badetøy & Håndkle</h3>
                        </div>
                        <p className={styles.ruleText}>
                            Badetøy er påbudt. <strong className={styles.highlight}>Håndkle under rumpe og føtter er også påbudt.</strong> Ta med ditt eget, rene håndkle.
                        </p>
                    </section>

                    <section className={styles.ruleCard}>
                        <div className={styles.ruleHeader}>
                            <ShowerHead size={24} />
                            <h3 className={styles.ruleTitle}>Dusj og Såpe</h3>
                        </div>
                        <p className={styles.ruleText}>
                            <strong>Tønsberg:</strong> Varmt vann i begge dusjene.<br />
                            <strong>Hjemseng:</strong> Kald utvendig dusj.<br />
                            <strong className={styles.highlight}>Ikke lov å bruke såpe</strong> da vannet renner rett ut i havet.
                        </p>
                    </section>

                    <section className={styles.ruleCard}>
                        <div className={styles.ruleHeader}>
                            <DoorOpen size={24} />
                            <h3 className={styles.ruleTitle}>Garderober</h3>
                        </div>
                        <p className={styles.ruleText}>
                            <strong>Tønsberg:</strong> Dame- og herregarderobe adskilt.<br />
                            <strong>Hjemseng:</strong> En fellesgarderobe.<br />
                            Pass på verdisakene dine, du er selv ansvarlig for disse.
                        </p>
                    </section>

                    <section className={styles.ruleCard}>
                        <div className={styles.ruleHeader}>
                            <Info size={24} />
                            <h3 className={styles.ruleTitle}>Toalett</h3>
                        </div>
                        <p className={styles.ruleText}>
                            <strong>Tønsberg:</strong> Offentlige toaletter på Tollbodplassen (150m unna).<br />
                            <strong>Hjemseng:</strong> Toaletter ved kafféen til leilighetene.
                        </p>
                    </section>

                    <section className={styles.ruleCard}>
                        <div className={styles.ruleHeader}>
                            <Users size={24} />
                            <h3 className={styles.ruleTitle}>Medlemskap</h3>
                        </div>
                        <p className={styles.ruleText}>
                            Medlemskap er personlig og kan ikke benyttes av andre. Kun 1 booking pr time. Månedskortet har ingen binding og fornyes automatisk.
                        </p>
                    </section>

                    <section className={styles.ruleCard}>
                        <div className={styles.ruleHeader}>
                            <RotateCcw size={24} />
                            <h3 className={styles.ruleTitle}>Ombooking</h3>
                        </div>
                        <p className={styles.ruleText}>
                            Billetter refunderes ikke, men kan ombookes kostnadsfritt inntil 24 timer før booking starter via «Min side».
                        </p>
                    </section>
                </div>

                <div style={{ marginTop: '4rem', padding: '2rem', backgroundColor: '#fdf2f2', border: '1px solid #fecdd3', borderRadius: '16px', textAlign: 'center' }}>
                    <div className={styles.importantHeader} style={{ justifyContent: 'center', color: '#991b1b' }}>
                        <PhoneCall size={24} />
                        Driftsavbrudd / Nød
                    </div>
                    <p style={{ color: '#991b1b', fontWeight: '600', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Ring: 401 55 365</p>
                    <p style={{ color: '#b91c1c' }}><strong>Ved fare for liv eller helse ring 113</strong></p>
                </div>
            </main>
            <Footer />
        </>
    );
}
