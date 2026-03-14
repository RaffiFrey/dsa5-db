import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const attributesTable = pgTable("attributes", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: text().notNull(),
  index: text().notNull(),
  description: text(),
});

export const derivedValuesTable = pgTable("derived_values", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: text().notNull(),
  index: text().notNull(),
  description: text(),
  formula: text(),
});

export const racesTable = pgTable("races", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: text().notNull(),
  LE: integer().notNull(),
  SK: integer().notNull(),
  ZK: integer().notNull(),
  GS: integer().notNull(),
  attribute: text().notNull(),
  advantages: text().array(),
  disadvantages: text().array(),
  apCost: integer().notNull(),
})