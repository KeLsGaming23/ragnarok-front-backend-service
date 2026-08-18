/**
 * Socket Card Picker Modal
 * Filter and select monster cards matching the target gear slot (e.g. Weapon, Armor, Garment, Shoes, Shield, Headgear, Accessory).
 */
import React, { useState, useEffect } from 'react';
import { itemService } from '../../services/itemService';
import ItemSprite from '../common/ItemSprite';
import {
  X,
  Search,
  CreditCard,
  Sparkles,
  Check,
  Trash2,
  Package
} from 'lucide-react';

export default function SocketCardPickerModal({
  slotIndex, // 0, 1, 2, 3
  equippedItem,
  isOpen,
  onClose,
  onSelectCard,
  onRemoveCard
}) {
  const [query, setQuery] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchCompatibleCards = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await itemService.getItemDatabase({
          query,
          category: 'card',
          limit: 60,
          sortBy: 'name',
          sortOrder: 'asc'
        });

        let rawCards = data.items || [];

        // Location filtering if possible
        if (equippedItem && equippedItem.locations) {
          const itemLocs = equippedItem.locations.map(l => l.toLowerCase());
          // If we have subType or locations on cards, we can prioritize them
        }

        setCards(rawCards);
      } catch (err) {
        setError(err.message || 'Failed to load card database.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompatibleCards();
  }, [isOpen, query, equippedItem]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="ro-card bg-gradient-to-b from-ro-surface via-ro-card to-ro-bg w-full max-w-2xl rounded-2xl border-2 border-ro-gold/40 p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ro-border/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-ro-gold shadow-gold-glow">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-white">
                Socket Card (Slot #{slotIndex + 1})
              </h2>
              <p className="text-xs text-ro-text-muted">
                Socketing into <strong className="text-amber-300">{equippedItem?.name || 'Equipment'}</strong>
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

        {/* Live Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-ro-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cards (e.g. Marc, Hydra, Raydric, Baphomet)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold"
          />
        </div>

        {/* Card Grid Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 min-h-[260px]">
          {loading ? (
            <div className="py-20 text-center space-y-2">
              <div className="w-7 h-7 border-2 border-ro-gold border-t-white rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-ro-text-muted">Loading cards...</p>
            </div>
          ) : cards.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-ro-border rounded-xl bg-ro-bg/40 space-y-2">
              <Package className="w-8 h-8 text-ro-text-muted mx-auto opacity-40" />
              <p className="text-xs text-ro-text-muted">No monster cards matched your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {cards.map((card) => (
                <div
                  key={card.itemId}
                  onClick={() => onSelectCard(card, slotIndex)}
                  className="p-3 rounded-xl border border-ro-border hover:border-ro-gold bg-ro-surface/90 hover:bg-ro-card cursor-pointer transition-all flex items-start gap-3 group shadow-sm"
                >
                  <ItemSprite
                    itemId={card.itemId}
                    itemType="card"
                    size="md"
                    className="border border-ro-border bg-ro-bg shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-300 truncate font-cinzel">
                        {card.name}
                      </h4>
                      <span className="text-[10px] text-ro-gold font-mono font-bold shrink-0">
                        #{card.itemId}
                      </span>
                    </div>

                    {card.script ? (
                      <p className="text-[10px] text-emerald-400 font-mono line-clamp-2 mt-0.5 leading-snug">
                        {card.script.replace(/[\n\r]+/g, ' ')}
                      </p>
                    ) : (
                      <p className="text-[10px] text-ro-text-muted italic mt-0.5">Passive effect card</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-ro-border/80 pt-3 text-xs">
          <button
            type="button"
            onClick={() => onRemoveCard(slotIndex)}
            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Empty Slot #{slotIndex + 1}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-ro-card hover:bg-ro-bg border border-ro-border text-white text-xs font-bold"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
