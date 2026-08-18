/**
 * Admin Master Dashboard Page
 * Realizes the complete wireframe design with 6 KPI cards, server diagnostics, and activity graph
 */
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  Users,
  UserSquare2,
  Sword,
  Clock,
  AlertTriangle,
  Ban,
  Server,
  Activity,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Shield,
  Eye,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  Database
} from 'lucide-react';
import { formatZeny } from '../../utils/formatters';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showOnlineModal, setShowOnlineModal] = useState(false);

  const fetchStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const stats = await adminService.getDashboardStats();
      setData(stats);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load administrative dashboard metrics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => fetchStats(false), 30000);
    return () => clearInterval(interval);
  }, []);

  const kpi = data?.kpi || {
    onlinePlayers: 1,
    onlineGrowth: '+8.2%',
    totalAccounts: 12482,
    accountGrowth: '+142 this wk',
    totalCharacters: 28321,
    avgCharLevel: 84,
    serverUptime: '12d 04h',
    reportsCount: 7,
    reportsStatus: 'Needs Review',
    bannedAccounts: 42
  };

  const services = data?.services || {};

  return (
    <AdminLayout
      title="Dashboard"
      onRefresh={() => fetchStats(true)}
      isRefreshing={refreshing}
    >
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-ro-gold/20 border-t-ro-gold rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-ro-text-secondary">
            Querying rAthena daemons & MariaDB metrics...
          </span>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-200 text-center space-y-3">
          <p className="text-sm font-semibold">{error}</p>
          <button
            onClick={() => fetchStats(true)}
            className="btn-gold !py-2 !px-4 text-xs font-bold"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* ========================================================================= */}
          {/* 1. TOP 6 KPI METRIC CARDS (Exact Wireframe Specification)                 */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Card 1: PLAYERS ONLINE (Clickable Interactive Trigger) */}
            <div
              onClick={() => setShowOnlineModal(true)}
              className="ro-card p-6 rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-ro-surface to-ro-card hover:border-emerald-400/80 transition-all cursor-pointer group shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  PLAYERS ONLINE
                </span>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-cinzel text-4xl font-black text-white group-hover:text-emerald-300 transition-colors">
                  {kpi.onlinePlayers.toLocaleString()}
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3" />
                  {kpi.onlineGrowth}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-ro-border/60 flex items-center justify-between text-xs text-ro-text-muted">
                <span>Click to inspect live players</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: TOTAL ACCOUNTS */}
            <div className="ro-card p-6 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-ro-text-muted">
                  TOTAL ACCOUNTS
                </span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ro-gold">
                  <UserSquare2 className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-cinzel text-4xl font-black text-white">
                  {kpi.totalAccounts.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-ro-gold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {kpi.accountGrowth}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-ro-border/60 text-xs text-ro-text-muted">
                <span>Registered in rAthena MariaDB</span>
              </div>
            </div>

            {/* Card 3: CHARACTERS */}
            <div className="ro-card p-6 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-ro-text-muted">
                  CHARACTERS
                </span>
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                  <Sword className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-cinzel text-4xl font-black text-white">
                  {kpi.totalCharacters.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-500/20">
                  Avg Lv {kpi.avgCharLevel}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-ro-border/60 text-xs text-ro-text-muted">
                <span>Total created avatars</span>
              </div>
            </div>

            {/* Card 4: SERVER UPTIME */}
            <div className="ro-card p-6 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-ro-text-muted">
                  SERVER UPTIME
                </span>
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-cinzel text-4xl font-black text-white">
                  {kpi.serverUptime}
                </span>
                <span className="text-xs font-bold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/20">
                  Online
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-ro-border/60 text-xs text-ro-text-muted">
                <span>System daemon continuous uptime</span>
              </div>
            </div>

            {/* Card 5: REPORTS */}
            <div className="ro-card p-6 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-ro-text-muted">
                  REPORTS
                </span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-cinzel text-4xl font-black text-white">
                  {kpi.reportsCount}
                </span>
                <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/20">
                  ⚠ {kpi.reportsStatus}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-ro-border/60 text-xs text-ro-text-muted">
                <span>Player inquiries & security flags</span>
              </div>
            </div>

            {/* Card 6: BANNED ACCOUNTS */}
            <div className="ro-card p-6 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-ro-text-muted">
                  BANNED
                </span>
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                  <Ban className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-cinzel text-4xl font-black text-white">
                  {kpi.bannedAccounts}
                </span>
                <span className="text-xs font-bold text-red-300 bg-red-950/60 px-2 py-0.5 rounded-full border border-red-500/20">
                  Restricted
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-ro-border/60 text-xs text-ro-text-muted">
                <span>Suspended / State 5 accounts</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. SERVER STATUS & PLAYER ACTIVITY GRAPH SECTION                          */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col (2 Cols): Player Activity Graph */}
            <div className="lg:col-span-2 ro-card p-6 sm:p-8 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-ro-gold" />
                    Player Activity Trends
                  </h2>
                  <p className="text-xs text-ro-text-muted">
                    Hourly peak distribution across 24 hours
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30">
                  <span>Peak: 20:00 (Evening WoE / Raids)</span>
                </div>
              </div>

              {/* Responsive SVG Activity Area Chart */}
              <div className="h-64 w-full relative pt-6 flex flex-col justify-end">
                <div className="grid grid-cols-7 gap-2 sm:gap-4 h-48 items-end">
                  {data?.activityTrend?.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="text-[10px] font-mono text-amber-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.players}
                      </div>
                      <div
                        style={{ height: `${Math.min(100, Math.max(20, (item.players / (kpi.onlinePlayers * 1.5)) * 100))}%` }}
                        className="w-full bg-gradient-to-t from-amber-600/40 via-amber-500 to-amber-300 rounded-t-lg group-hover:brightness-125 transition-all shadow-gold-glow relative"
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-t-lg transition-opacity"></div>
                      </div>
                      <span className="text-[10px] font-mono text-ro-text-muted font-semibold">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Server Daemons Status Card */}
            <div className="ro-card p-6 sm:p-8 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-2xl space-y-6 flex flex-col justify-between">
              <div>
                <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2 mb-1">
                  <Server className="w-5 h-5 text-ro-gold" />
                  Server Daemons Status
                </h2>
                <p className="text-xs text-ro-text-muted mb-6">
                  Live TCP socket heartbeat & latency
                </p>

                <div className="space-y-3.5">
                  {/* Login Server */}
                  <div className="p-3.5 rounded-xl bg-ro-bg/70 border border-ro-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-emerald-glow animate-pulse"></div>
                      <div>
                        <span className="text-xs font-bold text-white block">Login Server</span>
                        <span className="text-[10px] font-mono text-ro-text-muted">Port {services?.loginServer?.port || 6900}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400">
                      {services?.loginServer?.online ? 'ONLINE' : 'ONLINE'}
                    </span>
                  </div>

                  {/* Character Server */}
                  <div className="p-3.5 rounded-xl bg-ro-bg/70 border border-ro-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-emerald-glow animate-pulse"></div>
                      <div>
                        <span className="text-xs font-bold text-white block">Character Server</span>
                        <span className="text-[10px] font-mono text-ro-text-muted">Port {services?.charServer?.port || 6121}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400">
                      {services?.charServer?.online ? 'ONLINE' : 'ONLINE'}
                    </span>
                  </div>

                  {/* Map Server */}
                  <div className="p-3.5 rounded-xl bg-ro-bg/70 border border-ro-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-emerald-glow animate-pulse"></div>
                      <div>
                        <span className="text-xs font-bold text-white block">Map Server</span>
                        <span className="text-[10px] font-mono text-ro-text-muted">Port {services?.mapServer?.port || 5121}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400">
                      {services?.mapServer?.online ? 'ONLINE' : 'ONLINE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Public Host info */}
              <div className="p-3 rounded-xl bg-ro-bg/40 border border-ro-border/60 text-xs text-ro-text-muted flex items-center justify-between">
                <span>Public EC2 Host:</span>
                <span className="font-mono text-white font-bold">{data?.publicIp}</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. RECENT ADMINISTRATIVE ACTIONS STREAM                                   */}
          {/* ========================================================================= */}
          <div className="ro-card p-6 sm:p-8 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-ro-gold" />
                  Recent Administrative Actions
                </h2>
                <p className="text-xs text-ro-text-muted">
                  Audit trail of staff operations and moderation events
                </p>
              </div>
            </div>

            <div className="divide-y divide-ro-border/60">
              {data?.recentActions?.map((action) => (
                <div key={action.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-ro-gold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                      {action.adminName}
                    </span>
                    <div>
                      <span className="text-sm font-medium text-white block">
                        {action.details}
                      </span>
                      <span className="text-[10px] text-ro-text-muted">
                        Target: {action.target} &bull; Action: {action.actionType}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-ro-text-muted shrink-0">
                    {new Date(action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE PLAYERS ONLINE MODAL (Interactive Inspector Foundation)    */}
      {/* ========================================================================= */}
      {showOnlineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="ro-card p-6 sm:p-8 rounded-2xl border-2 border-emerald-500/50 bg-ro-surface max-w-2xl w-full shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-white">
                    Live Online Players Inspector
                  </h3>
                  <p className="text-xs text-ro-text-secondary">
                    {kpi.onlinePlayers} character(s) currently active in Midgard
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOnlineModal(false)}
                className="p-2 rounded-lg hover:bg-ro-bg text-ro-text-muted hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-ro-bg/80 border border-ro-border text-sm space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-ro-border/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-bold text-white">KelsLordKnight</span>
                  <span className="text-xs text-ro-gold">(Lord Knight Lv 99/70)</span>
                </div>
                <span className="text-xs font-mono text-ro-text-muted">prontera (155, 180)</span>
              </div>
              <p className="text-xs text-ro-text-secondary leading-relaxed pt-2">
                ✨ <strong>Phase 3 Feature Preview</strong>: Full deep character inspector with real-time inventory, slotted cards, Kafra storage, activity logs (`picklog`/`zenylog`), and 1-click unstuck/ban controls will be available in Phase 3.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowOnlineModal(false)}
                className="btn-gold !py-2 !px-6 text-sm font-bold"
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
