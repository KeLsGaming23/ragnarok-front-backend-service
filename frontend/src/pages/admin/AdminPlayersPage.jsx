/**
 * Admin Live Online & Character Management Page
 * Displays filterable real-time table of connected players or all characters with deep inspector trigger
 */
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import AdminLayout from '../../components/admin/AdminLayout';
import CharacterInspectorModal from '../../components/admin/CharacterInspectorModal';
import {
  Users,
  Search,
  Sword,
  MapPin,
  Coins,
  Eye,
  RefreshCw,
  Sparkles,
  Shield,
  Compass,
  ChevronRight,
  Filter,
  UserCheck,
  Globe
} from 'lucide-react';
import { formatZeny } from '../../utils/formatters';

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [onlineOnly, setOnlineOnly] = useState(true);
  const [search, setSearch] = useState('');
  const [mapFilter, setMapFilter] = useState('');
  const [inspectCharId, setInspectCharId] = useState(null);

  const fetchPlayers = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await adminService.getOnlinePlayers({
        search,
        map: mapFilter,
        onlineOnly
      });
      setPlayers(res.data?.players || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch players');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
    const interval = setInterval(() => fetchPlayers(false), 15000);
    return () => clearInterval(interval);
  }, [search, mapFilter, onlineOnly]);

  const onlineCount = players.filter(p => p.online === 1).length;

  return (
    <AdminLayout
      title={onlineOnly ? 'Live Online Players' : 'All Server Characters'}
      onRefresh={() => fetchPlayers(true)}
      isRefreshing={refreshing}
    >
      <div className="space-y-6">
        
        {/* Header & Filter Bar */}
        <div className="ro-card p-6 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  <span>{onlineOnly ? 'Active Connected Characters' : 'All Registered Characters'} ({players.length})</span>
                </h2>
                
                {onlineOnly ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Sockets
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-ro-bg border border-ro-border text-ro-text-muted">
                    Full Roster
                  </span>
                )}
              </div>
              <p className="text-xs text-ro-text-muted mt-1">
                Real-time sessions query from rAthena `char` and `login` tables
              </p>
            </div>

            {/* View Mode Toggle & Search Suite */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Online Only vs All Toggle */}
              <div className="p-1 rounded-xl bg-ro-bg border border-ro-border flex items-center">
                <button
                  onClick={() => setOnlineOnly(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    onlineOnly
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-ro-text-muted hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Online Only</span>
                </button>
                <button
                  onClick={() => setOnlineOnly(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    !onlineOnly
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-ro-text-muted hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>All Characters</span>
                </button>
              </div>

              {/* Search by Name */}
              <div className="relative">
                <Search className="w-4 h-4 text-ro-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search character or user..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white placeholder:text-ro-text-muted focus:outline-none focus:border-ro-gold w-44 sm:w-56"
                />
              </div>

              {/* Filter by Map */}
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

        {/* Players Roster Table */}
        <div className="ro-card rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-2xl overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-ro-gold/20 border-t-ro-gold rounded-full animate-spin"></div>
              <span className="text-xs text-ro-text-secondary">Querying rAthena character records...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-300 space-y-2">
              <p className="text-sm font-semibold">{error}</p>
              <button onClick={() => fetchPlayers(true)} className="btn-gold !py-1.5 !px-4 text-xs font-bold">
                Retry Query
              </button>
            </div>
          ) : players.length === 0 ? (
            <div className="py-16 text-center space-y-4 px-4">
              <div className="w-12 h-12 rounded-2xl bg-ro-surface border border-ro-border flex items-center justify-center mx-auto text-ro-text-muted">
                <Users className="w-6 h-6 text-ro-gold/60" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-white">
                  {onlineOnly ? 'No Players Currently Connected in Game' : 'No Characters Found'}
                </p>
                <p className="text-xs text-ro-text-muted max-w-md mx-auto leading-relaxed">
                  {onlineOnly
                    ? 'No player is currently logged into Midgard via KelsGamingRO.exe. Switch to "All Characters" to inspect and manage any player on the server!'
                    : 'No characters match your search filter.'}
                </p>
              </div>
              {onlineOnly && (
                <button
                  onClick={() => setOnlineOnly(false)}
                  className="btn-gold !py-2 !px-5 text-xs font-bold inline-flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>View All Characters on Server</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ro-bg/80 text-ro-text-muted uppercase text-[10px] font-extrabold tracking-wider border-b border-ro-border/80">
                  <tr>
                    <th className="py-3.5 px-6">Character</th>
                    <th className="py-3.5 px-4">Class / Job</th>
                    <th className="py-3.5 px-4">Level</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Zeny</th>
                    <th className="py-3.5 px-4">Account</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ro-border/60">
                  {players.map((player) => (
                    <tr key={player.char_id} className="hover:bg-ro-surface/60 transition-colors">
                      
                      {/* Character Name & Status */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              player.online === 1
                                ? 'bg-emerald-400 shadow-emerald-glow animate-pulse'
                                : 'bg-gray-600'
                            }`}
                            title={player.online === 1 ? 'Online in Midgard' : 'Offline'}
                          ></div>
                          <div>
                            <span className="font-bold text-white text-sm block">
                              {player.name}
                            </span>
                            <span className="text-[10px] text-ro-text-muted font-mono">
                              Char #{player.char_id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Class Badge */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          {player.className || 'Novice'}
                        </span>
                      </td>

                      {/* Level */}
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-white">
                          Lv {player.base_level}
                        </span>
                        <span className="text-ro-text-muted text-[10px] block">
                          Job {player.job_level}
                        </span>
                      </td>

                      {/* Map Coordinates */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-amber-300 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-ro-gold shrink-0" />
                          <span>{player.last_map || 'prontera'}</span>
                          <span className="text-ro-text-muted">({player.last_x}, {player.last_y})</span>
                        </div>
                      </td>

                      {/* Zeny */}
                      <td className="py-4 px-4 font-mono font-bold text-ro-gold">
                        {formatZeny(player.zeny)}
                      </td>

                      {/* Account ID / User */}
                      <td className="py-4 px-4">
                        <span className="font-mono text-gray-300 font-medium block">
                          {player.account_username}
                        </span>
                        <span className="text-[10px] text-ro-text-muted font-mono">
                          {player.last_ip || '127.0.0.1'}
                        </span>
                      </td>

                      {/* Deep Inspect Button */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setInspectCharId(player.char_id)}
                          className="btn-gold !py-1.5 !px-3 text-xs font-bold inline-flex items-center gap-1.5 shadow-md hover:scale-105 transition-transform"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Deep Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Deep Character Inspector Modal */}
      {inspectCharId && (
        <CharacterInspectorModal
          charId={inspectCharId}
          onClose={() => setInspectCharId(null)}
          onActionSuccess={() => fetchPlayers(false)}
        />
      )}
    </AdminLayout>
  );
}
