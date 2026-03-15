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
  magicPropertiesTable,
  staffSpellsTable,
  familiarTricksTable,
  witchCursesTable,
  witchSpecialAbilitiesTable,
  elvenSongsTable,
  cantripsTable,
  spellsTable,
  ritualsTable,
  churchTraditionsTable,
  churchTraditionRulesTable,
  churchTraditionFavorableTalentsTable,
  moralCodexEntriesTable,
  churchTraditionRanksTable,
  blessingsTable,
  liturgiesTable,
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
import magicPropertiesData from "../../data/magic/magic_properties.json";
import staffSpellsData from "../../data/magic/staff_spells.json";
import familiarTricksData from "../../data/magic/familiar_tricks.json";
import witchCursesData from "../../data/magic/witch_curses.json";
import witchSpecialAbilitiesData from "../../data/magic/witch_special_abilities.json";
import elvenSongsData from "../../data/magic/elven_songs.json";
import cantripsData from "../../data/magic/cantrips.json";
import spellsData from "../../data/magic/spells.json";
import ritualsData from "../../data/magic/rituals.json";
import churchTraditionsData from "../../data/gods/church_traditions.json";
import blessingsData from "../../data/gods/blessings.json";
import liturgiesData from "../../data/gods/liturgies.json";
import db from "./index";
import {sql} from "drizzle-orm";

