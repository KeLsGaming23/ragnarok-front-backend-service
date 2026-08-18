/**
 * Character Inventory & Equipment Viewer Modal (Phase 2: Actions & Safety Controls)
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
  Trash2,
  Send,
  Lock,
  Mail,
  User,
  Info
} from 'lucide-react';
import { accountService } from '../../services/accountService';
import { formatZeny } from '../../utils/formatters';
import ItemSprite from '../common/ItemSprite';

export default function InventoryViewerModal({ character, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('inventory'); // 'equipment' | 'inventory' | 'cart' | 'storage'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'weapon' | 'armor' | 'usable' | 'card' | 'etc'
  const [searchQuery, setSearchQuery] = useState('');
  
  const [data, setData] = useState(null);
  const [storageData, setStorageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Modal sub-states for Delete & Send Mail actions
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteAmount, setDeleteAmount] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  const [itemToMail, setItemToMail] = useState(null);
  const [mailRecipient, setMailRecipient] = useState('');
  const [mailAmount, setMailAmount] = useState(1);
  const [mailTitle, setMailTitle] = useState('');
  const [mailMessage, setMailMessage] = useState('');
  const [isSendingMail, setIsSendingMail] = useState(false);
  const [mailError, setMailError] = useState(null);

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
      setActionSuccess(null);
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

  // Open Delete Modal
  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setDeleteAmount(1);
    setError(null);
  };

  // Execute Delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await accountService.deleteCharacterItem(
        character.charId,
        itemToDelete.id,
        deleteAmount
      );
      setActionSuccess(res.message || 'Item successfully destroyed.');
      setItemToDelete(null);
      await fetchInventory();
    } catch (err) {
      setError(err.message || 'Failed to delete item.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Open Mail Modal
  const openMailModal = (item) => {
    setItemToMail(item);
    setMailAmount(1);
    setMailRecipient('');
    setMailTitle(`Gift from ${character.name}`);
    setMailMessage('');
    setMailError(null);
  };

  // Execute Send Mail
  const handleConfirmSendMail = async (e) => {
    e.preventDefault();
    if (!itemToMail || !mailRecipient.trim()) {
      setMailError('Please enter a recipient character name.');
      return;
    }

    setIsSendingMail(true);
    setMailError(null);
    try {
      const res = await accountService.sendCharacterItemMail(
        character.charId,
        itemToMail.id,
        {
          recipientName: mailRecipient.trim(),
          amount: mailAmount,
          title: mailTitle.trim() || `Gift: ${itemToMail.name}`,
          message: mailMessage.trim() || `Sent via KelsGaming RO Web Platform.`
        }
      );
      setActionSuccess(res.message || 'Item successfully sent via in-game mail!');
      setItemToMail(null);
      await fetchInventory();
    } catch (err) {
      setMailError(err.message || 'Failed to send in-game mail.');
    } finally {
      setIsSendingMail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="ro-card bg-ro-card w-full max-w-4xl max-h-[90vh] rounded-2xl border border-ro-border flex flex-col shadow-2xl overflow-hidden relative">
        
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
                <span>Live rAthena DB Sync</span>
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

        {/* Online / Offline Status Guard Banner */}
        {character.online ? (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-2.5 flex items-center gap-2 text-xs text-amber-300">
            <Lock className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Character is currently in-game.</strong> Item actions (Delete / Mail) are locked to prevent memory conflicts. Please log out character in-game to modify inventory.
            </span>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-5 py-2 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              <strong>Character is safely offline.</strong> You can destroy items or dispatch items via in-game mail (RODEX).
            </span>
          </div>
        )}

        {/* Action Success Banner */}
        {actionSuccess && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 px-5 py-2.5 flex items-center justify-between gap-2 text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button
              onClick={() => setActionSuccess(null)}
              className="text-emerald-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

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
                  className="ro-card p-3.5 rounded-xl border border-ro-border/80 hover:border-ro-gold/40 transition-all flex flex-col justify-between gap-3 group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Item Sprite Avatar */}
                      <ItemSprite
                        itemId={item.nameId || item.nameid}
                        itemType={item.type}
                        size="md"
                        className="shrink-0"
                      />

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
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {item.cards.map((card, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center gap-1"
                              >
                                <ItemSprite itemId={card.cardId || card.id} itemType="card" size="sm" />
                                <span>{card.name}</span>
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

                  {/* Phase 2: Action Buttons (Only for unequipped items in inventory) */}
                  {activeTab === 'inventory' && (
                    <div className="pt-2 border-t border-ro-border/50 flex items-center justify-end gap-2">
                      {item.isEquipped ? (
                        <span className="text-[11px] text-ro-text-muted italic">
                          Equipped in-game (Unequip to manage)
                        </span>
                      ) : (
                        <>
                          {/* Send via Mail Button */}
                          <button
                            onClick={() => openMailModal(item)}
                            disabled={character.online}
                            title={character.online ? 'Must log out in-game to send mail' : 'Send to another player via in-game mail'}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Send Mail</span>
                          </button>

                          {/* Delete Item Button */}
                          <button
                            onClick={() => openDeleteModal(item)}
                            disabled={character.online}
                            title={character.online ? 'Must log out in-game to delete' : 'Destroy item permanently'}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}

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
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Phase 2: Atomic Delete & In-Game RODEX Dispatch Active
          </span>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION DIALOG MODAL                                          */}
      {/* ========================================================================= */}
      {itemToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="ro-card bg-ro-card w-full max-w-md rounded-2xl border border-red-500/30 p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">
                  Destroy Item
                </h3>
                <p className="text-xs text-ro-text-muted">
                  Permanent removal from inventory
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-ro-bg border border-ro-border flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ItemSprite
                  itemId={itemToDelete.nameId || itemToDelete.nameid}
                  itemType={itemToDelete.type}
                  size="md"
                />
                <div>
                  <span className="text-xs text-ro-text-muted">Target Item:</span>
                  <p className="font-bold text-sm text-white">
                    {itemToDelete.title}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 shrink-0">
                Max: {itemToDelete.amount}
              </span>
            </div>

            {itemToDelete.amount > 1 && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ro-text-secondary flex justify-between">
                  <span>Amount to Destroy:</span>
                  <span className="text-white font-mono font-bold">{deleteAmount}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max={itemToDelete.amount}
                  value={deleteAmount}
                  onChange={(e) => setDeleteAmount(parseInt(e.target.value, 10))}
                  className="w-full accent-red-500"
                />
                <div className="flex justify-between text-[10px] text-ro-text-muted font-mono">
                  <span>1</span>
                  <span>{itemToDelete.amount}</span>
                </div>
              </div>
            )}

            <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-xs text-red-300 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                Warning: This action is irreversible!
              </p>
              <p className="text-[11px] text-red-400/80 pl-5.5">
                The item will be removed immediately from the rAthena database.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-ro-card hover:bg-ro-bg text-ro-text-secondary hover:text-white border border-ro-border transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all flex items-center gap-2 shadow-lg shadow-red-900/40 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Destroying...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Destroy</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEND VIA IN-GAME MAIL (RODEX) MODAL                                       */}
      {/* ========================================================================= */}
      {itemToMail && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleConfirmSendMail} className="ro-card bg-ro-card w-full max-w-lg rounded-2xl border border-sky-500/30 p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sky-400">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    Send In-Game Mail (RODEX)
                  </h3>
                  <p className="text-xs text-ro-text-muted">
                    Dispatch item directly to player mailbox
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setItemToMail(null)}
                className="text-ro-text-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {mailError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{mailError}</span>
              </div>
            )}

            {/* Attached Item Box */}
            <div className="p-3.5 rounded-xl bg-ro-bg border border-ro-border flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ItemSprite
                  itemId={itemToMail.nameId || itemToMail.nameid}
                  itemType={itemToMail.type}
                  size="md"
                />
                <div>
                  <span className="text-xs text-ro-text-muted">Attached Item:</span>
                  <p className="font-bold text-sm text-white">
                    {itemToMail.title}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-md border border-sky-500/20 shrink-0">
                Available: {itemToMail.amount}
              </span>
            </div>

            {/* Recipient Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ro-text-secondary flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-ro-gold" />
                <span>Recipient Character Name <strong className="text-red-400">*</strong></span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. KelsKnight"
                value={mailRecipient}
                onChange={(e) => setMailRecipient(e.target.value)}
                className="ro-input w-full px-3.5 py-2 text-xs rounded-xl"
              />
            </div>

            {/* Amount Slider if Stackable */}
            {itemToMail.amount > 1 && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ro-text-secondary flex justify-between">
                  <span>Send Amount:</span>
                  <span className="text-white font-mono font-bold">{mailAmount}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max={itemToMail.amount}
                  value={mailAmount}
                  onChange={(e) => setMailAmount(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-500"
                />
              </div>
            )}

            {/* Subject Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ro-text-secondary">
                Mail Subject / Title
              </label>
              <input
                type="text"
                maxLength={45}
                placeholder="Mail Subject"
                value={mailTitle}
                onChange={(e) => setMailTitle(e.target.value)}
                className="ro-input w-full px-3.5 py-2 text-xs rounded-xl"
              />
            </div>

            {/* Message Body */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ro-text-secondary">
                Message Body (Optional)
              </label>
              <textarea
                rows={2}
                maxLength={500}
                placeholder="Add a friendly note..."
                value={mailMessage}
                onChange={(e) => setMailMessage(e.target.value)}
                className="ro-input w-full px-3.5 py-2 text-xs rounded-xl resize-none"
              />
            </div>

            {/* Info notice */}
            <div className="p-3 bg-sky-950/40 border border-sky-800/40 rounded-xl text-xs text-sky-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 text-sky-400 mt-0.5" />
              <span>
                The recipient will receive an in-game notification and can claim the item safely from their mailbox, even if they are currently online or offline!
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToMail(null)}
                disabled={isSendingMail}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-ro-card hover:bg-ro-bg text-ro-text-secondary hover:text-white border border-ro-border transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSendingMail || !mailRecipient.trim()}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-all flex items-center gap-2 shadow-lg shadow-sky-900/40 disabled:opacity-50"
              >
                {isSendingMail ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching Mail...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch In-Game Mail</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
