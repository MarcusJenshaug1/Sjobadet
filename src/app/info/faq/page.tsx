import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import styles from '../InfoPages.module.css';
import { FAQContent } from './FAQContent';
import { Metadata } from 'next';
import { SaunaStory } from '@/components/sauna/SaunaStory';

export const metadata: Metadata = {
    title: 'FAQ | Sjøbadet Badstue',
    description: 'Ofte stilte spørsmål om Sjøbadet Badstue.',
};

export default function FAQPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>Ofte stilte spørsmål</h1>

                <FAQContent />

                <SaunaStory />
            </main>
            <Footer />
        </>
    );
}
