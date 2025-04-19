import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { getLocalTime, formatDateAsISO, formatTimeAsISO } from '@/lib/dateConversion';
import { EventEntry } from "@/lib/models";

export const events = sqliteTable("events", {
  id: integer().primaryKey(),
  name: text().notNull(),
  description: text(),
  start_date_utc: text().notNull(), // store date separate string component, as we will commonly query for events on a particular date
  start_time_utc: text().notNull(),
  end_date_utc: text().notNull(),
  end_time_utc: text().notNull(),
});

export type EventSchema = typeof events.$inferInsert;

export function validateEvent(event: EventEntry): string[] {
  var nameValid = event.name?.length > 0;
  var errors: string[] = [];

  if (!nameValid) {
    errors.push('Name is a required field');
  }

  var startEndDateValid = (event.start_date_local <= event.end_date_local); // works due to ISO string format
  if (!startEndDateValid) {
    errors.push('Start Date must be before End Date');
  }

  var endTimeBeforeStartTime = (event.start_date_local == event.end_date_local && event.start_time_local > event.end_time_local)
  if (endTimeBeforeStartTime) {
    errors.push('Start Time must be before End Time');
  }

  return errors;
}

export function generateNewEventEntry(prepopulate: boolean): EventEntry {

  const newEvent: EventEntry = {
    id: undefined,
    name: '',
    description: '',
    start_date_local: '',
    start_time_local: '',
    end_date_local: '',
    end_time_local: ''
  };

  if (prepopulate) {
    var nowIn1Hour = getLocalTime(1);
    var nowIn2Hours = getLocalTime(2);
    newEvent.start_date_local = formatDateAsISO(nowIn1Hour);
    newEvent.start_time_local = formatTimeAsISO(nowIn1Hour, true);
    newEvent.end_date_local = formatDateAsISO(nowIn2Hours);
    newEvent.end_time_local = formatTimeAsISO(nowIn2Hours, true);
  }

  return newEvent;
}

export function mapToDbSchema(event: EventEntry) {
  if (event === undefined || event === null) {
    return undefined;
  }
  var row: EventSchema = {

  };
  return row;
}

export function mapToModel(event: EventSchema) {
  if (event === undefined || event === null) {
    return undefined;
  }
  var model: EventEntry = {

  };
  return model;
}
