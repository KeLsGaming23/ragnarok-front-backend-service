/**
 * Responsive Navigation Bar
 */
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ServerStatusBadge from './ServerStatusBadge';
import { 
  Shield, 
  Download, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  Info, 
  Home, 
  ChevronRight,
  Crown,
  Database
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = parseInt(user?.groupId ?? user?.group_id ?? 0, 10) >= 99;

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'text-ro-gold bg-ro-gold/10 border-b-2 border-ro-gold font-semibold'
        : 'text-ro-text-secondary hover:text-ro-gold hover:bg-ro-surface/60'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-ro-bg/90 backdrop-blur-md border-b border-ro-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-ro-surface rounded-[7px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-ro-gold group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-xl font-extrabold tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent group-hover:from-white group-hover:to-amber-400 transition-colors">
                KelsGaming RO
              </span>
              <span className="text-[10px] uppercase tracking-widest text-ro-text-muted font-semibold">
                Private Server
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/database/items" className={navLinkClass}>
              Item Database
            </NavLink>
            <NavLink to="/server-info" className={navLinkClass}>
              Server Info
            </NavLink>
            <NavLink to="/download" className={navLinkClass}>
              Download Client
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/40 text-xs font-bold shadow-sm hover:brightness-125 transition-all ml-2"
              >
                <Crown className="w-3.5 h-3.5 text-ro-gold" />
                <span>Admin Portal</span>
              </Link>
            )}
          </nav>

          {/* Right Side: Status Badge & Auth CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <ServerStatusBadge />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-ro-card hover:bg-ro-card-hover border border-ro-border hover:border-ro-gold/40 text-sm font-medium text-ro-text-primary transition-colors"
                >
                  <User className="w-4 h-4 text-ro-gold" />
                  <span className="max-w-[120px] truncate">{user?.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-ro-card hover:bg-red-950/40 border border-ro-border hover:border-red-500/40 text-ro-text-muted hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-ro-text-secondary hover:text-white hover:bg-ro-surface transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-gold !py-2 !px-4 text-sm font-bold flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg bg-ro-card border border-ro-border text-ro-text-secondary hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ro-surface/95 border-b border-ro-border px-4 pt-2 pb-6 space-y-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top duration-200">
          <div className="py-2 flex justify-center">
            <ServerStatusBadge />
          </div>

          <div className="grid gap-1">
            <Link
              to="/"
              className="flex items-center justify-between px-4 py-3 rounded-lg text-ro-text-primary hover:bg-ro-card"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3"><Home className="w-5 h-5 text-ro-gold" /> Home</span>
              <ChevronRight className="w-4 h-4 text-ro-text-muted" />
            </Link>
            <Link
              to="/database/items"
              className="flex items-center justify-between px-4 py-3 rounded-lg text-ro-text-primary hover:bg-ro-card"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3"><Database className="w-5 h-5 text-ro-gold" /> Item Database</span>
              <ChevronRight className="w-4 h-4 text-ro-text-muted" />
            </Link>
            <Link
              to="/server-info"
              className="flex items-center justify-between px-4 py-3 rounded-lg text-ro-text-primary hover:bg-ro-card"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3"><Info className="w-5 h-5 text-ro-gold" /> Server Info</span>
              <ChevronRight className="w-4 h-4 text-ro-text-muted" />
            </Link>
            <Link
              to="/download"
              className="flex items-center justify-between px-4 py-3 rounded-lg text-ro-text-primary hover:bg-ro-card"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3"><Download className="w-5 h-5 text-ro-gold" /> Download Client</span>
              <ChevronRight className="w-4 h-4 text-ro-text-muted" />
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="flex items-center justify-between px-4 py-3 rounded-lg text-ro-text-primary hover:bg-ro-card"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-3"><User className="w-5 h-5 text-ro-gold" /> Dashboard</span>
                <ChevronRight className="w-4 h-4 text-ro-text-muted" />
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-3"><Crown className="w-5 h-5 text-ro-gold" /> Admin Portal</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </Link>
            )}
          </div>

          <div className="pt-2 border-t border-ro-border grid gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout ({user?.username})</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  className="btn-secondary !py-2.5 text-center text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-gold !py-2.5 text-center text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
