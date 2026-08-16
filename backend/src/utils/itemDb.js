/**
 * Ragnarok Online Item Database & Slot / Equipment Resolver
 */

// Bitmask constants for rAthena equipment slots
export const EQUIP_SLOTS = {
  1: 'Lower Headgear',
  2: 'Right Hand (Weapon)',
  4: 'Garment',
  8: 'Accessory (Left)',
  16: 'Armor',
  32: 'Left Hand (Shield)',
  64: 'Footgear (Shoes)',
  128: 'Accessory (Right)',
  256: 'Upper Headgear',
  512: 'Middle Headgear',
  1024: 'Costume Upper',
  2048: 'Costume Mid',
  4096: 'Costume Lower',
  8192: 'Costume Garment',
  16384: 'Ammo / Arrow'
};

export function getEquipSlotName(equipBitmask) {
  if (!equipBitmask || equipBitmask === 0) return null;
  
  const slots = [];
  for (const [bit, name] of Object.entries(EQUIP_SLOTS)) {
    if ((equipBitmask & Number(bit)) !== 0) {
      slots.push(name);
    }
  }
  return slots.length > 0 ? slots.join(' / ') : 'Equipped';
}

// Well-known RO Items lookup table
const KNOWN_ITEMS = {
  // Consumables & Potions
  501: { name: 'Red Potion', type: 'usable', icon: 'potion_red', weight: 7 },
  502: { name: 'Orange Potion', type: 'usable', icon: 'potion_orange', weight: 10 },
  503: { name: 'Yellow Potion', type: 'usable', icon: 'potion_yellow', weight: 13 },
  504: { name: 'White Potion', type: 'usable', icon: 'potion_white', weight: 15 },
  505: { name: 'Blue Potion', type: 'usable', icon: 'potion_blue', weight: 15 },
  506: { name: 'Green Potion', type: 'usable', icon: 'potion_green', weight: 7 },
  507: { name: 'Red Herb', type: 'etc', icon: 'herb_red', weight: 3 },
  508: { name: 'Yellow Herb', type: 'etc', icon: 'herb_yellow', weight: 5 },
  509: { name: 'White Herb', type: 'etc', icon: 'herb_white', weight: 7 },
  510: { name: 'Blue Herb', type: 'etc', icon: 'herb_blue', weight: 7 },
  511: { name: 'Green Herb', type: 'etc', icon: 'herb_green', weight: 5 },
  512: { name: 'Apple', type: 'usable', icon: 'apple', weight: 2 },
  513: { name: 'Banana', type: 'usable', icon: 'banana', weight: 2 },
  514: { name: 'Grape', type: 'usable', icon: 'grape', weight: 2 },
  515: { name: 'Carrot', type: 'usable', icon: 'carrot', weight: 2 },
  516: { name: 'Sweet Potato', type: 'usable', icon: 'sweet_potato', weight: 2 },
  517: { name: 'Meat', type: 'usable', icon: 'meat', weight: 15 },
  518: { name: 'Honey', type: 'usable', icon: 'honey', weight: 10 },
  519: { name: 'Milk', type: 'usable', icon: 'milk', weight: 3 },
  522: { name: 'Mastela Fruit', type: 'usable', icon: 'mastela_fruit', weight: 3 },
  523: { name: 'Holy Water', type: 'usable', icon: 'holy_water', weight: 3 },
  525: { name: 'Panacea', type: 'usable', icon: 'panacea', weight: 10 },
  526: { name: 'Royal Jelly', type: 'usable', icon: 'royal_jelly', weight: 15 },
  601: { name: 'Fly Wing', type: 'usable', icon: 'fly_wing', weight: 5 },
  602: { name: 'Butterfly Wing', type: 'usable', icon: 'butterfly_wing', weight: 5 },
  603: { name: 'Old Blue Box', type: 'usable', icon: 'obb', weight: 20 },
  604: { name: 'Dead Branch', type: 'usable', icon: 'dead_branch', weight: 5 },
  607: { name: 'Yggdrasil Berry', type: 'usable', icon: 'ygg_berry', weight: 30 },
  608: { name: 'Yggdrasil Seed', type: 'usable', icon: 'ygg_seed', weight: 30 },
  616: { name: 'Old Purple Box', type: 'usable', icon: 'opb', weight: 20 },
  617: { name: 'Old Card Album', type: 'usable', icon: 'oca', weight: 5 },
  644: { name: 'Gift Box', type: 'usable', icon: 'gift_box', weight: 20 },
  670: { name: 'Gold Coin', type: 'etc', icon: 'gold_coin', weight: 1 },
  674: { name: 'Bronze Coin', type: 'etc', icon: 'bronze_coin', weight: 1 },
  675: { name: 'Mithril Ore', type: 'etc', icon: 'mithril', weight: 1 },
  714: { name: 'Emperium', type: 'etc', icon: 'emperium', weight: 20 },
  969: { name: 'Gold', type: 'etc', icon: 'gold', weight: 20 },
  984: { name: 'Oridecon', type: 'etc', icon: 'oridecon', weight: 20 },
  985: { name: 'Elunium', type: 'etc', icon: 'elunium', weight: 20 },
  1010: { name: 'Rough Oridecon', type: 'etc', icon: 'rough_oridecon', weight: 5 },
  1011: { name: 'Rough Elunium', type: 'etc', icon: 'rough_elunium', weight: 5 },

  // Weapons (1-Handed Swords, 2-Handed Swords, Daggers, Katars, Bows, Rods, Axes, Spears)
  1101: { name: 'Sword', type: 'weapon', slots: 3, weight: 50 },
  1102: { name: 'Falchion', type: 'weapon', slots: 3, weight: 60 },
  1104: { name: 'Blade', type: 'weapon', slots: 4, weight: 70 },
  1107: { name: 'Lapier', type: 'weapon', slots: 2, weight: 50 },
  1108: { name: 'Scimitar', type: 'weapon', slots: 2, weight: 70 },
  1110: { name: 'Ring Pommel Saber', type: 'weapon', slots: 2, weight: 90 },
  1113: { name: 'Haedonggum', type: 'weapon', slots: 2, weight: 90 },
  1116: { name: 'Saber', type: 'weapon', slots: 3, weight: 100 },
  1123: { name: 'Tsurugi', type: 'weapon', slots: 2, weight: 120 },
  1128: { name: 'Fireblend', type: 'weapon', slots: 0, weight: 100 },
  1129: { name: 'Ice Falchion', type: 'weapon', slots: 0, weight: 100 },
  1151: { name: 'Slayer', type: 'weapon', slots: 2, weight: 130 },
  1152: { name: 'Bastard Sword', type: 'weapon', slots: 2, weight: 160 },
  1153: { name: 'Two-Handed Sword', type: 'weapon', slots: 2, weight: 220 },
  1154: { name: 'Broad Sword', type: 'weapon', slots: 2, weight: 200 },
  1157: { name: 'Claymore', type: 'weapon', slots: 2, weight: 250 },
  1160: { name: 'Muramasa', type: 'weapon', slots: 0, weight: 100 },
  1161: { name: 'Dragon Slayer', type: 'weapon', slots: 2, weight: 130 },
  1163: { name: 'Schweizersabel', type: 'weapon', slots: 2, weight: 160 },
  1170: { name: 'Executioner', type: 'weapon', slots: 0, weight: 220 },
  1201: { name: 'Knife', type: 'weapon', slots: 3, weight: 40 },
  1202: { name: 'Cutter', type: 'weapon', slots: 3, weight: 50 },
  1207: { name: 'Main Gauche', type: 'weapon', slots: 4, weight: 60 },
  1216: { name: 'Stiletto', type: 'weapon', slots: 3, weight: 70 },
  1220: { name: 'Gladius', type: 'weapon', slots: 3, weight: 70 },
  1221: { name: 'Damascus', type: 'weapon', slots: 2, weight: 80 },
  1250: { name: 'Katar', type: 'weapon', slots: 2, weight: 120 },
  1251: { name: 'Jur', type: 'weapon', slots: 3, weight: 80 },
  1252: { name: 'Jamadhar', type: 'weapon', slots: 1, weight: 150 },
  1254: { name: 'Katar of Quaking', type: 'weapon', slots: 0, weight: 120 },
  1255: { name: 'Katar of Raging Blaze', type: 'weapon', slots: 0, weight: 120 },
  1259: { name: 'Infiltrator', type: 'weapon', slots: 0, weight: 150 },
  1268: { name: 'Blood Tears', type: 'weapon', slots: 2, weight: 170 },
  1301: { name: 'Axe', type: 'weapon', slots: 3, weight: 80 },
  1351: { name: 'Battle Axe', type: 'weapon', slots: 3, weight: 150 },
  1354: { name: 'Buster', type: 'weapon', slots: 2, weight: 180 },
  1357: { name: 'Two-Handed Axe', type: 'weapon', slots: 2, weight: 250 },
  1401: { name: 'Javelin', type: 'weapon', slots: 3, weight: 70 },
  1404: { name: 'Spear', type: 'weapon', slots: 3, weight: 100 },
  1407: { name: 'Pike', type: 'weapon', slots: 4, weight: 100 },
  1410: { name: 'Partizan', type: 'weapon', slots: 2, weight: 100 },
  1415: { name: 'Trident', type: 'weapon', slots: 3, weight: 120 },
  1416: { name: 'Halberd', type: 'weapon', slots: 2, weight: 250 },
  1417: { name: 'Lance', type: 'weapon', slots: 0, weight: 250 },
  1501: { name: 'Club', type: 'weapon', slots: 3, weight: 70 },
  1504: { name: 'Mace', type: 'weapon', slots: 4, weight: 80 },
  1510: { name: 'Chain', type: 'weapon', slots: 3, weight: 80 },
  1513: { name: 'Stunner', type: 'weapon', slots: 2, weight: 200 },
  1601: { name: 'Rod', type: 'weapon', slots: 3, weight: 40 },
  1604: { name: 'Wand', type: 'weapon', slots: 2, weight: 50 },
  1607: { name: 'Staff', type: 'weapon', slots: 2, weight: 40 },
  1614: { name: 'Arc Wand', type: 'weapon', slots: 2, weight: 40 },
  1617: { name: 'Survivor\'s Rod (INT)', type: 'weapon', slots: 1, weight: 100 },
  1619: { name: 'Survivor\'s Rod (DEX)', type: 'weapon', slots: 1, weight: 100 },
  1625: { name: 'Staff of Piercing', type: 'weapon', slots: 0, weight: 50 },
  1701: { name: 'Bow', type: 'weapon', slots: 3, weight: 50 },
  1704: { name: 'Composite Bow', type: 'weapon', slots: 4, weight: 60 },
  1710: { name: 'Crossbow', type: 'weapon', slots: 3, weight: 90 },
  1714: { name: 'Gakkung Bow', type: 'weapon', slots: 2, weight: 110 },
  1716: { name: 'Hunter Bow', type: 'weapon', slots: 1, weight: 140 },
  1718: { name: 'Rudra Bow', type: 'weapon', slots: 0, weight: 120 },

  // Armor & Gear
  2101: { name: 'Guard', type: 'armor', slots: 1, weight: 30 },
  2103: { name: 'Buckler', type: 'armor', slots: 1, weight: 60 },
  2105: { name: 'Shield', type: 'armor', slots: 1, weight: 130 },
  2107: { name: 'Mirror Shield', type: 'armor', slots: 1, weight: 100 },
  2114: { name: 'Valkyrja\'s Shield', type: 'armor', slots: 1, weight: 50 },
  2115: { name: 'Stone Buckler', type: 'armor', slots: 1, weight: 130 },
  2220: { name: 'Hat', type: 'armor', slots: 1, weight: 20 },
  2221: { name: 'Cap', type: 'armor', slots: 1, weight: 30 },
  2226: { name: 'Helm', type: 'armor', slots: 1, weight: 70 },
  2232: { name: 'Corsair', type: 'armor', slots: 0, weight: 50 },
  2254: { name: 'Majestic Goat', type: 'armor', slots: 0, weight: 80 },
  2255: { name: 'Spiky Band', type: 'armor', slots: 1, weight: 50 },
  2285: { name: 'Feather Beret', type: 'armor', slots: 0, weight: 60 },
  2301: { name: 'Cotton Shirt', type: 'armor', slots: 1, weight: 10 },
  2305: { name: 'Adventure Suit', type: 'armor', slots: 1, weight: 30 },
  2307: { name: 'Mantle', type: 'armor', slots: 1, weight: 60 },
  2309: { name: 'Coat', type: 'armor', slots: 1, weight: 120 },
  2311: { name: 'Padded Armor', type: 'armor', slots: 1, weight: 280 },
  2314: { name: 'Chain Mail', type: 'armor', slots: 1, weight: 330 },
  2316: { name: 'Plate Mail', type: 'armor', slots: 1, weight: 450 },
  2321: { name: 'Silk Robe', type: 'armor', slots: 1, weight: 40 },
  2335: { name: 'Lord\'s Clothes', type: 'armor', slots: 1, weight: 250 },
  2341: { name: 'Glittering Jacket', type: 'armor', slots: 1, weight: 250 },
  2357: { name: 'Valkyrian Armor', type: 'armor', slots: 1, weight: 280 },
  2401: { name: 'Sandals', type: 'armor', slots: 1, weight: 20 },
  2403: { name: 'Shoes', type: 'armor', slots: 1, weight: 40 },
  2405: { name: 'Boots', type: 'armor', slots: 1, weight: 60 },
  2410: { name: 'High Fashion Sandals', type: 'armor', slots: 1, weight: 20 },
  2421: { name: 'Valkyrian Shoes', type: 'armor', slots: 1, weight: 50 },
  2423: { name: 'Variant Shoes', type: 'armor', slots: 0, weight: 50 },
  2501: { name: 'Hood', type: 'armor', slots: 1, weight: 20 },
  2503: { name: 'Muffler', type: 'armor', slots: 1, weight: 40 },
  2505: { name: 'Manteau', type: 'armor', slots: 1, weight: 60 },
  2524: { name: 'Valkyrian Manteau', type: 'armor', slots: 1, weight: 50 },
  2601: { name: 'Ring', type: 'armor', slots: 1, weight: 10 },
  2602: { name: 'Earring', type: 'armor', slots: 1, weight: 10 },
  2603: { name: 'Necklace', type: 'armor', slots: 1, weight: 10 },
  2604: { name: 'Glove', type: 'armor', slots: 1, weight: 10 },
  2605: { name: 'Brooch', type: 'armor', slots: 1, weight: 10 },
  2607: { name: 'Clip', type: 'armor', slots: 1, weight: 5 },
  2624: { name: 'Rosary', type: 'armor', slots: 1, weight: 10 },

  // Cards (4001+)
  4001: { name: 'Poring Card', type: 'card', prefix: 'Lucky', suffix: 'of Luck' },
  4002: { name: 'Fabre Card', type: 'card', prefix: 'Vital', suffix: 'of Vitality' },
  4003: { name: 'Pupa Card', type: 'card', prefix: 'Hard', suffix: 'of Recovery' },
  4004: { name: 'Drops Card', type: 'card', prefix: 'Dexterous', suffix: 'of Dexterity' },
  4005: { name: 'Baphomet Card', type: 'card', prefix: 'Scythe', suffix: 'of Chaos' },
  4006: { name: 'Hydra Card', type: 'card', prefix: 'Bloody', suffix: 'of Slaughter' },
  4007: { name: 'Skeleton Worker Card', type: 'card', prefix: 'Boned', suffix: 'of Destruction' },
  4019: { name: 'Ghostring Card', type: 'card', prefix: 'Ghostly', suffix: 'of Ghost' },
  4023: { name: 'Raydric Card', type: 'card', prefix: 'Immune', suffix: 'of Resistance' },
  4032: { name: 'Marc Card', type: 'card', prefix: 'Unfreezing', suffix: 'of Unfreezing' },
  4047: { name: 'Thara Frog Card', type: 'card', prefix: 'Cranial', suffix: 'of Protection' },
  4054: { name: 'Matyr Card', type: 'card', prefix: 'Green', suffix: 'of Fast' },
  4074: { name: 'Minorous Card', type: 'card', prefix: 'Titan', suffix: 'of Big Monster' },
  4115: { name: 'Zerom Card', type: 'card', prefix: 'Nimble', suffix: 'of Flash' },
  4128: { name: 'Golden Thief Bug Card', type: 'card', prefix: 'Golden', suffix: 'of Magic Immunity' }
};

