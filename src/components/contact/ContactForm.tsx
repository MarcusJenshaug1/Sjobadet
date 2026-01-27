'use client';

import React, { useState } from 'react';
import styles from './ContactForm.module.css';
import { Send, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

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
            <Card className={styles.successMessage} padding="lg">
                <CheckCircle size={40} style={{ marginBottom: '1rem' }} />
                <h3>Melding sendt!</h3>
                <p>Takk for at du kontakter oss. Vi svarer deg så fort vi kan.</p>
                <Button
                    onClick={() => setStatus('idle')}
                    className={styles.successButton}
                    size="md"
                >
                    Send ny melding
                </Button>
            </Card>
        );
    }

    return (
        <Card as="form" className={styles.form} onSubmit={handleSubmit} padding="lg">
            <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Navn</label>
                <Input
                    type="text"
                    id="name"
                    required
                    placeholder="Ditt fulle navn"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>E-post</label>
                <Input
                    type="email"
                    id="email"
                    required
                    placeholder="din@epost.no"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.label}>Emne</label>
                <Input
                    type="text"
                    id="subject"
                    required
                    placeholder="Hva gjelder det?"
                    value={formData.subject}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>Melding</label>
                <Textarea
                    id="message"
                    required
                    placeholder="Skriv din melding her..."
                    value={formData.message}
                    onChange={handleChange}
                />
            </div>

            <Button
                type="submit"
                disabled={status === 'submitting'}
                size="lg"
            >
                {status === 'submitting' ? 'Sender...' : (
                    <>
                        Send melding
                        <Send size={18} />
                    </>
                )}
            </Button>
        </Card>
    );
}
