/**
 * Ragnarok Online Item Database & Slot / Equipment Resolver
 * Powered by compiled rAthena YAML database (29,356+ items)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const itemsJsonPath = path.resolve(__dirname, '../data/items.json');

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

// Load compiled items dictionary
let ITEMS_MAP = {};
let CARDS_LIST = [];

try {
  if (fs.existsSync(itemsJsonPath)) {
    const rawData = fs.readFileSync(itemsJsonPath, 'utf-8');
    ITEMS_MAP = JSON.parse(rawData);
    
    // Pre-filter cards for fast dropdowns
    for (const [idStr, item] of Object.entries(ITEMS_MAP)) {
      if (item.type === 'card' || item.name.toLowerCase().includes('card') || (item.id >= 4001 && item.id <= 4999)) {
        CARDS_LIST.push({
          cardId: Number(idStr),
          name: item.name || `Card #${idStr}`,
          aegisName: item.aegisName
        });
      }
    }
  }
} catch (err) {
  console.warn('[ItemDb] Warning: Failed to load items.json, falling back to minimal dictionary:', err.message);
}

/**
 * Return CDN image URLs for sprites
 */
export function getItemImageUrls(itemId) {
  const id = Number(itemId);
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
  const item = ITEMS_MAP[id];
  const images = getItemImageUrls(id);

  if (item) {
    return {
      itemId: id,
      name: item.name || `Item #${id}`,
      aegisName: item.aegisName || '',
      type: item.type || 'etc',
      slots: item.slots || 0,
      weight: item.weight || 0,
      attack: item.attack || 0,
      defense: item.defense || 0,
      refineable: Boolean(item.refineable),
      imageUrl: images.sprite,
      collectionUrl: images.collection
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
    aegisName: `Item_${id}`,
    type: inferredType,
    slots: 0,
    weight: 0,
    attack: 0,
    defense: 0,
    refineable: false,
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
  
  if (!q) {
    // Return standard popular items by default
    const popularIds = [501, 502, 503, 504, 505, 607, 608, 603, 604, 616, 617, 714, 984, 985, 1161, 2357, 4147, 4005];
    for (const id of popularIds) {
      if (ITEMS_MAP[id]) {
        results.push(resolveItemInfo(id));
      }
    }
    return results;
  }

  // Exact ID match prioritised
  const numericId = parseInt(q, 10);
  if (!isNaN(numericId) && ITEMS_MAP[numericId]) {
    results.push(resolveItemInfo(numericId));
  }

  const queryTerms = q.split(/\s+/).filter(Boolean);

  for (const [idStr, item] of Object.entries(ITEMS_MAP)) {
    const id = Number(idStr);
    if (id === numericId) continue;

    const itemName = (item.name || '').toLowerCase();
    const aegisName = (item.aegisName || '').toLowerCase();

    // Must match all terms in query
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
  return cardIds.map(id => {
    const cardInfo = ITEMS_MAP[id];
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
