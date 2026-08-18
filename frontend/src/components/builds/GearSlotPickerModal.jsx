/**
 * Gear Slot Item Picker Modal
 * Search and choose equipment compatible with the target gear slot and active job class.
 */
import React, { useState, useEffect } from 'react';
import { itemService } from '../../services/itemService';
import ItemSprite from '../common/ItemSprite';
import {
  X,
  Search,
  Sword,
  Shield,
  Sparkles,
  Filter,
  Eye,
  Check,
  Package
} from 'lucide-react';

export default function GearSlotPickerModal({
  slotKey,
  slotTitle,
  categoryFilter, // 'weapon' | 'armor' | etc.
  locationFilter, // 'Head_Top' | 'Armor' | 'Right_Hand' | etc.
  selectedJob, // e.g. 'Lord Knight', 'High Wizard'
  isOpen,
  onClose,
  onSelect
}) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const fetchCompatibleGear = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await itemService.getItemDatabase({
          query,
          category: categoryFilter,
          page,
          limit: 30,
          sortBy: 'attack',
          sortOrder: 'desc'
        });

        // Filter for items compatible with the active job class and location
        let rawItems = data.items || [];

        if (selectedJob && selectedJob !== 'Novice' && selectedJob !== 'All') {
          rawItems = rawItems.filter(item => {
            if (!item.jobs || item.jobs.length === 0) return true; // Wearable by all
            return item.jobs.some(j => 
              j.toLowerCase() === selectedJob.toLowerCase() ||
              j.toLowerCase() === 'all' ||
              j.toLowerCase() === 'all_jobs'
            );
          });
        }

        // Location match filter if present
        if (locationFilter && locationFilter !== 'Any') {
          rawItems = rawItems.filter(item => {
            if (!item.locations || item.locations.length === 0) return true;
            return item.locations.some(loc => 
              loc.toLowerCase() === locationFilter.toLowerCase() ||
              (locationFilter.startsWith('Head') && loc.startsWith('Head')) ||
              (locationFilter.startsWith('Costume') && loc.startsWith('Costume'))
            );
          });
        }

        setItems(rawItems);
        setTotalItems(data.totalItems || rawItems.length);
      } catch (err) {
        setError(err.message || 'Failed to load gear database.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompatibleGear();
  }, [isOpen, query, page, categoryFilter, locationFilter, selectedJob]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="ro-card bg-gradient-to-b from-ro-surface via-ro-card to-ro-bg w-full max-w-3xl rounded-2xl border-2 border-ro-gold/40 p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-ro-border/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-ro-gold shadow-gold-glow">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-white">
                Select {slotTitle}
              </h2>
              <p className="text-xs text-ro-text-muted">
                Showing compatible gear for <strong className="text-amber-300">{selectedJob || 'All Classes'}</strong>
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
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder={`Search ${slotTitle} by name or ID...`}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold"
          />
        </div>

        {/* Item List Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 min-h-[300px]">
          {loading ? (
            <div className="py-20 text-center space-y-2">
              <div className="w-7 h-7 border-2 border-ro-gold border-t-white rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-ro-text-muted">Loading gear options...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-ro-border rounded-xl bg-ro-bg/40 space-y-2">
              <Package className="w-8 h-8 text-ro-text-muted mx-auto opacity-40" />
              <p className="text-xs text-ro-text-muted">No items matched your search filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {items.map((item) => (
                <div
                  key={item.itemId}
                  onClick={() => onSelect(item)}
                  className="p-3 rounded-xl border border-ro-border hover:border-ro-gold bg-ro-surface/90 hover:bg-ro-card cursor-pointer transition-all flex items-start gap-3 group shadow-sm"
                >
                  <ItemSprite
                    itemId={item.itemId}
                    itemType={item.type}
                    size="md"
                    className="border border-ro-border bg-ro-bg shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-300 truncate font-cinzel">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-ro-gold font-mono font-bold shrink-0">
                        #{item.itemId}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-ro-text-muted mt-0.5">
                      {item.attack > 0 && <span className="text-red-400">Atk: {item.attack}</span>}
                      {item.defense > 0 && <span className="text-emerald-400">Def: {item.defense}</span>}
                      {item.slots > 0 && <span className="text-amber-300 font-bold">[{item.slots}] Slots</span>}
                      {item.weight > 0 && <span>Wt: {item.weight}</span>}
                    </div>

                    {item.script && (
                      <p className="text-[9px] text-emerald-400/90 font-mono truncate mt-1">
                        {item.script.replace(/[\n\r]+/g, ' ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-ro-border/80 pt-3 text-xs">
          <span className="text-ro-text-muted text-[11px]">
            Found <strong className="text-white">{items.length}</strong> compatible items
          </span>
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
