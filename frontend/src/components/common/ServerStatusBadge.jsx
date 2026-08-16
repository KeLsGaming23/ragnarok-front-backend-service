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
    <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-ro-surface/90 border border-ro-border shadow-sm">
      <div className="flex items-center gap-1.5">
        <span className={`relative flex h-2.5 w-2.5`}>
          {isOnline && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
        </span>
        <span className={`text-xs font-semibold ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
          {isOnline ? 'Server Online' : 'Server Offline'}
        </span>
      </div>

      <div className="h-3 w-[1px] bg-ro-border"></div>

      <div className="flex items-center gap-1 text-xs text-ro-text-secondary font-medium">
        <Users className="w-3.5 h-3.5 text-ro-gold" />
        <span><strong className="text-ro-text-primary">{onlineCount}</strong> Online</span>
      </div>
    </div>
  );
}
