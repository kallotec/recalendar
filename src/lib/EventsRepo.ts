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

export async function Insert(model: Event) {
    // TODO: Store in UTC
    const db = getClient();
    return db.insert(schema.events).values(model).returning({ id: schema.events.id });
}

export async function Update(model: Event) {
    // TODO: Store in UTC
    const db = getClient();
    return db
        .update(schema.events)
        .set({ 
            name: model.name, 
            description: model.description,
            start_date: model.start_date,
            start_time: model.start_time,
            end_date: model.end_date,
            end_time: model.end_time
        })
        .where(eq(schema.events.id, model.id as number));
}

export async function Delete(id: number) {
    const db = getClient();
    return db
        .delete(schema.events)
        .where(eq(schema.events.id, id));
}

function getClient() {
    dotenv.config();
    const client = createClient({ url: process.env.DATABASE_URL as string });
    const db = drizzle({ client, schema });
    return db;
}