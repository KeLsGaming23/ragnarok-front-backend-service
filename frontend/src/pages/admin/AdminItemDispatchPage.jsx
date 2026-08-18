/**
 * Admin Web In-Game Item & Mail Dispatcher Page
 * Phase 4: Deliver gear, refines, cards, and Zeny directly into Backpack, Kafra storage, or RodEx Mail
 */
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Gift,
  Mail,
  Package,
  Sparkles,
  Sword,
  Shield,
  Coins,
  Search,
  CheckCircle2,
  AlertTriangle,
  Send,
  User,
  Layers,
  Flame,
  Info
} from 'lucide-react';
import { formatZeny } from '../../utils/formatters';
import ItemSprite from '../../components/common/ItemSprite';

export default function AdminItemDispatchPage() {
  // Characters for autocomplete
  const [characters, setCharacters] = useState([]);
  const [loadingChars, setLoadingChars] = useState(true);

  // Form State
  const [deliveryMethod, setDeliveryMethod] = useState('mail'); // 'mail' | 'inventory' | 'storage'
  const [selectedCharId, setSelectedCharId] = useState('');
  const [targetAccountId, setTargetAccountId] = useState('');
  
  // Item Config
  const [itemQuery, setItemQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [customItemId, setCustomItemId] = useState('');
  const [amount, setAmount] = useState(1);
  const [refineLevel, setRefineLevel] = useState(0);

  // Cards
  const [availableCards, setAvailableCards] = useState([]);
  const [card0, setCard0] = useState('');
  const [card1, setCard1] = useState('');
  const [card2, setCard2] = useState('');
  const [card3, setCard3] = useState('');

  // Zeny & Mail Details
  const [zenyAmount, setZenyAmount] = useState(0);
  const [mailTitle, setMailTitle] = useState('Official Server Gift');
  const [mailBody, setMailBody] = useState('Here is your special delivery from the Server Administration.');

  // UI Feedback
  const [dispatching, setDispatching] = useState(false);
  const [toast, setToast] = useState(null);

  // Load characters and known items
  useEffect(() => {
    const initData = async () => {
      try {
        const [charRes, itemRes] = await Promise.all([
          adminService.getOnlinePlayers({ onlineOnly: false, limit: 200 }),
          adminService.searchItems('')
        ]);
        const charList = charRes?.players || charRes?.data?.players || (Array.isArray(charRes) ? charRes : []);
        setCharacters(charList);
        if (charList.length > 0 && !selectedCharId) {
          setSelectedCharId(String(charList[0].char_id));
          setTargetAccountId(String(charList[0].account_id));
        }

        const cards = itemRes?.cards || itemRes?.data?.cards || [];
        setAvailableCards(cards);
      } catch (err) {
        console.warn('Failed to load dispatch presets:', err.message);
      } finally {
        setLoadingChars(false);
      }
    };
    initData();
  }, []);

  // Search items as user types
  useEffect(() => {
    if (!itemQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await adminService.searchItems(itemQuery);
        const list = res?.items || res?.data?.items || [];
        setSearchResults(list);
      } catch {
        setSearchResults([]);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [itemQuery]);

  // Handle character change
  const handleCharChange = (charId) => {
    setSelectedCharId(charId);
    const found = characters.find(c => String(c.char_id) === String(charId));
    if (found) {
      setTargetAccountId(String(found.account_id));
    }
  };

  // Select Item from search
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setCustomItemId(String(item.itemId));
    setItemQuery(item.name);
    setSearchResults([]);
  };

  // Submit Dispatch
  const handleDispatch = async (e) => {
    e.preventDefault();
    const parsedNameId = parseInt(customItemId || selectedItem?.itemId, 10);
    const parsedZeny = parseInt(zenyAmount, 10) || 0;

    if (!parsedNameId && parsedZeny <= 0) {
      setToast({ type: 'error', text: 'Please specify an Item ID or a Zeny amount to deliver.' });
      return;
    }

    if (deliveryMethod !== 'storage' && !selectedCharId) {
      setToast({ type: 'error', text: 'Please select a recipient character.' });
      return;
    }

    if (deliveryMethod === 'storage' && !targetAccountId) {
      setToast({ type: 'error', text: 'Please specify a target Account ID for Kafra storage.' });
      return;
    }

    setDispatching(true);
    try {
      const res = await adminService.dispatchItem({
        deliveryMethod,
        charId: selectedCharId ? parseInt(selectedCharId, 10) : undefined,
        accountId: targetAccountId ? parseInt(targetAccountId, 10) : undefined,
        nameid: parsedNameId || undefined,
        amount: parseInt(amount, 10) || 1,
        refine: parseInt(refineLevel, 10) || 0,
        card0: parseInt(card0, 10) || 0,
        card1: parseInt(card1, 10) || 0,
        card2: parseInt(card2, 10) || 0,
        card3: parseInt(card3, 10) || 0,
        zeny: parsedZeny,
        mailTitle,
        mailBody
      });

      setToast({ type: 'success', text: res.message || 'Dispatch completed successfully!' });
    } catch (err) {
      setToast({ type: 'error', text: err.message || 'Failed to dispatch delivery.' });
    } finally {
      setDispatching(false);
    }
  };

  const selectedCharObj = characters.find(c => String(c.char_id) === String(selectedCharId));

  return (
    <AdminLayout title="Item & Mail Dispatcher">
      <div className="space-y-6">
        
        {/* Toast Feedback */}
        {toast && (
          <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-lg ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/90 border-red-500/40 text-red-300'
          }`}>
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
              <span>{toast.text}</span>
            </div>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Header Hero Banner */}
        <div className="ro-card p-6 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Gift className="w-5 h-5 text-ro-gold" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl font-bold text-white">
                Web In-Game Item & Mail Dispatcher
              </h2>
              <p className="text-xs text-ro-text-muted">
                Deliver weapons, armors, cards, refines, and Zeny directly into Player Backpacks, Kafra Storage, or RodEx In-Game Mail.
              </p>
            </div>
          </div>
        </div>

        {/* Main Dispatch Grid Form */}
        <form onSubmit={handleDispatch} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Columns: Configurator */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Choose Delivery Method */}
            <div className="ro-card p-6 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl space-y-4">
              <h3 className="font-cinzel text-sm font-bold text-ro-gold uppercase tracking-wider flex items-center gap-2">
                <Send className="w-4 h-4 text-ro-gold" />
                <span>1. Select Delivery Channel</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Channel 1: In-Game Mail */}
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('mail')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    deliveryMethod === 'mail'
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg'
                      : 'bg-ro-bg border-ro-border text-ro-text-muted hover:border-ro-border/80'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Mail className="w-4 h-4 text-ro-gold" />
                    <span className="text-xs font-bold text-white">In-Game Mail (RodEx)</span>
                  </div>
                  <p className="text-[10px] text-ro-text-secondary leading-relaxed">
                    Safest delivery. Player receives parcel in mailbox with attached Zeny.
                  </p>
                </button>

                {/* Channel 2: Direct Backpack */}
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('inventory')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    deliveryMethod === 'inventory'
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg'
                      : 'bg-ro-bg border-ro-border text-ro-text-muted hover:border-ro-border/80'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sword className="w-4 h-4 text-ro-gold" />
                    <span className="text-xs font-bold text-white">Direct Backpack</span>
                  </div>
                  <p className="text-[10px] text-ro-text-secondary leading-relaxed">
                    Directly injects into character bag.
                  </p>
                </button>

                {/* Channel 3: Kafra Storage */}
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('storage')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    deliveryMethod === 'storage'
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg'
                      : 'bg-ro-bg border-ro-border text-ro-text-muted hover:border-ro-border/80'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Package className="w-4 h-4 text-ro-gold" />
                    <span className="text-xs font-bold text-white">Kafra Storage</span>
                  </div>
                  <p className="text-[10px] text-ro-text-secondary leading-relaxed">
                    Delivers to account-wide warehouse.
                  </p>
                </button>
              </div>
            </div>

            {/* 2. Recipient Selector */}
            <div className="ro-card p-6 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-cinzel text-sm font-bold text-ro-gold uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-ro-gold" />
                  <span>2. Recipient Target</span>
                </h3>
                <button
                  type="button"
                  onClick={async () => {
                    setLoadingChars(true);
                    try {
                      const res = await adminService.getOnlinePlayers({ onlineOnly: false, limit: 200 });
                      const list = res?.players || res?.data?.players || (Array.isArray(res) ? res : []);
                      setCharacters(list);
                    } catch (e) {
                      console.warn(e);
                    } finally {
                      setLoadingChars(false);
                    }
                  }}
                  className="text-[10px] text-ro-gold hover:underline flex items-center gap-1"
                >
                  <span>🔄 Refresh Characters</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Dropdown Selector */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                    Select Server Character ({characters.length} Available)
                  </label>
                  {loadingChars ? (
                    <div className="p-2.5 bg-ro-bg rounded-xl text-ro-text-muted">Loading character records...</div>
                  ) : (
                    <select
                      value={selectedCharId}
                      onChange={(e) => handleCharChange(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold"
                    >
                      <option value="">-- Choose Character --</option>
                      {characters.map((c) => (
                        <option key={c.char_id} value={c.char_id}>
                          {c.online === 1 ? '🟢' : '⚪'} {c.name} (Lv {c.base_level} {c.className || 'Novice'}) - #{c.char_id}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Direct Char ID input fallback */}
                <div>
                  <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                    Character ID (char_id)
                  </label>
                  <input
                    type="number"
                    value={selectedCharId}
                    onChange={(e) => handleCharChange(e.target.value)}
                    placeholder="e.g. 150001"
                    className="w-full px-3 py-2.5 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold font-mono"
                  />
                </div>
              </div>

              {/* Linked Account ID */}
              <div>
                <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                  Target Account ID (Auto-linked for Kafra Storage)
                </label>
                <input
                  type="number"
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                  placeholder="Auto-detected or enter Account ID..."
                  className="w-full px-3 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold font-mono"
                />
              </div>
            </div>

            {/* 3. Item Configurator */}
            <div className="ro-card p-6 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl space-y-4">
              <h3 className="font-cinzel text-sm font-bold text-ro-gold uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ro-gold" />
                <span>3. Item Specifications & Refine</span>
              </h3>

              {/* Live Search & Custom Item ID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2 relative">
                  <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                    Search Item Database
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-ro-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={itemQuery}
                      onChange={(e) => setItemQuery(e.target.value)}
                      placeholder="Type name (e.g. Red Potion, Dragon Slayer, Valkyrian Armor)..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold"
                    />
                  </div>

                  {/* Autocomplete Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-30 mt-1 rounded-xl bg-ro-surface border-2 border-ro-gold shadow-2xl max-h-56 overflow-y-auto divide-y divide-ro-border/60">
                      {searchResults.map((it) => (
                        <button
                          key={it.itemId}
                          type="button"
                          onClick={() => handleSelectItem(it)}
                          className="w-full px-3 py-2 text-left hover:bg-ro-bg flex items-center justify-between text-xs transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <ItemSprite itemId={it.itemId} itemType={it.type} size="sm" />
                            <div>
                              <span className="font-bold text-white group-hover:text-amber-300 block">{it.name}</span>
                              <span className="text-[10px] text-ro-text-muted font-mono">ID: #{it.itemId}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-ro-gold font-bold uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                            {it.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                    Item ID (nameid)
                  </label>
                  <input
                    type="number"
                    value={customItemId}
                    onChange={(e) => setCustomItemId(e.target.value)}
                    placeholder="e.g. 501, 1161"
                    className="w-full px-3 py-2.5 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold font-mono"
                  />
                </div>
              </div>

              {/* Amount & Refine Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                    Quantity / Amount
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30000}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-ro-text-muted uppercase text-[10px]">
                      Refine Level (+0 to +10)
                    </label>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      +{refineLevel}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={refineLevel}
                    onChange={(e) => setRefineLevel(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* 4 Card Slots */}
              <div className="space-y-2 pt-2 border-t border-ro-border/60">
                <label className="font-bold text-ro-text-muted uppercase text-[10px] block">
                  Slotted Cards (Optional 4 Slots)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { label: 'Card Slot 1', val: card0, set: setCard0 },
                    { label: 'Card Slot 2', val: card1, set: setCard1 },
                    { label: 'Card Slot 3', val: card2, set: setCard2 },
                    { label: 'Card Slot 4', val: card3, set: setCard3 }
                  ].map((slot, idx) => (
                    <select
                      key={idx}
                      value={slot.val}
                      onChange={(e) => slot.set(e.target.value)}
                      className="px-2.5 py-2 rounded-xl bg-ro-bg border border-ro-border text-[11px] text-white focus:outline-none focus:border-ro-gold"
                    >
                      <option value="">{slot.label} (Empty)</option>
                      {availableCards.map((c) => (
                        <option key={c.cardId} value={c.cardId}>
                          {c.name} (#{c.cardId})
                        </option>
                      ))}
                    </select>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. In-Game Mail Options / Zeny */}
            <div className="ro-card p-6 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl space-y-4">
              <h3 className="font-cinzel text-sm font-bold text-ro-gold uppercase tracking-wider flex items-center gap-2">
                <Coins className="w-4 h-4 text-ro-gold" />
                <span>4. Attached Currency & Letter</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-ro-text-muted uppercase text-[10px]">
                      Attached Zeny
                    </label>
                    <span className="font-mono font-bold text-ro-gold text-xs">
                      {formatZeny(zenyAmount)}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={2000000000}
                    step={1}
                    value={zenyAmount}
                    onChange={(e) => setZenyAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    placeholder="e.g. 100, 50000, 1000000"
                    className="w-full px-3 py-2.5 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold font-mono"
                  />
                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      { label: '+100 Z', val: 100 },
                      { label: '+1,000 Z', val: 1000 },
                      { label: '+10,000 Z', val: 10000 },
                      { label: '+100,000 Z', val: 100000 },
                      { label: '+1,000,000 Z', val: 1000000 },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => setZenyAmount(prev => (parseInt(prev, 10) || 0) + preset.val)}
                        className="px-2 py-0.5 rounded-lg bg-ro-bg hover:bg-amber-950/40 border border-ro-border hover:border-amber-500/40 text-[10px] text-amber-300 font-mono transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setZenyAmount(0)}
                      className="px-2 py-0.5 rounded-lg bg-ro-bg hover:bg-red-950/40 border border-ro-border hover:border-red-500/40 text-[10px] text-red-400 font-mono transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {deliveryMethod === 'mail' && (
                  <>
                    <div>
                      <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                        Mail Subject Title
                      </label>
                      <input
                        type="text"
                        value={mailTitle}
                        onChange={(e) => setMailTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                        Mail Message Body
                      </label>
                      <textarea
                        rows={2}
                        value={mailBody}
                        onChange={(e) => setMailBody(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold resize-none"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Live Parcel Preview & Dispatch CTA */}
          <div className="space-y-6">
            <div className="ro-card p-6 rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-ro-surface via-ro-card to-ro-bg shadow-2xl space-y-5 sticky top-24">
              <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-ro-gold" />
                <span>Delivery Preview</span>
              </h3>

              {/* Recipient Badge */}
              <div className="p-3.5 rounded-xl bg-ro-bg border border-ro-border space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-ro-text-muted block">Recipient</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">
                    {selectedCharObj ? selectedCharObj.name : `Char #${selectedCharId || 'None'}`}
                  </span>
                  <span className="text-[10px] font-mono text-ro-gold">
                    {selectedCharObj ? `${selectedCharObj.className || 'Novice'} Lv ${selectedCharObj.base_level}` : ''}
                  </span>
                </div>
              </div>

              {/* Delivery Channel Badge */}
              <div className="p-3.5 rounded-xl bg-ro-bg border border-ro-border space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-ro-text-muted block">Destination</span>
                <span className="font-bold text-amber-300 capitalize text-xs block">
                  {deliveryMethod === 'mail' ? '📬 In-Game Mail (RodEx)' : deliveryMethod === 'inventory' ? '🎒 Direct Backpack' : '📦 Kafra Warehouse'}
                </span>
              </div>

              {/* Item Card Preview */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-ro-bg border border-amber-500/40 space-y-3">
                <span className="text-[10px] font-extrabold uppercase text-ro-gold block">Item Contents</span>
                <div className="flex items-center gap-3">
                  <ItemSprite
                    itemId={customItemId || selectedItem?.itemId}
                    itemType={selectedItem?.type}
                    size="lg"
                    className="border-2 border-ro-gold/40 shadow-md bg-ro-bg"
                  />
                  <div>
                    <span className="font-cinzel font-bold text-white text-sm block">
                      {refineLevel > 0 ? `+${refineLevel} ` : ''}
                      {selectedItem?.name || (customItemId ? `Item #${customItemId}` : 'No item selected')}
                    </span>
                    <span className="text-[10px] text-ro-text-muted font-mono">
                      Quantity: {amount}x &bull; ID: #{customItemId || 'None'}
                    </span>
                  </div>
                </div>

                {/* Cards attached */}
                {[card0, card1, card2, card3].some(Boolean) && (
                  <div className="pt-2 border-t border-ro-border/60 text-[10px] space-y-1.5">
                    <span className="text-ro-text-muted uppercase font-bold block">Attached Cards:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[card0, card1, card2, card3].map((c, i) => c && (
                        <div key={i} className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-ro-surface text-amber-300 border border-ro-border font-mono text-[10px]">
                          <ItemSprite itemId={c} itemType="card" size="sm" />
                          <span>Slot {i+1}: Card #{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Attached Zeny */}
              {zenyAmount > 0 && (
                <div className="p-3 rounded-xl bg-ro-bg border border-ro-border flex items-center justify-between text-xs">
                  <span className="text-ro-text-muted">Attached Zeny:</span>
                  <span className="font-mono font-bold text-ro-gold">{formatZeny(zenyAmount)}</span>
                </div>
              )}

              {/* CTA Button */}
              <button
                type="submit"
                disabled={dispatching}
                className="w-full btn-gold !py-3 font-cinzel text-sm font-bold shadow-gold-glow flex items-center justify-center gap-2"
              >
                {dispatching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-white rounded-full animate-spin"></div>
                    <span>Dispatching Parcel...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirm & Dispatch Delivery</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
