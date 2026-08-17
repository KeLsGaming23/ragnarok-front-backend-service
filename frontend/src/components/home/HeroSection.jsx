/**
 * Hero Section for KelsGaming RO Landing Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  Download, 
  Swords, 
  ShieldCheck, 
  Zap, 
  Compass, 
  ChevronRight 
} from 'lucide-react';

export default function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ro-card border border-ro-border mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-ro-gold" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-ro-gold uppercase">
            Official rAthena Private Server
          </span>
          <span className="text-ro-border font-light">|</span>
          <span className="text-xs sm:text-sm text-ro-text-secondary">AWS Hosted (32.236.113.36)</span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
          <span className="block text-ro-text-primary">KelsGaming RO</span>
          <span className="block mt-2 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
            Your Adventure Begins Here.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-ro-text-secondary mb-10 leading-relaxed">
          Embark on an authentic Ragnarok Online journey in the realm of Midgard. Experience balanced <strong className="text-amber-300 font-semibold">25x / 25x / 10x</strong> rates, thrilling Transcendent WoE castles, and a pre-configured client designed for instant play.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="btn-gold w-full sm:w-auto text-base !py-3.5 !px-8 flex items-center gap-2"
            >
              <Compass className="w-5 h-5" />
              <span>Go to Player Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/register"
              className="btn-gold w-full sm:w-auto text-base !py-3.5 !px-8 flex items-center gap-2"
            >
              <Swords className="w-5 h-5" />
              <span>Play Now — Register Free</span>
            </Link>
          )}

          <Link
            to="/download"
            className="btn-crystal w-full sm:w-auto text-base !py-3.5 !px-8 flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Pre-Configured Client</span>
          </Link>
        </div>

        {/* Server Highlights Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="ro-card p-4 text-center">
            <div className="text-amber-400 font-cinzel text-xl font-bold">25x / 25x / 10x</div>
            <div className="text-xs text-ro-text-secondary mt-1">Exp & Drop Rates</div>
          </div>
          <div className="ro-card p-4 text-center">
            <div className="text-sky-400 font-cinzel text-xl font-bold">99 / 70</div>
            <div className="text-xs text-ro-text-secondary mt-1">Transcendent Max Level</div>
          </div>
          <div className="ro-card p-4 text-center">
            <div className="text-emerald-400 font-cinzel text-xl font-bold">Episode 13.2</div>
            <div className="text-xs text-ro-text-secondary mt-1">Encounter Unknown</div>
          </div>
          <div className="ro-card p-4 text-center">
            <div className="text-purple-400 font-cinzel text-xl font-bold">Gepard 3.0</div>
            <div className="text-xs text-ro-text-secondary mt-1">Anti-Cheat Protected</div>
          </div>
        </div>

      </div>
    </section>
  );
}
