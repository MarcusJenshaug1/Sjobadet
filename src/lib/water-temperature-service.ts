import prisma from './prisma';

const YR_BASE_URL = 'https://badetemperaturer.yr.no';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8000;

export type WaterTemperatureData = {
    temperature: number;
    time: string;
    locationName?: string | null;
    distanceKm?: number | null;
    source: 'yr' | 'open-meteo' | null;
};

type SaunaWaterTempCache = {
    id: string;
    latitude?: number | null;
    longitude?: number | null;
    waterTempValue?: number | null;
    waterTempTime?: Date | string | null;
    waterTempLocationName?: string | null;
    waterTempDistanceKm?: number | null;
    waterTempFetchedAt?: Date | string | null;
    waterTempSource?: string | null;
};

type YrNearestEntry = {
    temperature?: number | string;
    time?: string;
    timestamp?: string;
    measuredAt?: string;
    observedAt?: string;
    locationName?: string;
    name?: string;
    location?: { name?: string; latitude?: number; longitude?: number; lat?: number; lon?: number };
    latitude?: number;
    longitude?: number;
    lat?: number;
    lon?: number;
    distance?: number;
    distanceKm?: number;
};

type NormalizedEntry = {
    temperature: number;
    time: string;
    locationName?: string | null;
    distanceKm?: number | null;
};

function isValidCoordinate(value: number | null | undefined, min: number, max: number): value is number {
    return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

function parseNumber(value: unknown) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
}

function parseTime(value?: string | null) {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function toLocationName(entry: YrNearestEntry) {
    return entry.locationName || entry.name || entry.location?.name || null;
}

function toCoordinates(entry: YrNearestEntry) {
    const lat = parseNumber(entry.latitude ?? entry.lat ?? entry.location?.latitude ?? entry.location?.lat);
    const lon = parseNumber(entry.longitude ?? entry.lon ?? entry.location?.longitude ?? entry.location?.lon);
    return { lat, lon };
}

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return 6371 * c;
}

function normalizeYrEntries(entries: YrNearestEntry[], saunaLat: number, saunaLon: number): NormalizedEntry[] {
    return entries
        .map<NormalizedEntry | null>((entry) => {
            const temperature = parseNumber(entry.temperature);
            const time = parseTime(entry.time || entry.measuredAt || entry.observedAt || entry.timestamp);
            if (temperature === null || !time) return null;
            const locationName = toLocationName(entry);
            const coords = toCoordinates(entry);
            const distanceFromCoords =
                isValidCoordinate(coords.lat, -90, 90) && isValidCoordinate(coords.lon, -180, 180)
                    ? haversineDistanceKm(saunaLat, saunaLon, coords.lat, coords.lon)
                    : null;
            const distanceFromEntryRaw = parseNumber(entry.distanceKm ?? entry.distance);
            const distanceFromEntry =
                typeof distanceFromEntryRaw === 'number' && distanceFromEntryRaw > 200
                    ? distanceFromEntryRaw / 1000
                    : distanceFromEntryRaw;
            const distanceKm = distanceFromCoords ?? distanceFromEntry ?? null;
            return { temperature, time, locationName, distanceKm };
        })
        .filter((entry): entry is NormalizedEntry => entry !== null);
}

function selectBestEntry(entries: NormalizedEntry[]) {
    if (entries.length === 0) return null;
    return entries
        .slice()
        .sort((a, b) => {
            const distA = a.distanceKm ?? Number.POSITIVE_INFINITY;
            const distB = b.distanceKm ?? Number.POSITIVE_INFINITY;
            if (distA !== distB) return distA - distB;
            return new Date(b.time).getTime() - new Date(a.time).getTime();
        })[0];
}

