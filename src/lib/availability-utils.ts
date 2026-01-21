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
                if (startMinutes <= nowMinutes) continue;
            }

            return { date: day, slot };
        }
    }

    return null;
}
