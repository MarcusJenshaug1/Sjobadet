'use client';

import { useEffect } from 'react';
import styles from './CookieSettingsTrigger.module.css';
import { Cookie } from 'lucide-react';

interface CookieSettingsTriggerProps {
    label?: string;
}

export function CookieSettingsTrigger({ label = 'Personvernvalg' }: CookieSettingsTriggerProps) {
    useEffect(() => {
        // no-op mount placeholder
    }, []);

    const openSettings = () => {
        window.dispatchEvent(new CustomEvent('openConsentSettings'));
    };

    return (
        <button className={styles.trigger} type="button" onClick={openSettings} aria-label={label}>
            <Cookie size={16} />
            <span>{label}</span>
        </button>
    );
}
