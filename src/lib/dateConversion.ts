import assert from "node:assert";
import { DateTime } from 'luxon';

export function getLocalTime(timezone: string, addHours: number = 0): DateTime {
    return DateTime.now().setZone(timezone).plus({ hours: addHours });
}

export function parseIsoLocalDateAndTime(dateStrLocalIso: string, timeStrLocalIso: string, tz: string): DateTime {
    var isoLocalDateTime = dateStrLocalIso + " " + timeStrLocalIso;
    return DateTime.fromISO(isoLocalDateTime, { zone: tz });
}

export function getStartAndEndOfDayInMsUtc(dateIsoLocal: string, timezone: string) {
    var d = DateTime.fromISO(dateIsoLocal, { locale: timezone }).toUTC();
    return {
        startMs: d.startOf('day').toMillis(),
        endMs: d.endOf('day').toMillis()
    }
}