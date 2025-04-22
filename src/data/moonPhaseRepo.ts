'use server'
import * as dotenv from 'dotenv';
import { EventEntry } from "../lib/models";
import assert from "node:assert";
import axios from 'axios';
import { DateTime } from 'luxon';

export type MoonPhaseEntry = {
    Date: string,
    Phase: number,
    Name?: string
};

const phaseLookup: Record<number, string> = { 0: 'New Moon', 1: 'Waxing Crescent', 2: 'Full Moon', 3: 'Waning Crescent' };

export async function GetMoonPhaseByDate(isoDate: string, timezone: string): Promise<EventEntry | undefined> {

    const localDate = DateTime.fromISO(isoDate, { locale: timezone });
    assert(localDate.year >= 1700 && localDate.year <= 2082, "Year number out of range");

    const localDateStart = localDate.startOf('day');
    const localDateEnd = localDate.endOf('day');
    const utcDate = localDate.toUTC();
    const targetUtcDateFragment = utcDate.toISODate();

    const url = `https://craigchamberlain.github.io/moon-data/api/moon-phase-data/${utcDate.year}/`;
    const res = await axios.get(url);
    const phaseChanges = res.data as MoonPhaseEntry[];
    const match = phaseChanges.find((p) => p.Date.substring(0, 10) == targetUtcDateFragment);

    if (!match) {
        return undefined;
    }

    return {
        id: undefined, // cannot edit
        name: phaseLookup[match.Phase], // hydrate extra info
        description: 'Sourced from the Moon API (https://github.com/CraigChamberlain/moon-data)',
        timezone: timezone,
        startDateTime: localDateStart,
        endDateTime: localDateEnd,
        isAllDay: true
    };
}
