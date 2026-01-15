import { getGlobalSettings } from '@/lib/sauna-service';
import styles from './AlertBar.module.css';
import { Info } from 'lucide-react';

interface AlertBarViewProps {
    alert_enabled: boolean;
    alert_text?: string;
}

export function AlertBarView({ alert_enabled, alert_text }: AlertBarViewProps) {
    if (!alert_enabled || !alert_text) return null;

    return (
        <div className={styles.alertBar}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.5rem 1rem' }}>
                <Info size={18} />
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{alert_text}</span>
            </div>
        </div>
    );
}

export async function AlertBar() {
    const settings = await getGlobalSettings();
    const isEnabled = settings['alert_enabled'] === 'true';
    const text = settings['alert_text'];

    return <AlertBarView alert_enabled={isEnabled} alert_text={text} />;
}
