import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const combatSpecialAbilitiesTable = pgTable("combat_special_abilities", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  type: varchar({ length: 50 }).notNull(), // "passiv" | "Spezialmanöver" | "Basismanöver"
  description: text().notNull(),
  rules: text().notNull(),
  penalty: text(),                 // Erschwernis, e.g. "-2", "-4/-6", "+/-0"
  requirementsText: text(),        // Mixed attribute + SF requirements as free text
  combatTechniques: text().array(), // e.g. ["alle"] or ["Dolche", "Fechtwaffen"]
  apValue: integer().notNull(),
  apText: text(),                  // For tiered/variable AP costs
});
