import React from 'react';
import styles from './Hero.module.css';

export function Hero() {
    return (
        <section className={styles.hero}>
            {/* Background Image could go here using Next Image matching styles.backgroundImage */}
            <div className={styles.overlay} />
            <div className={styles.content}>
                <h1 className={styles.title}>Book badstue hos Sjøbadet</h1>
                <p className={styles.text}>
                    Opplev stillhet, varme og fellesskap på Tønsberg Brygge og Hjemseng Brygge.
                </p>
            </div>
        </section>
    );
}
