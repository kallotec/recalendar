'use server'
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from '../db/schema';
import * as dotenv from 'dotenv';
import { eq } from "drizzle-orm/sqlite-core/expressions";
type Event = typeof schema.events.$inferInsert;

export async function GetByDate(date: string): Promise<Event[]> {
    const db = getClient();
    return db.query.events.findMany({
        where: eq(schema.events.date, date)
    });
}

export async function Insert(model: Event) {
    const db = getClient();
    return db.insert(schema.events).values(model).returning({ id: schema.events.id });
}

export async function Update(model: Event) {
    const db = getClient();
    return db
        .update(schema.events)
        .set({ name: model.name, date: model.date, time: model.time })
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