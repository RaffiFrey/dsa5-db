import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const magicPropertiesTable = pgTable("magic_properties", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar( { length: 255 }).notNull(),
  description: text().notNull(),
  propertyChecks: text().array()
});
