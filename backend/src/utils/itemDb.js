/**
 * Ragnarok Online Item Database & Custom Item Studio Engine
 * Powered by compiled rAthena rich database (29,356+ items) + dynamic custom items store
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const itemsJsonPath = path.resolve(__dirname, '../data/items.json');
const customItemsJsonPath = path.resolve(__dirname, '../data/custom_items.json');

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

// In-memory Stores
let ITEMS_MAP = {};
let CUSTOM_ITEMS_MAP = {};
let CARDS_LIST = [];

// Initialize custom items file if missing
if (!fs.existsSync(customItemsJsonPath)) {
  try {
    fs.writeFileSync(customItemsJsonPath, JSON.stringify({}), 'utf-8');
  } catch {}
}

function loadAllData() {
  try {
    if (fs.existsSync(itemsJsonPath)) {
      const rawData = fs.readFileSync(itemsJsonPath, 'utf-8');
      ITEMS_MAP = JSON.parse(rawData);
    }
  } catch (err) {
    console.warn('[ItemDb] Warning: Failed to load items.json:', err.message);
  }

  try {
    if (fs.existsSync(customItemsJsonPath)) {
      const rawCustom = fs.readFileSync(customItemsJsonPath, 'utf-8');
      CUSTOM_ITEMS_MAP = JSON.parse(rawCustom);
    }
  } catch (err) {
    console.warn('[ItemDb] Warning: Failed to load custom_items.json:', err.message);
  }

  rebuildCardsList();
}

function rebuildCardsList() {
  CARDS_LIST = [];
  const merged = { ...ITEMS_MAP, ...CUSTOM_ITEMS_MAP };
  for (const [idStr, item] of Object.entries(merged)) {
    if (item.type === 'card' || item.name?.toLowerCase().includes('card') || (item.id >= 4001 && item.id <= 4999)) {
      CARDS_LIST.push({
        cardId: Number(idStr),
        name: item.name || `Card #${idStr}`,
        aegisName: item.aegisName,
        isCustom: Boolean(CUSTOM_ITEMS_MAP[idStr])
      });
    }
  }
}

// Load initially
loadAllData();

/**
 * Return CDN image URLs for sprites
 */
export function getItemImageUrls(itemId, customSpriteUrl = null) {
  const id = Number(itemId);
  if (customSpriteUrl) {
    return {
      sprite: customSpriteUrl,
      collection: customSpriteUrl
    };
  }
  return {
    sprite: `https://static.divine-pride.net/images/items/item/${id}.png`,
    collection: `https://static.divine-pride.net/images/items/collection/${id}.png`
  };
}

/**
 * Resolve an item ID to human-readable metadata & sprite URLs
 */
export function resolveItemInfo(itemId) {
  const id = Number(itemId);
  const customItem = CUSTOM_ITEMS_MAP[id];
  const officialItem = ITEMS_MAP[id];
  const item = customItem || officialItem;
  const isCustom = Boolean(customItem);

  const images = getItemImageUrls(id, item?.customSpriteUrl);

  if (item) {
    return {
      itemId: id,
      name: item.name || `Item #${id}`,
      aegisName: item.aegisName || '',
      type: item.type || 'etc',
      subType: item.subType || '',
      buy: item.buy || 0,
      sell: item.sell || 0,
      weight: item.weight || 0,
      attack: item.attack || 0,
      magicAttack: item.magicAttack || 0,
      defense: item.defense || 0,
      range: item.range || 1,
      slots: item.slots || 0,
      jobs: item.jobs || [],
      locations: item.locations || [],
      weaponLevel: item.weaponLevel || 0,
      armorLevel: item.armorLevel || 0,
      equipLevelMin: item.equipLevelMin || 0,
      equipLevelMax: item.equipLevelMax || 0,
      refineable: Boolean(item.refineable),
      gradable: Boolean(item.gradable),
      script: item.script || '',
      equipScript: item.equipScript || '',
      unEquipScript: item.unEquipScript || '',
      isCustom,
      imageUrl: images.sprite,
      collectionUrl: images.collection
    };
  }

  // Fallback category detection
  let inferredType = 'etc';
  if (id >= 501 && id <= 699) inferredType = 'usable';
  else if (id >= 1100 && id <= 1999) inferredType = 'weapon';
  else if (id >= 2100 && id <= 2999) inferredType = 'armor';
  else if (id >= 4000 && id <= 4999) inferredType = 'card';
  else if (id >= 1750 && id <= 1799) inferredType = 'ammo';

  return {
    itemId: id,
    name: `Item #${id}`,
    aegisName: `Item_${id}`,
    type: inferredType,
    subType: '',
    buy: 0,
    sell: 0,
    weight: 0,
    attack: 0,
    magicAttack: 0,
    defense: 0,
    range: 1,
    slots: 0,
    jobs: [],
    locations: [],
    weaponLevel: 0,
    armorLevel: 0,
    equipLevelMin: 0,
    equipLevelMax: 0,
    refineable: false,
    gradable: false,
    script: '',
    equipScript: '',
    unEquipScript: '',
    isCustom: false,
    imageUrl: images.sprite,
    collectionUrl: images.collection
  };
}

