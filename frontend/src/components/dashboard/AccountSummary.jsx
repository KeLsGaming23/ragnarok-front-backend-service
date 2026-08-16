/**
 * Player Account Summary Card
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  ShieldCheck, 
  Download, 
  KeyRound, 
  Calendar, 
  Clock, 
  Wifi, 
  LogOut 
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function AccountSummary({ account, onOpenPasswordModal, onLogout }) {
  return (
    <div className="ro-card p-6 sm:p-8 rounded-xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl mb-8">
      
      {/* Top Banner with Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-ro-border">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-gold-glow flex items-center justify-center">
            <div className="w-full h-full bg-ro-surface rounded-[10px] flex items-center justify-center">
              <User className="w-7 h-7 text-ro-gold" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
                Welcome, {account?.username}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {account?.accountType || 'Player'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-ro-text-secondary mt-0.5">
              Account ID: <span className="font-mono text-ro-gold font-semibold">#{account?.accountId}</span> &bull; Status: <span className="text-emerald-400 font-semibold">{account?.state || 'Active'}</span>
            </p>
          </div>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
          <Link
            to="/download"
            className="btn-crystal !py-2 !px-3.5 text-xs font-bold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Client</span>
          </Link>
          <button
            onClick={onOpenPasswordModal}
            className="btn-secondary !py-2 !px-3.5 text-xs font-semibold flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5 text-ro-gold" />
            <span>Change Password</span>
          </button>
          <button
            onClick={onLogout}
            className="p-2 rounded-lg bg-ro-bg hover:bg-red-950/40 border border-ro-border hover:border-red-500/40 text-ro-text-muted hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Account Details Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
        <div className="bg-ro-bg/50 p-3.5 rounded-lg border border-ro-border/60">
          <div className="text-xs text-ro-text-muted flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Account Security</span>
          </div>
          <div className="text-sm font-semibold text-white">rAthena MD5 Synced</div>
        </div>

        <div className="bg-ro-bg/50 p-3.5 rounded-lg border border-ro-border/60">
          <div className="text-xs text-ro-text-muted flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Registered Email</span>
          </div>
          <div className="text-sm font-semibold text-white truncate" title={account?.email}>
            {account?.email || 'N/A'}
          </div>
        </div>

        <div className="bg-ro-bg/50 p-3.5 rounded-lg border border-ro-border/60">
          <div className="text-xs text-ro-text-muted flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Last Game Login</span>
          </div>
          <div className="text-sm font-semibold text-white">
            {formatDate(account?.lastLogin)}
          </div>
        </div>

        <div className="bg-ro-bg/50 p-3.5 rounded-lg border border-ro-border/60">
          <div className="text-xs text-ro-text-muted flex items-center gap-1.5 mb-1">
            <Wifi className="w-3.5 h-3.5 text-purple-400" />
            <span>Total Logins</span>
          </div>
          <div className="text-sm font-semibold text-white">
            {account?.loginCount || 0} Sessions
          </div>
        </div>
      </div>

    </div>
  );
}
