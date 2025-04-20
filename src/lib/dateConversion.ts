import assert from "node:assert";
import { DateTime } from 'luxon';

export function getLocalTime(timezone: string): DateTime {
    return DateTime.now()
    .setZone(timezone)
    .endOf('hour')
    .plus({ minutes: 1})
    .startOf('minute');
}

export function parseIsoLocalDateAndTime(dateStrLocalIso: string, timeStrLocalIso: string, tz: string): DateTime {
    var isoLocalDateTime = dateStrLocalIso + "T" + timeStrLocalIso;
    const dt = DateTime.fromISO(isoLocalDateTime, { zone: tz });
    return dt;
}

export function getStartAndEndOfDayInMsUtc(dateIsoLocal: string, timezone: string) {
    var startLocal = DateTime.fromISO(dateIsoLocal, { locale: timezone }).startOf('day');
    var endLocal = DateTime.fromISO(dateIsoLocal, { locale: timezone }).endOf('day');
    return {
        startMs: startLocal.toUTC().toSeconds(),
        endMs: endLocal.toUTC().toSeconds()
    }
}