'use client';

import React, { useState } from 'react';
import styles from '../InfoPages.module.css';
import { ChevronDown, Sparkles, Droplets, Flame, Bath, Gift, Info } from 'lucide-react';

export function FAQContent() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "Dusjer",
            answer: "JA, vi har dusjer både på Hjemseng Brygge og Tønsberg Brygge.",
            icon: <Droplets size={20} />
        },
        {
            question: "Er Badstuene elektriske?",
            answer: "JA, Alle våre badstuer er elektriske og er ferdig oppvarmet når du kommer.",
            icon: <Flame size={20} />
        },
        {
            question: "Er håndkle påbudt?",
            answer: "JA, husk håndkle under rompa og tær + badeshorts og drikke.",
            icon: <Bath size={20} />
        },
        {
            question: "Har du gavekort fra det gamle bookingsystemet?",
            answer: "Ta kontakt så hjelper vi deg! Vi sørger for at du får benyttet dine gamle gavekort i vårt nye system.",
            icon: <Gift size={20} />
        }
    ];

    return (
        <div className={styles.accordion}>
            {faqs.map((faq, index) => (
                <div
                    key={index}
                    className={`${styles.accordionItem} ${openIndex === index ? styles.accordionItemOpen : ''}`}
                >
                    <button
                        className={styles.accordionHeader}
                        onClick={() => toggleAccordion(index)}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'var(--primary)' }}>{faq.icon}</span>
                            {faq.question}
                        </span>
                        <ChevronDown className={styles.accordionIcon} size={20} />
                    </button>
                    <div className={styles.accordionContent}>
                        <p>{faq.answer}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
