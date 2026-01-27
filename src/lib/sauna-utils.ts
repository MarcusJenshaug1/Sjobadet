import type { OpeningHour } from '@prisma/client'

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

type OpeningHourLike = {
    type?: string | null;
    weekday?: number | null;
    opens?: string | null;
    closes?: string | null;
    active?: boolean | null;
}

type OpeningHourOverrideLike = {
    date?: string | Date | null;
    opens?: string | null;
    closes?: string | null;
    active?: boolean | null;
    note?: string | null;
}

const formatDayKey = (value: Date, timeZone: string) => {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(value)
}

export function getOverrideForDate(
    overrides: OpeningHourOverrideLike[] | undefined | null,
    date: Date = new Date(),
    timeZone: string = 'Europe/Oslo'
) {
    if (!overrides || overrides.length === 0) return null

    const targetKey = formatDayKey(date, timeZone)

    return overrides.find((override) => {
        if (!override?.date) return false
        const parsed = override.date instanceof Date ? override.date : new Date(override.date)
        if (Number.isNaN(parsed.getTime())) return false
        return formatDayKey(parsed, timeZone) === targetKey
    }) ?? null
}

export function formatSmartOpeningHours(openingHours: OpeningHourLike[] | undefined | null) {
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
