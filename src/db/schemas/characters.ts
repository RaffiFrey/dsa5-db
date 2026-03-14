import {varchar, boolean, integer, pgTable, text} from "drizzle-orm/pg-core";

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
});

export const talentsTable = pgTable("talents", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: text().notNull(),
  use: text().array(),
  newApplication: text().array(),
  category: text().notNull(),
  check: text().array(),
  description: text().notNull(),
  applications: text().array(),
  encumbrance: boolean(),
  tools: text(),
  quality: text().notNull(),
  failedCheck: text().notNull(),
  criticalSuccess: text().notNull(),
  botch: text().notNull(),
  improvementCost: text().notNull(),
});

export const generalSpecialAbilitiesTable = pgTable("general_special_abilities", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  rules: text().notNull(),
  apValue: integer().notNull(),
  dynamicApText: text(),
  category: varchar({ length: 100 }),
  requirementsText: text(),
  noDisadvantage: text().array(),
  combinedTalentsLevel: integer(),
});

export const specialAbilityTalentRequirementsTable = pgTable("special_ability_talent_requirements", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  specialAbilityId: integer("special_ability_id")
    .notNull()
    .references(() => generalSpecialAbilitiesTable.id, { onDelete: "cascade" }),
  talentId: integer("talent_id")
    .notNull()
    .references(() => talentsTable.id, { onDelete: "cascade" }),
  level: integer().notNull(),
});

export const specialAbilityCombinedTalentRequirementsTable = pgTable("special_ability_combined_talent_requirements", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  specialAbilityId: integer("special_ability_id")
    .notNull()
    .references(() => generalSpecialAbilitiesTable.id, { onDelete: "cascade" }),
  talentId: integer("talent_id")
    .notNull()
    .references(() => talentsTable.id, { onDelete: "cascade" }),
});