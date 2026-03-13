import "dotenv/config";
import { godsTable, conditionsTable, conditionLevelsTable, status } from "./schemas";
import godsData from "../../data/gods/gods_demons.json";
import conditionsData from "../../data/gameplay/conditions.json";
import conditionLevelsData from "../../data/gameplay/condition_levels.json";
import statusData from "../../data/gameplay/status.json";
import db from "./index";
import {sql} from "drizzle-orm";

async function seed() {

  console.log("🌱 Seeding database");
  console.log("🌱 Seeding gods & demons...");
  await db.execute(sql`TRUNCATE TABLE gods RESTART IDENTITY`);
  let entries = 0;
  const godValues = godsData.map(entry => ({
    name: entry.name,
    god_type: entry.god_type as "Gottheit" | "Erzdämon",
    aspects: entry.aspects,
    holy_symbol: entry.holy_symbol || null,
    secondName: entry.secondName ?? null,
  }));
  entries += godValues.length;
  await db.insert(godsTable).values(godValues);

  console.log("🌱 Seeding conditions...");
  const conditionValues = conditionsData.map(entry => ({
    name: entry.name,
    description: entry.description,
  }));
  entries += conditionValues.length;
  await db.insert(conditionsTable).values(conditionValues);

  const conditions = await db.select().from(conditionsTable);
  const conditionMap = new Map(conditions.map(c => [c.name, c.id]));

  const conditionLevelValues = conditionLevelsData.map(entry => ({
    conditionId: conditionMap.get(entry.condition)!,
    level: entry.level,
    effect: entry.effect,
  }))
  entries += conditionLevelValues.length;
  await db.insert(conditionLevelsTable).values(conditionLevelValues);

  console.log("🌱 Seeding status...");
  const statusValues = statusData.map(entry => ({
    name: entry.name,
    description: entry.description,
  }));
  entries += statusValues.length;
  await db.insert(status).values(statusValues);

  console.log(`✅ ${entries} entries added.`);
  process.exit(0);
}

seed().catch(error => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
})