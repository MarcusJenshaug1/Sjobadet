import prisma from './prisma'
import type { OpeningHour } from '@prisma/client'
import saunasJson from '@/data/saunas.json'
import { getNextAvailableSlot } from './availability-utils'

const SETTINGS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const SAUNA_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes for public content

type ActiveSauna = {
    id: string;
    slug: string;
    name: string;
    location: string;
    shortDescription: string;
    imageUrl?: string | null;
    driftStatus?: string | null;
    capacityDropin: number;
    capacityPrivat: number;
    bookingUrlDropin?: string | null;
    bookingUrlPrivat?: string | null;
    hasDropinAvailability?: boolean | null;
    kundeMelding?: string | null;
    flexibleHours?: boolean | null;
    hoursMessage?: string | null;
    stengeArsak?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    openingHours?: OpeningHour[];
    availabilityData?: string | null;
    lastScrapedAt?: Date | null;
    nextAvailableSlot?: { time: string; availableSpots: number; date: string } | null;
};

type SaunaDetail = ActiveSauna & {
    description?: string | null;
    gallery?: string | null;
    facilities?: string | null;
    address?: string | null;
    mapEmbedUrl?: string | null;
    status?: string | null;
    stengtFra?: Date | null;
    stengtTil?: Date | null;
};


const globalForSauna = globalThis as unknown as {
    activeSaunaCache: Map<string, { data: ActiveSauna[]; expiresAt: number }>;
    saunaBySlugCache: Map<string, { data: SaunaDetail; expiresAt: number }>;
    settingsCache: { data: Record<string, string>; expiresAt: number } | null;
};

const activeSaunaCache = globalForSauna.activeSaunaCache || new Map<string, { data: ActiveSauna[]; expiresAt: number }>();
const saunaBySlugCache = globalForSauna.saunaBySlugCache || new Map<string, { data: SaunaDetail; expiresAt: number }>();
let settingsCache: { data: Record<string, string>; expiresAt: number } | null = globalForSauna.settingsCache || null;

if (process.env.NODE_ENV !== 'production') {
    globalForSauna.activeSaunaCache = activeSaunaCache;
    globalForSauna.saunaBySlugCache = saunaBySlugCache;
    globalForSauna.settingsCache = settingsCache;
}


type StaticSauna = {
    id: string;
    slug: string;
    name: string;
    location: string;
    shortDescription: string;
    description?: string;
    imageUrl?: string;
    gallery?: unknown[];
    facilities?: unknown[];
    address?: string;
    mapEmbedUrl?: string;
    capacity?: { dropin?: number; privat?: number };
    bookingUrls?: { dropin?: string; privat?: string };
    active: boolean;
};

function mapStaticSaunaBase() {
    return (saunasJson as StaticSauna[])
        .filter((s) => s.active)
        .map<ActiveSauna>((s) => ({
            id: s.id,
            slug: s.slug,
            name: s.name,
            location: s.location,
            shortDescription: s.shortDescription,
            imageUrl: s.imageUrl,
            driftStatus: 'open',
            capacityDropin: s.capacity?.dropin ?? 0,
            capacityPrivat: s.capacity?.privat ?? 0,
            bookingUrlDropin: s.bookingUrls?.dropin ?? null,
            bookingUrlPrivat: s.bookingUrls?.privat ?? null,
            hasDropinAvailability: true,
            kundeMelding: null,
            flexibleHours: null,
            hoursMessage: null,
            stengeArsak: null,
            availabilityData: null,
            lastScrapedAt: null,
            nextAvailableSlot: null,
        }));
}

