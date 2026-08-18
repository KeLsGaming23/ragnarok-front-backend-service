/**
 * Responsive Navigation Bar (Option 3: Clean Split Dock Header)
 * Features brand on the left, spacious centered navigation, and a unified User Profile dropdown.
 */
import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  Crown,
  Database,
  Gift,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const isAdmin = parseInt(user?.groupId ?? user?.group_id ?? 0, 10) >= 99;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `relative px-3.5 py-2 text-xs lg:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 ${
      isActive
        ? 'text-ro-gold font-bold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-gradient-to-r after:from-amber-400 after:to-ro-gold after:shadow-gold-glow'
        : 'text-ro-text-secondary hover:text-white hover:bg-ro-surface/50 rounded-lg'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-ro-bg/95 backdrop-blur-xl border-b border-ro-border/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* 1. Left Side: Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none shrink-0"
            onClick={() => { setMobileMenuOpen(false); setUserDropdownOpen(false); }}
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-ro-surface rounded-[9px] flex items-center justify-center">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-ro-gold group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-lg sm:text-xl font-black tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent group-hover:from-white group-hover:to-amber-400 transition-colors">
                KelsGaming RO
              </span>
              <span className="text-[9px] uppercase tracking-widest text-ro-text-muted font-bold -mt-0.5">
                Private Server
              </span>
            </div>
          </Link>

          {/* 2. Center: Spacious Clean Navigation Links */}
          <nav className="hidden md:flex items-center justify-center space-x-1 lg:space-x-4 flex-1">
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
              Downloads
            </NavLink>
          </nav>

          {/* 3. Right Side: Compact Status Badge & User Profile Dropdown */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <ServerStatusBadge />

            {isAuthenticated ? (
              /* User Profile Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all ${
                    userDropdownOpen
                      ? 'bg-ro-surface border-ro-gold shadow-gold-glow text-white'
                      : 'bg-ro-card hover:bg-ro-surface border-ro-border hover:border-ro-gold/50 text-ro-text-primary'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-ro-gold shadow-inner">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block leading-tight max-w-[100px] truncate">
                      {user?.username}
                    </span>
                    {isAdmin && (
                      <span className="text-[9px] font-black text-ro-gold uppercase leading-none block">
                        Admin
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-ro-text-muted transition-transform duration-200 ${userDropdownOpen ? 'rotate-180 text-ro-gold' : ''}`} />
                </button>

                {/* Floating Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-ro-surface border-2 border-ro-gold/40 shadow-2xl p-2 z-50 animate-in fade-in zoom-in duration-150 space-y-1">
                    
                    {/* User Header */}
                    <div className="p-2.5 rounded-xl bg-ro-bg/80 border border-ro-border/60 mb-1">
                      <span className="text-xs font-bold text-white block truncate">
                        {user?.username}
                      </span>
                      <span className="text-[10px] text-ro-text-muted font-mono block truncate">
                        Account #{user?.id || user?.accountId || user?.account_id || '0'}
                      </span>
                      <div className="mt-1.5 flex items-center gap-1">
                        {isAdmin ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-500 text-black">
                            👑 GM Level 99
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            🗡️ Player
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Menu Links */}
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-ro-text-secondary hover:text-white hover:bg-ro-card transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-ro-gold" />
                      <span>Player Dashboard</span>
                    </Link>

                    {isAdmin && (
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-300 hover:text-white hover:bg-amber-950/40 border border-transparent hover:border-amber-500/30 transition-colors"
                        >
                          <Crown className="w-4 h-4 text-ro-gold" />
                          <span>Admin Portal</span>
                        </Link>

                        <Link
                          to="/admin/dispatch"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-ro-text-secondary hover:text-white hover:bg-ro-card transition-colors"
                        >
                          <Gift className="w-4 h-4 text-amber-400" />
                          <span>Item Dispatcher</span>
                        </Link>
                      </>
                    )}

                    <div className="my-1 border-t border-ro-border/60"></div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-300 hover:text-white hover:bg-red-950/40 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Actions */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-ro-text-secondary hover:text-white hover:bg-ro-surface transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn-gold !py-2 !px-4 text-xs font-cinzel font-bold shadow-gold-glow flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* 4. Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-ro-surface hover:bg-ro-card border border-ro-border text-ro-text-muted hover:text-white transition-colors"
              aria-label="Toggle menu"
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
              className="flex items-center justify-between px-4 py-3 rounded-xl text-ro-text-primary hover:bg-ro-card text-xs font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3"><Home className="w-4 h-4 text-ro-gold" /> Home</span>
              <ChevronRight className="w-4 h-4 text-ro-text-muted" />
            </Link>
            <Link
              to="/database/items"
              className="flex items-center justify-between px-4 py-3 rounded-xl text-ro-text-primary hover:bg-ro-card text-xs font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3"><Database className="w-4 h-4 text-ro-gold" /> Item Database</span>
              <ChevronRight className="w-4 h-4 text-ro-text-muted" />
            </Link>
            <Link
              to="/server-info"
              className="flex items-center justify-between px-4 py-3 rounded-xl text-ro-text-primary hover:bg-ro-card text-xs font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3"><Info className="w-4 h-4 text-ro-gold" /> Server Info</span>
              <ChevronRight className="w-4 h-4 text-ro-text-muted" />
            </Link>
            <Link
              to="/download"
              className="flex items-center justify-between px-4 py-3 rounded-xl text-ro-text-primary hover:bg-ro-card text-xs font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center gap-3"><Download className="w-4 h-4 text-ro-gold" /> Downloads</span>
              <ChevronRight className="w-4 h-4 text-ro-text-muted" />
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="flex items-center justify-between px-4 py-3 rounded-xl text-ro-text-primary hover:bg-ro-card text-xs font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-3"><User className="w-4 h-4 text-ro-gold" /> Player Dashboard</span>
                <ChevronRight className="w-4 h-4 text-ro-text-muted" />
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 text-xs font-bold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-3"><Crown className="w-4 h-4 text-ro-gold" /> Admin Control Portal</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </Link>
            )}
          </div>

          <div className="pt-2 border-t border-ro-border grid gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 font-bold text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({user?.username})</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  className="btn-secondary !py-2.5 text-center text-xs font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn-gold !py-2.5 text-center text-xs font-bold"
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
