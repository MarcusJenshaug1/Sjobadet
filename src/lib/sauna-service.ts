import prisma from './prisma'
import type { OpeningHour } from '@prisma/client'

const SETTINGS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let settingsCache: { data: Record<string, string>; expiresAt: number } | null = null;
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
    openingHours?: OpeningHour[];
};

type SaunaDetail = ActiveSauna & {
    description?: string | null;
    gallery?: string | null;
    address?: string | null;
    mapEmbedUrl?: string | null;
    status?: string | null;
    stengtFra?: Date | null;
    stengtTil?: Date | null;
};

const activeSaunaCache = new Map<string, { data: ActiveSauna[]; expiresAt: number }>();
const saunaBySlugCache = new Map<string, { data: SaunaDetail; expiresAt: number }>();

export const getActiveSaunas = async (options: { includeOpeningHours?: boolean } = {}) => {
    const { includeOpeningHours = false } = options;
    const cacheKey = includeOpeningHours ? 'active:withHours' : 'active:base';
    const cached = activeSaunaCache.get(cacheKey);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
        return cached.data;
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
        kundeMelding: true,
        flexibleHours: true,
        hoursMessage: true,
        stengeArsak: true,
    };

    return await prisma.sauna.findMany({
        where: { status: 'active' },
        orderBy: { sorting: 'asc' },
        select: {
            ...baseSelect,
            ...(includeOpeningHours
                ? {
                    openingHours: {
                        where: { active: true },
                        orderBy: { weekday: 'asc' },
                        select: {
                            id: true,
                            weekday: true,
                            opens: true,
                            closes: true,
                            active: true,
                            type: true,
                        }
                    }
                }
                : {}),
        }
    })
        .then((result) => {
            activeSaunaCache.set(cacheKey, { data: result, expiresAt: now + SAUNA_CACHE_TTL_MS });
            return result;
        })
}

export const getSaunaBySlug = async (slug: string) => {
    const cached = saunaBySlugCache.get(slug);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
        return cached.data;
    }

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
            openingHours: {
                where: { active: true },
                orderBy: { weekday: 'asc' }
            }
        }
    });

    if (result) {
        saunaBySlugCache.set(slug, { data: result, expiresAt: now + SAUNA_CACHE_TTL_MS });
    }

    return result;
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

    const normalized = settings.reduce((acc: Record<string, string>, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>);

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
