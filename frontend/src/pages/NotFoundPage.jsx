/**
 * 404 Not Found Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Swords } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 text-center relative">
      <div className="max-w-md w-full ro-card p-8 sm:p-10 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-ro-gold">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <div>
          <h1 className="font-cinzel text-6xl font-black text-amber-400 mb-2">404</h1>
          <h2 className="font-cinzel text-xl font-bold text-white mb-2">
            Lost in Midgard?
          </h2>
          <p className="text-xs sm:text-sm text-ro-text-secondary leading-relaxed">
            The page or dungeon you are searching for does not exist or has been warped to another realm.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="btn-gold w-full sm:w-auto !py-2.5 !px-6 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Prontera</span>
          </Link>
          <Link
            to="/download"
            className="btn-secondary w-full sm:w-auto !py-2.5 !px-6 text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Swords className="w-4 h-4 text-ro-gold" />
            <span>Download Client</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
