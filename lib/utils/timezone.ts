import { parseISO } from 'date-fns';
import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

/**
 * Get the user's timezone from the browser
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Convert a timestamp to a Date object in the user's timezone
 */
export function timestampToDate(timestamp: number): Date {
  const timezone = getUserTimezone();
  return toZonedTime(new Date(timestamp), timezone);
}

/**
 * Convert a Date object to a timestamp, accounting for timezone
 */
export function dateToTimestamp(date: Date): number {
  const timezone = getUserTimezone();
  return fromZonedTime(date, timezone).getTime();
}

/**
 * Format a timestamp with timezone awareness
 */
export function formatTimestamp(
  timestamp: number,
  formatString: string = "dd 'de' MMMM, yyyy 'às' HH:mm"
): string {
  const timezone = getUserTimezone();
  return formatInTimeZone(new Date(timestamp), timezone, formatString, {
    locale: ptBR,
  });
}

/**
 * Get current timestamp in user's timezone
 */
export function getCurrentTimestamp(): number {
  return Date.now();
}

/**
 * Create a timestamp from date and time strings
 */
export function createTimestampFromDateTime(
  dateString: string,
  timeString: string
): number {
  const timezone = getUserTimezone();
  const dateTimeString = `${dateString}T${timeString}`;
  const date = parseISO(dateTimeString);
  return fromZonedTime(date, timezone).getTime();
}

/**
 * Get start of day timestamp
 */
export function getStartOfDay(timestamp: number): number {
  const timezone = getUserTimezone();
  const date = toZonedTime(new Date(timestamp), timezone);
  date.setHours(0, 0, 0, 0);
  return fromZonedTime(date, timezone).getTime();
}

/**
 * Get end of day timestamp
 */
export function getEndOfDay(timestamp: number): number {
  const timezone = getUserTimezone();
  const date = toZonedTime(new Date(timestamp), timezone);
  date.setHours(23, 59, 59, 999);
  return fromZonedTime(date, timezone).getTime();
}

