import React from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';

export function Hero() {
    return (
        <section className={styles.hero}>
            <Image
                src="https://images.unsplash.com/photo-1694374510393-da60c58a3375?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Sjøbadet brygge"
                fill
                priority
                className={styles.backgroundImage}
                quality={85}
            />
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
