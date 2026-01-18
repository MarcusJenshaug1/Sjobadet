import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkData() {
    const { data, error } = await supabase
        .from('Sauna')
        .select('id, name, availabilityData, lastScrapedAt')
        .eq('id', 'b40050a6-86f9-484e-8e3e-d5565b08691c')
        .single();

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Sauna:', data.name);
    console.log('Last scraped:', data.lastScrapedAt);
    console.log('Availability data:', data.availabilityData);

    if (data.availabilityData) {
        try {
            const parsed = JSON.parse(data.availabilityData);
            console.log('Parsed data:', JSON.stringify(parsed, null, 2));
        } catch (e) {
            console.error('Parse error:', e);
        }
    }
}

checkData();
