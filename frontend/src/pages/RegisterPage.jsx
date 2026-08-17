/**
 * Player Registration Page for KelsGaming RO
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/common/Alert';
import { 
  User, 
  Mail, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Compass, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    sex: 'M'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.username.length < 4 || formData.username.length > 23) {
      setError('Username must be between 4 and 23 characters (rAthena limit).');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await register(formData);
      setCreatedUser(res.data?.user || { username: formData.username });
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        
        {isSuccess ? (
          /* Registration Success State */
          <div className="ro-card p-8 sm:p-10 rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-ro-surface to-ro-card shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white mb-2">
                Registration Successful!
              </h2>
              <p className="text-sm text-ro-text-secondary leading-relaxed">
                Your <strong className="text-amber-300 font-semibold">KelsGaming RO</strong> game account <strong className="text-white font-mono">({createdUser?.username})</strong> has been created and synced with the rAthena server!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-ro-bg/60 border border-ro-border text-xs text-ro-text-muted text-left space-y-1.5">
              <div className="flex justify-between">
                <span>Game Username:</span>
                <span className="font-mono text-white font-semibold">{createdUser?.username}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Status:</span>
                <span className="text-emerald-400 font-semibold">Active & Ready</span>
              </div>
              <div className="flex justify-between">
                <span>Server Host:</span>
                <span className="font-mono text-ro-gold">32.236.113.36:6900</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                to="/dashboard"
                className="btn-gold w-full !py-3.5 text-sm font-bold flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Go to Player Dashboard</span>
              </Link>
              <Link
                to="/download"
                className="btn-crystal w-full !py-3 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Pre-Configured Client</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div className="ro-card p-8 sm:p-10 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-2xl space-y-6">
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-gold-glow flex items-center justify-center mx-auto mb-4">
                <div className="w-full h-full bg-ro-surface rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-ro-gold" />
                </div>
              </div>
              <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
                Create Account
              </h1>
              <p className="text-xs sm:text-sm text-ro-text-secondary mt-1">
                Join KelsGaming RO and begin your Midgard adventure.
              </p>
            </div>

            {error && (
              <Alert type="error" message={error} onClose={() => setError(null)} />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-ro-text-secondary uppercase tracking-wider mb-1.5">
                  Account Username (4-23 characters)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    required
                    minLength={4}
                    maxLength={23}
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="e.g. kels_knight"
                    className="ro-input pl-10 font-mono text-sm"
                    autoComplete="username"
                  />
                  <User className="w-4 h-4 text-ro-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-ro-text-secondary uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="adventurer@example.com"
                    className="ro-input pl-10 text-sm"
                    autoComplete="email"
                  />
                  <Mail className="w-4 h-4 text-ro-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Gender for RO Sprite */}
              <div>
                <label className="block text-xs font-semibold text-ro-text-secondary uppercase tracking-wider mb-1.5">
                  Default Character Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, sex: 'M' }))}
                    className={`py-2.5 px-4 rounded-lg text-xs font-bold border transition-all ${
                      formData.sex === 'M'
                        ? 'bg-sky-500/20 border-sky-500 text-sky-300 shadow-sm'
                        : 'bg-ro-bg border-ro-border text-ro-text-secondary hover:text-white'
                    }`}
                  >
                    Male Sprite (M)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, sex: 'F' }))}
                    className={`py-2.5 px-4 rounded-lg text-xs font-bold border transition-all ${
                      formData.sex === 'F'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm'
                        : 'bg-ro-bg border-ro-border text-ro-text-secondary hover:text-white'
                    }`}
                  >
                    Female Sprite (F)
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-ro-text-secondary uppercase tracking-wider mb-1.5">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    maxLength={32}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="ro-input pl-10 text-sm"
                    autoComplete="new-password"
                  />
                  <Lock className="w-4 h-4 text-ro-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-ro-text-secondary uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="ro-input pl-10 text-sm"
                    autoComplete="new-password"
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
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? 'Creating rAthena Account...' : 'Create Account'}</span>
                </button>
              </div>

            </form>

            <div className="text-center pt-2 border-t border-ro-border/60">
              <p className="text-xs text-ro-text-secondary">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-ro-gold hover:underline">
                  Log in here
                </Link>
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