/**
 * Resolve an item ID to human-readable metadata
 */
export function resolveItemInfo(itemId) {
  const id = Number(itemId);
  if (KNOWN_ITEMS[id]) {
    return {
      itemId: id,
      name: KNOWN_ITEMS[id].name,
      type: KNOWN_ITEMS[id].type || 'etc',
      slots: KNOWN_ITEMS[id].slots || 0,
      weight: KNOWN_ITEMS[id].weight || 0,
      icon: KNOWN_ITEMS[id].icon || null
    };
  }

  // Fallback category detection by RO standard ID ranges
  let inferredType = 'etc';
  if (id >= 501 && id <= 699) inferredType = 'usable';
  else if (id >= 1100 && id <= 1999) inferredType = 'weapon';
  else if (id >= 2100 && id <= 2999) inferredType = 'armor';
  else if (id >= 4000 && id <= 4999) inferredType = 'card';
  else if (id >= 1750 && id <= 1799) inferredType = 'ammo';

  return {
    itemId: id,
    name: `Item #${id}`,
    type: inferredType,
    slots: 0,
    weight: 0,
    icon: null
  };
}

/**
 * Resolve card names from card slots (card0..card3)
 */
export function resolveCardNames(card0, card1, card2, card3) {
  const cardIds = [card0, card1, card2, card3].map(Number).filter(id => id > 0);
  return cardIds.map(id => {
    const cardInfo = KNOWN_ITEMS[id];
    return {
      cardId: id,
      name: cardInfo ? cardInfo.name : `Card #${id}`,
      prefix: cardInfo?.prefix || null
    };
  });
}

/**
 * Format a rich item title including refine rate, slots, and attached cards
 */
export function formatItemTitle(item) {
  const info = resolveItemInfo(item.nameid);
  const cards = resolveCardNames(item.card0, item.card1, item.card2, item.card3);
  
  let title = '';
  if (item.refine && item.refine > 0) {
    title += `+${item.refine} `;
  }
  
  title += info.name;
  
  if (info.slots > 0) {
    title += ` [${info.slots}]`;
  }
  
  if (cards.length > 0) {
    const cardNames = cards.map(c => c.name.replace(' Card', '')).join(', ');
    title += ` (${cardNames})`;
  }
  
  return title;
}
