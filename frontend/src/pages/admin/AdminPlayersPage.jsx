/**
 * Admin Live Online Players Management Page
 * Displays filterable real-time table of connected players with deep inspector trigger
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
  Filter
} from 'lucide-react';
import { formatZeny } from '../../utils/formatters';

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [mapFilter, setMapFilter] = useState('');
  const [inspectCharId, setInspectCharId] = useState(null);

  const fetchOnlinePlayers = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await adminService.getOnlinePlayers({ search, map: mapFilter });
      setPlayers(res.data?.players || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch online players');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOnlinePlayers();
    const interval = setInterval(() => fetchOnlinePlayers(false), 20000);
    return () => clearInterval(interval);
  }, [search, mapFilter]);

  return (
    <AdminLayout
      title="Live Online Players"
      onRefresh={() => fetchOnlinePlayers(true)}
      isRefreshing={refreshing}
    >
      <div className="space-y-6">
        
        {/* Header & Filter Bar */}
        <div className="ro-card p-6 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Active Connected Characters ({players.length})</span>
              </h2>
              <p className="text-xs text-ro-text-muted mt-0.5">
                Real-time sessions query from rAthena character & login tables
              </p>
            </div>

            {/* Search & Filter Inputs */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-ro-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search player or user..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white placeholder:text-ro-text-muted focus:outline-none focus:border-ro-gold w-48 sm:w-60"
                />
              </div>

              <div className="relative">
                <Compass className="w-4 h-4 text-ro-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={mapFilter}
                  onChange={(e) => setMapFilter(e.target.value)}
                  placeholder="Filter by map (e.g. prontera)..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white placeholder:text-ro-text-muted focus:outline-none focus:border-ro-gold w-48 sm:w-56"
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
              <span className="text-xs text-ro-text-secondary">Querying active player sockets...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-300 space-y-2">
              <p className="text-sm font-semibold">{error}</p>
              <button onClick={() => fetchOnlinePlayers(true)} className="btn-gold !py-1.5 !px-4 text-xs font-bold">
                Retry Query
              </button>
            </div>
          ) : players.length === 0 ? (
            <div className="py-16 text-center text-ro-text-muted space-y-2">
              <Users className="w-10 h-10 mx-auto text-ro-border" />
              <p className="text-sm font-semibold text-white">No Online Characters Matching Query</p>
              <p className="text-xs text-ro-text-muted">
                {search || mapFilter ? 'Try clearing search filters' : 'Currently no active players connected to the map server.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ro-bg/80 text-ro-text-muted uppercase text-[10px] font-extrabold tracking-wider border-b border-ro-border/80">
                  <tr>
                    <th className="py-3.5 px-6">Character</th>
                    <th className="py-3.5 px-4">Class / Job</th>
                    <th className="py-3.5 px-4">Level</th>
                    <th className="py-3.5 px-4">Current Map</th>
                    <th className="py-3.5 px-4">Zeny</th>
                    <th className="py-3.5 px-4">Account</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ro-border/60">
                  {players.map((player) => (
                    <tr key={player.char_id} className="hover:bg-ro-surface/60 transition-colors">
                      
                      {/* Character Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-emerald-glow animate-pulse shrink-0"></div>
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
                          {player.className}
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
          onActionSuccess={() => fetchOnlinePlayers(false)}
        />
      )}
    </AdminLayout>
  );
}
