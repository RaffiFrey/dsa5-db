import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const advantagesTable = pgTable("advantages", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  rules: text().notNull(),
  range: text(),
  actions: text(),
  requirements: text(),
  apValue: integer().notNull(),
  apText: text(),
});

export const disadvantagesTable = pgTable("disadvantages", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  rules: text().notNull(),
  range: text(),
  actions: text(),
  requirements: text(),
  apValue: integer().notNull(),
  apText: text(),
});
