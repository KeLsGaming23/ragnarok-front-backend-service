/**
 * Alert Banner Component
 */
import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;

  const styles = {
    error: {
      bg: 'bg-red-950/50 border-red-500/50 text-red-200',
      icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
    },
    success: {
      bg: 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
    },
    info: {
      bg: 'bg-sky-950/50 border-sky-500/50 text-sky-200',
      icon: <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
    }
  }[type] || styles.error;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm ${styles.bg} transition-all duration-200`}>
      {styles.icon}
      <div className="flex-1 text-sm font-medium">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
