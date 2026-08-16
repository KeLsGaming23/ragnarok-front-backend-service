/**
 * Character Inventory & Equipment Viewer Modal (Phase 1)
 */
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  Shield, 
  Swords, 
  Sparkles, 
  FlaskConical, 
  Layers, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Coins, 
  FolderArchive, 
  ShoppingCart,
  Tag
} from 'lucide-react';
import { accountService } from '../../services/accountService';
import { formatZeny } from '../../utils/formatters';

export default function InventoryViewerModal({ character, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('inventory'); // 'equipment' | 'inventory' | 'cart' | 'storage'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'weapon' | 'armor' | 'usable' | 'card' | 'etc'
  const [searchQuery, setSearchQuery] = useState('');
  
  const [data, setData] = useState(null);
  const [storageData, setStorageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInventory = async () => {
    if (!character?.charId) return;
    setLoading(true);
    setError(null);
    try {
      const invData = await accountService.getCharacterInventory(character.charId);
      setData(invData);

      // Also prefetch storage
      const storData = await accountService.getAccountStorage();
      setStorageData(storData);
    } catch (err) {
      setError(err.message || 'Failed to retrieve inventory data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && character?.charId) {
      fetchInventory();
    }
  }, [isOpen, character?.charId]);

  if (!isOpen || !character) return null;

  // Determine active item list based on tab
  let currentItems = [];
  if (activeTab === 'equipment') {
    currentItems = data?.equipment || [];
  } else if (activeTab === 'inventory') {
    currentItems = data?.inventory || [];
  } else if (activeTab === 'cart') {
    currentItems = data?.cart || [];
  } else if (activeTab === 'storage') {
    currentItems = storageData?.storage || [];
  }

  // Filter items
  const filteredItems = currentItems.filter((item) => {
    const matchesCategory = 
      categoryFilter === 'all' || 
      (categoryFilter === 'equipment' && (item.type === 'weapon' || item.type === 'armor')) ||
      item.type === categoryFilter;

    const matchesSearch = 
      !searchQuery.trim() || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cards?.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const getTypeBadge = (type) => {
    switch (type) {
      case 'weapon':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'armor':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'usable':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'card':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="ro-card bg-ro-card w-full max-w-4xl max-h-[90vh] rounded-2xl border border-ro-border flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-ro-bg border-b border-ro-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ro-gold/10 border border-ro-gold/30 flex items-center justify-center text-ro-gold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg font-bold text-white">
                  {character.name}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {character.className} (Lv. {character.baseLevel}/{character.jobLevel})
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1.5 ${
                  character.online 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-gray-500/10 text-gray-400 border border-gray-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${character.online ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`}></span>
                  {character.online ? 'Online in Game' : 'Offline'}
                </span>
              </div>
              <p className="text-xs text-ro-text-muted flex items-center gap-2 mt-0.5">
                <span>Zeny: <strong className="text-amber-300 font-mono">{formatZeny(character.zeny)}</strong></span>
                <span>•</span>
                <span>Database Sync Active</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchInventory}
              disabled={loading}
              className="p-2 text-ro-text-muted hover:text-ro-gold transition-colors rounded-lg hover:bg-ro-card/60"
              title="Refresh Inventory"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-ro-gold' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-ro-text-muted hover:text-white transition-colors rounded-lg hover:bg-ro-card/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 bg-ro-card/50 border-b border-ro-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('inventory'); setCategoryFilter('all'); }}
              className={`px-3.5 py-2 rounded-t-lg text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'inventory'
                  ? 'text-ro-gold border-ro-gold bg-ro-bg'
                  : 'text-ro-text-secondary border-transparent hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              Inventory Bag ({data?.totalInventoryItems || 0})
            </button>

            <button
              onClick={() => { setActiveTab('equipment'); setCategoryFilter('all'); }}
              className={`px-3.5 py-2 rounded-t-lg text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'equipment'
                  ? 'text-ro-gold border-ro-gold bg-ro-bg'
                  : 'text-ro-text-secondary border-transparent hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              Equipped Gear ({data?.equipment?.length || 0})
            </button>

            <button
              onClick={() => { setActiveTab('cart'); setCategoryFilter('all'); }}
              className={`px-3.5 py-2 rounded-t-lg text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'cart'
                  ? 'text-ro-gold border-ro-gold bg-ro-bg'
                  : 'text-ro-text-secondary border-transparent hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Pushcart ({data?.totalCartItems || 0})
            </button>

            <button
              onClick={() => { setActiveTab('storage'); setCategoryFilter('all'); }}
              className={`px-3.5 py-2 rounded-t-lg text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'storage'
                  ? 'text-ro-gold border-ro-gold bg-ro-bg'
                  : 'text-ro-text-secondary border-transparent hover:text-white'
              }`}
            >
              <FolderArchive className="w-4 h-4" />
              Kafra Storage ({storageData?.totalStorageItems || 0})
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative pb-2 sm:pb-0">
            <Search className="w-3.5 h-3.5 text-ro-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search items or cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ro-input pl-8 pr-3 py-1.5 text-xs w-48 focus:w-60 transition-all rounded-lg"
            />
          </div>
        </div>

        {/* Category Filters (when on inventory/storage tabs) */}
        {activeTab !== 'equipment' && (
          <div className="px-5 py-2 bg-ro-bg/40 border-b border-ro-border/60 flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[11px] font-semibold text-ro-text-muted uppercase tracking-wider mr-1">
              Filter:
            </span>
            {[
              { id: 'all', label: 'All Items' },
              { id: 'equipment', label: 'Weapons & Armor' },
              { id: 'usable', label: 'Consumables' },
              { id: 'card', label: 'Cards' },
              { id: 'etc', label: 'Etc / Misc' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setCategoryFilter(f.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  categoryFilter === f.id
                    ? 'bg-ro-gold text-ro-bg font-bold shadow-sm'
                    : 'bg-ro-card text-ro-text-secondary hover:text-white border border-ro-border/60'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* Content Body / Item Grid */}
        <div className="p-5 overflow-y-auto max-h-[55vh] flex-1 bg-ro-bg/20">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-ro-gold/20 border-t-ro-gold rounded-full animate-spin"></div>
              <p className="text-xs text-ro-text-secondary animate-pulse">
                Fetching character equipment & items from rAthena DB...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
              <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-ro-border/60 rounded-xl">
              <Package className="w-10 h-10 text-ro-text-muted mx-auto mb-2 opacity-50" />
              <h4 className="text-sm font-bold text-white mb-1">
                No items found
              </h4>
              <p className="text-xs text-ro-text-muted max-w-sm mx-auto">
                {searchQuery 
                  ? 'No items match your search criteria.' 
                  : activeTab === 'equipment' 
                    ? 'This character does not have any equipment equipped.' 
                    : 'This inventory bag is currently empty.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="ro-card p-3.5 rounded-xl border border-ro-border/80 hover:border-ro-gold/40 transition-all flex items-start justify-between gap-3 group relative overflow-hidden"
                >
                  <div className="flex items-start gap-3">
                    {/* Item Type Icon Avatar */}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${getTypeBadge(item.type)}`}>
                      {item.type === 'weapon' && <Swords className="w-4 h-4" />}
                      {item.type === 'armor' && <Shield className="w-4 h-4" />}
                      {item.type === 'usable' && <FlaskConical className="w-4 h-4" />}
                      {item.type === 'card' && <Sparkles className="w-4 h-4" />}
                      {item.type === 'etc' && <Layers className="w-4 h-4" />}
                    </div>

                    {/* Item Details */}
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                          {item.refine > 0 && (
                            <span className="text-amber-400 font-mono mr-1">+{item.refine}</span>
                          )}
                          {item.name}
                        </span>

                        {item.slots > 0 && (
                          <span className="text-[10px] font-mono font-bold text-gray-400 bg-ro-bg px-1.5 py-0.2 rounded border border-ro-border">
                            [{item.slots}]
                          </span>
                        )}
                      </div>

                      {/* Card Attachments */}
                      {item.cards && item.cards.length > 0 && (
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          {item.cards.map((card, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30"
                            >
                              🃏 {card.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Item Sub-Details: Slot / Type / Weight */}
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-ro-text-muted">
                        <span className={`capitalize font-semibold text-[10px] px-1.5 py-0.5 rounded border ${getTypeBadge(item.type)}`}>
                          {item.type}
                        </span>

                        {item.isEquipped && item.equipSlotName && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                            🛡️ {item.equipSlotName}
                          </span>
                        )}

                        <span className="font-mono text-[10px]">
                          ID: #{item.nameId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Badge */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      x{item.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-3 bg-ro-bg border-t border-ro-border flex items-center justify-between text-xs text-ro-text-muted">
          <span>
            Showing <strong className="text-white">{filteredItems.length}</strong> items
          </span>
          <span className="text-[11px]">
            Phase 1: Read-Only Live Inventory Sync
          </span>
        </div>

      </div>
    </div>
  );
}
