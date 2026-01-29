const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';
const OPEN_METEO_GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
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

    const userAgent = process.env.GEOCODING_USER_AGENT?.trim();
    const contactEmail = process.env.GEOCODING_CONTACT_EMAIL?.trim();
    const canUseNominatim = !!userAgent && !!contactEmail;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        if (canUseNominatim) {
            const url = new URL(NOMINATIM_BASE_URL);
            url.searchParams.set('q', trimmed);
            url.searchParams.set('format', 'jsonv2');
            url.searchParams.set('limit', '1');
            url.searchParams.set('addressdetails', '0');
            url.searchParams.set('email', contactEmail!);

            const response = await fetch(url.toString(), {
                headers: {
                    'User-Agent': userAgent!,
                    'Accept-Language': 'no-NB,no;q=0.9,en;q=0.8',
                },
                signal: controller.signal,
            });

            if (response.status === 403) {
                console.warn('[Geocoding] Nominatim rejected request (403).');
            } else if (response.status === 429) {
                console.warn('[Geocoding] Nominatim rate limited (429).');
            } else if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    const lat = parseNumber(data[0]?.lat);
                    const lon = parseNumber(data[0]?.lon);
                    if (lat !== null && lon !== null) {
                        return { latitude: lat, longitude: lon };
                    }
                }
            } else {
                console.warn(`[Geocoding] Nominatim error ${response.status}: ${response.statusText}`);
            }
        } else {
            console.warn('[Geocoding] Nominatim disabled: missing GEOCODING_USER_AGENT/GEOCODING_CONTACT_EMAIL.');
        }

        const openMeteoUrl = new URL(OPEN_METEO_GEOCODING_URL);
        openMeteoUrl.searchParams.set('name', trimmed);
        openMeteoUrl.searchParams.set('count', '1');
        openMeteoUrl.searchParams.set('language', 'nb');
        openMeteoUrl.searchParams.set('format', 'json');

        const openMeteoResponse = await fetch(openMeteoUrl.toString(), {
            signal: controller.signal,
        });

        if (!openMeteoResponse.ok) {
            console.warn(`[Geocoding] Open-Meteo error ${openMeteoResponse.status}: ${openMeteoResponse.statusText}`);
            return null;
        }

        const openMeteoData = await openMeteoResponse.json();
        const result = Array.isArray(openMeteoData?.results) ? openMeteoData.results[0] : null;
        const lat = parseNumber(result?.latitude);
        const lon = parseNumber(result?.longitude);
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