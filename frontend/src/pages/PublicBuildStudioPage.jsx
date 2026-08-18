/**
 * Public Visual Equipment Build & Loadout Studio Page (/build-studio)
 * Build, refine, socket cards, and calculate live aggregated combat stats for any character class.
 */
import React, { useState, useEffect } from 'react';
import { calculateBuildTotals } from '../utils/buildCalculator';
import EquipmentSlotCard from '../components/builds/EquipmentSlotCard';
import GearSlotPickerModal from '../components/builds/GearSlotPickerModal';
import SocketCardPickerModal from '../components/builds/SocketCardPickerModal';
import {
  Hammer,
  Sword,
  Shield,
  Crown,
  Eye,
  Smile,
  ShieldCheck,
  Feather,
  Footprints,
  Sparkles,
  Save,
  RotateCcw,
  FolderOpen,
  Share2,
  CheckCircle2,
  AlertCircle,
  Zap,
  Heart,
  Activity,
  Layers,
  Code2,
  Trash2,
  X
} from 'lucide-react';

const CLASS_OPTIONS = [
  { tier: 'Transcendent', jobs: ['Lord Knight', 'Paladin', 'High Wizard', 'Professor', 'Sniper', 'Clown', 'Gypsy', 'High Priest', 'Champion', 'Whitesmith', 'Creator', 'Assassin Cross', 'Stalker'] },
  { tier: '2nd Class', jobs: ['Knight', 'Crusader', 'Wizard', 'Sage', 'Hunter', 'Bard', 'Dancer', 'Priest', 'Monk', 'Blacksmith', 'Alchemist', 'Assassin', 'Rogue'] },
  { tier: 'Expanded & 1st', jobs: ['Novice', 'Super Novice', 'Gunslinger', 'Ninja', 'Taekwon', 'Star Gladiator', 'Soul Linker', 'Swordman', 'Mage', 'Archer', 'Acolyte', 'Merchant', 'Thief'] }
];

const SLOT_CONFIGS = [
  { key: 'head_top', title: 'Upper Headgear', icon: Crown, category: 'armor', location: 'Head_Top' },
  { key: 'head_mid', title: 'Middle Headgear', icon: Eye, category: 'armor', location: 'Head_Mid' },
  { key: 'head_low', title: 'Lower Headgear', icon: Smile, category: 'armor', location: 'Head_Low' },
  { key: 'armor', title: 'Body Armor', icon: Shield, category: 'armor', location: 'Armor' },
  { key: 'weapon', title: 'Right Hand Weapon', icon: Sword, category: 'weapon', location: 'Right_Hand' },
  { key: 'shield', title: 'Left Hand (Shield / Weapon)', icon: ShieldCheck, category: 'armor', location: 'Left_Hand' },
  { key: 'garment', title: 'Garment / Robe', icon: Feather, category: 'armor', location: 'Garment' },
  { key: 'shoes', title: 'Shoes / Boots', icon: Footprints, category: 'armor', location: 'Shoes' },
  { key: 'acc_left', title: 'Left Accessory', icon: Sparkles, category: 'armor', location: 'Left_Accessory' },
  { key: 'acc_right', title: 'Right Accessory', icon: Sparkles, category: 'armor', location: 'Right_Accessory' }
];

const DEFAULT_SLOTS = {
  head_top: null,
  head_mid: null,
  head_low: null,
  armor: null,
  weapon: null,
  shield: null,
  garment: null,
  shoes: null,
  acc_left: null,
  acc_right: null
};

