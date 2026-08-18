/**
 * Admin Guilds & War of Emperium (WoE) Castle Ownership Page
 * Visual radar of castle ownership and guild directory
 */
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Shield,
  Crown,
  Castle,
  Users,
  Search,
  Sparkles,
  RefreshCw,
  Award,
  Globe,
  Compass
} from 'lucide-react';

export default function AdminGuildsPage() {
  const [guilds, setGuilds] = useState([]);
  const [castles, setCastles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('castles');
  const [search, setSearch] = useState('');

  const fetchData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [gRes, cRes] = await Promise.all([
        adminService.getGuilds(),
        adminService.getCastles()
      ]);
      setGuilds(gRes?.guilds || gRes?.data?.guilds || []);
      setCastles(cRes?.castles || cRes?.data?.castles || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load guild data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredGuilds = guilds.filter(g =>
    g.name?.toLowerCase().includes(search.toLowerCase()) ||
    g.master_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="Guilds & War of Emperium"
      onRefresh={() => fetchData(true)}
      isRefreshing={refreshing}
    >
      <div className="space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-ro-border/80 bg-ro-surface/40 rounded-2xl p-1.5 gap-2 w-max">
          <button
            onClick={() => setActiveTab('castles')}
            className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'castles'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-ro-text-muted hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 text-ro-gold" />
            <span>WoE Castle Ownership</span>
          </button>
          <button
            onClick={() => setActiveTab('guilds')}
            className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'guilds'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-ro-text-muted hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 text-ro-gold" />
            <span>Guilds Directory ({guilds.length})</span>
          </button>
        </div>

        {/* Content View */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-ro-gold/20 border-t-ro-gold rounded-full animate-spin"></div>
            <span className="text-xs text-ro-text-secondary">Loading War of Emperium castle telemetry...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-300 space-y-2">
            <p className="text-sm font-semibold">{error}</p>
            <button onClick={() => fetchData(true)} className="btn-gold !py-1.5 !px-4 text-xs font-bold">
              Retry
            </button>
          </div>
        ) : activeTab === 'castles' ? (
          /* ========================================================================= */
          /* 1. WAR OF EMPERIUM CASTLES GRID                                           */
          /* ========================================================================= */
          <div className="space-y-6">
            <div className="ro-card p-6 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl flex items-center justify-between">
              <div>
                <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-ro-gold" />
                  <span>War of Emperium Territory Radar</span>
                </h2>
                <p className="text-xs text-ro-text-muted mt-0.5">
                  Real-time castle control data from rAthena `guild_castle` table
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {castles.map((castle) => {
                const isHeld = castle.guild_name && castle.guild_name !== 'Unclaimed';
                return (
                  <div
                    key={castle.castle_id}
                    className={`ro-card p-6 rounded-2xl border transition-all shadow-xl space-y-4 ${
                      isHeld
                        ? 'border-amber-500/50 bg-gradient-to-b from-amber-950/20 via-ro-surface to-ro-card'
                        : 'border-ro-border bg-gradient-to-b from-ro-surface to-ro-card'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-ro-text-muted">
                        {castle.realm || 'Midgard Realm'}
                      </span>
                      {isHeld ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <Crown className="w-3 h-3 text-ro-gold" /> Occupied
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-ro-bg text-ro-text-muted border border-ro-border">
                          Unclaimed
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-cinzel text-lg font-bold text-white">
                        {castle.castle_name || `Castle #${castle.castle_id}`}
                      </h3>
                      <p className="text-xs font-semibold text-ro-gold mt-0.5">
                        {isHeld ? `Held by: ${castle.guild_name}` : 'No defending guild'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ro-border/60 text-xs">
                      <div className="p-2 rounded-lg bg-ro-bg border border-ro-border/60">
                        <span className="text-[10px] text-ro-text-muted block">Defense</span>
                        <span className="font-mono font-bold text-white">{castle.defense ?? 0} / 100</span>
                      </div>
                      <div className="p-2 rounded-lg bg-ro-bg border border-ro-border/60">
                        <span className="text-[10px] text-ro-text-muted block">Economy</span>
                        <span className="font-mono font-bold text-white">{castle.economy ?? 0} / 100</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 2. GUILDS DIRECTORY                                                       */
          /* ========================================================================= */
          <div className="space-y-4">
            <div className="ro-card p-6 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-ro-gold" />
                  <span>Guilds Directory ({filteredGuilds.length})</span>
                </h2>
                <p className="text-xs text-ro-text-muted mt-0.5">
                  Roster of player guilds and active membership counts
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-ro-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search guild or master..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-ro-bg border border-ro-border text-xs text-white placeholder:text-ro-text-muted focus:outline-none focus:border-ro-gold w-48 sm:w-60"
                />
              </div>
            </div>

            <div className="ro-card rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-2xl overflow-hidden">
              {filteredGuilds.length === 0 ? (
                <div className="py-16 text-center text-ro-text-muted">
                  No guilds registered or matching query.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-ro-bg/80 text-ro-text-muted uppercase text-[10px] font-extrabold tracking-wider border-b border-ro-border/80">
                      <tr>
                        <th className="py-3.5 px-6">Guild</th>
                        <th className="py-3.5 px-4">Guild Master</th>
                        <th className="py-3.5 px-4">Guild Level</th>
                        <th className="py-3.5 px-4">Members</th>
                        <th className="py-3.5 px-4">Average Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ro-border/60">
                      {filteredGuilds.map((g) => (
                        <tr key={g.guild_id} className="hover:bg-ro-surface/60 transition-colors">
                          <td className="py-4 px-6 font-bold text-white text-sm flex items-center gap-2">
                            <Shield className="w-4 h-4 text-ro-gold" />
                            <span>{g.name}</span>
                          </td>
                          <td className="py-4 px-4 font-mono text-amber-300 font-semibold">
                            {g.master_name || `Char #${g.master_char_id}`}
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-white">
                            Lv {g.guild_lv}
                          </td>
                          <td className="py-4 px-4 font-mono text-gray-300">
                            {g.connect_member ?? 1} / {g.max_member ?? 36}
                          </td>
                          <td className="py-4 px-4 font-mono text-ro-gold font-bold">
                            Avg Lv {g.average_lv ?? 80}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
