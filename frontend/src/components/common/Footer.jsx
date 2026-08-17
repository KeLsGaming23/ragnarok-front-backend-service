/**
 * Ragnarok Theme Footer Component
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Server, Download, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ro-surface border-t border-ro-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40">
                <Shield className="w-5 h-5 text-ro-gold" />
              </div>
              <span className="font-cinzel text-xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                KelsGaming RO
              </span>
            </div>
            <p className="text-sm text-ro-text-secondary max-w-md leading-relaxed">
              Your Adventure Begins Here. Immerse yourself in the classic Ragnarok Online experience with balanced 25x rates, dedicated AWS hosting, and a tight-knit community of adventurers.
            </p>
            <div className="flex items-center gap-2 text-xs text-ro-text-muted">
              <Server className="w-4 h-4 text-ro-crystal" />
              <span>AWS EC2 Host: <code className="text-gray-300">32.236.113.36</code></span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="font-cinzel text-sm font-semibold text-ro-gold uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-ro-text-secondary">
              <li>
                <Link to="/" className="hover:text-ro-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/server-info" className="hover:text-ro-gold transition-colors">Server Info & Rates</Link>
              </li>
              <li>
                <Link to="/download" className="hover:text-ro-gold transition-colors">Client Download</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-ro-gold transition-colors">Create Account</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Player Services */}
          <div className="space-y-3">
            <h3 className="font-cinzel text-sm font-semibold text-ro-gold uppercase tracking-wider">
              Player Services
            </h3>
            <ul className="space-y-2 text-sm text-ro-text-secondary">
              <li>
                <Link to="/login" className="hover:text-ro-gold transition-colors">Player Login</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-ro-gold transition-colors">Character Roster</Link>
              </li>
              <li>
                <a href="#rates" className="hover:text-ro-gold transition-colors">Server Mechanics</a>
              </li>
              <li>
                <Link to="/download#troubleshooting" className="hover:text-ro-gold transition-colors">Troubleshooting</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="gold-divider"></div>

        {/* Disclaimer & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ro-text-muted">
          <p>
            &copy; {new Date().getFullYear()} KelsGaming RO. All rights reserved. Built with rAthena.
          </p>
          <p className="text-center md:text-right max-w-xl leading-relaxed">
            Ragnarok Online and related assets are registered trademarks of Gravity Co., Ltd. & Lee Myoungjin. KelsGaming RO is an independent private fan server.
          </p>
        </div>
      </div>
    </footer>
  );
}
