'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './BookingModal.module.css';

interface BookingModalProps {
    url: string;
    open: boolean;
    onClose: () => void;
    title?: string;
}

export function BookingModal({ url, open, onClose, title }: BookingModalProps) {
    useEffect(() => {
        if (!open) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            className={styles.backdrop}
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Booking'}
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.title}>{title || 'Fullfør booking'}</div>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Lukk">
                        ×
                    </button>
                </div>
                <div className={styles.body}>
                    <iframe
                        src={url}
                        title={title || 'Booking'}
                        className={styles.iframe}
                        allow="payment *; fullscreen"
                    />
                </div>
            </div>
        </div>,
        document.body
    );
}