export default function PublicBuildStudioPage() {
  const [buildName, setBuildName] = useState('My Custom Build');
  const [selectedJob, setSelectedJob] = useState('Lord Knight');
  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [savedBuilds, setSavedBuilds] = useState([]);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Modal Picker States
  const [activeGearSlot, setActiveGearSlot] = useState(null);
  const [activeCardSlot, setActiveCardSlot] = useState(null); // { slotKey, slotIndex }

  // Load saved builds from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('kelsro_saved_builds');
      if (stored) {
        setSavedBuilds(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not load saved builds:', e);
    }
  }, []);

  // Calculate live aggregated combat stats
  const buildStats = calculateBuildTotals(slots);

  const handleOpenGearPicker = (slotKey) => {
    const config = SLOT_CONFIGS.find(s => s.key === slotKey);
    setActiveGearSlot(config);
  };

  const handleSelectGear = (item) => {
    if (!activeGearSlot) return;
    setSlots(prev => ({
      ...prev,
      [activeGearSlot.key]: {
        item,
        refine: item.refineable ? 4 : 0,
        cards: []
      }
    }));
    setActiveGearSlot(null);
  };

  const handleSetRefine = (slotKey, refine) => {
    setSlots(prev => {
      const current = prev[slotKey];
      if (!current) return prev;
      return {
        ...prev,
        [slotKey]: {
          ...current,
          refine
        }
      };
    });
  };

  const handleUnequip = (slotKey) => {
    setSlots(prev => ({
      ...prev,
      [slotKey]: null
    }));
  };

  const handleOpenCardPicker = (slotKey, slotIndex) => {
    setActiveCardSlot({ slotKey, slotIndex });
  };

  const handleSelectCard = (card, slotIndex) => {
    if (!activeCardSlot) return;
    const { slotKey } = activeCardSlot;
    setSlots(prev => {
      const current = prev[slotKey];
      if (!current) return prev;
      const updatedCards = [...(current.cards || [])];
      updatedCards[slotIndex] = card;
      return {
        ...prev,
        [slotKey]: {
          ...current,
          cards: updatedCards
        }
      };
    });
    setActiveCardSlot(null);
  };

  const handleRemoveCard = (slotIndex) => {
    if (!activeCardSlot) return;
    const { slotKey } = activeCardSlot;
    setSlots(prev => {
      const current = prev[slotKey];
      if (!current) return prev;
      const updatedCards = [...(current.cards || [])];
      updatedCards[slotIndex] = null;
      return {
        ...prev,
        [slotKey]: {
          ...current,
          cards: updatedCards
        }
      };
    });
    setActiveCardSlot(null);
  };

  const handleResetAll = () => {
    if (window.confirm('Reset all equipment slots to empty?')) {
      setSlots(DEFAULT_SLOTS);
      setToast({ type: 'info', text: 'All equipment slots cleared.' });
    }
  };

  const handleSaveBuild = () => {
    const newBuild = {
      id: Date.now(),
      name: buildName.trim() || 'Untitled Build',
      job: selectedJob,
      slots,
      savedAt: new Date().toISOString()
    };
    const updated = [newBuild, ...savedBuilds.filter(b => b.name !== newBuild.name)];
    setSavedBuilds(updated);
    try {
      localStorage.setItem('kelsro_saved_builds', JSON.stringify(updated));
      setToast({ type: 'success', text: `Build "${newBuild.name}" saved successfully!` });
    } catch (e) {
      setToast({ type: 'error', text: 'Failed to save build.' });
    }
  };

  const handleLoadBuild = (build) => {
    setBuildName(build.name);
    setSelectedJob(build.job || 'Lord Knight');
    setSlots(build.slots || DEFAULT_SLOTS);
    setSavedDrawerOpen(false);
    setToast({ type: 'success', text: `Loaded build "${build.name}".` });
  };

  const handleDeleteSavedBuild = (buildId) => {
    const updated = savedBuilds.filter(b => b.id !== buildId);
    setSavedBuilds(updated);
    localStorage.setItem('kelsro_saved_builds', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-ro-bg py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 animate-fadeIn pb-16">
      
      {/* Top Header & Build Controls */}
      <div className="ro-card p-6 rounded-3xl border-2 border-ro-gold/40 bg-gradient-to-r from-ro-surface via-ro-card to-ro-bg shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <Hammer className="w-5 h-5 text-ro-gold" />
            <h1 className="font-cinzel text-xl sm:text-2xl font-black text-white tracking-wide">
              Equipment Build & Loadout Studio
            </h1>
          </div>
          <p className="text-xs text-ro-text-muted">
            Design your character gear loadout, slot cards, simulate refine upgrades, and calculate live aggregated combat stats.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleSaveBuild}
            className="btn-gold !py-2 !px-4 text-xs font-cinzel font-bold shadow-gold-glow flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Build</span>
          </button>

          <button
            type="button"
            onClick={() => setSavedDrawerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-ro-surface hover:bg-ro-bg text-ro-text-secondary hover:text-white border border-ro-border text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Saved Builds ({savedBuilds.length})</span>
          </button>

          <button
            type="button"
            onClick={handleResetAll}
            className="p-2 rounded-xl bg-ro-surface hover:bg-red-950/40 text-ro-text-muted hover:text-red-400 border border-ro-border hover:border-red-500/30 transition-all"
            title="Clear all equipment"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast.text}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Configuration Bar: Build Name & Job Class */}
      <div className="ro-card p-4 rounded-2xl border border-ro-border bg-ro-surface grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs shadow-lg">
        <div className="sm:col-span-2">
          <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
            Build Name / Loadout Title
          </label>
          <input
            type="text"
            value={buildName}
            onChange={(e) => setBuildName(e.target.value)}
            placeholder="e.g. WoE Spiral Pierce Lord Knight"
            className="w-full px-3.5 py-2 rounded-xl bg-ro-bg border border-ro-border text-white text-xs font-cinzel font-bold focus:outline-none focus:border-ro-gold"
          />
        </div>

        <div>
          <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
            Character Class
          </label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-ro-bg border border-ro-border text-white text-xs focus:border-ro-gold font-bold"
          >
            {CLASS_OPTIONS.map((group) => (
              <optgroup key={group.tier} label={group.tier}>
                {group.jobs.map((job) => (
                  <option key={job} value={job}>
                    {job}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split Layout: 10 Gear Slots (Left) vs Aggregated Stats Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: 10 Equipment Slots */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-cinzel text-sm font-bold text-ro-gold uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-ro-gold" />
              <span>Equipment Loadout (10 Slots)</span>
            </h3>
            <span className="text-xs text-ro-text-muted">
              Filtered for <strong className="text-amber-300">{selectedJob}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SLOT_CONFIGS.map((slot) => (
              <EquipmentSlotCard
                key={slot.key}
                slotKey={slot.key}
                title={slot.title}
                icon={slot.icon}
                slotData={slots[slot.key]}
                onOpenGearPicker={handleOpenGearPicker}
                onOpenCardPicker={handleOpenCardPicker}
                onSetRefine={handleSetRefine}
                onUnequip={handleUnequip}
              />
            ))}
          </div>
        </div>

        {/* Right: Live Aggregated Combat Stats Panel */}
        <div className="space-y-4">
          <div className="ro-card p-5 rounded-2xl border-2 border-ro-gold/40 bg-gradient-to-b from-ro-surface via-ro-card to-ro-bg shadow-xl space-y-5 sticky top-24">
            
            {/* Panel Header */}
            <div className="border-b border-ro-border/80 pb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-ro-gold block">
                Live Stat Aggregator
              </span>
              <h3 className="font-cinzel text-base font-bold text-white">
                Total Loadout Combat Power
              </h3>
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-ro-bg border border-ro-border space-y-0.5">
                <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Total Attack</span>
                <span className="font-mono text-lg font-bold text-red-400">
                  {buildStats.totalAtk}
                </span>
                {buildStats.refineAtk > 0 && (
                  <span className="text-[9px] text-amber-300 font-mono block">
                    (+{buildStats.refineAtk} Refine ATK)
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-ro-bg border border-ro-border space-y-0.5">
                <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Total Defense</span>
                <span className="font-mono text-lg font-bold text-emerald-400">
                  {buildStats.totalDef}
                </span>
                {buildStats.refineDef > 0 && (
                  <span className="text-[9px] text-amber-300 font-mono block">
                    (+{buildStats.refineDef} Refine DEF)
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-ro-bg border border-ro-border space-y-0.5">
                <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Magic Attack</span>
                <span className="font-mono text-base font-bold text-sky-400">
                  {buildStats.totalMagicAttack}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-ro-bg border border-ro-border space-y-0.5">
                <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Gear Weight</span>
                <span className="font-mono text-base font-bold text-gray-300">
                  {buildStats.totalWeight}
                </span>
              </div>
            </div>

            {/* Aggregated Primary Stats */}
            <div className="space-y-2 pt-2 border-t border-ro-border/60">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-ro-gold block">
                Primary Stat Bonuses
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-xs">
                {['str', 'agi', 'vit', 'int', 'dex', 'luk'].map((stat) => {
                  const val = buildStats.bonuses[stat] || 0;
                  return (
                    <div key={stat} className="p-1.5 rounded-lg bg-ro-bg/80 border border-ro-border">
                      <span className="text-[9px] uppercase text-ro-text-muted block">{stat}</span>
                      <span className={`font-bold ${val > 0 ? 'text-amber-300' : val < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                        {val > 0 ? `+${val}` : val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Secondary Modifiers */}
            <div className="space-y-1.5 pt-2 border-t border-ro-border/60 text-xs font-mono">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-ro-gold block">
                Combat Modifiers
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                {buildStats.bonuses.maxHpRate > 0 && (
                  <div className="p-1.5 rounded-lg bg-ro-bg border border-ro-border text-emerald-400">
                    Max HP: +{buildStats.bonuses.maxHpRate}%
                  </div>
                )}
                {buildStats.bonuses.maxSpRate > 0 && (
                  <div className="p-1.5 rounded-lg bg-ro-bg border border-ro-border text-sky-400">
                    Max SP: +{buildStats.bonuses.maxSpRate}%
                  </div>
                )}
                {buildStats.bonuses.aspdRate > 0 && (
                  <div className="p-1.5 rounded-lg bg-ro-bg border border-ro-border text-amber-300">
                    ASPD: +{buildStats.bonuses.aspdRate}%
                  </div>
                )}
                {buildStats.bonuses.critical > 0 && (
                  <div className="p-1.5 rounded-lg bg-ro-bg border border-ro-border text-red-400">
                    CRIT: +{buildStats.bonuses.critical}
                  </div>
                )}
                {buildStats.bonuses.flee > 0 && (
                  <div className="p-1.5 rounded-lg bg-ro-bg border border-ro-border text-purple-400">
                    FLEE: +{buildStats.bonuses.flee}
                  </div>
                )}
                {buildStats.bonuses.hit > 0 && (
                  <div className="p-1.5 rounded-lg bg-ro-bg border border-ro-border text-orange-400">
                    HIT: +{buildStats.bonuses.hit}
                  </div>
                )}
              </div>
            </div>

            {/* Combined Passive Scripts Stream */}
            <div className="space-y-2 pt-2 border-t border-ro-border/60">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-ro-gold block flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-ro-gold" /> Combined Item Scripts ({buildStats.scripts.length})
                </span>
              </div>

              {buildStats.scripts.length === 0 ? (
                <div className="p-3 rounded-xl bg-ro-bg border border-ro-border text-xs text-ro-text-muted italic text-center">
                  Equip gear with scripts or socket cards to view combined passive bonuses.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar p-1">
                  {buildStats.scripts.map((entry, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-black/80 border border-ro-border/80 text-xs font-mono">
                      <span className="text-amber-300 text-[10px] font-bold block">{entry.source}:</span>
                      <span className="text-emerald-400 text-[11px] whitespace-pre-wrap">{entry.script}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Modal 1: Gear Slot Picker */}
      {activeGearSlot && (
        <GearSlotPickerModal
          slotKey={activeGearSlot.key}
          slotTitle={activeGearSlot.title}
          categoryFilter={activeGearSlot.category}
          locationFilter={activeGearSlot.location}
          selectedJob={selectedJob}
          isOpen={Boolean(activeGearSlot)}
          onClose={() => setActiveGearSlot(null)}
          onSelect={handleSelectGear}
        />
      )}

      {/* Modal 2: Socket Card Picker */}
      {activeCardSlot && (
        <SocketCardPickerModal
          slotIndex={activeCardSlot.slotIndex}
          equippedItem={slots[activeCardSlot.slotKey]?.item}
          isOpen={Boolean(activeCardSlot)}
          onClose={() => setActiveCardSlot(null)}
          onSelectCard={handleSelectCard}
          onRemoveCard={handleRemoveCard}
        />
      )}

      {/* Saved Builds Drawer Modal */}
      {savedDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="ro-card bg-ro-card w-full max-w-lg rounded-2xl border-2 border-ro-gold p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-ro-border pb-3">
              <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-ro-gold" />
                <span>My Saved Loadouts ({savedBuilds.length})</span>
              </h3>
              <button onClick={() => setSavedDrawerOpen(false)} className="text-ro-text-muted hover:text-white">✕</button>
            </div>

            {savedBuilds.length === 0 ? (
              <div className="py-12 text-center text-xs text-ro-text-muted">
                No saved builds yet. Click "Save Build" on any loadout to store it here.
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                {savedBuilds.map((build) => (
                  <div
                    key={build.id}
                    className="p-3 rounded-xl bg-ro-surface border border-ro-border flex items-center justify-between gap-3 hover:border-ro-gold/50 transition-all"
                  >
                    <div>
                      <h4 className="font-cinzel text-xs font-bold text-white">{build.name}</h4>
                      <span className="text-[10px] text-amber-300 font-semibold">{build.job}</span>
                      <span className="text-[10px] text-ro-text-muted block font-mono">
                        {new Date(build.savedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoadBuild(build)}
                        className="px-3 py-1.5 rounded-lg bg-ro-gold/20 hover:bg-ro-gold text-ro-gold hover:text-black border border-ro-gold/40 text-xs font-bold transition-all"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSavedBuild(build.id)}
                        className="p-1.5 rounded-lg bg-ro-bg hover:bg-red-950 text-ro-text-muted hover:text-red-400 border border-ro-border"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-ro-border/60">
              <button
                type="button"
                onClick={() => setSavedDrawerOpen(false)}
                className="px-4 py-2 rounded-xl bg-ro-surface hover:bg-ro-bg border border-ro-border text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
