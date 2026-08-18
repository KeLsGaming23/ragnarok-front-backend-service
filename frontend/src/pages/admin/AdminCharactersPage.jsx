/**
 * Admin Character Roster & Level Editor Page
 * Full directory of characters with level modifier, 1-click unstuck, and deep inspector
 */
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import AdminLayout from '../../components/admin/AdminLayout';
import CharacterInspectorModal from '../../components/admin/CharacterInspectorModal';
import {
  Sword,
  Search,
  MapPin,
  Coins,
  Eye,
  RefreshCw,
  Sparkles,
  Shield,
  Compass,
  Edit3,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Users,
  Clock
} from 'lucide-react';
import { formatZeny, formatDate, formatTimeAgo } from '../../utils/formatters';

export default function AdminCharactersPage() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [mapFilter, setMapFilter] = useState('');
  const [onlineOnly, setOnlineOnly] = useState(false);

  // Inspector & Editor Modals
  const [inspectCharId, setInspectCharId] = useState(null);
  const [levelModalChar, setLevelModalChar] = useState(null);
  const [baseLevelInput, setBaseLevelInput] = useState(99);
  const [jobLevelInput, setJobLevelInput] = useState(70);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionToast, setActionToast] = useState(null);

  const fetchCharacters = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await adminService.getOnlinePlayers({
        search,
        map: mapFilter,
        onlineOnly
      });
      const list = res?.players || res?.data?.players || (Array.isArray(res) ? res : []);
      setCharacters(list);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch characters');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, [search, mapFilter, onlineOnly]);

  // 1-Click Unstuck
  const handleUnstuck = async (char) => {
    setActionLoading(true);
    try {
      const res = await adminService.unstuckCharacter(char.char_id);
      setActionToast({ type: 'success', text: res.message });
      fetchCharacters(false);
    } catch (err) {
      setActionToast({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // Adjust Levels
  const handleSaveLevels = async () => {
    if (!levelModalChar) return;
    setActionLoading(true);
    try {
      const res = await adminService.updateCharacterLevels(levelModalChar.char_id, {
        baseLevel: parseInt(baseLevelInput, 10),
        jobLevel: parseInt(jobLevelInput, 10)
      });
      setActionToast({ type: 'success', text: res.message });
      setLevelModalChar(null);
      fetchCharacters(false);
    } catch (err) {
      setActionToast({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Character Roster"
      onRefresh={() => fetchCharacters(true)}
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
                <Sword className="w-5 h-5 text-ro-gold" />
                <span>All Server Characters ({characters.length})</span>
              </h2>
              <p className="text-xs text-ro-text-muted mt-0.5">
                Browse characters, adjust base/job levels, teleport, or deep inspect inventory
              </p>
            </div>

            {/* Filter Suite */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Online Filter Toggle */}
              <div className="p-1 rounded-xl bg-ro-bg border border-ro-border flex items-center">
                <button
                  onClick={() => setOnlineOnly(false)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    !onlineOnly
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-ro-text-muted hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>All</span>
                </button>
                <button
                  onClick={() => setOnlineOnly(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    onlineOnly
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-ro-text-muted hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Online</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-ro-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search character or user..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white placeholder:text-ro-text-muted focus:outline-none focus:border-ro-gold w-48 sm:w-56"
                />
              </div>

              {/* Map Filter */}
              <div className="relative">
                <Compass className="w-4 h-4 text-ro-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={mapFilter}
                  onChange={(e) => setMapFilter(e.target.value)}
                  placeholder="Map (e.g. prontera)..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white placeholder:text-ro-text-muted focus:outline-none focus:border-ro-gold w-36 sm:w-44"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Characters Table */}
        <div className="ro-card rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-2xl overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-ro-gold/20 border-t-ro-gold rounded-full animate-spin"></div>
              <span className="text-xs text-ro-text-secondary">Querying character records...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-300 space-y-2">
              <p className="text-sm font-semibold">{error}</p>
              <button onClick={() => fetchCharacters(true)} className="btn-gold !py-1.5 !px-4 text-xs font-bold">
                Retry
              </button>
            </div>
          ) : characters.length === 0 ? (
            <div className="py-16 text-center text-ro-text-muted">
              No characters found matching query.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ro-bg/80 text-ro-text-muted uppercase text-[10px] font-extrabold tracking-wider border-b border-ro-border/80">
                  <tr>
                    <th className="py-3.5 px-6">Character</th>
                    <th className="py-3.5 px-4">Class</th>
                    <th className="py-3.5 px-4">Level</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Zeny</th>
                    <th className="py-3.5 px-4">Account</th>
                    <th className="py-3.5 px-4">Last Login</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ro-border/60">
                  {characters.map((char) => (
                    <tr key={char.char_id} className="hover:bg-ro-surface/60 transition-colors">
                      
                      {/* Name & Status */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              char.online === 1
                                ? 'bg-emerald-400 shadow-emerald-glow animate-pulse'
                                : 'bg-gray-600'
                            }`}
                            title={char.online === 1 ? 'Online in Midgard' : 'Offline'}
                          ></div>
                          <div>
                            <span className="font-bold text-white text-sm block">
                              {char.name}
                            </span>
                            <span className="text-[10px] text-ro-text-muted font-mono">
                              Char #{char.char_id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Class Badge */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          {char.className || 'Novice'}
                        </span>
                      </td>

                      {/* Level */}
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-white">
                          Lv {char.base_level}
                        </span>
                        <span className="text-ro-text-muted text-[10px] block">
                          Job {char.job_level}
                        </span>
                      </td>

                      {/* Map */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-amber-300 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-ro-gold shrink-0" />
                          <span>{char.last_map || 'prontera'}</span>
                          <span className="text-ro-text-muted">({char.last_x}, {char.last_y})</span>
                        </div>
                      </td>

                      {/* Zeny */}
                      <td className="py-4 px-4 font-mono font-bold text-ro-gold">
                        {formatZeny(char.zeny)}
                      </td>

                      {/* Account Username */}
                      <td className="py-4 px-4 font-mono text-gray-300">
                        {char.account_username}
                      </td>

                      {/* Last Login / Activity */}
                      <td className="py-4 px-4 font-mono">
                        {char.online === 1 ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40 animate-pulse inline-flex items-center gap-1">
                            <span>🟢 In-Game Now</span>
                          </span>
                        ) : (
                          <div>
                            <span className="text-white text-xs font-bold block" title={formatDate(char.last_login)}>
                              {formatTimeAgo(char.last_login)}
                            </span>
                            <span className="text-ro-text-muted text-[10px] block">
                              {formatDate(char.last_login)}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* 1-Click Unstuck */}
                          <button
                            onClick={() => handleUnstuck(char)}
                            disabled={actionLoading}
                            className="p-1.5 rounded-lg bg-ro-bg hover:bg-emerald-950/40 border border-ro-border hover:border-emerald-500/40 text-ro-text-muted hover:text-emerald-400 transition-colors"
                            title="Unstuck to Prontera"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Levels */}
                          <button
                            onClick={() => {
                              setLevelModalChar(char);
                              setBaseLevelInput(char.base_level);
                              setJobLevelInput(char.job_level);
                            }}
                            className="p-1.5 rounded-lg bg-ro-bg hover:bg-amber-950/40 border border-ro-border hover:border-amber-500/40 text-ro-text-muted hover:text-amber-300 transition-colors"
                            title="Edit Character Levels"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Deep Inspect */}
                          <button
                            onClick={() => setInspectCharId(char.char_id)}
                            className="btn-gold !py-1.5 !px-3 text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>
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
      {/* 1. EDIT LEVEL MODAL                                                       */}
      {/* ========================================================================= */}
      {levelModalChar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="ro-card p-6 rounded-2xl border-2 border-amber-500/50 bg-ro-surface max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-ro-gold" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">
                  Adjust Character Levels
                </h3>
                <p className="text-xs text-ro-text-secondary">
                  Character: <strong className="text-white">{levelModalChar.name}</strong> ({levelModalChar.className})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                  Base Level (1–99)
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={baseLevelInput}
                  onChange={(e) => setBaseLevelInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold"
                />
              </div>

              <div>
                <label className="font-bold text-ro-text-muted uppercase text-[10px] block mb-1">
                  Job Level (1–70)
                </label>
                <input
                  type="number"
                  min={1}
                  max={70}
                  value={jobLevelInput}
                  onChange={(e) => setJobLevelInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white focus:outline-none focus:border-ro-gold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setLevelModalChar(null)}
                className="btn-secondary !py-2 !px-4 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLevels}
                disabled={actionLoading}
                className="btn-gold !py-2 !px-5 text-xs font-bold"
              >
                Save Levels
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deep Character Inspector Modal */}
      {inspectCharId && (
        <CharacterInspectorModal
          charId={inspectCharId}
          onClose={() => setInspectCharId(null)}
          onActionSuccess={() => fetchCharacters(false)}
        />
      )}
    </AdminLayout>
  );
}
