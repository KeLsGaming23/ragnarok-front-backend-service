/**
 * rAthena YAML Item Database Compiler (Rich Edition)
 * Parses item_db_equip.yml, item_db_etc.yml, and item_db_usable.yml
 * and compiles them into a rich, compact JSON index (items.json) with scripts, stats, and requirements.
 */
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const outputDir = path.resolve(__dirname, '../src/data');
const outputFile = path.resolve(outputDir, 'items.json');

const filesToParse = [
  path.resolve(rootDir, 'item_db_usable.yml'),
  path.resolve(rootDir, 'item_db_etc.yml'),
  path.resolve(rootDir, 'item_db_equip.yml')
];

async function parseYamlFile(filePath, itemMap) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[Compiler] Warning: File ${filePath} does not exist, skipping.`);
    return;
  }

  const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let currentItem = null;
  let inScriptBlock = false;
  let scriptBuffer = [];
  let scriptKey = null; // 'script' | 'equipScript' | 'unEquipScript'

  for await (const line of rl) {
    const trimmed = line.trim();

    // Check for start of item
    if (line.startsWith('  - Id:') || line.startsWith('- Id:')) {
      // Save previous script if any
      if (currentItem && scriptKey && scriptBuffer.length > 0) {
        currentItem[scriptKey] = scriptBuffer.join('\n').trim();
        scriptBuffer = [];
        scriptKey = null;
      }
      if (currentItem && currentItem.id) {
        itemMap[currentItem.id] = currentItem;
      }

      inScriptBlock = false;
      const idMatch = trimmed.match(/Id:\s*(\d+)/i);
      currentItem = {
        id: idMatch ? parseInt(idMatch[1], 10) : null,
        name: '',
        aegisName: '',
        type: 'etc',
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
        unEquipScript: ''
      };
      continue;
    }

    if (!currentItem) continue;

    // Handle multiline script blocks
    if (inScriptBlock) {
      if (line.startsWith('    ') && (line.startsWith('      ') || !line.trim().match(/^[A-Za-z0-9_]+:/))) {
        scriptBuffer.push(line.trim());
        continue;
      } else {
        // End of script block
        if (scriptKey && scriptBuffer.length > 0) {
          currentItem[scriptKey] = scriptBuffer.join('\n').trim();
        }
        scriptBuffer = [];
        scriptKey = null;
        inScriptBlock = false;
      }
    }

    // Check if line starts a script block
    if (trimmed.startsWith('Script: |') || trimmed.startsWith('Script: >')) {
      inScriptBlock = true;
      scriptKey = 'script';
      scriptBuffer = [];
      continue;
    } else if (trimmed.startsWith('EquipScript: |') || trimmed.startsWith('EquipScript: >')) {
      inScriptBlock = true;
      scriptKey = 'equipScript';
      scriptBuffer = [];
      continue;
    } else if (trimmed.startsWith('UnEquipScript: |') || trimmed.startsWith('UnEquipScript: >')) {
      inScriptBlock = true;
      scriptKey = 'unEquipScript';
      scriptBuffer = [];
      continue;
    }

    // Extract core properties
    if (line.startsWith('    AegisName:') || line.startsWith('  AegisName:')) {
      const match = trimmed.match(/AegisName:\s*["']?([^"']+)["']?/i);
      if (match) currentItem.aegisName = match[1].trim();
    } else if (line.startsWith('    Name:') || line.startsWith('  Name:')) {
      const match = trimmed.match(/Name:\s*["']?([^"']+)["']?/i);
      if (match) currentItem.name = match[1].trim();
    } else if (line.startsWith('    Type:') || line.startsWith('  Type:')) {
      const match = trimmed.match(/Type:\s*(\w+)/i);
      if (match) {
        const rawType = match[1].toLowerCase();
        if (rawType.includes('weapon')) currentItem.type = 'weapon';
        else if (rawType.includes('armor')) currentItem.type = 'armor';
        else if (rawType.includes('card')) currentItem.type = 'card';
        else if (rawType.includes('healing') || rawType.includes('usable')) currentItem.type = 'usable';
        else if (rawType.includes('cash') || rawType.includes('ticket')) currentItem.type = 'ticket';
        else if (rawType.includes('ammo')) currentItem.type = 'ammo';
        else currentItem.type = 'etc';
      }
    } else if (line.startsWith('    SubType:') || line.startsWith('  SubType:')) {
      const match = trimmed.match(/SubType:\s*["']?([^"']+)["']?/i);
      if (match) currentItem.subType = match[1].trim();
    } else if (line.startsWith('    Buy:') || line.startsWith('  Buy:')) {
      const match = trimmed.match(/Buy:\s*(\d+)/i);
      if (match) currentItem.buy = parseInt(match[1], 10);
    } else if (line.startsWith('    Sell:') || line.startsWith('  Sell:')) {
      const match = trimmed.match(/Sell:\s*(\d+)/i);
      if (match) currentItem.sell = parseInt(match[1], 10);
    } else if (line.startsWith('    Slots:') || line.startsWith('  Slots:')) {
      const match = trimmed.match(/Slots:\s*(\d+)/i);
      if (match) currentItem.slots = parseInt(match[1], 10);
    } else if (line.startsWith('    Weight:') || line.startsWith('  Weight:')) {
      const match = trimmed.match(/Weight:\s*(\d+)/i);
      if (match) currentItem.weight = Math.floor(parseInt(match[1], 10) / 10);
    } else if (line.startsWith('    Attack:') || line.startsWith('  Attack:')) {
      const match = trimmed.match(/Attack:\s*(\d+)/i);
      if (match) currentItem.attack = parseInt(match[1], 10);
    } else if (line.startsWith('    MagicAttack:') || line.startsWith('  MagicAttack:')) {
      const match = trimmed.match(/MagicAttack:\s*(\d+)/i);
      if (match) currentItem.magicAttack = parseInt(match[1], 10);
    } else if (line.startsWith('    Defense:') || line.startsWith('  Defense:')) {
      const match = trimmed.match(/Defense:\s*(\d+)/i);
      if (match) currentItem.defense = parseInt(match[1], 10);
    } else if (line.startsWith('    Range:') || line.startsWith('  Range:')) {
      const match = trimmed.match(/Range:\s*(\d+)/i);
      if (match) currentItem.range = parseInt(match[1], 10);
    } else if (line.startsWith('    WeaponLevel:') || line.startsWith('  WeaponLevel:')) {
      const match = trimmed.match(/WeaponLevel:\s*(\d+)/i);
      if (match) currentItem.weaponLevel = parseInt(match[1], 10);
    } else if (line.startsWith('    ArmorLevel:') || line.startsWith('  ArmorLevel:')) {
      const match = trimmed.match(/ArmorLevel:\s*(\d+)/i);
      if (match) currentItem.armorLevel = parseInt(match[1], 10);
    } else if (line.startsWith('    EquipLevelMin:') || line.startsWith('  EquipLevelMin:')) {
      const match = trimmed.match(/EquipLevelMin:\s*(\d+)/i);
      if (match) currentItem.equipLevelMin = parseInt(match[1], 10);
    } else if (line.startsWith('    EquipLevelMax:') || line.startsWith('  EquipLevelMax:')) {
      const match = trimmed.match(/EquipLevelMax:\s*(\d+)/i);
      if (match) currentItem.equipLevelMax = parseInt(match[1], 10);
    } else if (line.startsWith('    Refineable:') || line.startsWith('  Refineable:')) {
      currentItem.refineable = trimmed.toLowerCase().includes('true');
    } else if (line.startsWith('    Gradable:') || line.startsWith('  Gradable:')) {
      currentItem.gradable = trimmed.toLowerCase().includes('true');
    } else if (line.startsWith('      ') && (trimmed.includes(': true') || trimmed.includes(':true'))) {
      const jobOrLoc = trimmed.split(':')[0].trim();
      // Heuristic: check if this is location or job
      const locKeywords = ['Right_Hand', 'Left_Hand', 'Armor', 'Head_Top', 'Head_Mid', 'Head_Low', 'Garment', 'Shoes', 'Right_Accessory', 'Left_Accessory', 'Costume_Top', 'Costume_Mid', 'Costume_Low', 'Costume_Garment', 'Ammo'];
      if (locKeywords.some(k => k.toLowerCase() === jobOrLoc.toLowerCase())) {
        if (!currentItem.locations.includes(jobOrLoc)) currentItem.locations.push(jobOrLoc);
      } else {
        if (!currentItem.jobs.includes(jobOrLoc)) currentItem.jobs.push(jobOrLoc);
      }
    }
  }

  if (currentItem && currentItem.id) {
    if (scriptKey && scriptBuffer.length > 0) {
      currentItem[scriptKey] = scriptBuffer.join('\n').trim();
    }
    itemMap[currentItem.id] = currentItem;
  }
}

async function compileAll() {
  console.log('=== Starting rAthena Rich YAML Item Database Compilation ===');
  const startTime = Date.now();
  const itemMap = {};

  for (const file of filesToParse) {
    console.log(`[Compiler] Parsing ${path.basename(file)}...`);
    await parseYamlFile(file, itemMap);
  }

  const totalItems = Object.keys(itemMap).length;
  console.log(`[Compiler] Total parsed items: ${totalItems.toLocaleString()}`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`[Compiler] Writing compiled rich JSON to ${outputFile}...`);
  fs.writeFileSync(outputFile, JSON.stringify(itemMap), 'utf-8');

  const stats = fs.statSync(outputFile);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`=== Rich Compilation Complete in ${duration}s! ===`);
  console.log(`Output: ${outputFile} (${sizeMB} MB, ${totalItems.toLocaleString()} items)`);
}

compileAll().catch(err => {
  console.error('[Compiler] Fatal Error:', err);
  process.exit(1);
});
