/**
 * Public Item Detail Modal with Interactive Refine Simulator
 * Clean, player-facing encyclopedia inspector with live refine stat scaling
 */
import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Sword,
  Shield,
  Coins,
  Package,
  Layers,
  Code2,
  Users,
  Hammer,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import ItemSprite from '../common/ItemSprite';
import { calculateRefineStats } from '../../utils/refineCalculator';

export default function PublicItemDetailModal({ item, isOpen, onClose }) {
  const [collectionError, setCollectionError] = useState(false);
  const [simulatedRefine, setSimulatedRefine] = useState(0);

  if (!isOpen || !item) return null;

  const refineData = calculateRefineStats(item, simulatedRefine);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="ro-card bg-gradient-to-b from-ro-surface via-ro-card to-ro-bg w-full max-w-2xl rounded-2xl border-2 border-ro-gold/40 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-ro-border/80 pb-4">
          <div className="flex items-center gap-4">
            <ItemSprite
              itemId={item.itemId}
              itemType={item.type}
              size="xl"
              className="border-2 border-ro-gold/50 shadow-lg bg-ro-bg p-1"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-cinzel text-xl font-bold text-white">
                  {simulatedRefine > 0 ? `+${simulatedRefine} ` : ''}{item.name}
                  {item.slots > 0 ? ` [${item.slots}]` : ''}
                </h2>
                {item.isCustom && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-yellow-300 text-black shadow-gold-glow">
                    ✨ CUSTOM ITEM
                  </span>
                )}
                {item.refineable && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Refineable
                  </span>
                )}
              </div>
              <p className="text-xs text-ro-text-muted font-mono mt-0.5">
                AegisName: <span className="text-amber-300">{item.aegisName}</span> &bull; ID: <span className="text-ro-gold font-bold">#{item.itemId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-ro-bg hover:bg-ro-card text-ro-text-muted hover:text-white border border-ro-border transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Split: Collection Art + Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Collection Art Card */}
          <div className="p-3 rounded-xl bg-ro-bg/80 border border-ro-border flex flex-col items-center justify-center text-center">
            {!collectionError ? (
              <img
                src={item.collectionUrl || `https://static.divine-pride.net/images/items/collection/${item.itemId}.png`}
                alt={item.name}
                onError={() => setCollectionError(true)}
                className="max-h-32 object-contain drop-shadow-md rounded"
              />
            ) : (
              <ItemSprite itemId={item.itemId} itemType={item.type} size="xl" />
            )}
            <span className="text-[10px] text-ro-text-muted font-mono mt-2 block">
              Type: <strong className="text-white capitalize">{item.type} {item.subType ? `(${item.subType})` : ''}</strong>
            </span>
          </div>

          {/* Core Combat Stats */}
          <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Attack (Atk)</span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-base font-bold text-red-400">
                  {refineData.totalAtk}
                </span>
                {refineData.refineBonus > 0 && (
                  <span className="text-[10px] text-amber-300 font-mono">
                    (+{refineData.refineBonus})
                  </span>
                )}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Magic Attack</span>
              <span className="font-mono text-base font-bold text-sky-400">{item.magicAttack || 0}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Defense (Def)</span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-base font-bold text-emerald-400">
                  {refineData.totalDef}
                </span>
                {refineData.refineBonus > 0 && (
                  <span className="text-[10px] text-amber-300 font-mono">
                    (+{refineData.refineBonus})
                  </span>
                )}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Card Slots</span>
              <span className="font-mono text-base font-bold text-amber-300">
                {item.slots > 0 ? `[${item.slots}] Slots` : 'No Slots'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Weight</span>
              <span className="font-mono text-base font-bold text-gray-300">{item.weight || 0}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Required Level</span>
              <span className="font-mono text-base font-bold text-purple-300">
                {item.equipLevelMin > 0 ? `Lv ${item.equipLevelMin}+` : 'Lv 1'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Weapon Lv</span>
              <span className="font-mono text-sm font-bold text-gray-300">{item.weaponLevel || '-'}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">NPC Buy / Sell</span>
              <span className="font-mono text-sm font-bold text-ro-gold">
                {item.buy ? `${item.buy.toLocaleString()} Z` : 'N/A'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Attack Range</span>
              <span className="font-mono text-sm font-bold text-gray-300">{item.range || 1} Cell</span>
            </div>
          </div>
        </div>

        {/* Interactive Refine Simulator Box */}
        {item.refineable && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-ro-card to-ro-surface border border-amber-500/40 space-y-3 shadow-inner">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Hammer className="w-4 h-4 text-ro-gold" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  Interactive Refine Simulator
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Safe Limit: +{refineData.safeLimit}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-ro-text-muted">Refine Level:</span>
                <span className="text-base font-bold text-ro-gold">+{simulatedRefine}</span>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={simulatedRefine}
                onChange={(e) => setSimulatedRefine(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-ro-bg rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-ro-text-muted px-0.5">
                <span>+0</span>
                <span>+4</span>
                <span>+7</span>
                <span>+10</span>
              </div>
            </div>

            {/* Refine Stat Bonus Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
              <div className="p-2 rounded-lg bg-ro-bg/80 border border-ro-border">
                <span className="text-[9px] text-ro-text-muted block">Refine Bonus:</span>
                <span className="font-bold text-amber-300">+{refineData.refineBonus} {item.type === 'weapon' ? 'ATK' : 'DEF'}</span>
              </div>

              <div className="p-2 rounded-lg bg-ro-bg/80 border border-ro-border">
                <span className="text-[9px] text-ro-text-muted block">Over-Refine Dmg:</span>
                <span className="font-bold text-orange-400">
                  {refineData.overRefineMax > 0 ? `+${refineData.overRefineMin}~${refineData.overRefineMax} ATK` : 'None'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-ro-bg/80 border border-ro-border">
                <span className="text-[9px] text-ro-text-muted block">Safe Threshold:</span>
                <span className={`font-bold ${refineData.isOverRefined ? 'text-red-400' : 'text-emerald-400'}`}>
                  {refineData.isOverRefined ? '⚠️ Over-Refined' : '🛡️ Safe Zone'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-ro-bg/80 border border-ro-border">
                <span className="text-[9px] text-ro-text-muted block">Blacksmith Chance:</span>
                <span className="font-bold text-sky-400">{refineData.successRate}% Success</span>
              </div>
            </div>
          </div>
        )}

        {/* Equip Locations */}
        {item.locations && item.locations.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-ro-text-muted block flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-ro-gold" /> Equipment Position / Placement:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {item.locations.map((loc) => (
                <span
                  key={loc}
                  className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/30 text-xs font-semibold"
                >
                  🛡️ {loc.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Job Eligibility */}
        {item.jobs && item.jobs.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-ro-text-muted block flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-ro-gold" /> Allowed Character Classes:
            </span>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 rounded-xl bg-ro-bg/60 border border-ro-border">
              {item.jobs.map((job) => (
                <span
                  key={job}
                  className="px-2 py-0.5 rounded bg-ro-card text-gray-300 border border-ro-border text-[10px] font-medium"
                >
                  {job}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* rAthena Passive Bonus Script Effects */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-ro-gold block flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-ro-gold" /> Item Passive Effects & Script Bonuses:
          </span>
          {item.script ? (
            <pre className="p-3.5 rounded-xl bg-black/90 border border-ro-border text-emerald-400 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner max-h-40">
              {item.script}
            </pre>
          ) : (
            <div className="p-3 rounded-xl bg-ro-bg border border-ro-border text-xs text-ro-text-muted italic">
              No special passive bonus scripts attached to this item.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-ro-border/80">
          <button
            type="button"
            onClick={onClose}
            className="btn-gold !py-2 !px-6 text-xs font-cinzel font-bold shadow-gold-glow"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
