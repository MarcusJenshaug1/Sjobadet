import React from 'react';
import { Header } from '@/components/layout/Header';
import nextDynamic from 'next/dynamic';
const Footer = nextDynamic(() => import('@/components/layout/Footer').then(mod => mod.Footer));
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Salgsbetingelser | Sjøbadet Badstue',
    description: 'Vilkår og salgsbetingelser for Sjøbadet Badstue.',
};

export default function TermsPage() {
    return (
        <>
            <Header />
            <main className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--primary)' }}>Salgsbetingelser</h1>

                <article style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.6' }}>
                    <p>Under følger vilkår og salgsbetingelser for forbrukerkjøp av varer over internett.</p>

                    <section>
                        <h3>1. Avtalen</h3>
                        <p>Avtalen består av disse salgsbetingelsene, opplysninger gitt i bestillingsløsningen og eventuelt særskilt avtalte vilkår. Ved eventuell motstrid mellom opplysningene, går det som særskilt er avtalt mellom partene foran, så fremt det ikke strider mot ufravikelig lovgivning.</p>
                    </section>

                    <section>
                        <h3>2. Partene</h3>
                        <p>Selger er Sjøbadet AS, Huvikveien 163A, 3124 Tønsberg, post@sjobadet.com, Org.nr: 926 084 275.<br />
                            Kjøper er den forbrukeren som foretar bestillingen.</p>
                    </section>

                    <section>
                        <h3>3. Pris</h3>
                        <p>Den oppgitte prisen for varen og tjenester er den totale prisen kjøper skal betale. Denne prisen inkluderer alle avgifter og tilleggskostnader.</p>
                    </section>

                    <section>
                        <h3>4. Avtaleinngåelse</h3>
                        <p>Avtalen er bindende for begge parter når kjøperen har sendt sin bestilling til selgeren.</p>
                        <p><strong>4.1. Bindingstid:</strong> Vi tilbyr et medlemskap med 6 måneders binding for 445 kr/mnd, samt et fleksibelt medlemskap uten binding for 545 kr/mnd.</p>
                    </section>

                    <section>
                        <h3>5. Betalingen</h3>
                        <p>Selgeren kan kreve betaling for varen fra det tidspunkt den blir sendt fra selgeren til kjøperen. Dersom kjøperen bruker kredittkort eller debetkort ved betaling, kan selgeren reservere kjøpesummen på kortet ved bestilling.</p>
                    </section>

                    <section>
                        <h3>6. Levering</h3>
                        <p>Levering er skjedd når kjøperen, eller hans representant, har overtatt tingen (tjenesten).</p>
                    </section>

                    <section>
                        <h3>7. Angrerett og avbestillingsvilkår</h3>
                        <p><strong>Unntak fra angrerett:</strong> Våre produkter, “Drop-in” og “Privat booking”, er unntatt angrerett i henhold til angrerettloven § 22 bokstav m, da dette er dato- og tidsbestemte fritidsaktiviteter.</p>
                        <p>Ombooking er mulig inntil 24 timer før opprinnelig booking.</p>
                        <p>For gavekort og abonnement gjelder den alminnelige angreretten (14 dager).</p>
                    </section>

                    <section>
                        <h3>8. Oppsigelse av «faste betalinger»</h3>
                        <p>Måendsbetalinger per Vipps er tilgjengelige i app eller nettside, og trekkes fra ønsket bankkort eller -konto. Avtaler via Vipps faste betalinger avsluttes i Vipps-appen.</p>
                    </section>

                    <section>
                        <h3>9-11. Mangel og Reklamasjon</h3>
                        <p>Hvis det foreligger en mangel ved varen må kjøper innen rimelig tidgi selger melding om at han eller hun vil påberope seg mangelen. (Se fullstendige lovtekster i kjøpsloven).</p>
                    </section>

                    <section>
                        <h3>15. Konfliktløsning</h3>
                        <p>Klager rettes til selger innen rimelig tid. Partene skal forsøke å løse eventuelle tvister i minnelighet.</p>
                    </section>
                </article>
            </main>
            <Footer />
        </>
    );
}
