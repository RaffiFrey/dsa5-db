import "dotenv/config";
import { godsTable } from "./schemas";
import godsData from "../../data/gods/gods_demons.json";
import db from "./index";
import {sql} from "drizzle-orm";

async function seed() {

  console.log("🌱 Seeding database");
  console.log("🌱 Seeding gods & demons...");
  await db.execute(sql`TRUNCATE TABLE gods RESTART IDENTITY`);
  const values = godsData.map(entry => ({
    name: entry.name,
    god_type: entry.god_type as "Gottheit" | "Erzdämon",
    aspects: entry.aspects,
    holy_symbol: entry.holy_symbol || null,
    secondName: entry.secondName ?? null,
  }));

  await db.insert(godsTable).values(values);

  console.log(`✅ ${values.length} entries added.`);
  process.exit(0);
}

seed().catch(error => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
})