export async function fetchNearestWaterTemperature(latitude: number, longitude: number): Promise<WaterTemperatureData | null> {
    if (!isValidCoordinate(latitude, -90, 90) || !isValidCoordinate(longitude, -180, 180)) return null;

    const apiKey = process.env.YR_BADETEMP_APIKEY;
    if (!apiKey) {
        // console.warn('[Yr] Missing YR_BADETEMP_APIKEY.');
        return null;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const url = `${YR_BASE_URL}/api/locations/${latitude},${longitude}/nearestwatertemperatures`;
        const response = await fetch(url, {
            headers: { apikey: apiKey },
            signal: controller.signal,
        });

        if (!response.ok) {
            console.warn(`[Yr] Bad response: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        if (!Array.isArray(data)) return null;

        const normalized = normalizeYrEntries(data as YrNearestEntry[], latitude, longitude);
        const best = selectBestEntry(normalized);
        if (!best) return null;

        return {
            ...best,
            source: 'yr',
        };
    } catch (error) {
        if ((error as Error).name === 'AbortError') {
            console.warn('[Yr] Request timed out.');
            return null;
        }
        console.error('[Yr] Failed to fetch nearest water temperatures:', error);
        return null;
    } finally {
        clearTimeout(timeout);
    }
}

function buildCacheData(sauna: SaunaWaterTempCache): WaterTemperatureData | null {
    if (sauna.waterTempValue === null || sauna.waterTempValue === undefined) return null;
    if (!sauna.waterTempTime) return null;
    const time = parseTime(typeof sauna.waterTempTime === 'string' ? sauna.waterTempTime : sauna.waterTempTime.toISOString());
    if (!time) return null;
    return {
        temperature: sauna.waterTempValue,
        time,
        locationName: sauna.waterTempLocationName ?? null,
        distanceKm: sauna.waterTempDistanceKm ?? null,
        source: (sauna.waterTempSource as 'yr' | 'open-meteo' | null) ?? null,
    };
}

async function refreshWaterTemperature(saunaId: string, latitude: number, longitude: number) {
    const waterResult = await fetchWithFallback(latitude, longitude);

    if (!waterResult) return null;

    const now = new Date();

    await prisma.sauna.update({
        where: { id: saunaId },
        data: {
            waterTempValue: waterResult.temperature,
            waterTempTime: new Date(waterResult.time),
            waterTempLocationName: waterResult.locationName ?? null,
            waterTempDistanceKm: waterResult.distanceKm ?? null,
            waterTempFetchedAt: now,
            waterTempSource: waterResult.source,
        },
    });

    return waterResult;
}

export async function getWaterTemperatureForSauna(sauna: SaunaWaterTempCache): Promise<WaterTemperatureData | null> {
    const latitude = sauna.latitude ?? null;
    const longitude = sauna.longitude ?? null;

    if (!isValidCoordinate(latitude, -90, 90) || !isValidCoordinate(longitude, -180, 180)) {
        console.warn('[WaterTemp] Missing or invalid coordinates for sauna:', sauna.id);
        return null;
    }

    const cached = buildCacheData(sauna);
    const fetchedAt = sauna.waterTempFetchedAt ? new Date(sauna.waterTempFetchedAt).getTime() : 0;
    const isFresh = fetchedAt > 0 && Date.now() - fetchedAt < CACHE_TTL_MS;

    if (isFresh && cached) return cached;

    if (cached) {
        void refreshWaterTemperature(sauna.id, latitude, longitude)
            .then((result) => {
                // Background refresh
            })
            .catch((error) => {
                console.error('[Weather] Background refresh failed:', error);
            });
        return cached;
    }

    return await refreshWaterTemperature(sauna.id, latitude, longitude);
}

type OpenMeteoResult = {
    valueC: number;
    observedAtIso: string;
} | null;

async function fetchOpenMeteoSeaSurfaceTemp(latitude: number, longitude: number): Promise<WaterTemperatureData | null> {
    try {
        const url = new URL('https://marine-api.open-meteo.com/v1/marine');
        url.searchParams.set('latitude', String(latitude));
        url.searchParams.set('longitude', String(longitude));
        url.searchParams.set('hourly', 'sea_surface_temperature');
        url.searchParams.set('timeformat', 'unixtime');
        url.searchParams.set('timezone', 'UTC');
        url.searchParams.set('forecast_hours', '48');

        const response = await fetch(url.toString(), { method: 'GET' });
        if (!response.ok) {
            // console.warn('[Open-Meteo] Marine API non-OK');
            return null;
        }

        const json = await response.json();
        const times = json?.hourly?.time as number[] | undefined;
        const temps = json?.hourly?.sea_surface_temperature as number[] | undefined;

        if (!Array.isArray(times) || !Array.isArray(temps) || times.length === 0 || temps.length === 0) {
            return null;
        }

        const nowSec = Math.floor(Date.now() / 1000);
        let idx = -1;
        for (let i = 0; i < times.length; i += 1) {
            if (times[i] <= nowSec) idx = i;
            else break;
        }
        if (idx < 0) idx = 0;

        const valueC = temps[idx];
        if (typeof valueC !== 'number' || Number.isNaN(valueC)) return null;

        return {
            temperature: valueC,
            time: new Date(times[idx] * 1000).toISOString(),
            locationName: null,
            distanceKm: null,
            source: 'open-meteo',
        };
    } catch (error) {
        console.error('[Open-Meteo] Failed to fetch sea surface temperature:', error);
        return null;
    }
}

async function fetchOpenMeteoWeather(latitude: number, longitude: number) {
    try {
        const url = new URL('https://api.open-meteo.com/v1/forecast');
        url.searchParams.set('latitude', String(latitude));
        url.searchParams.set('longitude', String(longitude));
        url.searchParams.set('current', 'temperature_2m,wind_speed_10m,weather_code');
        url.searchParams.set('wind_speed_unit', 'ms');
        url.searchParams.set('timeformat', 'unixtime');

        const response = await fetch(url.toString(), { method: 'GET' });
        if (!response.ok) return null;

        const json = await response.json();
        const current = json.current;
        if (!current) return null;

        return {
            airTemperature: current.temperature_2m as number,
            windSpeed: current.wind_speed_10m as number,
            weatherCode: current.weather_code as number,
        };
    } catch (error) {
        console.error('[Open-Meteo] Failed to fetch weather:', error);
        return null;
    }
}

async function fetchWithFallback(latitude: number, longitude: number): Promise<WaterTemperatureData | null> {
    const yrResult = await fetchNearestWaterTemperature(latitude, longitude);
    if (yrResult) return yrResult;
    const openMeteoResult = await fetchOpenMeteoSeaSurfaceTemp(latitude, longitude);
    return openMeteoResult;
}

export async function refreshWaterTemperatureForSaunaId(saunaId: string): Promise<WaterTemperatureData | null> {
    const sauna = await prisma.sauna.findUnique({
        where: { id: saunaId },
        select: { id: true, latitude: true, longitude: true },
    });

    if (!sauna) return null;
    if (!isValidCoordinate(sauna.latitude, -90, 90) || !isValidCoordinate(sauna.longitude, -180, 180)) {
        return null;
    }

    return await refreshWaterTemperature(sauna.id, sauna.latitude, sauna.longitude);
}