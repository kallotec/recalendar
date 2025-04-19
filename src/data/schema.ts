import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { getLocalTime, formatDateAsISO, formatTimeAsISO, convertLocalToUtc, convertUtcToLocal } from '@/lib/dateConversion';
import { EventEntry } from "@/lib/models";
import { bigint } from "drizzle-orm/mysql-core";

export const events = sqliteTable("events", {
  id: integer().primaryKey(),
  name: text().notNull(),
  description: text(),
  start_date_utc: text().notNull(), // store date separate string component, as we will commonly query for events on a particular date
  start_time_utc: text().notNull(),
  end_date_utc: text().notNull(),
  end_time_utc: text().notNull(),
  // start_time_ms_utc: text().notNull() // this would be bigint but SQLITE doesn't have a bigint type, and we can still sort on text well enough
  // end_time_ms_utc: text().notNull() // this would be bigint but SQLITE doesn't have a bigint type, and we can still sort on text well enough
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
  console.debug('mapToDbSchema', JSON.stringify(event));

  var utcStartDateTime = convertLocalToUtc(event.start_date_local, event.start_time_local);
  var utcStartDate = utcStartDateTime.split(" ")[0];
  var utcStartTime = utcStartDateTime.split(" ")[1];
  var utcEndDateTime = convertLocalToUtc(event.end_date_local, event.end_time_local);
  var utcEndDate = utcEndDateTime.split(" ")[0];
  var utcEndTime = utcEndDateTime.split(" ")[1];

  var row: EventSchema = {
    id: event.id,
    name: event.name,
    description: event.description,
    start_date_utc: utcStartDate,
    start_time_utc: utcStartTime,
    end_date_utc: utcEndDate,
    end_time_utc: utcEndTime,
  };
  console.debug('row', JSON.stringify(row));
  return row;
}

export function mapToModel(event: EventSchema) {
  if (event === undefined || event === null) {
    return undefined;
  }
  console.debug('mapToModel', JSON.stringify(event));

  var localStartDateTime = convertUtcToLocal(event.start_date_utc, event.start_time_utc);
  var localStartDate = localStartDateTime.split(" ")[0];
  var localStartTime = localStartDateTime.split(" ")[1];
  var localEndDateTime = convertUtcToLocal(event.end_date_utc, event.end_time_utc);
  var localEndDate = localEndDateTime.split(" ")[0];
  var localEndTime = localEndDateTime.split(" ")[1];

  var model: EventEntry = {
    id: event.id,
    name: event.name,
    description: event.description ?? undefined,
    start_date_local: localStartDate,
    start_time_local: localStartTime,
    end_date_local: localEndDate,
    end_time_local: localEndTime,
  };
  console.debug('model', JSON.stringify(model));
  return model;
}