/**
 * Search all items by query string or ID (multi-term matching)
 */
export function searchKnownItems(query = '', limit = 30) {
  const q = String(query).trim().toLowerCase();
  const results = [];
  const merged = { ...CUSTOM_ITEMS_MAP, ...ITEMS_MAP };
  
  if (!q) {
    const popularIds = [501, 502, 503, 504, 505, 607, 608, 603, 604, 616, 617, 714, 984, 985, 1161, 2357, 4147, 4005];
    for (const id of popularIds) {
      if (merged[id]) {
        results.push(resolveItemInfo(id));
      }
    }
    return results;
  }

  const numericId = parseInt(q, 10);
  if (!isNaN(numericId) && merged[numericId]) {
    results.push(resolveItemInfo(numericId));
  }

  const queryTerms = q.split(/\s+/).filter(Boolean);

  for (const [idStr, item] of Object.entries(merged)) {
    const id = Number(idStr);
    if (id === numericId) continue;

    const itemName = (item.name || '').toLowerCase();
    const aegisName = (item.aegisName || '').toLowerCase();

    const matchesAll = queryTerms.every(term => 
      idStr.includes(term) || itemName.includes(term) || aegisName.includes(term)
    );

    if (matchesAll) {
      results.push(resolveItemInfo(id));
      if (results.length >= limit) break;
    }
  }

  return results;
}

/**
 * Query Item Database with Categorized Filtering, Sorting, and Pagination
 */
