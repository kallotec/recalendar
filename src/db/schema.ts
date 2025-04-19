import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { getLocalTime, formatDateAsISO, formatTimeAsISO } from '@/lib/DateHelpers';

export const events = sqliteTable("events", {
  id: integer().primaryKey(),
  name: text().notNull(),
  description: text(),
  start_date_utc: text().notNull(), // store date separate string component, as we will commonly query for events on a particular date
  start_time_utc: text().notNull(),
  end_date_utc: text().notNull(),
  end_time_utc: text().notNull(),
});

export type EventEntry = typeof events.$inferInsert;

export function validateEvent(event: EventEntry): string[] {
  var nameValid = event.name?.length > 0;
  var errors: string[] = [];
  
  if (!nameValid) {
    errors.push('Name is a required field');
  }

  var startEndDateValid = (event.start_date_utc <= event.end_date_utc); // works due to ISO string format
  if (!startEndDateValid) {
    errors.push('Start Date must be before End Date');
  }

  var endTimeBeforeStartTime = (event.start_date_utc == event.end_date_utc && event.start_time_utc > event.end_time_utc)
  if (endTimeBeforeStartTime) {
    errors.push('Start Time must be before End Time');
  }

  return errors;
}

export function generateNewEventEntry(prepopulate: boolean): EventEntry {

  const newEvent:EventEntry = {
    id: undefined,
    name: '',
    description: '',
    start_date_utc: '',
    start_time_utc: '',
    end_date_utc: '',
    end_time_utc: ''
  };

  if (prepopulate) {
    var nowIn1Hour = getLocalTime(1);
    var nowIn2Hours = getLocalTime(2);
    newEvent.start_date_utc = formatDateAsISO(nowIn1Hour);
    newEvent.start_time_utc = formatTimeAsISO(nowIn1Hour, true);
    newEvent.end_date_utc = formatDateAsISO(nowIn2Hours);
    newEvent.end_time_utc = formatTimeAsISO(nowIn2Hours, true);
  }

  return newEvent;
}