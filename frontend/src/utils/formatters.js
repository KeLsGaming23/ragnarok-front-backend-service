/**
 * Formatting helpers for Ragnarok UI
 */

export function formatZeny(amount) {
  if (amount === undefined || amount === null) return '0 Z';
  return new Intl.NumberFormat('en-US').format(amount) + ' Z';
}

export function formatDate(dateString) {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function getTierBadgeClass(tier) {
  switch (tier) {
    case 'Transcendent':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    case '2nd Class':
      return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
    case 'Expanded':
      return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    case '1st Class':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
  }
}

export function formatTimeAgo(dateString) {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0 || diffInSeconds < 60) return 'Just now';
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}
