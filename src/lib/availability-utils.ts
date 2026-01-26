export type AvailabilitySlot = {
    from: string;
    to: string;
    availableSpots: number;
};

export type AvailabilityDays = Record<string, AvailabilitySlot[]>;

const parseMinutes = (timeStr?: string | null) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(/[:.]/).map((v) => parseInt(v, 10));
    if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
    return h * 60 + m;
};

/**
 * Returns date in format "28. Jan" (Norwegian style)
 */
export function formatDateNoShortTitleCase(date: string | Date, timeZone: string = 'Europe/Oslo'): string {
    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(d.getTime())) return 'Ukjent dato';

        const formatter = new Intl.DateTimeFormat('nb-NO', {
            day: 'numeric',
            month: 'short',
            timeZone,
        });

        const parts = formatter.formatToParts(d);
        const day = parts.find(p => p.type === 'day')?.value;
        let month = parts.find(p => p.type === 'month')?.value || '';

        // Title case for month abbreviation (Jan, Feb, etc.)
        if (month.length > 0) {
            // Remove trailing dot if present (nb-NO often includes it)
            if (month.endsWith('.')) {
                month = month.slice(0, -1);
            }
            month = month.charAt(0).toUpperCase() + month.slice(1);
        }

        return `${day}. ${month}`;
    } catch {
        return 'Ukjent dato';
    }
}

/**
 * Returns time in format "06:00"
 */
export function formatTimeNo(date: string | Date, timeZone: string = 'Europe/Oslo'): string {
    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(d.getTime())) return '00:00';

        return new Intl.DateTimeFormat('nb-NO', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone,
        }).format(d);
    } catch {
        return '00:00';
    }
}

/**
 * Returns relative day label: "i dag", "i morgen" or weekday name
 */
export function getRelativeDayLabel(date: string | Date, now: Date = new Date(), timeZone: string = 'Europe/Oslo'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';

    const osloNow = new Date(now.toLocaleString('en-US', { timeZone }));
    const targetDate = new Date(d.toLocaleString('en-US', { timeZone }));

    const today = new Date(osloNow.getFullYear(), osloNow.getMonth(), osloNow.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    if (target.getTime() === today.getTime()) return 'i dag';
    if (target.getTime() === tomorrow.getTime()) return 'i morgen';

    return new Intl.DateTimeFormat('nb-NO', { weekday: 'long', timeZone }).format(d).toLowerCase();
}

export function getNextAvailableSlot(
    days: AvailabilityDays | null | undefined,
    now: Date = new Date(),
    timeZone: string = 'Europe/Oslo'
): { date: string; slot: AvailabilitySlot } | null {
    if (!days) return null;

    const osloNow = new Date(now.toLocaleString('en-US', { timeZone }));
    const todayKey = new Intl.DateTimeFormat('sv-SE', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(osloNow);

    const dayKeys = Object.keys(days).filter(Boolean).sort();
    if (dayKeys.length === 0) return null;

    const nowMinutes = osloNow.getHours() * 60 + osloNow.getMinutes();

    for (const day of dayKeys) {
        if (day < todayKey) continue;
        const slots = (days[day] || [])
            .filter((s) => Number.isFinite(s.availableSpots) && s.availableSpots > 0)
            .sort((a, b) => (a.from || '').localeCompare(b.from || ''));

        for (const slot of slots) {
            const startMinutes = parseMinutes(slot.from);
            if (startMinutes === null) continue;

            if (day === todayKey) {
                // For today, only consider slots that haven't started yet
                if (startMinutes <= nowMinutes) continue;
            }

            return { date: day, slot };
        }
    }

    return null;
}
