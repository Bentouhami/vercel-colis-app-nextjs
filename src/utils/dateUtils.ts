// src/utils/dateUtils.ts
import { parseISO, format, startOfWeek, endOfWeek, addWeeks } from 'date-fns';

export const formatDateRange = (start: Date, end: Date): string => {
    try {
        if (start.getMonth() === end.getMonth()) {
            return `${format(start, 'MMM d')}-${format(end, 'd')}`;
        }
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
    } catch (error) {
        console.error('Error formatting dates:', error);
        return 'Invalid date';
    }
};

export const getWeekDateRange = (isoWeek: string): { start: Date; end: Date } => {
    try {
        const [year, week] = isoWeek.split('-W').map(Number);
        const firstDayOfYear = parseISO(`${year}-01-01`);
        const start = startOfWeek(addWeeks(firstDayOfYear, week - 1), { weekStartsOn: 1 });
        const end = endOfWeek(start, { weekStartsOn: 1 });
        return { start, end };
    } catch (error) {
        console.error('Error parsing week:', isoWeek, error);
        const fallback = new Date();
        return { start: fallback, end: fallback };
    }
};

export const formatAxisDate = (date: string, timeRange: 'month' | 'week'): string => {
    try {
        if (timeRange === 'month') {
            return format(parseISO(`${date}-01`), 'MMM');
        }
        const { start, end } = getWeekDateRange(date);
        return formatDateRange(start, end);
    } catch (error) {
        console.error('Error formatting date:', date, error);
        return 'Invalid date';
    }
};