import { describe, it, expect } from 'vitest';
import {
    formatDateNoShortTitleCase,
    getRelativeDayLabel,
    getNextAvailableSlot,
    AvailabilityDays
} from '../availability-utils';

describe('availability-utils', () => {
    describe('formatDateNoShortTitleCase', () => {
        it('formats date correctly in Norwegian style', () => {
            const date = '2026-01-28';
            expect(formatDateNoShortTitleCase(date)).toBe('28. Jan');
        });

        it('handles different months correctly', () => {
            expect(formatDateNoShortTitleCase('2026-02-15')).toBe('15. Feb');
            expect(formatDateNoShortTitleCase('2026-05-01')).toBe('1. Mai');
        });

        it('returns fallback for invalid date', () => {
            expect(formatDateNoShortTitleCase('invalid')).toBe('Ukjent dato');
        });
    });

    describe('getRelativeDayLabel', () => {
        const now = new Date('2026-01-26T12:00:00Z'); // Monday

        it('returns "i dag" for today', () => {
            expect(getRelativeDayLabel('2026-01-26', now)).toBe('i dag');
        });

        it('returns "i morgen" for tomorrow', () => {
            expect(getRelativeDayLabel('2026-01-27', now)).toBe('i morgen');
        });

        it('returns weekday name for other days', () => {
            expect(getRelativeDayLabel('2026-01-28', now)).toBe('onsdag');
            expect(getRelativeDayLabel('2026-01-29', now)).toBe('torsdag');
        });
    });

    describe('getNextAvailableSlot', () => {
        const now = new Date('2026-01-26T10:00:00'); // 10:00 local time (approx)

        const days: AvailabilityDays = {
            '2026-01-26': [
                { from: '09:00', to: '10:00', availableSpots: 5 }, // Past
                { from: '11:00', to: '12:00', availableSpots: 0 }, // Full
                { from: '14:00', to: '15:00', availableSpots: 2 }, // Available today
            ],
            '2026-01-27': [
                { from: '08:00', to: '09:00', availableSpots: 10 }
            ]
        };

        it('finds the next available slot today', () => {
            const result = getNextAvailableSlot(days, new Date('2026-01-26T10:00:00'));
            expect(result?.slot.from).toBe('14:00');
            expect(result?.date).toBe('2026-01-26');
        });

        it('finds slot tomorrow if none left today', () => {
            const result = getNextAvailableSlot(days, new Date('2026-01-26T15:00:00'));
            expect(result?.slot.from).toBe('08:00');
            expect(result?.date).toBe('2026-01-27');
        });

        it('returns null if no slots in 7 days', () => {
            const emptyDays: AvailabilityDays = {
                '2026-01-26': [{ from: '09:00', to: '10:00', availableSpots: 0 }]
            };
            expect(getNextAvailableSlot(emptyDays, now)).toBeNull();
        });
    });
});
