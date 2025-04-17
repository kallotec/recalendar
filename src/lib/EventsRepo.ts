'use server'
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from '../db/schema';
import * as dotenv from 'dotenv';
import { eq } from "drizzle-orm/sqlite-core/expressions";
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
        where: eq(schema.events.start_date, datetime)
    });
    return results.sort((a, b) => (a.start_time < b.start_time ? 1 : -1));
}

export async function Upsert(model: EventEntry): Promise<number> {
    console.log('upsert', JSON.stringify(model));
    const id: number = model.id as number;
    console.log('upsert id', id);

    if (id !== undefined) {
        const db = getClient();
        const [{ newId }] = await db
            .insert(schema.events)
            .values(model)
            .returning({ newId: schema.events.id });
        return newId;
    }
    else {
        const db = getClient();
        await db
            .update(schema.events)
            .set({
                name: model.name,
                description: model.description,
                start_date: model.start_date,
                start_time: model.start_time,
                end_date: model.end_date,
                end_time: model.end_time
            })
            .where(eq(schema.events.id, id));
        return id;
    }
}

export async function Delete(id: number) {
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