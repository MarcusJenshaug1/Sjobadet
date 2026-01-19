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
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <Info size={16} />
                </div>
                <span className={styles.text}>{alert_text}</span>
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
