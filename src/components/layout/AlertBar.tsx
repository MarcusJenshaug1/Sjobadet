import { getGlobalSettings } from '@/lib/sauna-service';
import { AlertBarView } from './AlertBarView';

export async function AlertBar() {
    const settings = await getGlobalSettings();
    const isEnabled = settings['alert_enabled'] === 'true';
    const text = settings['alert_text'];

    return <AlertBarView alert_enabled={isEnabled} alert_text={text} />;
}
