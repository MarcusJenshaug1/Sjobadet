'use client';

import React, { useState } from 'react';
import styles from './ContactForm.module.css';
import { Send, CheckCircle } from 'lucide-react';

export function ContactForm() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    if (status === 'success') {
        return (
            <div className={styles.successMessage}>
                <CheckCircle size={40} style={{ marginBottom: '1rem' }} />
                <h3>Melding sendt!</h3>
                <p>Takk for at du kontakter oss. Vi svarer deg så fort vi kan.</p>
                <button
                    onClick={() => setStatus('idle')}
                    className={styles.submitButton}
                    style={{ marginTop: '1.5rem', width: 'auto', padding: '0.75rem 2rem' }}
                >
                    Send ny melding
                </button>
            </div>
        );
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Navn</label>
                <input
                    type="text"
                    id="name"
                    required
                    className={styles.input}
                    placeholder="Ditt fulle navn"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>E-post</label>
                <input
                    type="email"
                    id="email"
                    required
                    className={styles.input}
                    placeholder="din@epost.no"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.label}>Emne</label>
                <input
                    type="text"
                    id="subject"
                    required
                    className={styles.input}
                    placeholder="Hva gjelder det?"
                    value={formData.subject}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>Melding</label>
                <textarea
                    id="message"
                    required
                    className={styles.textarea}
                    placeholder="Skriv din melding her..."
                    value={formData.message}
                    onChange={handleChange}
                ></textarea>
            </div>

            <button
                type="submit"
                className={styles.submitButton}
                disabled={status === 'submitting'}
            >
                {status === 'submitting' ? 'Sender...' : (
                    <>
                        Send melding
                        <Send size={18} />
                    </>
                )}
            </button>
        </form>
    );
}
