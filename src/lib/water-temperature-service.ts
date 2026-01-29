import prisma from './prisma';

const YR_BASE_URL = 'https://badetemperaturer.yr.no';
const SOURCE_LABEL = 'Badetemperaturer levert av Yr';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8000;

export type WaterTemperatureData = {
    temperature: number;
    time: string;
    locationName?: string | null;
    distanceKm?: number | null;
    sourceLabel: string;
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
        console.warn('[Yr] Missing YR_BADETEMP_APIKEY.');
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
            sourceLabel: SOURCE_LABEL,
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
        sourceLabel: SOURCE_LABEL,
    };
}

async function refreshWaterTemperature(saunaId: string, latitude: number, longitude: number) {
    const result = await fetchNearestWaterTemperature(latitude, longitude);
    const now = new Date();

    await prisma.sauna.update({
        where: { id: saunaId },
        data: {
            waterTempValue: result?.temperature ?? null,
            waterTempTime: result?.time ? new Date(result.time) : null,
            waterTempLocationName: result?.locationName ?? null,
            waterTempDistanceKm: result?.distanceKm ?? null,
            waterTempFetchedAt: now,
        },
    });

    return result;
}

export async function getWaterTemperatureForSauna(sauna: SaunaWaterTempCache): Promise<WaterTemperatureData | null> {
    const latitude = sauna.latitude ?? null;
    const longitude = sauna.longitude ?? null;

    if (!isValidCoordinate(latitude, -90, 90) || !isValidCoordinate(longitude, -180, 180)) {
        return null;
    }

    const cached = buildCacheData(sauna);
    const fetchedAt = sauna.waterTempFetchedAt ? new Date(sauna.waterTempFetchedAt).getTime() : 0;
    const isFresh = fetchedAt > 0 && Date.now() - fetchedAt < CACHE_TTL_MS;

    if (isFresh && cached) return cached;

    if (cached) {
        void refreshWaterTemperature(sauna.id, latitude, longitude)
            .then((result) => {
                sauna.waterTempValue = result?.temperature ?? null;
                sauna.waterTempTime = result?.time ? new Date(result.time) : null;
                sauna.waterTempLocationName = result?.locationName ?? null;
                sauna.waterTempDistanceKm = result?.distanceKm ?? null;
                sauna.waterTempFetchedAt = new Date();
            })
            .catch((error) => {
                console.error('[Yr] Background refresh failed:', error);
            });
        return cached;
    }

    return await refreshWaterTemperature(sauna.id, latitude, longitude);
}