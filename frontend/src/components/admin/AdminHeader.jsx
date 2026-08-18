/**
 * Admin Top Header Bar
 */
import React from 'react';
import { Menu, Activity, Shield, ExternalLink, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminHeader({ onMenuClick, onRefresh, isRefreshing, title = 'Dashboard' }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-20 bg-ro-bg/90 backdrop-blur-md border-b border-ro-border px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg bg-ro-card border border-ro-border text-ro-text-secondary hover:text-white lg:hidden"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xs text-ro-text-muted">
            <span>Admin</span>
            <span>/</span>
            <span className="text-amber-400 font-medium">{title}</span>
          </div>
          <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Quick Tools & Status */}
      <div className="flex items-center gap-3">
        {/* Manual Data Refresh CTA */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ro-card hover:bg-ro-card-hover border border-ro-border hover:border-ro-gold/40 text-xs font-medium text-ro-text-secondary hover:text-white transition-all disabled:opacity-50"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-ro-gold' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        )}

        {/* Live Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold">rAthena Daemons Active</span>
        </div>

        {/* Admin Tag */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ro-card border border-amber-500/30">
          <Shield className="w-4 h-4 text-ro-gold" />
          <span className="text-xs font-bold text-white hidden sm:inline">
            {user?.username}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-extrabold uppercase">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
