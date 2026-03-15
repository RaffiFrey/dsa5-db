import { boolean, integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { talentsTable } from "./characters";
import { advantagesTable, disadvantagesTable } from "./advantages";

export const socialStatusesTable = pgTable("social_statuses", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  level: integer().notNull().unique(),
  name: varchar({ length: 100 }).notNull(),
  examples: text().array(),
});

export const culturesTable = pgTable("cultures", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  occurrenceAndLifestyle: text(),
  worldViewAndReligion: text(),
  customs: text(),
  garbAndArmaments: text(),
  language: text().notNull(),
  script: text(),
  areaKnowledge: text(),
  commonMundaneProfessions: text().array(),
  commonMagicProfessions: text().array(),
  commonBlessedProfessions: text().array(),
  commonSkills: text().array(),
  uncommonSkills: text().array(),
  commonMaleNames: text().array(),
  commonFemaleNames: text().array(),
  commonFamilyNames: text().array(),
  nobleFamilies: text().array(),
  culturePackageApCost: integer(),
});

// Culture package: which talent bonuses belong to this culture
export const cultureTalentPackageTable = pgTable("culture_talent_package", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  cultureId: integer("culture_id")
    .notNull()
    .references(() => culturesTable.id, { onDelete: "cascade" }),
  talentId: integer("talent_id")
    .notNull()
    .references(() => talentsTable.id, { onDelete: "cascade" }),
  value: integer().notNull(),
});

// Common & uncommon advantages per culture
export const cultureAdvantagesTable = pgTable("culture_advantages", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  cultureId: integer("culture_id")
    .notNull()
    .references(() => culturesTable.id, { onDelete: "cascade" }),
  advantageId: integer("advantage_id")
    .notNull()
    .references(() => advantagesTable.id, { onDelete: "cascade" }),
  isCommon: boolean("is_common").notNull().default(true),
  note: text(),
});

// Common & uncommon disadvantages per culture
export const cultureDisadvantagesTable = pgTable("culture_disadvantages", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  cultureId: integer("culture_id")
    .notNull()
    .references(() => culturesTable.id, { onDelete: "cascade" }),
  disadvantageId: integer("disadvantage_id")
    .notNull()
    .references(() => disadvantagesTable.id, { onDelete: "cascade" }),
  isCommon: boolean("is_common").notNull().default(true),
  note: text(),
});

// Social status per culture (FK mapping)
export const cultureSocialStatusesTable = pgTable("culture_social_statuses", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  cultureId: integer("culture_id")
    .notNull()
    .references(() => culturesTable.id, { onDelete: "cascade" }),
  socialStatusId: integer("social_status_id")
    .notNull()
    .references(() => socialStatusesTable.id, { onDelete: "cascade" }),
});
