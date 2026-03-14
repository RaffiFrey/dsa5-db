import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const attributesTable = pgTable("attributes", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: text().notNull(),
  index: text().notNull(),
  description: text(),
});