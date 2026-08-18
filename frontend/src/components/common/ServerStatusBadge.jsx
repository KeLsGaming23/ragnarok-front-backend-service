/**
 * Server Status Mini Badge for Header & Navigation
 */
import React, { useEffect, useState } from 'react';
import { serverService } from '../../services/serverService';
import { Activity, ShieldCheck, Users } from 'lucide-react';

export default function ServerStatusBadge() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchStatus() {
      try {
        const data = await serverService.getServerStatus();
        if (mounted) {
          setStatus(data);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // 30s auto-refresh
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading || !status) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ro-card border border-ro-border text-xs text-ro-text-muted">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
        <span>Checking Server...</span>
      </div>
    );
  }

  const isOnline = status.overallStatus === 'ONLINE' || status.overallStatus === 'PARTIAL';
  const onlineCount = status.players?.online || 0;

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-ro-card/90 border border-ro-border/80 shadow-sm text-xs whitespace-nowrap">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          {isOnline && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
        </span>
        <span className={`text-[11px] font-bold ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      <div className="h-2.5 w-[1px] bg-ro-border/80"></div>

      <div className="flex items-center gap-1 text-[11px] font-mono text-ro-text-secondary">
        <Users className="w-3 h-3 text-ro-gold" />
        <span className="font-bold text-white">{onlineCount}</span>
      </div>
    </div>
  );
}
