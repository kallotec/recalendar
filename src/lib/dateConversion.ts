import { DateTime } from 'luxon';

export function getLocalTime(timezone: string): DateTime {
    return DateTime.now()
        .setZone(timezone)
        .endOf('hour')
        .plus({ minutes: 1 })
        .startOf('minute');
}

export function parseIsoLocalDateAndTime(dateStrLocalIso: string, timeStrLocalIso: string, tz: string): DateTime {
    const isoLocalDateTime = dateStrLocalIso + "T" + timeStrLocalIso;
    const dt = DateTime.fromISO(isoLocalDateTime, { zone: tz });
    return dt;
}

export function localIsoDateToUtc(dateIsoLocal: string, timezone: string) {
    return DateTime.fromISO(dateIsoLocal, { locale: timezone });
}

export function getStartAndEndOfDayInSecsUtc(dateIsoLocal: string, timezone: string) {
    const date = localIsoDateToUtc(dateIsoLocal, timezone);
    const startLocal = date.startOf('day');
    const endLocal = date.endOf('day');
    return {
        startSecs: startLocal.toUTC().toSeconds(),
        endSecs: endLocal.toUTC().toSeconds()
    }
}