export function queryItemDatabase({
  query = '',
  category = 'all', // 'all' | 'weapon' | 'armor' | 'card' | 'usable' | 'ticket' | 'ammo' | 'etc' | 'custom'
  subType = '',
  customOnly = false,
  page = 1,
  limit = 40,
  sortBy = 'id', // 'id' | 'name' | 'attack' | 'defense' | 'weight' | 'slots'
  sortOrder = 'asc'
} = {}) {
  const q = String(query).trim().toLowerCase();
  const queryTerms = q.split(/\s+/).filter(Boolean);
  const merged = { ...CUSTOM_ITEMS_MAP, ...ITEMS_MAP };

  let matchedItems = [];
  const categoryCounts = {
    all: 0,
    weapon: 0,
    armor: 0,
    card: 0,
    usable: 0,
    ticket: 0,
    ammo: 0,
    etc: 0,
    custom: Object.keys(CUSTOM_ITEMS_MAP).length
  };

  for (const [idStr, item] of Object.entries(merged)) {
    const id = Number(idStr);
    const isCustom = Boolean(CUSTOM_ITEMS_MAP[id]);
    const type = item.type || 'etc';

    // Count categories
    categoryCounts.all++;
    if (categoryCounts[type] !== undefined) {
      categoryCounts[type]++;
    }

    // Filter by Custom Only
    if (customOnly || category === 'custom') {
      if (!isCustom) continue;
    }

    // Filter by Category
    if (category !== 'all' && category !== 'custom') {
      if (category === 'ticket') {
        const isTicket = type === 'ticket' || item.name?.toLowerCase().includes('ticket') || item.name?.toLowerCase().includes('pass') || item.name?.toLowerCase().includes('coin');
        if (!isTicket) continue;
      } else if (type !== category) {
        continue;
      }
    }

    // Filter by SubType if specified
    if (subType && item.subType && item.subType.toLowerCase() !== subType.toLowerCase()) {
      continue;
    }

    // Filter by Query
    if (queryTerms.length > 0) {
      const itemName = (item.name || '').toLowerCase();
      const aegisName = (item.aegisName || '').toLowerCase();
      const matchesAll = queryTerms.every(term => 
        idStr.includes(term) || itemName.includes(term) || aegisName.includes(term)
      );
      if (!matchesAll) continue;
    }

    matchedItems.push(resolveItemInfo(id));
  }

  // Sort matched items
  matchedItems.sort((a, b) => {
    let valA = a[sortBy] ?? '';
    let valB = b[sortBy] ?? '';

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalItems = matchedItems.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * limit;
  const paginatedItems = matchedItems.slice(startIndex, startIndex + limit);

  return {
    items: paginatedItems,
    totalItems,
    totalPages,
    currentPage,
    limit,
    categoryCounts
  };
}

/**
 * Custom Item CRUD
 */
export function getCustomItems() {
  return Object.values(CUSTOM_ITEMS_MAP).map(item => resolveItemInfo(item.id));
}

export function saveCustomItem(itemData) {
  const id = parseInt(itemData.id, 10);
  if (!id || id <= 0) {
    throw new Error('Valid numeric Item ID is required.');
  }
  if (!itemData.name || !itemData.name.trim()) {
    throw new Error('Item Name is required.');
  }

  const aegisName = itemData.aegisName?.trim() || itemData.name.trim().replace(/\s+/g, '_');
  
  const newItem = {
    id,
    name: itemData.name.trim(),
    aegisName,
    type: itemData.type || 'etc',
    subType: itemData.subType || '',
    buy: parseInt(itemData.buy, 10) || 0,
    sell: parseInt(itemData.sell, 10) || 0,
    weight: parseInt(itemData.weight, 10) || 0,
    attack: parseInt(itemData.attack, 10) || 0,
    magicAttack: parseInt(itemData.magicAttack, 10) || 0,
    defense: parseInt(itemData.defense, 10) || 0,
    range: parseInt(itemData.range, 10) || 1,
    slots: Math.max(0, Math.min(4, parseInt(itemData.slots, 10) || 0)),
    jobs: Array.isArray(itemData.jobs) ? itemData.jobs : [],
    locations: Array.isArray(itemData.locations) ? itemData.locations : [],
    weaponLevel: parseInt(itemData.weaponLevel, 10) || 0,
    armorLevel: parseInt(itemData.armorLevel, 10) || 0,
    equipLevelMin: parseInt(itemData.equipLevelMin, 10) || 0,
    equipLevelMax: parseInt(itemData.equipLevelMax, 10) || 0,
    refineable: Boolean(itemData.refineable),
    gradable: Boolean(itemData.gradable),
    script: itemData.script ? itemData.script.trim() : '',
    equipScript: itemData.equipScript ? itemData.equipScript.trim() : '',
    unEquipScript: itemData.unEquipScript ? itemData.unEquipScript.trim() : '',
    customSpriteUrl: itemData.customSpriteUrl ? itemData.customSpriteUrl.trim() : '',
    updatedAt: new Date().toISOString()
  };

  CUSTOM_ITEMS_MAP[id] = newItem;

  // Persist to file
  fs.writeFileSync(customItemsJsonPath, JSON.stringify(CUSTOM_ITEMS_MAP, null, 2), 'utf-8');
  rebuildCardsList();

  return resolveItemInfo(id);
}

export function deleteCustomItem(itemId) {
  const id = parseInt(itemId, 10);
  if (!CUSTOM_ITEMS_MAP[id]) {
    throw new Error(`Custom item #${id} does not exist.`);
  }

  delete CUSTOM_ITEMS_MAP[id];
  fs.writeFileSync(customItemsJsonPath, JSON.stringify(CUSTOM_ITEMS_MAP, null, 2), 'utf-8');
  rebuildCardsList();

  return { success: true, id };
}

/**
 * Export all Custom Items in standard rAthena item_db2.yml format
 */
export function exportItemDb2Yaml() {
  const customItems = Object.values(CUSTOM_ITEMS_MAP);

  let yaml = `# rAthena Custom Item Database (item_db2.yml)\n`;
  yaml += `# Exported from KelsGaming RO Admin Studio on ${new Date().toUTCString()}\n`;
  yaml += `###########################################################################\n\n`;
  yaml += `Header:\n`;
  yaml += `  Type: ITEM_DB\n`;
  yaml += `  Version: 3\n\n`;
  yaml += `Body:\n`;

  if (customItems.length === 0) {
    yaml += `  # No custom items created yet.\n`;
    return yaml;
  }

  for (const item of customItems) {
    yaml += `  - Id: ${item.id}\n`;
    yaml += `    AegisName: ${item.aegisName}\n`;
    yaml += `    Name: "${item.name}"\n`;
    yaml += `    Type: ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}\n`;
    if (item.subType) yaml += `    SubType: ${item.subType}\n`;
    if (item.buy > 0) yaml += `    Buy: ${item.buy}\n`;
    if (item.sell > 0) yaml += `    Sell: ${item.sell}\n`;
    if (item.weight > 0) yaml += `    Weight: ${item.weight * 10}\n`;
    if (item.attack > 0) yaml += `    Attack: ${item.attack}\n`;
    if (item.magicAttack > 0) yaml += `    MagicAttack: ${item.magicAttack}\n`;
    if (item.defense > 0) yaml += `    Defense: ${item.defense}\n`;
    if (item.range > 1) yaml += `    Range: ${item.range}\n`;
    if (item.slots > 0) yaml += `    Slots: ${item.slots}\n`;
    if (item.weaponLevel > 0) yaml += `    WeaponLevel: ${item.weaponLevel}\n`;
    if (item.armorLevel > 0) yaml += `    ArmorLevel: ${item.armorLevel}\n`;
    if (item.equipLevelMin > 0) yaml += `    EquipLevelMin: ${item.equipLevelMin}\n`;
    if (item.equipLevelMax > 0) yaml += `    EquipLevelMax: ${item.equipLevelMax}\n`;
    if (item.refineable) yaml += `    Refineable: true\n`;
    if (item.gradable) yaml += `    Gradable: true\n`;

    if (item.jobs && item.jobs.length > 0) {
      yaml += `    Jobs:\n`;
      for (const j of item.jobs) {
        yaml += `      ${j}: true\n`;
      }
    }

    if (item.locations && item.locations.length > 0) {
      yaml += `    Locations:\n`;
      for (const loc of item.locations) {
        yaml += `      ${loc}: true\n`;
      }
    }

    if (item.script) {
      yaml += `    Script: |\n`;
      const lines = item.script.split('\n');
      for (const l of lines) {
        yaml += `      ${l}\n`;
      }
    }
    yaml += `\n`;
  }

  return yaml;
}

/**
 * Get all available cards for slotting
 */
export function getKnownCards(limit = 200) {
  return CARDS_LIST.slice(0, limit);
}

/**
 * Resolve card names from card slots (card0..card3)
 */
export function resolveCardNames(card0, card1, card2, card3) {
  const cardIds = [card0, card1, card2, card3].map(Number).filter(id => id > 0);
  const merged = { ...CUSTOM_ITEMS_MAP, ...ITEMS_MAP };
  return cardIds.map(id => {
    const cardInfo = merged[id];
    return {
      cardId: id,
      name: cardInfo ? cardInfo.name : `Card #${id}`,
      imageUrl: `https://static.divine-pride.net/images/items/item/${id}.png`
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
    const cardNames = cards.map(c => c.name.replace(/\s+Card$/i, '')).join(', ');
    title += ` (${cardNames})`;
  }
  
  return title;
}
