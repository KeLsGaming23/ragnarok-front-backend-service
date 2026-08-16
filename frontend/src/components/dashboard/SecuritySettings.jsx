/**
 * Security & Password Settings Modal / Component
 */
import React, { useState } from 'react';
import { accountService } from '../../services/accountService';
import Alert from '../common/Alert';
import { KeyRound, Lock, X, CheckCircle2 } from 'lucide-react';

export default function SecuritySettings({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (newPassword !== confirmNewPassword) {
      setAlert({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setAlert({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    try {
      await accountService.updatePassword(currentPassword, newPassword, confirmNewPassword);
      setAlert({ 
        type: 'success', 
        message: 'Password successfully updated! Your rAthena account has been updated.' 
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="ro-card max-w-md w-full p-6 sm:p-8 rounded-2xl border border-ro-border bg-ro-surface shadow-2xl relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-ro-text-muted hover:text-white p-1 rounded-lg hover:bg-ro-card transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <KeyRound className="w-5 h-5 text-ro-gold" />
          </div>
          <div>
            <h3 className="font-cinzel text-xl font-bold text-white">
              Change Password
            </h3>
            <p className="text-xs text-ro-text-secondary">
              Updates both your website and rAthena game login.
            </p>
          </div>
        </div>

        {alert && (
          <div className="mb-4">
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ro-text-secondary uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="ro-input pl-10"
              />
              <Lock className="w-4 h-4 text-ro-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ro-text-secondary uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="ro-input pl-10"
              />
              <Lock className="w-4 h-4 text-ro-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ro-text-secondary uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="ro-input pl-10"
              />
              <Lock className="w-4 h-4 text-ro-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary !py-2.5 !px-4 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold !py-2.5 !px-6 text-xs font-bold"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
