import { Metadata } from 'next';
import Link from 'next/link';
import styles from './Personvern.module.css';
import { CookieSettingsTrigger } from '@/components/layout/CookieSettingsTrigger';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
    title: 'Personvernerklæring',
    description: 'Slik behandler Sjøbadet Badstue personopplysninger, informasjonskapsler og analyser.',
};

const sections = [
    {
        title: 'Hvem vi er',
        body: 'Sjøbadet Badstue (org.nr. 926 084 275) er behandlingsansvarlig for personopplysninger som samles inn når du bruker nettsiden sjobadet.no, kjøper billetter eller kommuniserer med oss.',
    },
    {
        title: 'Hva vi samler inn',
        items: [
            'Kontaktdata: navn, e-post, telefon hvis du fyller ut skjema eller kjøper billetter.',
            'Bookingdata: kjøp, tidspunkt, antall plasser og betalingsreferanse (selve betalingen håndteres av vår betalingsleverandør).',
            'Bruksdata: sidevisninger, klikk og teknisk info (IP, nettleser, enhet) for drift og analyse.',
            'Kommunikasjon: e-posthenvendelser og supportdialog.',
        ],
    },
    {
        title: 'Formål',
        items: [
            'Levere tjenesten: håndtere booking, betaling og kundeservice.',
            'Sikkerhet og misbrukshåndtering.',
            'Analyse og forbedring av nettsted og kapasitet.',
            'Markedsføring med samtykke (nyhetsbrev/remarketing).',
        ],
    },
    {
        title: 'Rettigheter',
        body: 'Du kan be om innsyn, retting, sletting, begrensning eller protestere mot behandling. Du kan også trekke tilbake samtykker. Kontakt oss på personvern@sjobadet.com.',
    },
    {
        title: 'Lagringstid',
        body: 'Vi lagrer data så lenge det er nødvendig for formålene over. Lovpålagt regnskapsdata lagres i henhold til bokføringsloven.',
    },
    {
        title: 'Databehandlere',
        body: 'Vi bruker utvalgte leverandører for drift, hosting, analyse og betaling. Data deles bare når det er nødvendig for tjenesten og i tråd med databehandleravtaler.',
    },
    {
        title: 'Overføringer',
        body: 'Dersom data overføres utenfor EØS sørger vi for lovlig grunnlag (EU Standard Contractual Clauses).',
    },
    {
        title: 'Informasjonskapsler og sporing',
        body: 'Vi bruker nødvendige informasjonskapsler for drift, og valgfrie kapsler for analyse/markedsføring. Du kan endre valg når som helst nedenfor.',
    },
];

const trackingTable = [
    { name: 'Nødvendige', purpose: 'Drift, sikkerhet, lastbalansering, samtykke-lagring', retention: 'Inntil 12 mnd eller kortere', basis: 'Berettiget interesse / nødvendig for tjeneste' },
    { name: 'Analyse (valgfrie)', purpose: 'Forstå bruk, forbedre innhold og kapasitet', retention: '12 mnd', basis: 'Samtykke' },
    { name: 'Markedsføring (valgfrie)', purpose: 'Reklame/retargeting når du har samtykket', retention: 'Inntil 12 mnd', basis: 'Samtykke' },
];

export default function PrivacyPage() {
    return (
        <>
            <Header />
            <main className="container" style={{ padding: '4rem 1rem', maxWidth: '900px' }}>
                <h1 className={styles.title}>Personvernerklæring</h1>
                <p className={styles.lead}>
                    Her finner du oversikt over hvilke data vi behandler, hvorfor, hvor lenge, og hvordan du kan styre informasjonskapsler og samtykker.
                </p>

                <section className={styles.card}>
                    <h2>Styr dine valg</h2>
                    <p>Du kan endre eller trekke tilbake samtykker for analyse/markedsføring når som helst.</p>
                    <CookieSettingsTrigger label="Åpne personvernvalg" />
                </section>

                {sections.map((section) => (
                    <section key={section.title} className={styles.card}>
                        <h2>{section.title}</h2>
                        {section.body && <p>{section.body}</p>}
                        {section.items && (
                            <ul>
                                {section.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        )}
                    </section>
                ))}

                <section className={styles.card}>
                    <h2>Oversikt over sporing og cookies</h2>
                    <div className={styles.table} role="table" aria-label="Sporingstyper">
                        <div className={styles.tableHead} role="row">
                            <div role="columnheader">Kategori</div>
                            <div role="columnheader">Formål</div>
                            <div role="columnheader">Lagring</div>
                            <div role="columnheader">Behandlingsgrunnlag</div>
                        </div>
                        {trackingTable.map((row) => (
                            <div className={styles.tableRow} role="row" key={row.name}>
                                <div role="cell">{row.name}</div>
                                <div role="cell">{row.purpose}</div>
                                <div role="cell">{row.retention}</div>
                                <div role="cell">{row.basis}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.card}>
                    <h2>Dine rettigheter</h2>
                    <p>For innsyn eller andre rettigheter, kontakt oss på <Link href="mailto:personvern@sjobadet.com">personvern@sjobadet.com</Link>. Du har også rett til å klage til Datatilsynet.</p>
                </section>

                <section className={styles.card}>
                    <h2>Sist oppdatert</h2>
                    <p>Oppdatert {new Date().toISOString().split('T')[0]}.</p>
                </section>
            </main>
            <Footer />
        </>
    );
}
