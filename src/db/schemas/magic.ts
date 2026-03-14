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
  propertyNote: text(),
  apValue: integer().notNull(),
  apNote: text(),
});

export const familiarTricksTable = pgTable("familiar_tricks", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  effect: text().notNull(),
  animalTypes: text("animal_types").array().notNull(),
  aspCost: integer("asp_cost").notNull(),
  aspText: text("asp_text"),
  duration: text().notNull(),
  propertyId: integer("property_id")
    .references(() => magicPropertiesTable.id, { onDelete: "set null" }),
  propertyNote: text("property_note"),
  apValue: integer("ap_value").notNull(),
  apNote: text("ap_note"),
});

export const witchCursesTable = pgTable("witch_curses", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  check: text().array().notNull(),
  modifiedByZK: integer("modified_by_zk").notNull().default(0), // boolean as 0/1
  modifiedBySK: integer("modified_by_sk").notNull().default(0),
  effect: text().notNull(),
  aspCost: integer("asp_cost").notNull(),
  aspText: text("asp_text"),
  duration: text().notNull(),
  propertyId: integer("property_id")
    .notNull()
    .references(() => magicPropertiesTable.id, { onDelete: "restrict" }),
});

export const witchSpecialAbilitiesTable = pgTable("witch_special_abilities", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  rules: text().notNull(),
  requirements: text(),
  apValue: integer().notNull(),
});

export const cantripsTable = pgTable("cantrips", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  effect: text().notNull(),
  range: text().notNull(),
  duration: text().notNull(),
  targetCategory: text("target_category").notNull(),
  propertyId: integer("property_id")
    .notNull()
    .references(() => magicPropertiesTable.id, { onDelete: "restrict" }),
  apValue: integer("ap_value").notNull(),
});

export const elvenSongsTable = pgTable("elven_songs", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  check: text().array().notNull(),
  effect: text().notNull(),
  talent: text().notNull(),
  aspCost: integer("asp_cost").notNull(),
  aspText: text("asp_text"),
  duration: text().notNull(),
  propertyId: integer("property_id")
    .notNull()
    .references(() => magicPropertiesTable.id, { onDelete: "restrict" }),
  improvementCost: varchar({ length: 1 }).notNull(),
});

export const spellsTable = pgTable("spells", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  check: text().array().notNull(),
  modifiedByZK: integer("modified_by_zk").notNull().default(0),
  modifiedBySK: integer("modified_by_sk").notNull().default(0),
  effect: text().notNull(),
  castingDuration: integer("casting_duration").notNull(),
  aspCost: integer("asp_cost").notNull(),
  aspText: text("asp_text"),
  costsNotModifiable: integer("costs_not_modifiable").notNull().default(0),
  range: text().notNull(),
  duration: text().notNull(),
  targetCategory: text("target_category").notNull(),
  propertyId: integer("property_id")
    .notNull()
    .references(() => magicPropertiesTable.id, { onDelete: "restrict" }),
  distribution: text().array().notNull(),
  improvementCost: varchar({ length: 1 }).notNull(),
});

export const ritualsTable = pgTable("rituals", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  check: text().array().notNull(),
  effect: text().notNull(),
  ritualDuration: text("ritual_duration").notNull(), // Text, da "8 Stunden" / "30 Minuten"
  aspCost: integer("asp_cost").notNull(),
  aspText: text("asp_text"),
  costsNotModifiable: integer("costs_not_modifiable").notNull().default(0),
  range: text().notNull(),
  duration: text().notNull(),
  targetCategory: text("target_category").notNull(),
  propertyId: integer("property_id")
    .notNull()
    .references(() => magicPropertiesTable.id, { onDelete: "restrict" }),
  distribution: text().array().notNull(),
  improvementCost: varchar({ length: 1 }).notNull(),
});


