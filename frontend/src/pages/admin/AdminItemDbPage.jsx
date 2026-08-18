/**
 * Admin Item Database Encyclopedia & Custom Item Studio Page
 * Phase 5: Complete 29,356+ rAthena Items Explorer, Custom Item Creator, Categorized Filters, and YAML Exporter
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import AdminLayout from '../../components/admin/AdminLayout';
import ItemSprite from '../../components/common/ItemSprite';
import ItemDetailModal from '../../components/admin/ItemDetailModal';
import CustomItemEditorModal from '../../components/admin/CustomItemEditorModal';
import {
  Database,
  Search,
  Plus,
  Download,
  RefreshCw,
  Sparkles,
  Sword,
  Shield,
  CreditCard,
  FlaskConical,
  Ticket,
  Gem,
  Send,
  Edit3,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List
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

export default function AdminItemDbPage() {
  const navigate = useNavigate();

  // Query & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Data State
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Modal State
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);
  const [customEditorOpen, setCustomEditorOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [yamlExportText, setYamlExportText] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getItemDatabase({
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

  const handleSaveCustomItem = async (itemData) => {
    const res = await adminService.saveCustomItem(itemData);
    setActionSuccess(`Custom item "${res.name}" (#${res.itemId}) successfully saved!`);
    fetchItems();
  };

  const handleDeleteCustomItem = async (item) => {
    if (!window.confirm(`Are you sure you want to permanently delete custom item "${item.name}" (#${item.itemId})?`)) {
      return;
    }
    try {
      await adminService.deleteCustomItem(item.itemId);
      setActionSuccess(`Custom item #${item.itemId} removed from database.`);
      fetchItems();
    } catch (err) {
      setError(err.message || 'Failed to delete custom item.');
    }
  };

  const handleExportYaml = async () => {
    try {
      const res = await adminService.exportCustomItemsYaml();
      const yaml = res.yaml || res;
      setYamlExportText(yaml);
    } catch (err) {
      setError(err.message || 'Failed to export YAML.');
    }
  };

  const handleDispatchItem = (item) => {
    navigate(`/admin/dispatch?itemId=${item.itemId}`);
  };

  return (
    <AdminLayout title="Item Database Encyclopedia & Custom Item Studio">
      <div className="space-y-6 animate-fadeIn pb-12">
        
        {/* Top Header Card */}
        <div className="ro-card p-6 rounded-2xl border-2 border-ro-gold/40 bg-gradient-to-r from-ro-surface via-ro-card to-ro-bg shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-5 h-5 text-ro-gold" />
              <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">
                rAthena Item Database Encyclopedia
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                29,356+ Items Online
              </span>
            </div>
            <p className="text-xs text-ro-text-muted">
              Browse authentic Ragnarok Online items, inspect combat stats and passive bonus scripts, and create custom server items.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => { setItemToEdit(null); setCustomEditorOpen(true); }}
              className="btn-gold !py-2 !px-3.5 text-xs font-cinzel font-bold shadow-gold-glow flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Item</span>
            </button>

            <button
              onClick={handleExportYaml}
              className="px-3.5 py-2 rounded-xl bg-ro-surface hover:bg-ro-bg text-ro-text-secondary hover:text-white border border-ro-border text-xs font-bold transition-all flex items-center gap-1.5"
              title="Export all custom items formatted for rAthena item_db2.yml"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export item_db2.yml</span>
            </button>

            <button
              onClick={fetchItems}
              disabled={loading}
              className="p-2 rounded-xl bg-ro-surface hover:bg-ro-bg text-ro-text-muted hover:text-white border border-ro-border transition-all"
              title="Refresh item database"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-ro-gold' : ''}`} />
            </button>
          </div>
        </div>

        {/* Success / Error Alerts */}
        {actionSuccess && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = categoryCounts[cat.id] ?? (cat.id === 'all' ? totalItems : 0);
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                  isActive
                    ? 'bg-gradient-to-r from-ro-gold to-amber-500 text-black font-extrabold border-ro-gold shadow-gold-glow'
                    : 'bg-ro-surface hover:bg-ro-card text-ro-text-muted hover:text-white border-ro-border'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
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

        {/* Search, Sort, & View Controls Bar */}
        <div className="ro-card p-4 rounded-xl border border-ro-border bg-ro-surface flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {/* Live Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-ro-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by Name, AegisName, or numeric ID (#501, Baphomet)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Sort Control */}
            <div className="flex items-center gap-2">
              <span className="text-ro-text-muted text-[11px] font-bold uppercase">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-ro-bg border border-ro-border text-white text-xs focus:border-ro-gold"
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
                className="px-2 py-1.5 rounded-lg bg-ro-bg border border-ro-border text-ro-gold font-mono uppercase text-xs"
              >
                {sortOrder}
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 rounded-lg bg-ro-bg border border-ro-border">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-ro-gold text-black' : 'text-ro-text-muted hover:text-white'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md ${viewMode === 'table' ? 'bg-ro-gold text-black' : 'text-ro-text-muted hover:text-white'}`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-ro-gold border-t-white rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-ro-text-muted animate-pulse">Filtering 29,356+ items in rAthena database...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-ro-border rounded-2xl bg-ro-surface/40 space-y-3">
            <Database className="w-10 h-10 text-ro-text-muted mx-auto opacity-40" />
            <h4 className="font-cinzel text-base font-bold text-white">No Items Matched</h4>
            <p className="text-xs text-ro-text-muted max-w-md mx-auto">
              No items in the database matched your search query or selected category filter.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.itemId}
                className={`ro-card p-4 rounded-2xl border transition-all flex flex-col justify-between group relative overflow-hidden ${
                  item.isCustom
                    ? 'border-amber-500/60 bg-gradient-to-b from-amber-950/20 via-ro-card to-ro-bg hover:border-amber-400 shadow-md'
                    : 'border-ro-border/80 hover:border-ro-gold/50 bg-ro-surface/80'
                }`}
              >
                <div>
                  {/* Top Bar: Sprite + ID + Badges */}
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

                  {/* Title & Aegis Name */}
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
                      <span className="px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40 font-semibold" title="Contains passive rAthena bonus script">
                        📜 Script
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-ro-border/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedItemDetail(item)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-ro-bg hover:bg-ro-card text-ro-text-secondary hover:text-white border border-ro-border transition-all flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {item.isCustom && (
                      <>
                        <button
                          type="button"
                          onClick={() => { setItemToEdit(item); setCustomEditorOpen(true); }}
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all"
                          title="Edit Custom Item"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomItem(item)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all"
                          title="Delete Custom Item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDispatchItem(item)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-ro-gold/10 hover:bg-ro-gold text-ro-gold hover:text-black border border-ro-gold/30 transition-all flex items-center gap-1"
                      title="Dispatch this item to a player"
                    >
                      <Send className="w-3 h-3" />
                      <span>Dispatch</span>
                    </button>
                  </div>
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
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ro-border/60">
                  {items.map((item) => (
                    <tr key={item.itemId} className="hover:bg-ro-bg/40 transition-colors">
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
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedItemDetail(item)}
                            className="p-1.5 rounded-lg bg-ro-bg hover:bg-ro-card text-ro-text-secondary hover:text-white border border-ro-border"
                            title="Inspect Item"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDispatchItem(item)}
                            className="px-2 py-1 text-[11px] font-bold rounded-lg bg-ro-gold/10 hover:bg-ro-gold text-ro-gold hover:text-black border border-ro-gold/30 flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Dispatch</span>
                          </button>
                        </div>
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

      </div>

      {/* Item Detail Inspector Modal */}
      {selectedItemDetail && (
        <ItemDetailModal
          item={selectedItemDetail}
          isOpen={Boolean(selectedItemDetail)}
          onClose={() => setSelectedItemDetail(null)}
          onEditCustom={(it) => { setItemToEdit(it); setCustomEditorOpen(true); }}
          onDeleteCustom={handleDeleteCustomItem}
        />
      )}

      {/* Custom Item Studio Editor Modal */}
      {customEditorOpen && (
        <CustomItemEditorModal
          initialItem={itemToEdit}
          isOpen={customEditorOpen}
          onClose={() => { setCustomEditorOpen(false); setItemToEdit(null); }}
          onSave={handleSaveCustomItem}
        />
      )}

      {/* YAML Export Modal */}
      {yamlExportText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="ro-card bg-ro-card w-full max-w-2xl rounded-2xl border-2 border-ro-gold p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-ro-border pb-3">
              <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-ro-gold" />
                <span>rAthena item_db2.yml Export</span>
              </h3>
              <button onClick={() => setYamlExportText(null)} className="text-ro-text-muted hover:text-white">✕</button>
            </div>
            <p className="text-xs text-ro-text-muted">
              Copy this YAML content directly into your rAthena server <code className="text-amber-300">db/item_db2.yml</code> to load custom items in-game:
            </p>
            <pre className="p-4 rounded-xl bg-black/90 border border-ro-border text-emerald-400 font-mono text-xs max-h-80 overflow-y-auto whitespace-pre">
              {yamlExportText}
            </pre>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(yamlExportText);
                  alert('Copied item_db2.yml to clipboard!');
                }}
                className="btn-gold !py-2 !px-4 text-xs font-cinzel font-bold shadow-gold-glow"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setYamlExportText(null)}
                className="px-4 py-2 rounded-xl bg-ro-surface hover:bg-ro-bg border border-ro-border text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
