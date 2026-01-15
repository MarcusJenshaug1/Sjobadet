import React from 'react';
import { getGlobalSettings, getActiveSaunas } from '@/lib/sauna-service';
import { FooterView } from './FooterView';
export { FooterView };

/**
 * Footer Server Component.
 * Fetches data and passes it to the FooterView Client Component.
 */
export async function Footer() {
    const settings = await getGlobalSettings();
    const saunas = await getActiveSaunas();

    const address = settings['contact_address'] || 'Nedre Langgate 44, 3126 Tønsberg';
    const email = settings['contact_email'] || 'booking@sjobadet.com';
    const phone = settings['contact_phone'] || '+47 401 55 365';
    const instagram = settings['social_instagram'];
    const facebook = settings['social_facebook'];

    return (
        <FooterView
            address={address}
            email={email}
            phone={phone}
            instagram={instagram}
            facebook={facebook}
            saunas={saunas}
        />
    );
}
