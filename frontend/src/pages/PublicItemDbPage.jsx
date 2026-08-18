/**
 * Public Item Encyclopedia Page (/database/items)
 * Accessible to all players and visitors for browsing 29,356+ Ragnarok Online items and refine simulations.
 */
import React, { useState, useEffect } from 'react';
import { itemService } from '../services/itemService';
import ItemSprite from '../components/common/ItemSprite';
import PublicItemDetailModal from '../components/public/PublicItemDetailModal';
import {
  Database,
  Search,
  Sparkles,
  Sword,
  Shield,
  CreditCard,
  FlaskConical,
  Ticket,
  Gem,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  LayoutGrid,
  List,
  Compass,
  Layers
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: Database },
  { id: 'weapon', label: 'Weapons', icon: Sword },
  { id: 'armor', label: 'Equip & Armor', icon: Shield },
  { id: 'card', label: 'Cards', icon: CreditCard },
  { id: 'usable', label: 'Consumables', icon: FlaskConical },
  { id: 'ticket', label: 'Tickets & Cash', icon: Ticket },
  { id: 'ammo', label: 'Ammo', icon: Gem },
  { id: 'etc', label: 'Etc / Materials', icon: Gem },
  { id: 'custom', label: '✨ Custom Items', icon: Sparkles }
];

