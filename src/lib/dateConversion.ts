import assert from "node:assert";

export function getLocalTime(addHours: number = 0): Date {
    const now = new Date(); // uses local time
    if (addHours > 0) {
        const hoursToAdd = addHours * 60 * 60 * 1000;
        now.setTime(now.getTime() + hoursToAdd);
    }
    return now;
}

export function convertUtcToLocal(date_utc: string, time_utc: string): string {
    var { year, month, day, hour, minute } = extractIsoDate(date_utc + " " + time_utc);
    const d = new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0));
    return formatDateAsISO(d) + " " + formatTimeAsISO(d, false);
}

export function convertLocalToUtc(date_local: string, time_local: string): string {
    var { year, month, day, hour, minute } = extractIsoDate(date_local + " " + time_local);
    const d = new Date(year, month - 1, day, hour, minute, 0, 0);
    return formatDateAsISO(d) + " " + formatTimeAsISO(d, false);
}

export function extractIsoDate(dateTimeStr: string) {
    console.debug(dateTimeStr);
    const formatChecker = new RegExp(/([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2})/g);
    const isValidIsoString = formatChecker.test(dateTimeStr);
    assert(isValidIsoString, "invalid datetime iso string");
    const components = dateTimeStr.split(" ");
    const dateStr = components[0];
    const timeStr = components[1];
    const result = {
        year: +dateStr.substring(0, 4),   // 2025-04-19 
        month: +dateStr.substring(5, 7),  // 01234567890
        day: +dateStr.substring(8, 10),
        hour: +timeStr.substring(0, 2),   // 16:00
        minute: +timeStr.substring(3, 5), // 012345
    };
    console.debug(result);
    return result;
}

export function formatDateAsISO(d: Date): string {
    return `${d.getFullYear()}-${padNumWithZeros(d.getMonth() + 1)}-${padNumWithZeros(d.getDate())}`;
}

export function formatTimeAsISO(d: Date, removeMinutes: Boolean = true): string {
    const hrs = d.getHours();
    const mins = (removeMinutes ? 0 : d.getMinutes());
    return `${padNumWithZeros(hrs)}:${padNumWithZeros(mins)}`;
}

const padNumWithZeros = (n: number, c: number = 2) => n.toString().padStart(c, '0');