function mapStaticSaunaDetail(slug: string): SaunaDetail | null {
    const match = (saunasJson as StaticSauna[]).find((s) => s.slug === slug);
    if (!match || !match.active) return null;
    return {
        id: match.id,
        slug: match.slug,
        name: match.name,
        location: match.location,
        shortDescription: match.shortDescription,
        description: match.description,
        imageUrl: match.imageUrl,
        gallery: JSON.stringify(match.gallery || []),
        facilities: JSON.stringify(match.facilities || []),
        address: match.address,
        mapEmbedUrl: match.mapEmbedUrl,
        driftStatus: 'open',
        capacityDropin: match.capacity?.dropin ?? 0,
        capacityPrivat: match.capacity?.privat ?? 0,
        bookingUrlDropin: match.bookingUrls?.dropin ?? null,
        bookingUrlPrivat: match.bookingUrls?.privat ?? null,
        status: 'active',
        stengtFra: null,
        stengtTil: null,
        kundeMelding: null,
        flexibleHours: null,
        hoursMessage: null,
        hasDropinAvailability: true,
        availabilityData: null,
        lastScrapedAt: null,
        nextAvailableSlot: null,
        openingHours: [],
    };
}

function computeNextAvailableSlot(availabilityData?: string | null): { time: string; availableSpots: number; date: string } | null {
    if (!availabilityData) return null;
    try {
        const parsed = JSON.parse(availabilityData) as { days?: Record<string, { from: string; to: string; availableSpots: number }[]> };
        const next = getNextAvailableSlot(parsed.days ?? {}, new Date(), 'Europe/Oslo');
        if (!next) return null;
        return { time: next.slot.from, availableSpots: next.slot.availableSpots ?? 0, date: next.date };
    } catch (err) {
        console.error('[SaunaService] Failed to compute next available slot:', err);
    }
    return null;
}

export const getActiveSaunas = async (options: { includeOpeningHours?: boolean } = {}) => {
    const { includeOpeningHours = false } = options;
    const cacheKey = includeOpeningHours ? 'active:withHours' : 'active:base';
    const cached = activeSaunaCache.get(cacheKey);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
        return cached.data.map((sauna: any) => ({
            ...sauna,
            nextAvailableSlot: computeNextAvailableSlot(sauna.availabilityData),
        }));
    }

    const baseSelect = {
        id: true,
        slug: true,
        name: true,
        location: true,
        shortDescription: true,
        imageUrl: true,
        driftStatus: true,
        capacityDropin: true,
        capacityPrivat: true,
        bookingUrlDropin: true,
        bookingUrlPrivat: true,
        hasDropinAvailability: true,
        availabilityData: true,
        lastScrapedAt: true,
        kundeMelding: true,
        flexibleHours: true,
        hoursMessage: true,
        stengeArsak: true,
        seoTitle: true,
        seoDescription: true,
    };

    try {
        const result = await prisma.sauna.findMany({
            where: { status: 'active' },
            orderBy: { sorting: 'asc' },
            select: {
                ...baseSelect,
                ...(includeOpeningHours
                    ? {
                        openingHours: {
                            where: { active: true },
                            orderBy: { weekday: 'asc' },
                        }
                    }
                    : {}),
            } as any
        });

        activeSaunaCache.set(cacheKey, { data: result as any, expiresAt: now + SAUNA_CACHE_TTL_MS });

        return result.map((sauna: any) => ({
            ...sauna,
            nextAvailableSlot: computeNextAvailableSlot(sauna.availabilityData),
        }));
    } catch (error) {
        console.error('[SaunaService] Falling back to static saunas.json due to DB error:', error);
        return mapStaticSaunaBase().map(sauna => ({
            ...sauna,
            nextAvailableSlot: computeNextAvailableSlot(sauna.availabilityData)
        }));
    }
}

