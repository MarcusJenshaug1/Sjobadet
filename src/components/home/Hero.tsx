import React from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';

export function Hero() {
    return (
        <section className={styles.hero}>
            <Image
                src="/hero-sjobadet.jpg"
                alt="Sjøbadet brygge"
                fill
                priority
                fetchPriority="high"
                className={styles.backgroundImage}
                quality={85}
                sizes="(max-width: 768px) 100vw, 100vw"
            />
            <div className={styles.overlay} />
            <div className={styles.content}>
                <h1 className={styles.title}>Book badstue hos Sjøbadet</h1>
                <p className={styles.text}>
                    Opplev stillhet, varme og fellesskap på Tønsberg og Hjemseng Brygge.
                </p>
            </div>
        </section>
    );
}
