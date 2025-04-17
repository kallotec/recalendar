import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { getLocalTime, formatDateAsISO, formatTimeAsISO } from '@/lib/DateHelpers';

export const events = sqliteTable("events", {
  id: integer().primaryKey(),
  name: text().notNull(),
  description: text(),
  start_date: text().notNull(), // store date separate string component, as we will commonly query for events on a particular date
  start_time: text().notNull(),
  end_date: text().notNull(),
  end_time: text().notNull()
});

export type EventEntry = typeof events.$inferInsert;

export function validateEvent(event: EventEntry): string[] {
  var nameValid = event.name?.length > 0;
  var errors: string[] = [];
  if (!nameValid) {
    errors.push('Name is a required field');
  }
  var startEndDateValid = (event.start_date <= event.end_date); // works due to ISO string format
  if (!startEndDateValid) {
    errors.push('Start Date must be before End Date');
  }
  return errors;
}

export function generateNewEventEntry(prepopulate: boolean): EventEntry {

  const newEvent:EventEntry = {
    id: undefined,
    name: '',
    description: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: ''
  };

  if (prepopulate) {
    var nowIn1Hour = getLocalTime(1);
    var nowIn2Hours = getLocalTime(2);
    newEvent.start_date = formatDateAsISO(nowIn1Hour);
    newEvent.start_time = formatTimeAsISO(nowIn1Hour, true);
    newEvent.end_date = formatDateAsISO(nowIn2Hours);
    newEvent.end_time = formatTimeAsISO(nowIn2Hours, true);
  }

  return newEvent;
}