/**
 * KelsGaming RO - Landing Page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import ServerStatusWidget from '../components/home/ServerStatusWidget';
import ServerRatesGrid from '../components/home/ServerRatesGrid';
import FeaturesSection from '../components/home/FeaturesSection';
import NewsSection from '../components/home/NewsSection';
import { Download, Sparkles, Swords, ChevronRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Live Server Status Widget */}
        <ServerStatusWidget />

        {/* Server Rates & Mechanics Grid */}
        <ServerRatesGrid />

        {/* Server Features */}
        <FeaturesSection />

        {/* Latest Announcements */}
        <NewsSection />

        {/* Pre-configured Client Quick Banner CTA */}
        <div className="ro-card p-8 sm:p-12 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-r from-ro-surface via-ro-card to-ro-surface shadow-2xl relative overflow-hidden text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-ro-gold">
              Instant 1-Click Launch
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Begin Your Adventure?
            </h2>
            <p className="text-sm text-ro-text-secondary leading-relaxed">
              Download our fully pre-configured game client configured directly for AWS EC2 (<code className="text-amber-300 font-mono">32.236.113.36</code>). No complex setup required.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/download"
                className="btn-gold !py-3.5 !px-8 text-sm font-bold flex items-center gap-2 w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                <span>Download Client Now</span>
              </Link>
              <Link
                to="/register"
                className="btn-secondary !py-3.5 !px-8 text-sm font-semibold flex items-center gap-2 w-full sm:w-auto"
              >
                <Sparkles className="w-4 h-4 text-ro-gold" />
                <span>Create Free Account</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
