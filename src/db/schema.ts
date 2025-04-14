import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
  id: integer().primaryKey(),
  name: text().notNull(),
  date: text().notNull(),
  time: text().notNull()
});
