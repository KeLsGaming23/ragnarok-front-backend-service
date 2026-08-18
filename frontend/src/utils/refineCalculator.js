/**
 * Ragnarok Online Refine Math & Stat Scaling Calculator
 * Implements official Pre-Re & Renewal refine rules for Weapons (Lv 1-4) and Armors/Gear.
 */

// Weapon Level Refine Parameters
const WEAPON_REFINE_DATA = {
  1: {
    safeLimit: 7,
    atkPerRefine: 2,
    overRefineMaxPerLv: 3,
    successRates: [100, 100, 100, 100, 100, 100, 100, 60, 40, 20]
  },
  2: {
    safeLimit: 6,
    atkPerRefine: 3,
    overRefineMaxPerLv: 5,
    successRates: [100, 100, 100, 100, 100, 100, 60, 40, 20, 10]
  },
  3: {
    safeLimit: 5,
    atkPerRefine: 5,
    overRefineMaxPerLv: 8,
    successRates: [100, 100, 100, 100, 100, 60, 50, 30, 20, 10]
  },
  4: {
    safeLimit: 4,
    atkPerRefine: 7,
    overRefineMaxPerLv: 14,
    successRates: [100, 100, 100, 100, 60, 40, 40, 20, 20, 10]
  }
};

// Armor Refine Parameters
const ARMOR_REFINE_DATA = {
  safeLimit: 4,
  defPerRefine: 0.7, // Classic / Pre-Re standard
  successRates: [100, 100, 100, 100, 60, 40, 40, 20, 20, 10]
};

/**
 * Calculate dynamic combat stats based on refine level (+0 to +10)
 */
export function calculateRefineStats(item, refineLevel = 0) {
  const refine = Math.max(0, Math.min(10, parseInt(refineLevel, 10) || 0));
  const isWeapon = item?.type === 'weapon';
  const isArmor = item?.type === 'armor';

  if (!item || !item.refineable) {
    return {
      refine,
      isRefineable: false,
      safeLimit: 0,
      totalAtk: item?.attack || 0,
      totalDef: item?.defense || 0,
      refineBonus: 0,
      overRefineMin: 0,
      overRefineMax: 0,
      isOverRefined: false,
      successRate: 100
    };
  }

  // --- WEAPON CALCULATION ---
  if (isWeapon) {
    const wLevel = Math.max(1, Math.min(4, item.weaponLevel || 1));
    const config = WEAPON_REFINE_DATA[wLevel] || WEAPON_REFINE_DATA[1];
    const baseAtk = item.attack || 0;

    const refineBonus = refine * config.atkPerRefine;
    const isOverRefined = refine > config.safeLimit;

    let overRefineMin = 0;
    let overRefineMax = 0;

    if (isOverRefined) {
      const overLvls = refine - config.safeLimit;
      overRefineMin = 1;
      overRefineMax = overLvls * config.overRefineMaxPerLv;
    }

    const totalAtk = baseAtk + refineBonus;
    const successRate = refine === 0 ? 100 : (config.successRates[refine - 1] ?? 10);

    return {
      refine,
      isRefineable: true,
      weaponLevel: wLevel,
      safeLimit: config.safeLimit,
      baseAtk,
      totalAtk,
      refineBonus,
      overRefineMin,
      overRefineMax,
      isOverRefined,
      successRate
    };
  }

  // --- ARMOR / GEAR CALCULATION ---
  if (isArmor) {
    const baseDef = item.defense || 0;
    const safeLimit = ARMOR_REFINE_DATA.safeLimit;
    const refineBonus = Math.round(refine * ARMOR_REFINE_DATA.defPerRefine * 10) / 10;
    const isOverRefined = refine > safeLimit;
    const totalDef = Math.round((baseDef + refineBonus) * 10) / 10;
    const successRate = refine === 0 ? 100 : (ARMOR_REFINE_DATA.successRates[refine - 1] ?? 10);

    return {
      refine,
      isRefineable: true,
      safeLimit,
      baseDef,
      totalDef,
      refineBonus,
      isOverRefined,
      successRate
    };
  }

  // Fallback for other items
  return {
    refine,
    isRefineable: false,
    safeLimit: 0,
    totalAtk: item?.attack || 0,
    totalDef: item?.defense || 0,
    refineBonus: 0,
    isOverRefined: false,
    successRate: 100
  };
}
