import {integer, pgEnum, pgTable, varchar, text} from "drizzle-orm/pg-core";
import { talentsTable } from "./characters";

export const godTypeEnum = pgEnum("good_type", ["Gottheit", "Erzdämon"]);

export const godsTable = pgTable("gods", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  god_type: godTypeEnum(),
  aspects: varchar({ length: 255 }).array(),
  holy_symbol: varchar({ length: 255 }),
  secondName: varchar({ length: 255 }),
});

export const churchTraditionsTable = pgTable("church_traditions", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  godId: integer("god_id")
    .notNull()
    .references(() => godsTable.id, { onDelete: "restrict" }),
  description: text().notNull(),
  leadingAttribute: varchar("leading_attribute", { length: 50 }).notNull(),
  requirements: text(),
  apValue: integer("ap_value").notNull(),
});

export const churchTraditionRulesTable = pgTable("church_tradition_rules", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  traditionId: integer("tradition_id")
    .notNull()
    .references(() => churchTraditionsTable.id, { onDelete: "cascade" }),
  rule: text().notNull(),
  order: integer().notNull(),
});

export const churchTraditionFavorableTalentsTable = pgTable("church_tradition_favorable_talents", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  traditionId: integer("tradition_id")
    .notNull()
    .references(() => churchTraditionsTable.id, { onDelete: "cascade" }),
  talentId: integer("talent_id")
    .references(() => talentsTable.id, { onDelete: "cascade" }),
  note: text(), // For non-talent entries like "alle Nahkampftechniken"
});

export const moralCodexEntriesTable = pgTable("moral_codex_entries", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  traditionId: integer("tradition_id")
    .notNull()
    .references(() => churchTraditionsTable.id, { onDelete: "cascade" }),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
});

export const churchTraditionRanksTable = pgTable("church_tradition_ranks", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  traditionId: integer("tradition_id")
    .notNull()
    .references(() => churchTraditionsTable.id, { onDelete: "cascade" }),
  rank: varchar({ length: 100 }).notNull(),
  title: varchar({ length: 255 }).notNull(),
  order: integer().notNull(),
});

export const blessingsTable = pgTable("blessings", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  effect: text().notNull(),
  range: text().notNull(),
  duration: text().notNull(),
  targetCategory: text("target_category").notNull(),
  aspect: varchar({ length: 100 }).notNull(),
  kapCost: integer("kap_cost").notNull().default(1),
  apValue: integer("ap_value").notNull().default(1),
});