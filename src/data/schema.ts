import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { getLocalTime } from '@/lib/dateConversion';
import { EventEntry } from "@/lib/models";
import { DateTime } from "luxon";
import assert from "node:assert";

export const timezoneLocalNZ = 'Pacific/Auckland';
const timezoneUtc: string = 'utc';

export const events = sqliteTable("events", {
  id: integer().primaryKey(),
  name: text().notNull(),
  description: text(),
  timezone: text().notNull(),
  start_datetime_utc: text().notNull(), // this would be bigint but SQLITE doesn't have a bigint type, and we can still sort on text well enough
  end_datetime_utc: text().notNull() // this would be bigint but SQLITE doesn't have a bigint type, and we can still sort on text well enough
});

export type EventSchema = typeof events.$inferInsert;

export function validateEvent(event: EventEntry): string[] {
  const nameValid = event.name?.length > 0;
  const errors: string[] = [];

  if (!nameValid) {
    errors.push('Name is a required field');
  }

  const startEndDateValid = (event.startDateTime <= event.endDateTime); // works due to ISO string format
  if (!startEndDateValid) {
    errors.push('Start Date must be before End Date');
  }

  return errors;
}

export function generateNewEventEntry(isoDate: string, timezone: string): EventEntry {
  
  const today = DateTime.now().setZone(timezone);
  const d = DateTime.fromISO(isoDate, { locale: timezone })
    .plus({ hours: today.hour + 1, minutes: today.minute })
    .startOf('hour');

  const newEvent: EventEntry = {
    id: undefined,
    name: '',
    description: '',
    timezone: timezone,
    startDateTime: d,
    endDateTime: d.plus({ hours: 1 }),
    isAllDay: false
  };

  return newEvent;
}

export function mapToDbSchema(event: EventEntry): EventSchema {
  assert(event, "mapToDbSchema: event is not specified");

  const row: EventSchema = {
    id: event.id,
    name: event.name,
    description: event.description,
    timezone: timezoneLocalNZ, // hardcoded for this assignment, would be pulled from a User record normally
    start_datetime_utc: event.startDateTime.toUTC().toSeconds().toString(),
    end_datetime_utc: event.endDateTime.toUTC().toSeconds().toString(),
  };
  return row;
}

export function mapToModel(event: EventSchema): EventEntry {
  assert(event, "mapToModel: event is not specified");

  const startDate = DateTime
    .fromSeconds(parseInt(event.start_datetime_utc), { locale: timezoneUtc })
    .setZone(event.timezone);

  const endDate = DateTime
    .fromSeconds(parseInt(event.end_datetime_utc), { locale: timezoneUtc })
    .setZone(event.timezone);

  const model: EventEntry = {
    id: event.id,
    name: event.name,
    timezone: event.timezone,
    description: event.description ?? undefined,
    startDateTime: startDate,
    endDateTime: endDate,
    isAllDay: false
  };

  return model;
}
