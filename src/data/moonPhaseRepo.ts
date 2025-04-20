'use server'
import * as dotenv from 'dotenv';
import { EventEntry, MoonPhaseEntry } from "../lib/models";
import assert from "node:assert";
import axios from 'axios';
import { DateTime } from 'luxon';


const phaseLookup:Record<number, string> = { 0: 'New Moon', 1: 'Waxing Crescent', 2: 'Full Moon', 3: 'Waning Crescent' };

export async function GetMoonPhaseByDate(isoDate:string, timezone:string): Promise<MoonPhaseEntry | undefined> {

    var utcDate = DateTime.fromISO(isoDate, { locale: timezone }).toUTC();
    assert(utcDate.year >= 1700 && utcDate.year <= 2082, "Year number out of range");

    const targetUtcDateFragment = utcDate.toISODate();
    const url = `https://craigchamberlain.github.io/moon-data/api/moon-phase-data/${utcDate.year}/`;
    const res = await axios.get(url);
    const phaseChanges = res.data as MoonPhaseEntry[];
    const match = phaseChanges.find((p) => p.Date.substring(0,10) == targetUtcDateFragment);
    
    if (match) {
        // hydrate extra info
        match.Name = phaseLookup[match.Phase];
    }

    return match;
}
