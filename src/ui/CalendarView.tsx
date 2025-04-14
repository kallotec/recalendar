import { GetByDate, Delete, Insert, Update } from '@/lib/EventsRepo';
import * as schema from '../db/schema';
type Event = typeof schema.events.$inferInsert;

export default async function CalendarView() {
    let list = await GetByDate("2025-04-14");

    async function refreshList() {
        list = await GetByDate("2025-04-14");
    }
    async function insertEvent() {
        var [{id}] = await Insert({ name: "test", date: "2025-04-14", time: "21:58" });
        await refreshList();
    }
    return <>
        <div>
            Calendar View <button onClick={refreshList}>refresh</button> <button onClick={insertEvent}>insert</button>
            {list.map((e: Event) => (
                <div>{e.time}: {e.name}</div>
            ))}
        </div>
    </>
}