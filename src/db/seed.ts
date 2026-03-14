import "dotenv/config";
import {
  attributesTable,
  derivedValuesTable,
  godsTable,
  conditionsTable,
  conditionLevelsTable,
  experienceLevelTable,
  status,
  talentsTable,
  racesTable,
  generalSpecialAbilitiesTable,
  specialAbilityTalentRequirementsTable,
  specialAbilityCombinedTalentRequirementsTable,
  advantagesTable,
  disadvantagesTable,
  culturesTable,
  cultureTalentPackageTable,
  cultureAdvantagesTable,
  cultureDisadvantagesTable,
  combatSpecialAbilitiesTable,
} from "./schemas";
import godsData from "../../data/gods/gods_demons.json";
import conditionsData from "../../data/gameplay/conditions.json";
import conditionLevelsData from "../../data/gameplay/condition_levels.json";
import experienceLevelsData from "../../data/gameplay/experience_levels.json";
import attributesData from "../../data/characters/attributes.json";
import derivedValuesData from "../../data/characters/derived_values.json";
import statusData from "../../data/gameplay/status.json";
import racesData from "../../data/characters/races.json";
import talentsData from "../../data/characters/talents.json";
import generalSpecialAbilitiesData from "../../data/gameplay/general_special_abilities.json";
import advantagesData from "../../data/characters/advantages.json";
import disadvantagesData from "../../data/characters/disadvantages.json";
import culturesData from "../../data/characters/cultures.json";
import combatSpecialAbilitiesData from "../../data/gameplay/combat_special_abilities.json";
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

  console.log("🌱 Seeding attributes...");
  const attributeValues = attributesData.map(entry => ({
    name: entry.name,
    description: entry.description,
    index: entry.index,
  }));
  entries += attributeValues.length;
  await db.insert(attributesTable).values(attributeValues);

  console.log("🌱 Seeding talents...");
  const talentValues = talentsData.map(entry => ({
    name: entry.name,
    use: entry.use,
    newApplication: entry.newApplication,
    category: entry.category,
    check: entry.check,
    description: entry.description,
    applications: entry.applications,
    encumbrance: entry.encumbrance,
    tools: entry.tools,
    quality: entry.quality,
    failedCheck: entry.failedCheck,
    criticalSuccess: entry.criticalSuccess,
    botch: entry.botch,
    improvementCost: entry.improvementCost,
  }));

  entries += talentValues.length;
  await db.insert(talentsTable).values(talentValues);

  const talents = await db.select().from(talentsTable);
  const talentMap = new Map(talents.map(t => [t.name, t.id]));

  console.log("🌱 Seeding derived values...");
  const derivedValues = derivedValuesData.map(entry => ({
    name: entry.name,
    description: entry.description,
    index: entry.index,
    formula: entry.formula,
  }))
  entries += derivedValues.length;
  await db.insert(derivedValuesTable).values(derivedValues);

  console.log("🌱 Seeding races...");
  const raceValues = racesData.map(entry => ({
    name: entry.name,
    LE: entry.LE,
    SK: entry.SK,
    ZK: entry.ZK,
    GS: entry.GS,
    attribute: entry.attribute,
    advantages: entry.advantages,
    disadvantages: entry.disadvantages,
    apCost: entry.apCost,
  }));
  entries += raceValues.length;
  await db.insert(racesTable).values(raceValues);

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

  console.log("🌱 Seeding experience levels...");
  const experienceLevelValues = experienceLevelsData.map(entry => ({
    name: entry.name,
    startingAP: entry.startingAP,
    attributeMax: entry.attributeMax,
    skillMax: entry.skillMax,
    combatSkillMax: entry.combatSkillMax,
    attributeSumMax: entry.attributeSumMax,
    maxSpells: entry.maxSpells,
    maxForeignSpells: entry.maxForeignSpells,
  }));
  entries += experienceLevelValues.length;
  await db.insert(experienceLevelTable).values(experienceLevelValues);


  console.log("🌱 Seeding status...");
  const statusValues = statusData.map(entry => ({
    name: entry.name,
    description: entry.description,
  }));
  entries += statusValues.length;
  await db.insert(status).values(statusValues);

  console.log("🌱 Seeding general special abilities...");
  const generalSpecialAbilitiesFiltered = generalSpecialAbilitiesData.filter(entry => entry.name);

  for (const entry of generalSpecialAbilitiesFiltered) {
    // Special Ability einfügen
    const [specialAbility] = await db.insert(generalSpecialAbilitiesTable).values({
      name: entry.name,
      description: entry.description,
      rules: entry.rules,
      apValue: entry.apValue,
      dynamicApText: entry.dynamicApText || null,
      category: entry.category || null,
      requirementsText: entry.requirements.text || null,
      noDisadvantage: entry.requirements.noDisadvantage.length > 0 ? entry.requirements.noDisadvantage : null,
      combinedTalentsLevel: entry.requirements.combinedTalents.level > 0 ? entry.requirements.combinedTalents.level : null,
    }).returning();

    entries++;

    // Talent Requirements einfügen
    if (entry.requirements.talents.length > 0) {
      const talentReqs = entry.requirements.talents
        .map(req => {
          const talentId = talentMap.get(req.talent);
          if (!talentId) {
            console.warn(`⚠️ Talent nicht gefunden: ${req.talent} für ${entry.name}`);
            return null;
          }
          return {
            specialAbilityId: specialAbility.id,
            talentId,
            level: req.level,
          };
        })
        .filter(Boolean);

      if (talentReqs.length > 0) {
        await db.insert(specialAbilityTalentRequirementsTable).values(talentReqs as any);
        entries += talentReqs.length;
      }
    }

    // Combined Talent Requirements einfügen
    if (entry.requirements.combinedTalents.talents.length > 0) {
      const combinedReqs = entry.requirements.combinedTalents.talents
        .map(talentName => {
          const talentId = talentMap.get(talentName as string);
          if (!talentId) {
            console.warn(`⚠️ Combined Talent nicht gefunden: ${talentName} für ${entry.name}`);
            return null;
          }
          return {
            specialAbilityId: specialAbility.id,
            talentId,
          };
        })
        .filter(Boolean);

      if (combinedReqs.length > 0) {
        await db.insert(specialAbilityCombinedTalentRequirementsTable).values(combinedReqs as any);
        entries += combinedReqs.length;
      }
    }
  }

  console.log("🌱 Seeding advantages...");
  const advantageValues = advantagesData
    .filter(entry => entry.name)
    .map(entry => ({
      name: entry.name,
      description: entry.description,
      rules: entry.rules,
      range: entry.range || null,
      actions: entry.actions || null,
      requirements: entry.requirements || null,
      apValue: entry.apValue,
      apText: (entry as any).apText || null,
    }));
  entries += advantageValues.length;
  await db.insert(advantagesTable).values(advantageValues);

  console.log("🌱 Seeding disadvantages...");
  const disadvantageValues = disadvantagesData
    .filter(entry => entry.name)
    .map(entry => ({
      name: entry.name,
      description: entry.description,
      rules: entry.rules,
      range: entry.range || null,
      actions: entry.actions || null,
      requirements: entry.requirements || null,
      apValue: entry.apValue,
      apText: (entry as any).apText || null,
    }));
  entries += disadvantageValues.length;
  await db.insert(disadvantagesTable).values(disadvantageValues);

  const advantages = await db.select().from(advantagesTable);
  const advantageMap = new Map(advantages.map(a => [a.name, a.id]));
  const disadvantages = await db.select().from(disadvantagesTable);
  const disadvantageMap = new Map(disadvantages.map(d => [d.name, d.id]));

  console.log("🌱 Seeding cultures...");
  for (const entry of culturesData) {
    const [culture] = await db.insert(culturesTable).values({
      name: entry.name,
      description: entry.description,
      occurrenceAndLifestyle: entry.occurrenceAndLifestyle || null,
      worldViewAndReligion: entry.worldViewAndReligion || null,
      customs: entry.customs || null,
      garbAndArmaments: entry.garbAndArmaments || null,
      language: entry.language,
      script: entry.script || null,
      areaKnowledge: entry.areaKnowledge || null,
      socialStatus: entry.socialStatus,
      commonMundaneProfessions: entry.commonMundaneProfessions,
      commonMagicProfessions: entry.commonMagicProfessions,
      commonBlessedProfessions: entry.commonBlessedProfessions,
      commonSkills: entry.commonSkills,
      uncommonSkills: entry.uncommonSkills,
      commonMaleNames: entry.commonMaleNames,
      commonFemaleNames: entry.commonFemaleNames,
      commonFamilyNames: entry.commonFamilyNames,
      nobleFamilies: entry.nobleFamilies,
      culturePackageApCost: entry.culturePackage.apCost,
    }).returning();
    entries++;

    // Culture package talents
    const talentPackageRows = entry.culturePackage.talents
      .map(t => {
        const talentId = talentMap.get(t.talent);
        if (!talentId) {
          console.warn(`⚠️ Talent nicht gefunden: ${t.talent} für Kulturpaket ${entry.name}`);
          return null;
        }
        return {
          cultureId: culture.id,
          talentId,
          value: parseInt(t.value.replace("+", "")),
        };
      })
      .filter(Boolean);

    if (talentPackageRows.length > 0) {
      await db.insert(cultureTalentPackageTable).values(talentPackageRows as any);
      entries += talentPackageRows.length;
    }

    // Common & uncommon advantages
    const allCultureAdvantages = [
      ...entry.commonAdvantages.map(a => ({ ...a, isCommon: true })),
      ...entry.uncommonAdvantages.map(a => ({ ...a, isCommon: false })),
    ];
    const advantageRows = allCultureAdvantages
      .map(a => {
        const advantageId = advantageMap.get(a.name);
        if (!advantageId) {
          console.warn(`⚠️ Vorteil nicht gefunden: ${a.name} für Kultur ${entry.name}`);
          return null;
        }
        return {
          cultureId: culture.id,
          advantageId,
          isCommon: a.isCommon,
          note: (a as any).note || null,
        };
      })
      .filter(Boolean);

    if (advantageRows.length > 0) {
      await db.insert(cultureAdvantagesTable).values(advantageRows as any);
      entries += advantageRows.length;
    }

    // Common & uncommon disadvantages
    const allCultureDisadvantages = [
      ...entry.commonDisadvantages.map(d => ({ ...d, isCommon: true })),
      ...entry.uncommonDisadvantages.map(d => ({ ...d, isCommon: false })),
    ];
    const disadvantageRows = allCultureDisadvantages
      .map(d => {
        const disadvantageId = disadvantageMap.get(d.name);
        if (!disadvantageId) {
          console.warn(`⚠️ Nachteil nicht gefunden: ${d.name} für Kultur ${entry.name}`);
          return null;
        }
        return {
          cultureId: culture.id,
          disadvantageId,
          isCommon: d.isCommon,
          note: (d as any).note || null,
        };
      })
      .filter(Boolean);

    if (disadvantageRows.length > 0) {
      await db.insert(cultureDisadvantagesTable).values(disadvantageRows as any);
      entries += disadvantageRows.length;
    }
  }

  console.log("🌱 Seeding combat special abilities...");
  const combatAbilityValues = combatSpecialAbilitiesData.map(entry => ({
    name: entry.name,
    type: entry.type,
    description: entry.description,
    rules: entry.rules,
    penalty: entry.penalty ?? null,
    requirementsText: entry.requirementsText || null,
    combatTechniques: entry.combatTechniques.length > 0 ? entry.combatTechniques : null,
    apValue: entry.apValue,
    apText: entry.apText ?? null,
  }));
  entries += combatAbilityValues.length;
  await db.insert(combatSpecialAbilitiesTable).values(combatAbilityValues);

  console.log(`✅ ${entries} entries added.`);
  process.exit(0);
}

seed().catch(error => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
})