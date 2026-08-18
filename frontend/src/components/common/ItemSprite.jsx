/**
 * Reusable Ragnarok Item Sprite & Icon Component
 * Renders official sprite from CDN with local fallback and category badge
 */
import React, { useState } from 'react';
import {
  Sword,
  Shield,
  FlaskConical,
  CreditCard,
  Gem,
  Package
} from 'lucide-react';

export default function ItemSprite({
  itemId,
  itemName = '',
  itemType = 'etc',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  showFallbackBadge = true
}) {
  const [imgError, setImgError] = useState(false);
  const numericId = parseInt(itemId, 10);

  // Size dimensions
  const sizeMap = {
    sm: 'w-6 h-6 min-w-[24px] min-h-[24px]',
    md: 'w-8 h-8 min-w-[32px] min-h-[32px]',
    lg: 'w-12 h-12 min-w-[48px] min-h-[48px]',
    xl: 'w-16 h-16 min-w-[64px] min-h-[64px]'
  };

  const iconSizeMap = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const currentSizeClass = sizeMap[size] || sizeMap.md;
  const currentIconSize = iconSizeMap[size] || iconSizeMap.md;

  // Fallback category icon
  const getCategoryIcon = () => {
    const typeStr = String(itemType).toLowerCase();
    if (typeStr.includes('weapon')) return <Sword className={`${currentIconSize} text-amber-400`} />;
    if (typeStr.includes('armor') || typeStr.includes('shield') || typeStr.includes('headgear')) {
      return <Shield className={`${currentIconSize} text-sky-400`} />;
    }
    if (typeStr.includes('card')) return <CreditCard className={`${currentIconSize} text-purple-400`} />;
    if (typeStr.includes('usable') || typeStr.includes('healing') || typeStr.includes('potion')) {
      return <FlaskConical className={`${currentIconSize} text-emerald-400`} />;
    }
    return <Gem className={`${currentIconSize} text-ro-gold`} />;
  };

  if (!numericId || numericId <= 0 || imgError) {
    if (!showFallbackBadge) return null;
    return (
      <div
        className={`${currentSizeClass} rounded-lg bg-ro-bg/90 border border-ro-border flex items-center justify-center shrink-0 shadow-inner ${className}`}
        title={itemName || `Item #${itemId}`}
      >
        {getCategoryIcon()}
      </div>
    );
  }

  return (
    <div
      className={`${currentSizeClass} rounded-lg bg-ro-bg/60 border border-ro-border/60 flex items-center justify-center shrink-0 overflow-hidden relative group/sprite p-0.5 ${className}`}
      title={itemName ? `${itemName} (#${numericId})` : `Item #${numericId}`}
    >
      <img
        src={`https://static.divine-pride.net/images/items/item/${numericId}.png`}
        alt={itemName || `Item ${numericId}`}
        loading="lazy"
        onError={() => setImgError(true)}
        className="w-full h-full object-contain drop-shadow-md transition-transform duration-200 group-hover/sprite:scale-110"
      />
    </div>
  );
}
