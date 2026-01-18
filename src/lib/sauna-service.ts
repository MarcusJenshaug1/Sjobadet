import prisma from './prisma'
import type { OpeningHour } from '@prisma/client'

export const getActiveSaunas = async () => {
    return await prisma.sauna.findMany({
        where: { status: 'active' },
        orderBy: { sorting: 'asc' },
        select: {
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
            openingHours: true,
        }
    })
}

export const getSaunaBySlug = async (slug: string) => {
    return await prisma.sauna.findUnique({
        where: { slug },
        include: { openingHours: true }
    })
}

export const getGlobalSettings = async () => {
    const settings = await prisma.siteSetting.findMany();
    return settings.reduce((acc: Record<string, string>, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>);
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
