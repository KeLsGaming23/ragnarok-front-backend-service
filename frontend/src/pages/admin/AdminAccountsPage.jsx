import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  UserSquare2,
  Search,
  Shield,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Key,
  Crown,
  Sparkles,
  Users,
  Compass,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Filter,
  Clock,
  Globe
} from 'lucide-react';

export default function AdminAccountsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialState = searchParams.get('state') || '';
  const initialGm = searchParams.get('gm') || '';

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState(initialState);
  const [gmFilter, setGmFilter] = useState(initialGm);

  // Modals & Action States
  const [altModalIp, setAltModalIp] = useState(null);
  const [altAccounts, setAltAccounts] = useState([]);
  const [altLoading, setAltLoading] = useState(false);

  const [gmModalAccount, setGmModalAccount] = useState(null);
  const [selectedGmLevel, setSelectedGmLevel] = useState(0);

  const [banModalAccount, setBanModalAccount] = useState(null);
  const [banDuration, setBanDuration] = useState(24);
  const [banReason, setBanReason] = useState('Violating Server Rules');

  const [vipModalAccount, setVipModalAccount] = useState(null);
  const [vipDays, setVipDays] = useState(30);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionToast, setActionToast] = useState(null);

  const fetchAccounts = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await adminService.getAccounts({
        search,
        state: stateFilter,
        minGroupId: gmFilter
      });
      const list = res?.accounts || res?.data?.accounts || (Array.isArray(res) ? res : []);
      setAccounts(list);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch accounts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [search, stateFilter, gmFilter]);

  // Handle Alt Inspector by IP
  const handleOpenAlts = async (ip) => {
    setAltModalIp(ip);
    setAltLoading(true);
    try {
      const res = await adminService.getAltsByIp(ip);
      const list = res?.accounts || res?.data?.accounts || [];
      setAltAccounts(list);
    } catch (err) {
      setAltAccounts([]);
    } finally {
      setAltLoading(false);
    }
  };

  // Action: Promote / Demote GM
  const handleUpdateGm = async () => {
    if (!gmModalAccount) return;
    setActionLoading(true);
    try {
      const res = await adminService.updateAccountGmLevel(gmModalAccount.account_id, selectedGmLevel);
      setActionToast({ type: 'success', text: res.message });
      setGmModalAccount(null);
      fetchAccounts(false);
    } catch (err) {
      setActionToast({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Reset Kafra PIN
  const handleResetPin = async (account) => {
    if (!window.confirm(`Reset 4-digit Kafra PIN for account "${account.userid}"?`)) return;
    setActionLoading(true);
    try {
      const res = await adminService.resetAccountPincode(account.account_id);
      setActionToast({ type: 'success', text: res.message });
      fetchAccounts(false);
    } catch (err) {
      setActionToast({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Apply Ban
  const handleBan = async () => {
    if (!banModalAccount) return;
    setActionLoading(true);
    try {
      const res = await adminService.banAccount(banModalAccount.account_id, {
        durationHours: parseInt(banDuration, 10),
        reason: banReason
      });
      setActionToast({ type: 'success', text: res.message });
      setBanModalAccount(null);
      fetchAccounts(false);
    } catch (err) {
      setActionToast({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Unban
  const handleUnban = async (account) => {
    setActionLoading(true);
    try {
      const res = await adminService.unbanAccount(account.account_id);
      setActionToast({ type: 'success', text: res.message });
      fetchAccounts(false);
    } catch (err) {
      setActionToast({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Add VIP
  const handleAddVip = async () => {
    if (!vipModalAccount) return;
    setActionLoading(true);
    try {
      const res = await adminService.addAccountVip(vipModalAccount.account_id, parseInt(vipDays, 10));
      setActionToast({ type: 'success', text: res.message });
      setVipModalAccount(null);
      fetchAccounts(false);
    } catch (err) {
      setActionToast({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Accounts Management"
      onRefresh={() => fetchAccounts(true)}
      isRefreshing={refreshing}
    >
      <div className="space-y-6">
        
        {/* Toast Feedback */}
        {actionToast && (
          <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-lg ${
            actionToast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/90 border-red-500/40 text-red-300'
          }`}>
            <div className="flex items-center gap-2">
              {actionToast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
              <span>{actionToast.text}</span>
            </div>
            <button onClick={() => setActionToast(null)} className="text-gray-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="ro-card p-6 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
                <UserSquare2 className="w-5 h-5 text-ro-gold" />
                <span>Player Accounts Directory ({accounts.length})</span>
              </h2>
              <p className="text-xs text-ro-text-muted mt-0.5">
                Query, promote, ban, and detect multi-accounts from rAthena `login` table
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-ro-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search user, email, IP..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white placeholder:text-ro-text-muted focus:outline-none focus:border-ro-gold w-48 sm:w-60"
                />
              </div>

              {/* Status Filter */}
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold"
              >
                <option value="">All Account States</option>
                <option value="0">Active Only</option>
                <option value="5">Banned (State 5)</option>
              </select>

              {/* GM Filter */}
              <select
                value={gmFilter}
                onChange={(e) => setGmFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold"
              >
                <option value="">All GM Ranks</option>
                <option value="1">Staff / GM (1+)</option>
                <option value="99">Administrators (99)</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-ro-border/60">
            <button
              onClick={() => { setStateFilter(''); setGmFilter(''); setSearchParams({}); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                stateFilter === '' && gmFilter === ''
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-ro-bg text-ro-text-muted hover:text-white border border-ro-border'
              }`}
            >
              All Accounts
            </button>
            <button
              onClick={() => { setStateFilter('5'); setGmFilter(''); setSearchParams({ state: '5' }); }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                stateFilter === '5'
                  ? 'bg-red-950 text-red-300 border border-red-500/40 shadow-sm'
                  : 'bg-ro-bg text-ro-text-muted hover:text-red-400 border border-ro-border'
              }`}
            >
              <Ban className="w-3 h-3 text-red-400" />
              <span>🚫 Banned Accounts Only</span>
            </button>
            <button
              onClick={() => { setStateFilter('0'); setGmFilter(''); setSearchParams({ state: '0' }); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                stateFilter === '0'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-ro-bg text-ro-text-muted hover:text-emerald-300 border border-ro-border'
              }`}
            >
              Active Only
            </button>
            <button
              onClick={() => { setGmFilter('1'); setStateFilter(''); setSearchParams({ gm: '1' }); }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                gmFilter === '1' || gmFilter === '99'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-ro-bg text-ro-text-muted hover:text-amber-300 border border-ro-border'
              }`}
            >
              <Crown className="w-3 h-3 text-ro-gold" />
              <span>Staff & Admins</span>
            </button>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="ro-card rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-2xl overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-ro-gold/20 border-t-ro-gold rounded-full animate-spin"></div>
              <span className="text-xs text-ro-text-secondary">Querying rAthena accounts...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-300 space-y-2">
              <p className="text-sm font-semibold">{error}</p>
              <button onClick={() => fetchAccounts(true)} className="btn-gold !py-1.5 !px-4 text-xs font-bold">
                Retry
              </button>
            </div>
          ) : accounts.length === 0 ? (
            <div className="py-16 text-center text-ro-text-muted">
              No player accounts match your search filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ro-bg/80 text-ro-text-muted uppercase text-[10px] font-extrabold tracking-wider border-b border-ro-border/80">
                  <tr>
                    <th className="py-3.5 px-6">Account User</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">GM Rank</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Last IP (Alt Detector)</th>
                    <th className="py-3.5 px-4">Chars</th>
                    <th className="py-3.5 px-6 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ro-border/60">
                  {accounts.map((acc) => (
                    <tr key={acc.account_id} className="hover:bg-ro-surface/60 transition-colors">
                      
                      {/* Username & ID */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-ro-bg border border-ro-border flex items-center justify-center font-bold text-white font-mono">
                            {acc.userid.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-white text-sm block">
                              {acc.userid}
                            </span>
                            <span className="text-[10px] text-ro-text-muted font-mono">
                              Account #{acc.account_id} &bull; {acc.logincount} logins
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-4 text-gray-300 font-mono">
                        {acc.email || 'N/A'}
                      </td>

                      {/* GM Rank Badge */}
                      <td className="py-4 px-4">
                        {acc.group_id >= 99 ? (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm flex items-center gap-1 w-max">
                            <Crown className="w-3 h-3 text-ro-gold" /> Admin (99)
                          </span>
                        ) : acc.group_id > 0 ? (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-sky-500/20 text-sky-300 border border-sky-500/40 w-max block">
                            Staff (Lv {acc.group_id})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-ro-bg text-ro-text-muted border border-ro-border">
                            Player (0)
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {acc.isBanned ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950 border border-red-500/40 text-red-400">
                            BANNED
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                            ACTIVE
                          </span>
                        )}
                        {acc.isVip && (
                          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-950 border border-purple-500/40 text-purple-300">
                            ⭐ VIP
                          </span>
                        )}
                      </td>

                      {/* Last IP & Alt Trigger */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleOpenAlts(acc.last_ip || '127.0.0.1')}
                          className="font-mono text-amber-300 hover:text-white flex items-center gap-1.5 group p-1 rounded hover:bg-ro-bg transition-colors"
                          title="Click to detect all accounts logged from this IP"
                        >
                          <Globe className="w-3 h-3 text-ro-text-muted group-hover:text-ro-gold" />
                          <span>{acc.last_ip || '127.0.0.1'}</span>
                          <span className="text-[9px] text-ro-text-muted underline group-hover:text-amber-300">
                            (Find Alts)
                          </span>
                        </button>
                      </td>

                      {/* Character Count */}
                      <td className="py-4 px-4 font-mono font-bold text-white">
                        {acc.char_count ?? 0} char(s)
                      </td>

                      {/* Moderation Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Promote/Demote GM */}
                          <button
                            onClick={() => {
                              setGmModalAccount(acc);
                              setSelectedGmLevel(acc.group_id || 0);
                            }}
                            className="p-1.5 rounded-lg bg-ro-bg hover:bg-amber-950/40 border border-ro-border hover:border-amber-500/40 text-ro-text-muted hover:text-amber-300 transition-colors"
                            title="Change GM Rank"
                          >
                            <Crown className="w-3.5 h-3.5" />
                          </button>

                          {/* Reset PIN */}
                          <button
                            onClick={() => handleResetPin(acc)}
                            className="p-1.5 rounded-lg bg-ro-bg hover:bg-sky-950/40 border border-ro-border hover:border-sky-500/40 text-ro-text-muted hover:text-sky-300 transition-colors"
                            title="Reset 4-Digit Kafra PIN"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          {/* Add VIP */}
                          <button
                            onClick={() => setVipModalAccount(acc)}
                            className="p-1.5 rounded-lg bg-ro-bg hover:bg-purple-950/40 border border-ro-border hover:border-purple-500/40 text-ro-text-muted hover:text-purple-300 transition-colors"
                            title="Add VIP Subscription"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          {/* Ban / Unban */}
                          {acc.isBanned ? (
                            <button
                              onClick={() => handleUnban(acc)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow-sm transition-colors"
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setBanModalAccount(acc);
                                setBanDuration(24);
                              }}
                              className="p-1.5 rounded-lg bg-ro-bg hover:bg-red-950/40 border border-ro-border hover:border-red-500/40 text-ro-text-muted hover:text-red-400 transition-colors"
                              title="Ban Account"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. IP ALT ACCOUNTS DETECTOR MODAL                                         */}
      {/* ========================================================================= */}
      {altModalIp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="ro-card p-6 rounded-2xl border-2 border-amber-500/50 bg-ro-surface max-w-xl w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-ro-gold" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    Multi-Account Detector
                  </h3>
                  <p className="text-xs text-ro-text-secondary">
                    Accounts connected from IP: <code className="text-amber-300 font-mono font-bold">{altModalIp}</code>
                  </p>
                </div>
              </div>
              <button onClick={() => setAltModalIp(null)} className="text-ro-text-muted hover:text-white p-1">✕</button>
            </div>

            {altLoading ? (
              <div className="py-8 text-center text-xs text-ro-text-secondary">Scanning accounts on this IP...</div>
            ) : altAccounts.length === 0 ? (
              <p className="text-xs text-ro-text-muted py-4 text-center">No other accounts logged in from this IP.</p>
            ) : (
              <div className="divide-y divide-ro-border/60 max-h-72 overflow-y-auto custom-scrollbar rounded-xl bg-ro-bg/80 border border-ro-border p-3 space-y-1">
                {altAccounts.map((a) => (
                  <div key={a.account_id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{a.userid}</span>
                      <span className="text-[10px] text-ro-text-muted font-mono">
                        #{a.account_id} &bull; {a.email || 'No email'} &bull; {a.char_count} chars
                      </span>
                    </div>
                    {a.isBanned ? (
                      <span className="text-[10px] font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-500/30">Banned</span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">Active</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <button onClick={() => setAltModalIp(null)} className="btn-secondary !py-1.5 !px-4 text-xs font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CHANGE GM LEVEL MODAL                                                  */}
      {/* ========================================================================= */}
      {gmModalAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="ro-card p-6 rounded-2xl border-2 border-amber-500/50 bg-ro-surface max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Crown className="w-5 h-5 text-ro-gold" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">
                  Update GM Rank
                </h3>
                <p className="text-xs text-ro-text-secondary">
                  Account: <strong className="text-white">{gmModalAccount.userid}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-bold text-ro-text-muted uppercase text-[10px] block">
                Select Administrative Role
              </label>
              <select
                value={selectedGmLevel}
                onChange={(e) => setSelectedGmLevel(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2.5 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold"
              >
                <option value={0}>Player (Level 0 - Standard Player Access)</option>
                <option value={10}>Event GM / Support (Level 10)</option>
                <option value={50}>Head Game Master (Level 50)</option>
                <option value={99}>👑 Server Administrator (Level 99 - Full Web Access)</option>
              </select>
              <p className="text-[11px] text-ro-text-muted leading-relaxed">
                Level 99 grants full access to the Web Admin Portal, player inspections, and server moderation tools.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setGmModalAccount(null)}
                className="btn-secondary !py-2 !px-4 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateGm}
                disabled={actionLoading}
                className="btn-gold !py-2 !px-5 text-xs font-bold"
              >
                Apply GM Rank
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. BAN ACCOUNT MODAL                                                      */}
      {/* ========================================================================= */}
      {banModalAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="ro-card p-6 rounded-2xl border-2 border-red-500/50 bg-ro-surface max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <Ban className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">
                  Suspend Account
                </h3>
                <p className="text-xs text-ro-text-secondary">
                  Target: <strong className="text-white">{banModalAccount.userid}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                  Ban Duration
                </label>
                <select
                  value={banDuration}
                  onChange={(e) => setBanDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-red-400"
                >
                  <option value={24}>24 Hours</option>
                  <option value={72}>3 Days</option>
                  <option value={168}>7 Days (1 Week)</option>
                  <option value={720}>30 Days (1 Month)</option>
                  <option value={0}>Permanent Ban (State 5)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                  Reason for Suspension
                </label>
                <input
                  type="text"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="e.g. Botting, Toxic Behavior"
                  className="w-full px-3 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-red-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setBanModalAccount(null)}
                className="btn-secondary !py-2 !px-4 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleBan}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
              >
                Apply Suspension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ADD VIP TIME MODAL                                                     */}
      {/* ========================================================================= */}
      {vipModalAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="ro-card p-6 rounded-2xl border-2 border-purple-500/50 bg-ro-surface max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">
                  Add VIP Subscription
                </h3>
                <p className="text-xs text-ro-text-secondary">
                  Account: <strong className="text-white">{vipModalAccount.userid}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-bold text-ro-text-muted uppercase text-[10px] block">
                VIP Duration to Add
              </label>
              <select
                value={vipDays}
                onChange={(e) => setVipDays(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-purple-400"
              >
                <option value={7}>+7 Days (1 Week Trial)</option>
                <option value={30}>+30 Days (1 Month Standard)</option>
                <option value={90}>+90 Days (3 Months VIP Pass)</option>
                <option value={365}>+365 Days (1 Year VIP Pass)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setVipModalAccount(null)}
                className="btn-secondary !py-2 !px-4 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVip}
                disabled={actionLoading}
                className="btn-gold !py-2 !px-5 text-xs font-bold !bg-purple-600 hover:!bg-purple-500 text-white"
              >
                Grant VIP Time
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
