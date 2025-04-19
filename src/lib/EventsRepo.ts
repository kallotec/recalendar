'use server'
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from '../db/schema';
import * as dotenv from 'dotenv';
import { and, eq, gt, not } from "drizzle-orm/sqlite-core/expressions";
type EventEntry = typeof schema.events.$inferInsert;

export async function GetById(id: number): Promise<EventEntry> {
    const db = getClient();
    var res = await db.query.events.findFirst({
        where: eq(schema.events.id, id)
    });
    return res!;
}

export async function GetByDate(datetime: string): Promise<EventEntry[]> {
    const db = getClient();
    var results = await db.query.events.findMany({
        where: and(gt(schema.events.id, 0), eq(schema.events.start_date_utc, datetime))
    });
    return results.sort((a, b) => (a.start_time_utc < b.start_time_utc ? 1 : -1));
}

export async function Upsert(model: EventEntry): Promise<number> {
    console.log('upsert', JSON.stringify(model));
    const idParam: number = model.id as number;
    console.log('upsert id', idParam);

    if (idParam === undefined) {
        console.log('inserting', idParam);
        const db = getClient();
        const [{ id }] = await db
            .insert(schema.events)
            .values(model)
            .returning()
        return id;
    }
    else {
        console.log('updating', idParam);
        const db = getClient();
        await db
            .update(schema.events)
            .set({
                name: model.name,
                description: model.description,
                start_date_utc: model.start_date_utc,
                start_time_utc: model.start_time_utc,
                end_date_utc: model.end_date_utc,
                end_time_utc: model.end_time_utc
            })
            .where(eq(schema.events.id, idParam));
        return idParam;
    }
}

export async function Delete(id: number) {
    console.log('deleting', id);
    const db = getClient();
    return await db
        .delete(schema.events)
        .where(eq(schema.events.id, id));
}

function getClient() {
    dotenv.config();
    const client = createClient({ url: process.env.DATABASE_URL as string });
    return drizzle({ client, schema });
}