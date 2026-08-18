/**
 * Interactive Equipment Slot Card
 * Renders an individual gear slot with item sprite, refine selector, card sockets, and clear button.
 */
import React from 'react';
import ItemSprite from '../common/ItemSprite';
import {
  Plus,
  Trash2,
  Hammer,
  Shield,
  CreditCard,
  Layers,
  Sparkles
} from 'lucide-react';

export default function EquipmentSlotCard({
  slotKey,
  title,
  icon: SlotIcon,
  slotData = null, // { item, refine, cards: [] }
  onOpenGearPicker,
  onOpenCardPicker,
  onSetRefine,
  onUnequip
}) {
  const item = slotData?.item;
  const refine = slotData?.refine || 0;
  const cards = slotData?.cards || [];
  const maxSlots = item?.slots || 0;

  if (!item) {
    return (
      <div
        onClick={() => onOpenGearPicker(slotKey)}
        className="p-3.5 rounded-2xl border-2 border-dashed border-ro-border hover:border-ro-gold/70 bg-ro-surface/40 hover:bg-ro-surface/80 transition-all cursor-pointer group flex items-center justify-between gap-3 min-h-[92px] shadow-inner"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ro-bg border border-ro-border flex items-center justify-center text-ro-text-muted group-hover:text-ro-gold group-hover:border-ro-gold/40 transition-colors">
            <SlotIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white font-cinzel block">
              {title}
            </span>
            <span className="text-[10px] text-ro-text-muted">
              Click to choose item
            </span>
          </div>
        </div>

        <div className="w-7 h-7 rounded-lg bg-ro-bg border border-ro-border flex items-center justify-center text-ro-text-muted group-hover:text-white group-hover:border-ro-gold transition-colors">
          <Plus className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-ro-surface via-ro-card to-ro-bg shadow-md space-y-2.5 relative group">
      
      {/* Top Row: Sprite + Name + Refine & Unequip */}
      <div className="flex items-start justify-between gap-2">
        <div
          onClick={() => onOpenGearPicker(slotKey)}
          className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
        >
          <ItemSprite
            itemId={item.itemId}
            itemType={item.type}
            size="md"
            className="border border-amber-500/50 bg-ro-bg shadow shrink-0"
          />

          <div className="min-w-0 flex-1">
            <span className="text-[9px] uppercase font-black tracking-widest text-ro-gold block">
              {title}
            </span>
            <h4 className="font-cinzel text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors" title={item.name}>
              {refine > 0 ? `+${refine} ` : ''}{item.name}
            </h4>
            <div className="flex items-center gap-2 text-[10px] font-mono text-ro-text-muted">
              {item.attack > 0 && <span className="text-red-400">Atk: {item.attack}</span>}
              {item.defense > 0 && <span className="text-emerald-400">Def: {item.defense}</span>}
              <span>Wt: {item.weight}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Refine Selector (if refineable) */}
          {item.refineable && (
            <select
              value={refine}
              onChange={(e) => onSetRefine(slotKey, parseInt(e.target.value, 10) || 0)}
              className="px-1.5 py-1 rounded-lg bg-ro-bg border border-ro-border text-amber-300 font-mono text-[10px] font-bold focus:border-ro-gold cursor-pointer"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => (
                <option key={r} value={r}>
                  +{r}
                </option>
              ))}
            </select>
          )}

          {/* Unequip Button */}
          <button
            type="button"
            onClick={() => onUnequip(slotKey)}
            className="p-1 rounded-lg bg-ro-bg hover:bg-red-950/40 border border-ro-border hover:border-red-500/40 text-ro-text-muted hover:text-red-400 transition-colors"
            title="Unequip item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Sockets Grid (if item has slots) */}
      {maxSlots > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1 border-t border-ro-border/60">
          {Array.from({ length: maxSlots }).map((_, idx) => {
            const card = cards[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onOpenCardPicker(slotKey, idx)}
                className={`p-1.5 rounded-lg border text-left flex items-center gap-1.5 transition-all text-[10px] ${
                  card
                    ? 'bg-amber-950/30 border-amber-500/50 text-amber-300 font-bold'
                    : 'bg-ro-bg/60 border-ro-border text-ro-text-muted hover:border-ro-gold/40 hover:text-white'
                }`}
              >
                {card ? (
                  <ItemSprite itemId={card.itemId} itemType="card" size="sm" />
                ) : (
                  <CreditCard className="w-3 h-3 text-ro-text-muted shrink-0" />
                )}
                <span className="truncate flex-1 font-mono">
                  {card ? card.name.replace(/Card$/i, '') : `[Slot ${idx + 1}]`}
                </span>
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
}
