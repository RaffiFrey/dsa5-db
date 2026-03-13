import {integer, pgTable, varchar, text} from "drizzle-orm/pg-core";

export const conditionsTable = pgTable("conditions", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
});

export const conditionLevelsTable = pgTable("condition_levels", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  conditionId: integer("condition_id")
    .notNull()
    .references(() => conditionsTable.id, { onDelete: "cascade" }),
  level: integer().notNull(),
  effect: text().notNull(),
});

export const experienceLevelTable = pgTable("experience_levels", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: text().notNull(),
  startingAP: integer().notNull(),
  attributeMax: integer().notNull(),
  skillMax: integer().notNull(),
  combatSkillMax: integer().notNull(),
  attributeSumMax: integer().notNull(),
  maxSpells: integer().notNull(),
  maxForeignSpells: integer().notNull(),
});

export const status = pgTable("status", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: text().notNull(),
  description: text().notNull(),
});