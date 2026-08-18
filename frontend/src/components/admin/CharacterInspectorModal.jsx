/**
 * Character Deep Inspector Modal
 * 5-Tab Character Monitor: Stats, Backpack Inventory with Cards/Refine, Kafra Storage, Activity Logs, and 1-Click Moderation Actions
 */
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  User,
  Sword,
  Shield,
  MapPin,
  Coins,
  Package,
  FileText,
  Activity,
  AlertTriangle,
  RotateCcw,
  Ban,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Crown,
  Heart,
  Zap,
  Info,
  Clock,
  Compass
} from 'lucide-react';
import { formatZeny } from '../../utils/formatters';
import ItemSprite from '../common/ItemSprite';

export default function CharacterInspectorModal({ charId, onClose, onActionSuccess }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // Ban Form State
  const [banDuration, setBanDuration] = useState(24);
  const [banReason, setBanReason] = useState('Violating Server Rules');

  const fetchInspection = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.inspectCharacter(charId);
      const inspectorData = res?.character ? res : (res?.data || res);
      setData(inspectorData);
    } catch (err) {
      setError(err.message || 'Failed to fetch character details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (charId) {
      fetchInspection();
    }
  }, [charId]);

  // Moderation Action Handlers
  const handleUnstuck = async () => {
    setActionLoading(true);
    setActionMessage(null);
    try {
      const res = await adminService.unstuckCharacter(charId);
      setActionMessage({ type: 'success', text: res.message });
      fetchInspection();
      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to unstuck character' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPoints = async () => {
    setActionLoading(true);
    setActionMessage(null);
    try {
      const res = await adminService.resetCharacterPoints(charId, { resetStats: true, resetSkills: true });
      setActionMessage({ type: 'success', text: res.message });
      fetchInspection();
      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to reset points' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleBan = async () => {
    if (!data?.account?.account_id) return;
    setActionLoading(true);
    setActionMessage(null);
    try {
      const res = await adminService.banAccount(data.account.account_id, {
        durationHours: parseInt(banDuration, 10),
        reason: banReason
      });
      setActionMessage({ type: 'success', text: res.message });
      fetchInspection();
      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to ban account' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnban = async () => {
    if (!data?.account?.account_id) return;
    setActionLoading(true);
    setActionMessage(null);
    try {
      const res = await adminService.unbanAccount(data.account.account_id);
      setActionMessage({ type: 'success', text: res.message });
      fetchInspection();
      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to unban account' });
    } finally {
      setActionLoading(false);
    }
  };

  const character = data?.character;
  const account = data?.account;
  const inventory = data?.inventory || [];
  const storage = data?.storage || [];
  const pickLogs = data?.activityLogs?.pickLogs || [];
  const zenyLogs = data?.activityLogs?.zenyLogs || [];

  const isBanned = account && (account.state === 5 || (account.unban_time > 0 && account.unban_time > Math.floor(Date.now() / 1000)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="ro-card rounded-2xl border-2 border-amber-500/50 bg-ro-card w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-ro-surface via-ro-card to-ro-surface border-b border-ro-border/80 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-gold-glow flex items-center justify-center">
              <div className="w-full h-full bg-ro-surface rounded-[10px] flex items-center justify-center">
                <Sword className="w-6 h-6 text-ro-gold" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-cinzel text-2xl font-black text-white">
                  {character?.name || 'Character Inspector'}
                </h2>
                {character?.online === 1 ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    ONLINE
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-800 text-gray-400">
                    OFFLINE
                  </span>
                )}
                {isBanned && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-950 border border-red-500/50 text-red-400 uppercase">
                    Banned
                  </span>
                )}
              </div>
              <p className="text-xs text-ro-text-secondary mt-0.5">
                {character?.className} &bull; Base Lv <strong className="text-white">{character?.base_level}</strong> / Job Lv <strong className="text-white">{character?.job_level}</strong> &bull; Account: <code className="text-amber-300 font-mono">{account?.userid}</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-ro-surface hover:bg-ro-bg border border-ro-border text-ro-text-muted hover:text-white transition-colors"
            title="Close Inspector"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-ro-border/80 bg-ro-bg/50 px-6 gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Stats', icon: User },
            { id: 'inventory', label: `Backpack (${inventory.length})`, icon: Sword },
            { id: 'storage', label: `Kafra Storage (${storage.length})`, icon: Package },
            { id: 'logs', label: 'Activity Logs', icon: Activity },
            { id: 'moderation', label: 'Moderation Tools', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-ro-gold text-ro-gold bg-ro-gold/10'
                    : 'border-transparent text-ro-text-secondary hover:text-white hover:bg-ro-surface/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Alert */}
        {actionMessage && (
          <div className={`mx-6 mt-4 p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/60 border-red-500/40 text-red-300'
          }`}>
            {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-ro-gold/20 border-t-ro-gold rounded-full animate-spin"></div>
              <span className="text-xs text-ro-text-secondary">Loading character telemetry...</span>
            </div>
          ) : error ? (
            <div className="p-6 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-center">
              {error}
            </div>
          ) : (
            <>
              {/* ========================================================================= */}
              {/* TAB 1: OVERVIEW & STATS                                                   */}
              {/* ========================================================================= */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* HP & SP Dual Bars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-ro-surface/80 border border-ro-border space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <Heart className="w-4 h-4 fill-emerald-400/20" /> HP Pool
                        </span>
                        <span className="font-mono text-white">
                          {character?.hp?.toLocaleString()} / {character?.max_hp?.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-ro-bg rounded-full overflow-hidden border border-ro-border/60">
                        <div
                          style={{ width: `${Math.min(100, (character?.hp / (character?.max_hp || 1)) * 100)}%` }}
                          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                        ></div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-ro-surface/80 border border-ro-border space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-sky-400">
                          <Zap className="w-4 h-4 fill-sky-400/20" /> SP Pool
                        </span>
                        <span className="font-mono text-white">
                          {character?.sp?.toLocaleString()} / {character?.max_sp?.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-ro-bg rounded-full overflow-hidden border border-ro-border/60">
                        <div
                          style={{ width: `${Math.min(100, (character?.sp / (character?.max_sp || 1)) * 100)}%` }}
                          className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full"
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Attributes Hex Grid */}
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-ro-text-muted mb-3 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-ro-gold" /> Character Base Attributes
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {[
                        { label: 'STR', val: character?.str, color: 'text-red-400' },
                        { label: 'AGI', val: character?.agi, color: 'text-amber-400' },
                        { label: 'VIT', val: character?.vit, color: 'text-emerald-400' },
                        { label: 'INT', val: character?.int, color: 'text-sky-400' },
                        { label: 'DEX', val: character?.dex, color: 'text-indigo-400' },
                        { label: 'LUK', val: character?.luk, color: 'text-purple-400' },
                      ].map((stat) => (
                        <div key={stat.label} className="p-3 rounded-xl bg-ro-surface/90 border border-ro-border/80 text-center space-y-1">
                          <span className={`text-[10px] font-black uppercase ${stat.color}`}>{stat.label}</span>
                          <span className="font-mono text-xl font-bold text-white block">{stat.val ?? 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location & Account Overview Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Location Radar */}
                    <div className="p-4 rounded-xl bg-ro-surface/80 border border-ro-border space-y-3">
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <Compass className="w-4 h-4 text-ro-gold" /> Midgard Location Radar
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-ro-border/60">
                          <span className="text-ro-text-muted">Current Map:</span>
                          <code className="text-amber-300 font-bold">{character?.last_map || 'prontera'} ({character?.last_x}, {character?.last_y})</code>
                        </div>
                        <div className="flex justify-between py-1 border-b border-ro-border/60">
                          <span className="text-ro-text-muted">Save Point Town:</span>
                          <code className="text-gray-300">{character?.save_map || 'prontera'} ({character?.save_x}, {character?.save_y})</code>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-ro-text-muted">Zeny in Backpack:</span>
                          <span className="font-mono font-bold text-ro-gold">{formatZeny(character?.zeny)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Linked Account Details */}
                    <div className="p-4 rounded-xl bg-ro-surface/80 border border-ro-border space-y-3">
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <User className="w-4 h-4 text-ro-gold" /> Master Account Details
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-ro-border/60">
                          <span className="text-ro-text-muted">Account ID / User:</span>
                          <span className="text-white font-mono font-semibold">#{account?.account_id} ({account?.userid})</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-ro-border/60">
                          <span className="text-ro-text-muted">Registered Email:</span>
                          <span className="text-gray-300">{account?.email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-ro-text-muted">Last Login IP:</span>
                          <code className="text-amber-300 font-mono">{account?.last_ip || '127.0.0.1'}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: BACKPACK INVENTORY                                                 */}
              {/* ========================================================================= */}
              {activeTab === 'inventory' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-ro-text-muted">
                      Items in Backpack ({inventory.length})
                    </span>
                    <span className="text-xs text-ro-text-secondary">
                      Equipped items highlighted with golden borders
                    </span>
                  </div>

                  {inventory.length === 0 ? (
                    <div className="py-12 text-center text-xs text-ro-text-muted">
                      No items currently held in backpack.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {inventory.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                            item.isEquipped
                              ? 'bg-amber-950/20 border-amber-500/50 shadow-md'
                              : 'bg-ro-surface/80 border-ro-border'
                          }`}
                        >
                          <ItemSprite itemId={item.nameid} itemType={item.type} size="md" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-white truncate block">
                                {item.formattedTitle}
                              </span>
                              {item.amount > 1 && (
                                <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-ro-bg border border-ro-border text-amber-300 shrink-0">
                                  x{item.amount}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 mt-1">
                              {item.isEquipped && (
                                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  {item.equipSlotName}
                                </span>
                              )}
                              <span className="text-[10px] text-ro-text-muted">
                                ID #{item.nameid} &bull; {item.type}
                              </span>
                            </div>

                            {/* Slotted Cards */}
                            {item.cards && item.cards.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {item.cards.map((c, i) => (
                                  <span key={i} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
                                    🎴 {c}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: KAFRA STORAGE                                                      */}
              {/* ========================================================================= */}
              {activeTab === 'storage' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-ro-text-muted">
                      Account Kafra Warehouse Items ({storage.length})
                    </span>
                  </div>

                  {storage.length === 0 ? (
                    <div className="py-12 text-center text-xs text-ro-text-muted">
                      Kafra storage is currently empty.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {storage.map((item) => (
                        <div key={item.id} className="p-3.5 rounded-xl bg-ro-surface/80 border border-ro-border flex items-start gap-3">
                          <ItemSprite itemId={item.nameid} itemType={item.type} size="md" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white truncate block">
                                {item.formattedTitle}
                              </span>
                              <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-ro-bg border border-ro-border text-amber-300">
                                x{item.amount}
                              </span>
                            </div>
                            <span className="text-[10px] text-ro-text-muted block mt-1">
                              ID #{item.nameid} &bull; {item.type}
                            </span>
                            {item.cards && item.cards.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {item.cards.map((c, i) => (
                                  <span key={i} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
                                    🎴 {c}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 4: ACTIVITY & TRANSACTION LOGS                                        */}
              {/* ========================================================================= */}
              {activeTab === 'logs' && (
                <div className="space-y-6">
                  {/* Picklog (Loot & Purchases) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-ro-text-muted flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-ro-gold" /> Recent Item Drops & NPC Transactions (Picklog)
                    </h4>
                    {pickLogs.length === 0 ? (
                      <p className="text-xs text-ro-text-muted py-4">No recent picklog events found.</p>
                    ) : (
                      <div className="divide-y divide-ro-border/60 rounded-xl bg-ro-surface/80 border border-ro-border p-3">
                        {pickLogs.map((log, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                log.type === 'M' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                              }`}>
                                {log.type === 'M' ? 'Monster Drop' : log.type === 'B' ? 'NPC Purchase' : 'Trade/Loot'}
                              </span>
                              <span className="font-bold text-white">{log.itemName || `Item #${log.nameid}`}</span>
                              <span className="text-[10px] text-amber-400 font-mono">x{log.amount}</span>
                            </div>
                            <span className="text-[10px] text-ro-text-muted font-mono">
                              {log.map || 'prontera'} &bull; {new Date(log.time).toLocaleTimeString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Zenylog */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-ro-text-muted flex items-center gap-2">
                      <Coins className="w-3.5 h-3.5 text-ro-gold" /> Recent Zeny Transactions (Zenylog)
                    </h4>
                    {zenyLogs.length === 0 ? (
                      <p className="text-xs text-ro-text-muted py-4">No recent zeny events recorded.</p>
                    ) : (
                      <div className="divide-y divide-ro-border/60 rounded-xl bg-ro-surface/80 border border-ro-border p-3">
                        {zenyLogs.map((log, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-ro-bg border border-ro-border text-gray-300">
                                Transaction
                              </span>
                              <span className={`font-mono font-bold ${log.amount < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {log.amount > 0 ? `+${log.amount.toLocaleString()}` : log.amount.toLocaleString()} Zeny
                              </span>
                            </div>
                            <span className="text-[10px] text-ro-text-muted font-mono">
                              {new Date(log.time).toLocaleTimeString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 5: MODERATION CONTROLS                                                */}
              {/* ========================================================================= */}
              {activeTab === 'moderation' && (
                <div className="space-y-6">
                  {/* Unstuck & Reset Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 1-Click Unstuck */}
                    <div className="p-5 rounded-2xl bg-ro-surface border border-ro-border space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-white">
                        <RotateCcw className="w-4 h-4 text-emerald-400" />
                        <span>1-Click Character Unstuck</span>
                      </div>
                      <p className="text-xs text-ro-text-secondary leading-relaxed">
                        Instantly teleports <strong>{character?.name}</strong> back to Prontera center coordinates <code className="text-amber-300 font-mono">(155, 180)</code>. Useful if stuck in a crash loop.
                      </p>
                      <button
                        onClick={handleUnstuck}
                        disabled={actionLoading}
                        className="btn-gold w-full !py-2.5 text-xs font-bold flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Teleport to Prontera</span>
                      </button>
                    </div>

                    {/* Reset Stats / Skill Points */}
                    <div className="p-5 rounded-2xl bg-ro-surface border border-ro-border space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-white">
                        <Sparkles className="w-4 h-4 text-sky-400" />
                        <span>Reset Status & Skills</span>
                      </div>
                      <p className="text-xs text-ro-text-secondary leading-relaxed">
                        Resets attributes (STR, AGI, VIT, INT, DEX, LUK) back to 1 and refunds all status and skill points.
                      </p>
                      <button
                        onClick={handleResetPoints}
                        disabled={actionLoading}
                        className="btn-secondary w-full !py-2.5 text-xs font-bold flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Reset All Points</span>
                      </button>
                    </div>
                  </div>

                  {/* Ban / Unban Management */}
                  <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-bold text-red-400">
                        <Ban className="w-4 h-4" />
                        <span>Account Suspension Controls</span>
                      </div>
                      {isBanned ? (
                        <span className="text-xs font-bold text-red-400 bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-500/40">
                          ACCOUNT CURRENTLY BANNED
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                          ACCOUNT ACTIVE
                        </span>
                      )}
                    </div>

                    {isBanned ? (
                      <div className="space-y-3">
                        <p className="text-xs text-red-300">
                          This account is currently blocked from logging in. Click below to restore full access.
                        </p>
                        <button
                          onClick={handleUnban}
                          disabled={actionLoading}
                          className="btn-gold !py-2.5 text-xs font-bold !bg-emerald-600 hover:!bg-emerald-500 text-white"
                        >
                          Restore & Unban Account
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-extrabold uppercase text-ro-text-muted block mb-1">
                              Ban Duration
                            </label>
                            <select
                              value={banDuration}
                              onChange={(e) => setBanDuration(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-red-400"
                            >
                              <option value={24}>24 Hours (Temporary)</option>
                              <option value={72}>3 Days (Temporary)</option>
                              <option value={168}>7 Days (1 Week)</option>
                              <option value={720}>30 Days (1 Month)</option>
                              <option value={0}>Permanent Ban (State 5)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-extrabold uppercase text-ro-text-muted block mb-1">
                              Reason / Infraction
                            </label>
                            <input
                              type="text"
                              value={banReason}
                              onChange={(e) => setBanReason(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-red-400"
                              placeholder="e.g. Botting, Harassment, Real-money trade"
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleBan}
                          disabled={actionLoading}
                          className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Apply Account Ban</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-ro-surface/90 border-t border-ro-border flex items-center justify-between">
          <span className="text-xs text-ro-text-muted">
            Viewing Character #{charId} in rAthena MariaDB
          </span>
          <button
            onClick={onClose}
            className="btn-secondary !py-2 !px-5 text-xs font-bold"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
