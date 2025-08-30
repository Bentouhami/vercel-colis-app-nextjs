// path: src/utils/dateUtils.ts
import { parseISO, format, startOfWeek, endOfWeek, addWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDateRange = (start: Date, end: Date): string => {
    try {
        if (start.getMonth() === end.getMonth()) {
            return `${format(start, 'MMM d', { locale: fr })}-${format(end, 'd', { locale: fr })}`;
        }
        return `${format(start, 'MMM d', { locale: fr })} - ${format(end, 'MMM d', { locale: fr })}`;
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
        // Handle full ISO dates like YYYY-MM-DD (our summary endpoints)
        const parsed = parseISO(date);
        if (!isNaN(parsed.getTime())) {
            // For daily points, render day/month; keep it concise
            return timeRange === 'month' ? format(parsed, 'dd MMM', { locale: fr }) : format(parsed, 'dd/MM', { locale: fr });
        }

        // Handle YYYY-MM (month buckets)
        if (/^\d{4}-\d{2}$/.test(date)) {
            return format(parseISO(`${date}-01`), 'MMM', { locale: fr });
        }

        // Handle ISO week strings like YYYY-Wxx
        if (/^\d{4}-W\d{2}$/.test(date)) {
            const { start, end } = getWeekDateRange(date);
            return formatDateRange(start, end);
        }

        return date;
    } catch (error) {
        console.error('Error formatting date:', date, error);
        return 'Invalid date';
    }
};
