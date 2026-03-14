import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const magicPropertiesTable = pgTable("magic_properties", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  propertyChecks: text().array(),
});

export const staffSpellsTable = pgTable("staff_spells", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  effect: text().notNull(),
  requirements: text(),
  volume: integer().notNull(),
  bindingCost: text(),
  propertyId: integer("property_id")
    .references(() => magicPropertiesTable.id, { onDelete: "set null" }),
  propertyNote: text(),              // For variable properties like "je nach Merkmal"
  apValue: integer().notNull(),
  apNote: text(),
});