export const getSaunaBySlug = async (slug: string) => {
    const cached = saunaBySlugCache.get(slug);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
        return {
            ...cached.data,
            nextAvailableSlot: computeNextAvailableSlot(cached.data.availabilityData)
        };
    }

    try {
        const result = await prisma.sauna.findUnique({
            where: { slug },
            select: {
                id: true,
                slug: true,
                name: true,
                shortDescription: true,
                description: true,
                location: true,
                imageUrl: true,
                gallery: true,
                address: true,
                mapEmbedUrl: true,
                facilities: true,
                capacityDropin: true,
                capacityPrivat: true,
                bookingUrlDropin: true,
                bookingUrlPrivat: true,
                status: true,
                driftStatus: true,
                stengeArsak: true,
                stengtFra: true,
                stengtTil: true,
                kundeMelding: true,
                flexibleHours: true,
                hoursMessage: true,
                hasDropinAvailability: true,
                availabilityData: true,
                lastScrapedAt: true,
                seoTitle: true,
                seoDescription: true,
                openingHours: {
                    where: { active: true },
                    orderBy: { weekday: 'asc' }
                }
            } as any
        });

        if (result) {
            const withNext = {
                ...(result as any),
                nextAvailableSlot: computeNextAvailableSlot((result as any).availabilityData ?? null),
            };
            saunaBySlugCache.set(slug, { data: withNext, expiresAt: now + SAUNA_CACHE_TTL_MS });
            return withNext;
        }
        return result;
    } catch (error) {
        console.error('[SaunaService] Falling back to static sauna detail due to DB error:', error);
        const fallback = mapStaticSaunaDetail(slug);
        if (fallback) {
            saunaBySlugCache.set(slug, { data: fallback, expiresAt: now + SAUNA_CACHE_TTL_MS });
        }
        return fallback;
    }
}

export function clearSaunaCaches(slug?: string) {
    if (slug) {
        saunaBySlugCache.delete(slug);
    }
    saunaBySlugCache.clear();
    activeSaunaCache.clear();
}

export const getGlobalSettings = async () => {
    const now = Date.now();

    if (settingsCache && settingsCache.expiresAt > now) {
        return settingsCache.data;
    }

    const settings = await prisma.siteSetting.findMany({
        select: { key: true, value: true }
    });

    const normalized = settings.reduce<Record<string, string>>((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    settingsCache = {
        data: normalized,
        expiresAt: now + SETTINGS_CACHE_TTL_MS,
    };

    return normalized;
}

export function getTodayOpeningHours(openingHours: OpeningHour[]) {
    const now = new Date()
    const jsDay = now.getDay() // 0(Sun) - 6(Sat)

    // Map JS(0=Sun) -> DB(6=Sun)
    // Map JS(1=Mon) -> DB(0=Mon)
    let dbDay = jsDay - 1
    if (dbDay < 0) dbDay = 6

    // Look for exceptions first
    const todayHours = openingHours.find(h => h.weekday === dbDay && h.type === 'weekly')

    return todayHours
}

export const getCacheStats = async () => {
    return {
        activeSaunas: activeSaunaCache.size,
        saunaDetails: saunaBySlugCache.size,
        settings: settingsCache ? 1 : 0
    }
}

export function formatSmartOpeningHours(openingHours: OpeningHour[] | undefined) {
    if (!openingHours || openingHours.length === 0) return 'Kontakt oss for åpningstider';

    const weekly = openingHours
        .filter(h => h.type === 'weekly')
        .sort((a, b) => (a.weekday ?? 0) - (b.weekday ?? 0));

    if (weekly.length === 0) return 'Kontakt oss for åpningstider';

    const activeDays = weekly.filter(h => h.active);
    if (activeDays.length === 0) return 'Stengt';

    // Check if all days are active and have the same hours
    const firstActive = activeDays[0];
    const allSame = weekly.length === 7 && weekly.every(h =>
        h.active && h.opens === firstActive.opens && h.closes === firstActive.closes
    );

    if (allSame) {
        return `Alle dager: ${firstActive.opens} - ${firstActive.closes}`;
    }

    // Check if Mon-Fri are the same
    const monFri = weekly.filter(h => (h.weekday ?? 0) < 5);
    const firstMonFri = monFri[0];
    const monFriSame = monFri.every(h =>
        h.active === firstMonFri.active && h.opens === firstMonFri.opens && h.closes === firstMonFri.closes
    );

    if (monFriSame && monFri.length === 5) {
        const monFriStatus = firstMonFri.active ? `${firstMonFri.opens} - ${firstMonFri.closes}` : 'Stengt';
        return `Man-Fre: ${monFriStatus}, Lør-Søn: Se detaljer`;
    }

    return 'Åpent - se detaljer';
}
