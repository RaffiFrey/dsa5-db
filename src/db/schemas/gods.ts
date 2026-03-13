import {integer, pgEnum, pgTable, varchar} from "drizzle-orm/pg-core";

export const godTypeEnum = pgEnum("good_type", ["Gottheit", "Erzdämon"]);

export const godsTable = pgTable("gods", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  aspects: varchar({ length: 255 }).array(),
  holy_symbol: varchar({ length: 255 }),
  secondName: varchar({ length: 255 }),
})