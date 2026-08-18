/**
 * Live Server Status Card Widget
 */
import React, { useState, useEffect } from 'react';
import { serverService } from '../../services/serverService';
import { 
  Server, 
  Users, 
  RefreshCw, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Shield 
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function ServerStatusWidget() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatus = async (force = false) => {
    if (force) setRefreshing(true);
    try {
      const data = await serverService.getServerStatus(force);
      setStatus(data);
      setError(null);
    } catch (err) {
      setError('Unable to reach status server. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(() => fetchStatus(false), 20000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="ro-card p-6 sm:p-8 relative overflow-hidden border border-ro-border/80 bg-gradient-to-b from-ro-surface/90 to-ro-card/90 shadow-2xl">
      {/* Header with Title & Refresh */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Server className="w-5 h-5 text-ro-gold" />
          </div>
          <div>
            <h2 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
              Server Health & Status
            </h2>
            <p className="text-xs text-ro-text-muted">
              Live AWS EC2 Node: <span className="font-mono text-gray-300">{status?.host || '3.107.209.130'}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchStatus(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ro-bg/80 border border-ro-border hover:border-ro-gold/40 text-xs font-medium text-ro-text-secondary hover:text-white transition-all disabled:opacity-50"
          title="Refresh server status"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-ro-gold' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-ro-gold/20 border-t-ro-gold rounded-full animate-spin"></div>
          <span className="text-xs text-ro-text-secondary">Pinging rAthena game daemons...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-sm text-center">
          {error}
        </div>
      ) : (
        <div>
          {/* Main Services Grid (Login, Char, Map) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            
            {/* Login Server */}
            <div className="bg-ro-bg/60 rounded-xl p-4 border border-ro-border flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-ro-text-secondary block">Login Server</span>
                <span className="text-xs font-mono text-ro-text-muted">Port {status?.services?.loginServer?.port || 6900}</span>
              </div>
              <div className="flex items-center gap-2">
                {status?.services?.loginServer?.online ? (
                  <>
                    <span className="text-xs font-bold text-emerald-400">ONLINE</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </>
                ) : (
                  <>
                    <span className="text-xs font-bold text-red-400">OFFLINE</span>
                    <XCircle className="w-5 h-5 text-red-400" />
                  </>
                )}
              </div>
            </div>

            {/* Char Server */}
            <div className="bg-ro-bg/60 rounded-xl p-4 border border-ro-border flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-ro-text-secondary block">Character Server</span>
                <span className="text-xs font-mono text-ro-text-muted">Port {status?.services?.charServer?.port || 6121}</span>
              </div>
              <div className="flex items-center gap-2">
                {status?.services?.charServer?.online ? (
                  <>
                    <span className="text-xs font-bold text-emerald-400">ONLINE</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </>
                ) : (
                  <>
                    <span className="text-xs font-bold text-red-400">OFFLINE</span>
                    <XCircle className="w-5 h-5 text-red-400" />
                  </>
                )}
              </div>
            </div>

            {/* Map Server */}
            <div className="bg-ro-bg/60 rounded-xl p-4 border border-ro-border flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-ro-text-secondary block">Map Server</span>
                <span className="text-xs font-mono text-ro-text-muted">Port {status?.services?.mapServer?.port || 5121}</span>
              </div>
              <div className="flex items-center gap-2">
                {status?.services?.mapServer?.online ? (
                  <>
                    <span className="text-xs font-bold text-emerald-400">ONLINE</span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </>
                ) : (
                  <>
                    <span className="text-xs font-bold text-red-400">OFFLINE</span>
                    <XCircle className="w-5 h-5 text-red-400" />
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Stats Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-ro-bg/40 border border-ro-border/60">
            <div className="text-center sm:text-left">
              <div className="text-xs text-ro-text-secondary flex items-center justify-center sm:justify-start gap-1">
                <Users className="w-3.5 h-3.5 text-ro-gold" />
                <span>Players Online</span>
              </div>
              <div className="text-2xl font-extrabold text-amber-400 font-cinzel mt-1">
                {status?.players?.online ?? 0}
              </div>
            </div>

            <div className="text-center sm:text-left">
              <div className="text-xs text-ro-text-secondary flex items-center justify-center sm:justify-start gap-1">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>Peak Today</span>
              </div>
              <div className="text-2xl font-extrabold text-sky-400 font-cinzel mt-1">
                {status?.players?.peakToday ?? 0}
              </div>
            </div>

            <div className="text-center sm:text-left">
              <div className="text-xs text-ro-text-secondary flex items-center justify-center sm:justify-start gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Total Accounts</span>
              </div>
              <div className="text-2xl font-extrabold text-white font-cinzel mt-1">
                {status?.players?.totalAccounts ?? 1}
              </div>
            </div>

            <div className="text-center sm:text-left">
              <div className="text-xs text-ro-text-secondary flex items-center justify-center sm:justify-start gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Last Updated</span>
              </div>
              <div className="text-xs font-medium text-ro-text-muted mt-2 truncate">
                {status?.lastUpdated ? formatDate(status.lastUpdated) : 'Just now'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
