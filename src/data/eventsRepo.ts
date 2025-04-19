'use server'
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from './schema';
import * as dotenv from 'dotenv';
import { and, eq, gt } from "drizzle-orm/sqlite-core/expressions";
import { EventEntry } from "../lib/models";
import assert from "node:assert";

export async function GetById(id: number): Promise<EventEntry> {
    assert(id > 0, "id arg not specified");
    const db = getClient();
    var res = await db.query.events.findFirst({
        where: eq(schema.events.id, id)
    });
    return schema.mapToModel(res!)!;
}

export async function GetByDate(datetime: string): Promise<EventEntry[]> {
    assert(datetime?.length > 0, "datetime arg not specified");
    const db = getClient();
    var results = await db.query.events.findMany({
        where: and(gt(schema.events.id, 0), eq(schema.events.start_date_utc, datetime))
    });
    return results!
        .sort((a, b) => (a.start_time_utc < b.start_time_utc ? 1 : -1))
        .map((e: schema.EventSchema) => schema.mapToModel(e)!);
}

export async function Upsert(model: EventEntry): Promise<number> {
    assert(model, "model arg not specified");
    const idParam: number = model.id as number;
    const row = schema.mapToDbSchema(model)!;

    if (idParam === undefined) {
        const db = getClient();
        const [{ id }] = await db
            .insert(schema.events)
            .values(row)
            .returning()
        return id;
    }
    else {
        const db = getClient();
        await db
            .update(schema.events)
            .set({
                name: row.name,
                description: row.description,
                start_date_utc: row.start_date_utc,
                start_time_utc: row.start_time_utc,
                end_date_utc: row.end_date_utc,
                end_time_utc: row.end_time_utc
            })
            .where(eq(schema.events.id, idParam));
        return idParam;
    }
}

export async function Delete(id: number) {
    assert(id, "id not specified");
    const db = getClient();
    return await db
        .delete(schema.events)
        .where(eq(schema.events.id, id));
}

function getClient() {
    dotenv.config();
    const dbUrl = process.env.DATABASE_URL as string;
    assert(dbUrl?.length > 0, "db url not set");
    const client = createClient({ url: dbUrl });
    return drizzle({ client, schema });
}