async function seed() {

  console.log("🌱 Seeding database");
  console.log("🗑️  Truncating all tables...");
  await db.execute(sql`
    TRUNCATE TABLE
      cantrips,  
      blessings,
      liturgies,
      church_tradition_ranks,
      moral_codex_entries,
      church_tradition_favorable_talents,
      church_tradition_rules,
      church_traditions,
      rituals,
      spells,
      cantrips,
      elven_songs,
      witch_special_abilities,
      witch_curses,
      familiar_tricks,
      staff_spells,
      magic_properties,
      combat_special_abilities,
      culture_advantages,
      culture_disadvantages,
      culture_talent_package,
      cultures,
      advantages,
      disadvantages,
      special_ability_combined_talent_requirements,
      special_ability_talent_requirements,
      general_special_abilities,
      talents,
      races,
      derived_values,
      attributes,
      condition_levels,
      conditions,
      experience_levels,
      status,
      gods
    RESTART IDENTITY CASCADE
  `);
  console.log("🌱 Seeding gods & demons...");
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

  console.log("🌱 Magic properties...");
  const magicPropertyValues = magicPropertiesData.map(entry => ({
    name: entry.name,
    description: entry.description,
    propertyChecks: entry.propertyChecks,
  }));

  entries += magicPropertyValues.length;
  await db.insert(magicPropertiesTable).values(magicPropertyValues);

  console.log("🌱 Seeding staff spells...");
  const magicProperties = await db.select().from(magicPropertiesTable);
  const magicPropertyMap = new Map(magicProperties.map(p => [p.name, p.id]));

  const staffSpellValues = staffSpellsData.map(entry => {
    const propertyId = entry.property ? magicPropertyMap.get(entry.property) ?? null : null;
    if (entry.property && !propertyId) {
      console.warn(`⚠️ Merkmal nicht gefunden: ${entry.property} für ${entry.name}`);
    }
    return {
      name: entry.name,
      effect: entry.effect,
      requirements: entry.requirements || null,
      volume: entry.volume,
      bindingCost: entry.bindingCost || null,
      propertyId,
      propertyNote: (entry as any).propertyNote ?? null,
      apValue: entry.apValue,
      apNote: entry.apNote ?? null,
    };
  });
  entries += staffSpellValues.length;
  await db.insert(staffSpellsTable).values(staffSpellValues);

  console.log("🌱 Seeding familiar tricks...");
  const familiarTrickValues = familiarTricksData.map(entry => {
    const propertyId = entry.property ? magicPropertyMap.get(entry.property) ?? null : null;
    if (entry.property && !propertyId) {
      console.warn(`⚠️ Merkmal nicht gefunden: ${entry.property} für ${entry.name}`);
    }
    return {
      name: entry.name,
      effect: entry.effect,
      animalTypes: entry.animalTypes,
      aspCost: entry.aspCost,
      aspText: (entry as any).aspText ?? null,
      duration: entry.duration,
      propertyId,
      propertyNote: (entry as any).propertyNote ?? null,
      apValue: entry.apValue,
      apNote: entry.apNote ?? null,
    };
  });
  entries += familiarTrickValues.length;
  await db.insert(familiarTricksTable).values(familiarTrickValues);

  console.log("🌱 Seeding witch curses...");
  const witchCurseValues = witchCursesData.map(entry => {
    const propertyId = magicPropertyMap.get(entry.property);
    if (!propertyId) {
      console.warn(`⚠️ Merkmal nicht gefunden: ${entry.property} für ${entry.name}`);
    }
    return {
      name: entry.name,
      check: entry.check,
      modifiedByZK: entry.modifiedByZK ? 1 : 0,
      modifiedBySK: entry.modifiedBySK ? 1 : 0,
      effect: entry.effect,
      aspCost: entry.aspCost,
      aspText: entry.aspText ?? null,
      duration: entry.duration,
      propertyId: propertyId!,
    };
  });
  entries += witchCurseValues.length;
  await db.insert(witchCursesTable).values(witchCurseValues);

  console.log("🌱 Seeding witch special abilities...");
  const witchSpecialAbilityValues = witchSpecialAbilitiesData.map(entry => ({
    name: entry.name,
    rules: entry.rules,
    requirements: entry.requirements || null,
    apValue: entry.apValue,
  }));
  entries += witchSpecialAbilityValues.length;
  await db.insert(witchSpecialAbilitiesTable).values(witchSpecialAbilityValues);

  console.log("🌱 Seeding elven songs...");
  const elvenSongValues = elvenSongsData.map(entry => {
    const propertyId = magicPropertyMap.get(entry.property);
    if (!propertyId) {
      console.warn(`⚠️ Merkmal nicht gefunden: ${entry.property} für ${entry.name}`);
    }
    return {
      name: entry.name,
      check: entry.check,
      effect: entry.effect,
      talent: entry.talent,
      aspCost: entry.aspCost,
      aspText: entry.aspText ?? null,
      duration: entry.duration,
      propertyId: propertyId!,
      improvementCost: entry.improvementCost,
    };
  });
  entries += elvenSongValues.length;
  await db.insert(elvenSongsTable).values(elvenSongValues);

  console.log("🌱 Seeding cantrips...")
  const cantripValues = cantripsData.map(entry => {
    const propertyId = magicPropertyMap.get(entry.property);
    return {
      name: entry.name,
      effect: entry.effect,
      range: entry.range,
      duration: entry.duration,
      targetCategory: entry.targetCategory,
      propertyId: propertyId!,
      apValue: entry.apValue,
    }
  });
  entries += cantripValues.length;
  await db.insert(cantripsTable).values(cantripValues);

  console.log("🌱 Seeding spells...");
  const spellValues = spellsData.map(entry => {
    const propertyId = magicPropertyMap.get(entry.property);
    if (!propertyId) {
      console.warn(`⚠️ Merkmal nicht gefunden: ${entry.property} für ${entry.name}`);
    }
    return {
      name: entry.name,
      check: entry.check,
      modifiedByZK: entry.modifiedByZK ? 1 : 0,
      modifiedBySK: entry.modifiedBySK ? 1 : 0,
      effect: entry.effect,
      castingDuration: entry.castingDuration,
      aspCost: entry.aspCost,
      aspText: entry.aspText ?? null,
      costsNotModifiable: entry.costsNotModifiable ? 1 : 0,
      range: entry.range,
      duration: entry.duration,
      targetCategory: entry.targetCategory,
      propertyId: propertyId!,
      distribution: entry.distribution,
      improvementCost: entry.improvementCost,
    };
  });
  entries += spellValues.length;
  await db.insert(spellsTable).values(spellValues);

  console.log("🌱 Seeding rituals...");
  const ritualValues = ritualsData.map(entry => {
    const propertyId = magicPropertyMap.get(entry.property);
    if (!propertyId) {
      console.warn(`⚠️ Merkmal nicht gefunden: ${entry.property} für ${entry.name}`);
    }
    return {
      name: entry.name,
      check: entry.check,
      effect: entry.effect,
      ritualDuration: entry.ritualDuration,
      aspCost: entry.aspCost,
      aspText: entry.aspText ?? null,
      costsNotModifiable: entry.costsNotModifiable ? 1 : 0,
      range: entry.range,
      duration: entry.duration,
      targetCategory: entry.targetCategory,
      propertyId: propertyId!,
      distribution: entry.distribution,
      improvementCost: entry.improvementCost,
    };
  });
  entries += ritualValues.length;
  await db.insert(ritualsTable).values(ritualValues);

  console.log("🌱 Seeding church traditions...");
  const gods = await db.select().from(godsTable);
  const godMap = new Map(gods.map(g => [g.name, g.id]));

  for (const entry of churchTraditionsData) {
    const godId = godMap.get(entry.god);
    if (!godId) {
      console.warn(`⚠️ Gott nicht gefunden: ${entry.god} für ${entry.name}`);
      continue;
    }

    const [tradition] = await db.insert(churchTraditionsTable).values({
      name: entry.name,
      godId,
      description: entry.description,
      leadingAttribute: entry.leadingAttribute,
      requirements: entry.requirements || null,
      apValue: entry.apValue,
    }).returning();
    entries++;

    // Rules
    const ruleRows = entry.rules.map((rule, i) => ({
      traditionId: tradition.id,
      rule,
      order: i + 1,
    }));
    if (ruleRows.length > 0) {
      await db.insert(churchTraditionRulesTable).values(ruleRows);
      entries += ruleRows.length;
    }

    // Favorable talents — handle both string[] and object[] formats
    const talentRows = (entry.favorableTalents as any[])
      .map(t => {
        const talentName = typeof t === "string" ? t : t.talent;
        const note = typeof t === "string" ? null : (t.note ?? null);
        if (!talentName) {
          // pure note entry (e.g. "alle Nahkampftechniken")
          return { traditionId: tradition.id, talentId: null, note };
        }
        const talentId = talentMap.get(talentName) ?? null;
        if (!talentId) {
          console.warn(`⚠️ Talent nicht gefunden: ${talentName} für ${entry.name}`);
        }
        return { traditionId: tradition.id, talentId, note };
      });
    if (talentRows.length > 0) {
      await db.insert(churchTraditionFavorableTalentsTable).values(talentRows as any);
      entries += talentRows.length;
    }

    // Moral codex
    const codexRows = entry.moralCodex.map(c => ({
      traditionId: tradition.id,
      name: c.name,
      description: c.description,
    }));
    if (codexRows.length > 0) {
      await db.insert(moralCodexEntriesTable).values(codexRows);
      entries += codexRows.length;
    }

    // Ranks
    const rankRows = entry.ranks.map(r => ({
      traditionId: tradition.id,
      rank: r.rank,
      title: r.title,
      order: r.order,
    }));
    if (rankRows.length > 0) {
      await db.insert(churchTraditionRanksTable).values(rankRows);
      entries += rankRows.length;
    }
  }

  console.log("🌱 Seeding blessings...");
  const blessingValues = blessingsData.map(entry => ({
    name: entry.name,
    effect: entry.effect,
    range: entry.range,
    duration: entry.duration,
    targetCategory: entry.targetCategory,
    aspect: entry.aspect,
    kapCost: entry.kapCost,
    apValue: entry.apValue,
  }));
  entries += blessingValues.length;
  await db.insert(blessingsTable).values(blessingValues);

  console.log("🌱 Seeding liturgies...");
  const liturgyValues = liturgiesData.map(entry => ({
    name: entry.name,
    description: entry.description ?? null,
    probe: entry.probe,
    modifiedBySK: (entry as any).modifiedBySK ? 1 : 0,
    modifiedByZK: (entry as any).modifiedByZK ? 1 : 0,
    effect: entry.effect,
    liturgyDuration: entry.liturgyDuration ?? null,
    kapCost: entry.kapCost ?? null,
    costsNotModifiable: entry.costsNotModifiable ? 1 : 0,
    range: entry.range ?? null,
    duration: entry.duration ?? null,
    targetCategory: entry.targetCategory ?? null,
    distribution: entry.distribution ?? null,
    improvementFactor: entry.improvementFactor ?? null,
  }));
  entries += liturgyValues.length;
  await db.insert(liturgiesTable).values(liturgyValues);

  console.log(`✅ ${entries} entries added.`);
  process.exit(0);
}

seed().catch(error => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
})