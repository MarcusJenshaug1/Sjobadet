import React from 'react';
import { Header } from '@/components/layout/Header';
import nextDynamic from 'next/dynamic';
const Footer = nextDynamic(() => import('@/components/layout/Footer').then(mod => mod.Footer));
const SaunaStory = nextDynamic(() => import('@/components/sauna/SaunaStory').then(mod => mod.SaunaStory));
import styles from '../InfoPages.module.css';
import { FAQContent } from './FAQContent';
import { Metadata } from 'next';

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
