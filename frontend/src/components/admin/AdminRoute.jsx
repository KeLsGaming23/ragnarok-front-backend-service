/**
 * Admin Protected Route Guard
 * Enforces authenticated session with rAthena GM Level 99+
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-ro-bg gap-4">
        <div className="w-12 h-12 border-4 border-ro-gold/20 border-t-ro-gold rounded-full animate-spin"></div>
        <span className="text-sm font-medium text-ro-text-secondary">
          Verifying Administrator Privileges...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const groupId = parseInt(user?.groupId ?? user?.group_id ?? 0, 10);

  if (groupId < 99) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="p-4 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 mb-4">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h1 className="font-cinzel text-3xl font-bold text-white mb-2">
          Access Restricted
        </h1>
        <p className="text-ro-text-secondary max-w-md mb-6 text-sm">
          You do not have Administrator permissions (GM Level 99+) to access the Ragnarok Online Server Control Portal.
        </p>
        <a
          href="/dashboard"
          className="btn-gold !py-2.5 !px-6 text-sm font-semibold inline-flex items-center gap-2"
        >
          Return to Player Dashboard
        </a>
      </div>
    );
  }

  return children;
}
