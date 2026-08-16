/**
 * Player Login Page for KelsGaming RO
 */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/common/Alert';
import { Shield, User, Lock, Swords, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="ro-card p-8 sm:p-10 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-2xl space-y-6">
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-gold-glow flex items-center justify-center mx-auto mb-4">
              <div className="w-full h-full bg-ro-surface rounded-[10px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-ro-gold" />
              </div>
            </div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
              Player Login
            </h1>
            <p className="text-xs sm:text-sm text-ro-text-secondary mt-1">
              Access your KelsGaming RO account & character roster.
            </p>
          </div>

          {error && (
            <Alert type="error" message={error} onClose={() => setError(null)} />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-ro-text-secondary uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="ro-input pl-10 text-sm font-mono"
                  autoComplete="username"
                />
                <User className="w-4 h-4 text-ro-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-ro-text-secondary uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="ro-input pl-10 text-sm"
                  autoComplete="current-password"
                />
                <Lock className="w-4 h-4 text-ro-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full !py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <Swords className="w-4 h-4" />
                <span>{loading ? 'Authenticating...' : 'Login to Dashboard'}</span>
              </button>
            </div>

          </form>

          <div className="text-center pt-2 border-t border-ro-border/60">
            <p className="text-xs text-ro-text-secondary">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-semibold text-ro-gold hover:underline">
                Create one now
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
