import React from 'react';
import styles from './SaunaStory.module.css';
import { Sparkles, Info } from 'lucide-react';

export function SaunaStory() {
    return (
        <div className={styles.storySection}>
            <h2 className={styles.storyTitle}>Søstrene av lys & LöYLY</h2>

            <div className={styles.storySubsection}>
                <h3><Sparkles size={24} color="#0f766e" /> LöYLY</h3>
                <p className={styles.storyText}>
                    Dampen som stiger opp fra ovnen kalles for <strong>Löyly</strong>. Det betyr "Saunaens sjel" og stammer fra Finsk folkelore. Det sies at energien i badstuer er kvinnelig, derfor har ofte badstuer kvinnenavn, vår er intet unntak.
                </p>
            </div>

            <div className={styles.storySubsection}>
                <h3><Info size={24} color="#0f766e" /> Søstrene</h3>
                <p className={styles.storyText}>
                    Alt begynte med <strong>Theia</strong> - Navnet betyr gudinne (opprinnelsen til navnet Thea). Hun kom til Tønsberg brygge med ungdommens glød og den ungdommelig energien er noe vi synes passer godt til det nye møtestedet på Tønsberg brygge. I hennes navn lever minnene, latteren og energien som fikk oss til å bygge videre.
                </p>

                <p className={styles.storyText} style={{ marginBottom: '2rem' }}>
                    På Hjemseng står nå to søstre side om side - <strong>Helia</strong> og <strong>Lysa</strong> (oppkalt etter Hilde og Lisbeth). De er like i kraft, men ulike i sinn.
                </p>

                <div className={styles.storyList}>
                    <div className={styles.storyListItem}>
                        <p><strong>Helia</strong> åpner dørene for alle som vil komme innom, puste dypt og finne ro i fellesskapet.</p>
                    </div>
                    <div className={styles.storyListItem}>
                        <p><strong>Lysa</strong> er mer privat - hun inviterer til nære stunder, der venner, familie og lag deler stillheten og varme bak lukkede dører.</p>
                    </div>
                </div>

                <p className={styles.storyText} style={{ marginTop: '2rem' }}>
                    Og når eventyret skal ut på veien, følger <strong>Nomia</strong> med - den frie vandrende søsteren. Hun bringer badstuvarmen dit folk møtes, uten røyk eller ved, bare stillhet, pust og elektrisk ro.
                </p>

                <p className={styles.conclusionText}>
                    Sammen utgjør de et lite univers av lys, kraft og fellesskap - Theia, Helia, Lysa og Nomia - søstrene av lys.
                </p>
            </div>
        </div>
    );
}
