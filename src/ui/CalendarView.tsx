'use client'
import DatePicker from './DatePicker';
import * as schema from '../db/schema';
type Event = typeof schema.events.$inferInsert;

export default function CalendarView(
    { selectedDate, eventList, onSelectedDatechanged }:
        { selectedDate: string, eventList: Event[], onSelectedDatechanged: (d: string) => void }) {
    return <>
        <div>
            <DatePicker selectedDate={selectedDate} onChange={onSelectedDatechanged} />
            <ul>
                {eventList.map((e: Event) => (
                    <li key={e.id}>{e.time}: {e.name}</li>
                ))}
            </ul>
        </div>
    </>
}