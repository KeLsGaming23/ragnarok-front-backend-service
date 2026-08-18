/**
 * Custom Item Studio & Visual Editor Modal
 * Create, edit, and configure custom server weapons, armors, cards, consumables, and tickets.
 */
import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Sword,
  Shield,
  Coins,
  Package,
  Layers,
  Save,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Users,
  Image,
  RefreshCw
} from 'lucide-react';
import ItemSprite from '../common/ItemSprite';

const RO_JOBS = [
  'Novice', 'Swordman', 'Mage', 'Archer', 'Acolyte', 'Merchant', 'Thief',
  'Knight', 'Crusader', 'Wizard', 'Sage', 'Hunter', 'BardDancer', 'Priest', 'Monk',
  'Blacksmith', 'Alchemist', 'Assassin', 'Rogue', 'Taekwon', 'Star_Gladiator', 'Soul_Linker',
  'Gunslinger', 'Ninja', 'SuperNovice'
];

const RO_LOCATIONS = [
  { id: 'Head_Top', label: 'Upper Headgear' },
  { id: 'Head_Mid', label: 'Middle Headgear' },
  { id: 'Head_Low', label: 'Lower Headgear' },
  { id: 'Armor', label: 'Body Armor' },
  { id: 'Right_Hand', label: 'Right Hand (Weapon)' },
  { id: 'Left_Hand', label: 'Left Hand (Shield / Weapon)' },
  { id: 'Garment', label: 'Garment (Robe / Wings)' },
  { id: 'Shoes', label: 'Shoes / Boots' },
  { id: 'Right_Accessory', label: 'Right Accessory' },
  { id: 'Left_Accessory', label: 'Left Accessory' },
  { id: 'Costume_Top', label: 'Costume Upper' },
  { id: 'Costume_Mid', label: 'Costume Mid' },
  { id: 'Costume_Low', label: 'Costume Lower' },
  { id: 'Costume_Garment', label: 'Costume Garment / Wings' },
  { id: 'Ammo', label: 'Ammo / Arrow Slot' }
];

const SCRIPT_SNIPPETS = [
  { label: '+10 All Stats', code: 'bonus bAllStats,10;' },
  { label: '+20% Max HP', code: 'bonus bMaxHPrate,20;' },
  { label: '+15% Max SP', code: 'bonus bMaxSPrate,15;' },
  { label: '+10% ASPD', code: 'bonus bAspdRate,10;' },
  { label: '+50 ATK / MATK', code: 'bonus bBaseAtk,50;\nbonus bMatkRate,10;' },
  { label: '+20 CRIT', code: 'bonus bCritical,20;' },
  { label: 'Ignore 50% DEF', code: 'bonus2 bIgnoreDefRaceRate,RC_All,50;' },
  { label: 'Ignore 50% MDEF', code: 'bonus2 bIgnoreMdefRate,RC_All,50;' },
  { label: 'Unbreakable Gear', code: 'bonus bUnbreakableArmor;\nbonus bUnbreakableWeapon;' },
  { label: '100% Potion Heal', code: 'bonus2 bAddItemHealRate,501,100;\nbonus2 bAddItemHealRate,504,100;' },
  { label: '25% Double Attack', code: 'bonus bDoubleRate,25;' },
  { label: 'Autocast Meteor Storm', code: 'bonus3 bAutoSpell,MG_METEOR,5,50;' }
];

