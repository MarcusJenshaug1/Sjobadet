const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';
const REQUEST_TIMEOUT_MS = 8000;

type GeocodingResult = {
    latitude: number;
    longitude: number;
};

function parseNumber(value: unknown) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
}

export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
    const trimmed = address?.trim();
    if (!trimmed) return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const url = new URL(NOMINATIM_BASE_URL);
        url.searchParams.set('q', trimmed);
        url.searchParams.set('format', 'jsonv2');
        url.searchParams.set('limit', '1');
        url.searchParams.set('addressdetails', '0');

        const contactEmail = process.env.GEOCODING_CONTACT_EMAIL?.trim();
        if (contactEmail) {
            url.searchParams.set('email', contactEmail);
        }

        const userAgent = process.env.GEOCODING_USER_AGENT || 'Sjobadet/1.0 (contact: support@yr.no)';

        const response = await fetch(url.toString(), {
            headers: {
                'User-Agent': userAgent,
                'Accept-Language': 'no-NB,no;q=0.9,en;q=0.8',
            },
            signal: controller.signal,
        });

        if (!response.ok) {
            console.warn(`[Geocoding] Nominatim error ${response.status}: ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) return null;

        const lat = parseNumber(data[0]?.lat);
        const lon = parseNumber(data[0]?.lon);
        if (lat === null || lon === null) return null;

        return { latitude: lat, longitude: lon };
    } catch (error) {
        if ((error as Error).name === 'AbortError') {
            console.warn('[Geocoding] Request timed out.');
            return null;
        }
        console.error('[Geocoding] Failed to geocode address:', error);
        return null;
    } finally {
        clearTimeout(timeout);
    }
}