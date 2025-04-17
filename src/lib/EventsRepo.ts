'use server'
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from '../db/schema';
import * as dotenv from 'dotenv';
import { eq } from "drizzle-orm/sqlite-core/expressions";
type Event = typeof schema.events.$inferInsert;

export async function GetByDate(datetime: string): Promise<Event[]> {
    // TODO: Translate to local time
    const db = getClient();
    return db.query.events.findMany({
        where: eq(schema.events.start_date, datetime)
    });
}

export async function Upsert(model: Event): Promise<number> {

    const id: number = model.id as number;

    // TODO: Store dates/times in UTC

    if (id !== undefined) {

        const db = getClient();
        const [{ id }] = await db
            .insert(schema.events)
            .values(model)
            .returning({ id: schema.events.id });
        return id;
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
    const db = drizzle({ client, schema });
    return db;
}