export default function CustomItemEditorModal({
  initialItem = null,
  isOpen,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    id: 20001,
    name: '',
    aegisName: '',
    type: 'weapon',
    subType: '1hSword',
    buy: 0,
    sell: 0,
    weight: 10,
    attack: 100,
    magicAttack: 0,
    defense: 0,
    range: 1,
    slots: 1,
    weaponLevel: 4,
    armorLevel: 1,
    equipLevelMin: 1,
    equipLevelMax: 0,
    refineable: true,
    gradable: false,
    script: '',
    customSpriteUrl: '',
    jobs: [...RO_JOBS],
    locations: ['Right_Hand']
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialItem) {
      setFormData({
        id: initialItem.itemId || initialItem.id,
        name: initialItem.name || '',
        aegisName: initialItem.aegisName || '',
        type: initialItem.type || 'weapon',
        subType: initialItem.subType || '',
        buy: initialItem.buy || 0,
        sell: initialItem.sell || 0,
        weight: initialItem.weight || 0,
        attack: initialItem.attack || 0,
        magicAttack: initialItem.magicAttack || 0,
        defense: initialItem.defense || 0,
        range: initialItem.range || 1,
        slots: initialItem.slots || 0,
        weaponLevel: initialItem.weaponLevel || 1,
        armorLevel: initialItem.armorLevel || 1,
        equipLevelMin: initialItem.equipLevelMin || 1,
        equipLevelMax: initialItem.equipLevelMax || 0,
        refineable: Boolean(initialItem.refineable),
        gradable: Boolean(initialItem.gradable),
        script: initialItem.script || '',
        customSpriteUrl: initialItem.customSpriteUrl || '',
        jobs: initialItem.jobs?.length > 0 ? initialItem.jobs : [...RO_JOBS],
        locations: initialItem.locations?.length > 0 ? initialItem.locations : ['Right_Hand']
      });
    } else {
      setFormData({
        id: Math.floor(20000 + Math.random() * 9000),
        name: '',
        aegisName: '',
        type: 'weapon',
        subType: '1hSword',
        buy: 20,
        sell: 10,
        weight: 50,
        attack: 150,
        magicAttack: 50,
        defense: 0,
        range: 1,
        slots: 2,
        weaponLevel: 4,
        armorLevel: 1,
        equipLevelMin: 70,
        equipLevelMax: 0,
        refineable: true,
        gradable: false,
        script: 'bonus bAllStats,5;\nbonus bMaxHPrate,10;',
        customSpriteUrl: '',
        jobs: [...RO_JOBS],
        locations: ['Right_Hand']
      });
    }
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleToggleJob = (job) => {
    setFormData(prev => ({
      ...prev,
      jobs: prev.jobs.includes(job)
        ? prev.jobs.filter(j => j !== job)
        : [...prev.jobs, job]
    }));
  };

  const handleToggleAllJobs = (selectAll) => {
    setFormData(prev => ({
      ...prev,
      jobs: selectAll ? [...RO_JOBS] : []
    }));
  };

  const handleToggleLocation = (locId) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.includes(locId)
        ? prev.locations.filter(l => l !== locId)
        : [...prev.locations, locId]
    }));
  };

  const handleInsertScriptSnippet = (code) => {
    setFormData(prev => ({
      ...prev,
      script: prev.script ? `${prev.script}\n${code}` : code
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.name.trim()) {
      setError('Please provide an Item Name.');
      return;
    }
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save custom item.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <form onSubmit={handleSubmit} className="ro-card bg-gradient-to-b from-ro-surface via-ro-card to-ro-bg w-full max-w-3xl rounded-2xl border-2 border-ro-gold p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ro-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-ro-gold shadow-gold-glow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-white">
                {initialItem ? 'Edit Custom Item' : 'Create New Custom Item'}
              </h2>
              <p className="text-xs text-ro-text-muted">
                Configure item properties, combat stats, allowed jobs, and rAthena script bonuses
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-ro-bg hover:bg-ro-card text-ro-text-muted hover:text-white border border-ro-border transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Basic Identifiers & Category */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-ro-gold flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" /> 1. Item Identity & Category
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                Item ID (Unique) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-ro-bg border border-ro-border text-white font-mono focus:border-ro-gold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                Display Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Celestial Dragon Blade"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-ro-bg border border-ro-border text-white focus:border-ro-gold"
              />
            </div>

            <div>
              <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                Category / Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-ro-bg border border-ro-border text-white focus:border-ro-gold capitalize"
              >
                <option value="weapon">⚔️ Weapon</option>
                <option value="armor">🛡️ Armor / Gear</option>
                <option value="card">🎴 Monster Card</option>
                <option value="usable">🧪 Consumable</option>
                <option value="ticket">🎫 Ticket / Cash</option>
                <option value="ammo">🏹 Ammo / Arrow</option>
                <option value="etc">💎 Etc / Material</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                Aegis Server Name
              </label>
              <input
                type="text"
                placeholder="e.g. Celestial_Dragon_Blade"
                value={formData.aegisName}
                onChange={(e) => setFormData({ ...formData, aegisName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-ro-bg border border-ro-border text-white font-mono focus:border-ro-gold"
              />
            </div>

            <div>
              <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                Sub-Type (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 1hSword, Wings, Headgear"
                value={formData.subType}
                onChange={(e) => setFormData({ ...formData, subType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-ro-bg border border-ro-border text-white focus:border-ro-gold"
              />
            </div>

            <div>
              <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                Custom Sprite URL (Optional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="https://.../sprite.png"
                  value={formData.customSpriteUrl}
                  onChange={(e) => setFormData({ ...formData, customSpriteUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-ro-bg border border-ro-border text-white text-[11px] focus:border-ro-gold"
                />
                <ItemSprite
                  itemId={formData.id}
                  itemType={formData.type}
                  size="md"
                  className="bg-ro-bg border border-ro-border"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Combat & Equipment Attributes */}
        <div className="space-y-3 pt-2 border-t border-ro-border/60">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-ro-gold flex items-center gap-1.5">
            <Sword className="w-3.5 h-3.5" /> 2. Combat & Equipment Stats
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 text-xs">
            <div>
              <label className="font-bold text-ro-text-muted uppercase text-[9px] block mb-1">
                ATK (Attack)
              </label>
              <input
                type="number"
                value={formData.attack}
                onChange={(e) => setFormData({ ...formData, attack: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-2 py-1.5 rounded-lg bg-ro-bg border border-ro-border text-red-400 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-ro-text-muted uppercase text-[9px] block mb-1">
                MATK (Magic Atk)
              </label>
              <input
                type="number"
                value={formData.magicAttack}
                onChange={(e) => setFormData({ ...formData, magicAttack: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-2 py-1.5 rounded-lg bg-ro-bg border border-ro-border text-sky-400 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-ro-text-muted uppercase text-[9px] block mb-1">
                DEF (Defense)
              </label>
              <input
                type="number"
                value={formData.defense}
                onChange={(e) => setFormData({ ...formData, defense: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-2 py-1.5 rounded-lg bg-ro-bg border border-ro-border text-emerald-400 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-ro-text-muted uppercase text-[9px] block mb-1">
                Card Slots (0-4)
              </label>
              <select
                value={formData.slots}
                onChange={(e) => setFormData({ ...formData, slots: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-2 py-1.5 rounded-lg bg-ro-bg border border-ro-border text-amber-300 font-mono"
              >
                <option value={0}>0 Slots</option>
                <option value={1}>1 Slot</option>
                <option value={2}>2 Slots</option>
                <option value={3}>3 Slots</option>
                <option value={4}>4 Slots</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-ro-text-muted uppercase text-[9px] block mb-1">
                Weight
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-2 py-1.5 rounded-lg bg-ro-bg border border-ro-border text-white font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-ro-text-muted uppercase text-[9px] block mb-1">
                Min Level Req
              </label>
              <input
                type="number"
                value={formData.equipLevelMin}
                onChange={(e) => setFormData({ ...formData, equipLevelMin: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-2 py-1.5 rounded-lg bg-ro-bg border border-ro-border text-purple-300 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.refineable}
                onChange={(e) => setFormData({ ...formData, refineable: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="font-bold text-white">Can Be Refined (+1 to +10)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.gradable}
                onChange={(e) => setFormData({ ...formData, gradable: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="font-bold text-white">Can Be Graded (Enchantment)</span>
            </label>
          </div>
        </div>

        {/* Section 3: Equipment Positions */}
        <div className="space-y-2 pt-2 border-t border-ro-border/60">
          <span className="text-xs font-extrabold uppercase tracking-wider text-ro-gold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> 3. Equip Placement Locations
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {RO_LOCATIONS.map((loc) => (
              <label
                key={loc.id}
                className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  formData.locations.includes(loc.id)
                    ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                    : 'bg-ro-bg/60 border-ro-border text-ro-text-muted hover:text-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.locations.includes(loc.id)}
                  onChange={() => handleToggleLocation(loc.id)}
                  className="w-3.5 h-3.5 accent-sky-500"
                />
                <span className="text-[11px] font-semibold">{loc.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 4: Allowed Jobs Checklist */}
        <div className="space-y-2 pt-2 border-t border-ro-border/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-ro-gold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> 4. Eligible Character Jobs ({formData.jobs.length}/{RO_JOBS.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleAllJobs(true)}
                className="text-[10px] text-amber-300 hover:underline"
              >
                Select All
              </button>
              <span className="text-ro-border">|</span>
              <button
                type="button"
                onClick={() => handleToggleAllJobs(false)}
                className="text-[10px] text-ro-text-muted hover:underline"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl bg-ro-bg/80 border border-ro-border text-xs">
            {RO_JOBS.map((job) => (
              <label key={job} className="flex items-center gap-1.5 cursor-pointer text-[10px] text-gray-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={formData.jobs.includes(job)}
                  onChange={() => handleToggleJob(job)}
                  className="w-3 h-3 accent-amber-500"
                />
                <span>{job}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 5: rAthena Bonus Script Builder */}
        <div className="space-y-2 pt-2 border-t border-ro-border/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-ro-gold flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> 5. rAthena Script Effects
            </span>
            <span className="text-[10px] text-ro-text-muted">Click presets below to quickly insert effects</span>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {SCRIPT_SNIPPETS.map((snip) => (
              <button
                key={snip.label}
                type="button"
                onClick={() => handleInsertScriptSnippet(snip.code)}
                className="px-2 py-0.5 rounded-lg bg-ro-bg hover:bg-amber-950/40 border border-ro-border hover:border-amber-500/40 text-[10px] text-amber-300 font-mono transition-colors"
              >
                + {snip.label}
              </button>
            ))}
          </div>

          <textarea
            rows={4}
            value={formData.script}
            onChange={(e) => setFormData({ ...formData, script: e.target.value })}
            placeholder="e.g. bonus bAllStats,10; bonus bMaxHPrate,20; bonus2 bAddItemHealRate,501,100;"
            className="w-full p-3 rounded-xl bg-black/90 border border-ro-border text-emerald-400 font-mono text-xs focus:outline-none focus:border-ro-gold resize-y shadow-inner"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-ro-border/80">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-ro-card hover:bg-ro-bg text-ro-text-secondary hover:text-white border border-ro-border transition-all"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="btn-gold !py-2.5 !px-6 text-xs font-cinzel font-bold shadow-gold-glow flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Item...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Custom Item</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
