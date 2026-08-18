/**
 * rAthena YAML Item Database Compiler
 * Parses item_db_equip.yml, item_db_etc.yml, and item_db_usable.yml
 * and compiles them into a fast, compact JSON index (items.json)
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

  for await (const line of rl) {
    const trimmed = line.trim();

    // Handle multi-line script block skip
    if (inScriptBlock) {
      if (line.startsWith('  - Id:') || (line.startsWith('  ') && !line.startsWith('    ') && trimmed.includes(':'))) {
        inScriptBlock = false;
      } else {
        continue;
      }
    }

    if (trimmed.endsWith(': |') || trimmed.endsWith(': >')) {
      inScriptBlock = true;
      continue;
    }

    // New item entry
    if (line.startsWith('  - Id:') || line.startsWith('- Id:')) {
      if (currentItem && currentItem.id) {
        itemMap[currentItem.id] = currentItem;
      }
      const idMatch = trimmed.match(/Id:\s*(\d+)/i);
      currentItem = {
        id: idMatch ? parseInt(idMatch[1], 10) : null,
        name: '',
        aegisName: '',
        type: 'etc',
        slots: 0,
        weight: 0,
        attack: 0,
        defense: 0,
        refineable: false
      };
      continue;
    }

    if (!currentItem) continue;

    // Extract properties
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
        else if (rawType.includes('healing') || rawType.includes('usable') || rawType.includes('cash')) currentItem.type = 'usable';
        else if (rawType.includes('ammo')) currentItem.type = 'ammo';
        else currentItem.type = 'etc';
      }
    } else if (line.startsWith('    Slots:') || line.startsWith('  Slots:')) {
      const match = trimmed.match(/Slots:\s*(\d+)/i);
      if (match) currentItem.slots = parseInt(match[1], 10);
    } else if (line.startsWith('    Weight:') || line.startsWith('  Weight:')) {
      const match = trimmed.match(/Weight:\s*(\d+)/i);
      if (match) currentItem.weight = Math.floor(parseInt(match[1], 10) / 10);
    } else if (line.startsWith('    Attack:') || line.startsWith('  Attack:')) {
      const match = trimmed.match(/Attack:\s*(\d+)/i);
      if (match) currentItem.attack = parseInt(match[1], 10);
    } else if (line.startsWith('    Defense:') || line.startsWith('  Defense:')) {
      const match = trimmed.match(/Defense:\s*(\d+)/i);
      if (match) currentItem.defense = parseInt(match[1], 10);
    } else if (line.startsWith('    Refineable:') || line.startsWith('  Refineable:')) {
      currentItem.refineable = trimmed.toLowerCase().includes('true');
    }
  }

  if (currentItem && currentItem.id) {
    itemMap[currentItem.id] = currentItem;
  }
}

async function compileAll() {
  console.log('=== Starting rAthena YAML Item Database Compilation ===');
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

  console.log(`[Compiler] Writing compiled JSON to ${outputFile}...`);
  fs.writeFileSync(outputFile, JSON.stringify(itemMap), 'utf-8');

  const stats = fs.statSync(outputFile);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`=== Compilation Complete in ${duration}s! ===`);
  console.log(`Output: ${outputFile} (${sizeMB} MB, ${totalItems.toLocaleString()} items)`);
}

compileAll().catch(err => {
  console.error('[Compiler] Fatal Error:', err);
  process.exit(1);
});