export default function PublicItemDbPage() {
  // Query & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  // Data State
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inspector Modal State
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await itemService.getItemDatabase({
        query: searchQuery,
        category: selectedCategory,
        customOnly: selectedCategory === 'custom',
        page: currentPage,
        limit: 40,
        sortBy,
        sortOrder
      });

      setItems(data.items || []);
      setTotalItems(data.totalItems || 0);
      setTotalPages(data.totalPages || 1);
      setCategoryCounts(data.categoryCounts || {});
    } catch (err) {
      setError(err.message || 'Failed to load item database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchQuery, selectedCategory, sortBy, sortOrder, currentPage]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-ro-bg py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Hero Banner */}
      <div className="ro-card p-8 rounded-3xl border-2 border-ro-gold/40 bg-gradient-to-r from-ro-surface via-ro-card to-ro-bg shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-ro-gold" />
            <span>Official Ragnarok Online Item Wiki</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
            Item Database Encyclopedia
          </h1>
          <p className="text-sm text-ro-text-muted leading-relaxed">
            Explore 29,356+ authentic weapons, armors, cards, and consumables. Inspect combat stats, passive bonus scripts, and simulate refine upgrades with live damage scaling.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const count = categoryCounts[cat.id] ?? (cat.id === 'all' ? totalItems : 0);
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                isActive
                  ? 'bg-gradient-to-r from-ro-gold to-amber-500 text-black font-extrabold border-ro-gold shadow-gold-glow'
                  : 'bg-ro-surface hover:bg-ro-card text-ro-text-muted hover:text-white border-ro-border'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
              {count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${isActive ? 'bg-black/30 text-black font-bold' : 'bg-ro-bg text-ro-gold border border-ro-border'}`}>
                  {count.toLocaleString()}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search, Sort & View Controls */}
      <div className="ro-card p-4 rounded-2xl border border-ro-border bg-ro-surface flex flex-col md:flex-row items-center justify-between gap-4 text-xs shadow-lg">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-ro-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by Name, AegisName, or ID (#501, Baphomet)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-ro-text-muted text-[11px] font-bold uppercase">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-ro-bg border border-ro-border text-white text-xs focus:border-ro-gold"
            >
              <option value="id">Item ID</option>
              <option value="name">Name (A-Z)</option>
              <option value="attack">Attack (Atk)</option>
              <option value="defense">Defense (Def)</option>
              <option value="weight">Weight</option>
              <option value="slots">Card Slots</option>
            </select>

            <button
              type="button"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-2.5 py-2 rounded-xl bg-ro-bg border border-ro-border text-ro-gold font-mono uppercase text-xs font-bold"
            >
              {sortOrder}
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-ro-bg border border-ro-border">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-ro-gold text-black' : 'text-ro-text-muted hover:text-white'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-ro-gold text-black' : 'text-ro-text-muted hover:text-white'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-ro-gold border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-ro-text-muted animate-pulse">Browsing 29,356+ items in Midgard Encyclopedia...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-ro-border rounded-3xl bg-ro-surface/40 space-y-3">
          <Database className="w-12 h-12 text-ro-text-muted mx-auto opacity-40" />
          <h4 className="font-cinzel text-lg font-bold text-white">No Items Matched</h4>
          <p className="text-xs text-ro-text-muted max-w-md mx-auto">
            No items in the encyclopedia matched your query. Try searching with a broader name or ID.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.itemId}
              onClick={() => setSelectedItem(item)}
              className={`ro-card p-4 rounded-2xl border transition-all flex flex-col justify-between group cursor-pointer hover:-translate-y-1 ${
                item.isCustom
                  ? 'border-amber-500/50 bg-gradient-to-b from-amber-950/20 via-ro-card to-ro-bg hover:border-amber-400 shadow-md'
                  : 'border-ro-border/80 hover:border-ro-gold/60 bg-ro-surface/80 hover:shadow-xl'
              }`}
            >
              <div>
                {/* Top Sprite & Badges */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <ItemSprite
                    itemId={item.itemId}
                    itemType={item.type}
                    size="lg"
                    className="border border-ro-border/60 shadow bg-ro-bg"
                  />

                  <div className="text-right space-y-1">
                    <span className="font-mono text-xs font-bold text-ro-gold block">
                      #{item.itemId}
                    </span>
                    <span className="inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-ro-bg border border-ro-border text-ro-text-muted">
                      {item.type} {item.subType ? `• ${item.subType}` : ''}
                    </span>
                    {item.isCustom && (
                      <span className="block text-[8px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500 text-black">
                        Custom
                      </span>
                    )}
                  </div>
                </div>

                {/* Name & AegisName */}
                <h3 className="font-cinzel text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1" title={item.name}>
                  {item.refineable ? '+ ' : ''}{item.name}
                </h3>
                <p className="text-[10px] text-ro-text-muted font-mono truncate mb-3" title={item.aegisName}>
                  {item.aegisName}
                </p>

                {/* Mini Stats Badges */}
                <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono mb-3">
                  {item.attack > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/40">
                      Atk: {item.attack}
                    </span>
                  )}
                  {item.defense > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                      Def: {item.defense}
                    </span>
                  )}
                  {item.slots > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40 font-bold">
                      [{item.slots}] Slots
                    </span>
                  )}
                  {item.weight > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-ro-bg text-gray-400 border border-ro-border">
                      Wt: {item.weight}
                    </span>
                  )}
                  {item.script && (
                    <span className="px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40 font-semibold" title="Contains passive bonus script">
                      📜 Script
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-ro-border/60 flex items-center justify-between">
                <span className="text-[11px] text-ro-text-muted font-mono">
                  {item.equipLevelMin > 0 ? `Req Lv ${item.equipLevelMin}+` : 'Lv 1+'}
                </span>
                <span className="text-xs font-bold text-ro-gold group-hover:underline flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Details</span>
                </span>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="ro-card rounded-2xl border border-ro-border overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ro-bg/80 border-b border-ro-border text-ro-text-muted font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Sprite</th>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Name & Aegis</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Combat Stats</th>
                  <th className="p-3.5">Slots</th>
                  <th className="p-3.5">Weight</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ro-border/60">
                {items.map((item) => (
                  <tr
                    key={item.itemId}
                    onClick={() => setSelectedItem(item)}
                    className="hover:bg-ro-bg/40 transition-colors cursor-pointer"
                  >
                    <td className="p-3.5">
                      <ItemSprite itemId={item.itemId} itemType={item.type} size="md" />
                    </td>
                    <td className="p-3.5 font-mono font-bold text-ro-gold">
                      #{item.itemId}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-white block">{item.name}</span>
                      <span className="text-[10px] text-ro-text-muted font-mono">{item.aegisName}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="capitalize font-semibold text-gray-300">{item.type}</span>
                      {item.subType && <span className="text-[10px] text-ro-text-muted block">({item.subType})</span>}
                    </td>
                    <td className="p-3.5 font-mono text-[11px]">
                      {item.attack > 0 && <span className="text-red-400 mr-2">Atk: {item.attack}</span>}
                      {item.defense > 0 && <span className="text-emerald-400">Def: {item.defense}</span>}
                      {item.attack === 0 && item.defense === 0 && <span className="text-ro-text-muted">-</span>}
                    </td>
                    <td className="p-3.5 font-mono text-amber-300">
                      {item.slots > 0 ? `[${item.slots}]` : '-'}
                    </td>
                    <td className="p-3.5 font-mono text-gray-400">
                      {item.weight || 0}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl bg-ro-gold/10 hover:bg-ro-gold text-ro-gold hover:text-black border border-ro-gold/30 inline-flex items-center gap-1 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Bar */}
      <div className="flex items-center justify-between text-xs text-ro-text-muted pt-4 border-t border-ro-border/60">
        <span>
          Showing <strong className="text-white">{items.length}</strong> of <strong className="text-ro-gold">{totalItems.toLocaleString()}</strong> items
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage <= 1 || loading}
            className="p-2 rounded-xl bg-ro-surface hover:bg-ro-bg border border-ro-border text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-mono px-3 py-1.5 rounded-xl bg-ro-bg border border-ro-border text-white">
            Page <strong className="text-ro-gold">{currentPage}</strong> of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages || loading}
            className="p-2 rounded-xl bg-ro-surface hover:bg-ro-bg border border-ro-border text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Public Item Detail Modal */}
      {selectedItem && (
        <PublicItemDetailModal
          item={selectedItem}
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
        />
      )}

    </div>
  );
}
