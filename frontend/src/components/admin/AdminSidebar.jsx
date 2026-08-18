/**
 * Admin Sidebar Navigation
 * Matches wireframe layout with Dark Fantasy styling
 */
import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  Sword,
  Shield,
  Server,
  Gift,
  FileText,
  Settings,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Crown,
  Sparkles
} from 'lucide-react';

export default function AdminSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Players', path: '/admin/players', icon: Users },
    { name: 'Accounts', path: '/admin/accounts', icon: UserSquare2 },
    { name: 'Characters', path: '/admin/characters', icon: Sword },
    { name: 'Guilds', path: '/admin/guilds', icon: Shield },
    { name: 'Server', path: '/admin/server', icon: Server },
    { name: 'Item Dispatch', path: '/admin/dispatch', icon: Gift },
    { name: 'Logs', path: '/admin/logs', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const adminItems = [
    { name: 'Admins & Permissions', path: '/admin/admins', icon: ShieldCheck }
  ];

  const getLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 font-semibold shadow-sm'
        : 'text-ro-text-secondary hover:text-white hover:bg-ro-surface/80 border border-transparent'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-ro-card border-r border-ro-border flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Brand */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-ro-border/80 bg-ro-bg/50">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-gold-glow flex items-center justify-center">
                <div className="w-full h-full bg-ro-surface rounded-[10px] flex items-center justify-center">
                  <Crown className="w-5 h-5 text-ro-gold" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-cinzel font-black tracking-wider text-base bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  RO ADMIN
                </span>
                <span className="text-[10px] uppercase font-bold text-ro-text-muted tracking-widest flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  KelsGaming Control
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-210px)] custom-scrollbar">
            {/* Main Section */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-ro-text-muted">
                Core Management
              </span>
              <nav className="mt-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.exact}
                      onClick={onClose}
                      className={getLinkClasses}
                    >
                      <Icon className="w-4 h-4 text-ro-gold/80" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Divider */}
            <div className="pt-2 border-t border-ro-border/60">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-ro-text-muted">
                Access & Security
              </span>
              <nav className="mt-2 space-y-1">
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={getLinkClasses}
                    >
                      <Icon className="w-4 h-4 text-amber-400" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Footer Admin Profile & Exit Button */}
        <div className="p-4 border-t border-ro-border/80 bg-ro-bg/60 space-y-3">
          {/* Return to Game Portal Link */}
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-ro-surface/80 hover:bg-ro-surface text-xs font-medium text-ro-text-secondary hover:text-white border border-ro-border transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Game Portal</span>
          </Link>

          {/* Admin User Card & Logout */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5">
                <div className="w-full h-full rounded-full bg-ro-card flex items-center justify-center">
                  <Crown className="w-3.5 h-3.5 text-ro-gold" />
                </div>
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">
                  {user?.username}
                </span>
                <span className="text-[10px] font-semibold text-amber-400">
                  GM Level {user?.groupId ?? user?.group_id ?? 99}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-red-950/40 text-ro-text-muted hover:text-red-400 transition-colors"
              title="Logout from Admin Panel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
