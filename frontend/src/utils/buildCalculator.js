/**
 * Ragnarok Online Equipment Loadout & Stat Aggregator Calculator
 * Calculates combined combat stats, refine bonuses, weights, and parsed passive script effects across all 10 gear slots.
 */
import { calculateRefineStats } from './refineCalculator';

// Script regex parsers for common Ragnarok Online bonus commands
const BONUS_PARSERS = [
  { key: 'str', label: 'STR', regex: /bonus\s+bStr,\s*([+-]?\d+)/gi },
  { key: 'agi', label: 'AGI', regex: /bonus\s+bAgi,\s*([+-]?\d+)/gi },
  { key: 'vit', label: 'VIT', regex: /bonus\s+bVit,\s*([+-]?\d+)/gi },
  { key: 'int', label: 'INT', regex: /bonus\s+bInt,\s*([+-]?\d+)/gi },
  { key: 'dex', label: 'DEX', regex: /bonus\s+bDex,\s*([+-]?\d+)/gi },
  { key: 'luk', label: 'LUK', regex: /bonus\s+bLuk,\s*([+-]?\d+)/gi },
  { key: 'allStats', label: 'All Stats', regex: /bonus\s+bAllStats,\s*([+-]?\d+)/gi },
  { key: 'maxHpRate', label: 'Max HP %', regex: /bonus\s+bMaxHPrate,\s*([+-]?\d+)/gi },
  { key: 'maxSpRate', label: 'Max SP %', regex: /bonus\s+bMaxSPrate,\s*([+-]?\d+)/gi },
  { key: 'maxHp', label: 'Flat HP', regex: /bonus\s+bMaxHP,\s*([+-]?\d+)/gi },
  { key: 'maxSp', label: 'Flat SP', regex: /bonus\s+bMaxSP,\s*([+-]?\d+)/gi },
  { key: 'aspdRate', label: 'ASPD %', regex: /bonus\s+bAspdRate,\s*([+-]?\d+)/gi },
  { key: 'critical', label: 'CRIT', regex: /bonus\s+bCritical,\s*([+-]?\d+)/gi },
  { key: 'flee', label: 'FLEE', regex: /bonus\s+bFlee,\s*([+-]?\d+)/gi },
  { key: 'hit', label: 'HIT', regex: /bonus\s+bHit,\s*([+-]?\d+)/gi },
  { key: 'baseAtk', label: 'Bonus ATK', regex: /bonus\s+bBaseAtk,\s*([+-]?\d+)/gi },
  { key: 'matkRate', label: 'MATK %', regex: /bonus\s+bMatkRate,\s*([+-]?\d+)/gi },
  { key: 'def', label: 'Bonus Hard DEF', regex: /bonus\s+bDef,\s*([+-]?\d+)/gi },
  { key: 'mdef', label: 'Bonus MDEF', regex: /bonus\s+bMdef,\s*([+-]?\d+)/gi }
];

/**
 * Calculate aggregated stats and combined scripts across all 10 loadout slots
 */
export function calculateBuildTotals(slots = {}) {
  let totalBaseAtk = 0;
  let totalRefineAtk = 0;
  let totalBaseDef = 0;
  let totalRefineDef = 0;
  let totalMagicAttack = 0;
  let totalWeight = 0;
  let totalSlotsUsed = 0;
  let totalSlotsAvailable = 0;

  const aggregatedBonuses = {
    str: 0,
    agi: 0,
    vit: 0,
    int: 0,
    dex: 0,
    luk: 0,
    allStats: 0,
    maxHpRate: 0,
    maxSpRate: 0,
    maxHp: 0,
    maxSp: 0,
    aspdRate: 0,
    critical: 0,
    flee: 0,
    hit: 0,
    baseAtk: 0,
    matkRate: 0,
    def: 0,
    mdef: 0
  };

  const allScripts = [];

  // Helper to parse scripts from an item or card
  const parseScriptText = (script, sourceName) => {
    if (!script || typeof script !== 'string') return;
    allScripts.push({ source: sourceName, script: script.trim() });

    for (const parser of BONUS_PARSERS) {
      let match;
      const regex = new RegExp(parser.regex.source, 'gi');
      while ((match = regex.exec(script)) !== null) {
        const val = parseInt(match[1], 10);
        if (!isNaN(val)) {
          aggregatedBonuses[parser.key] += val;
        }
      }
    }
  };

  // Iterate over each equipped slot
  for (const slotKey of Object.keys(slots)) {
    const slotData = slots[slotKey];
    if (!slotData || !slotData.item) continue;

    const item = slotData.item;
    const refine = slotData.refine || 0;
    const cards = slotData.cards || [];

    // 1. Refine and combat stats
    const refineCalc = calculateRefineStats(item, refine);
    if (item.type === 'weapon') {
      totalBaseAtk += item.attack || 0;
      totalRefineAtk += refineCalc.refineBonus || 0;
    } else {
      totalBaseDef += item.defense || 0;
      totalRefineDef += refineCalc.refineBonus || 0;
    }

    totalMagicAttack += item.magicAttack || 0;
    totalWeight += item.weight || 0;

    totalSlotsAvailable += item.slots || 0;
    totalSlotsUsed += cards.filter(Boolean).length;

    // 2. Parse item passive script
    if (item.script) {
      parseScriptText(item.script, `${refine > 0 ? `+${refine} ` : ''}${item.name}`);
    }

    // 3. Parse cards slotted into this item
    for (const card of cards) {
      if (card && card.script) {
        parseScriptText(card.script, card.name);
      }
    }
  }

  // Factor allStats into individual primary stats
  if (aggregatedBonuses.allStats !== 0) {
    aggregatedBonuses.str += aggregatedBonuses.allStats;
    aggregatedBonuses.agi += aggregatedBonuses.allStats;
    aggregatedBonuses.vit += aggregatedBonuses.allStats;
    aggregatedBonuses.int += aggregatedBonuses.allStats;
    aggregatedBonuses.dex += aggregatedBonuses.allStats;
    aggregatedBonuses.luk += aggregatedBonuses.allStats;
  }

  const finalTotalAtk = totalBaseAtk + totalRefineAtk + aggregatedBonuses.baseAtk;
  const finalTotalDef = Math.round((totalBaseDef + totalRefineDef + aggregatedBonuses.def) * 10) / 10;

  return {
    totalAtk: finalTotalAtk,
    baseAtk: totalBaseAtk,
    refineAtk: totalRefineAtk,
    bonusAtk: aggregatedBonuses.baseAtk,
    totalDef: finalTotalDef,
    baseDef: totalBaseDef,
    refineDef: totalRefineDef,
    bonusDef: aggregatedBonuses.def,
    totalMagicAttack,
    totalWeight,
    totalSlotsUsed,
    totalSlotsAvailable,
    bonuses: aggregatedBonuses,
    scripts: allScripts
  };
}
