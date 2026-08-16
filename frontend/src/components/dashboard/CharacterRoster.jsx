/**
 * Character Roster Display for Player Dashboard
 */
import React from 'react';
import { 
  Users, 
  Coins, 
  MapPin, 
  Shield, 
  Heart, 
  Zap, 
  CircleDot, 
  Sparkles, 
  Compass 
} from 'lucide-react';
import { formatZeny, getTierBadgeClass, formatDate } from '../../utils/formatters';

export default function CharacterRoster({ characters = [] }) {
  if (!characters || characters.length === 0) {
    return (
      <div className="ro-card p-12 text-center border border-dashed border-ro-border rounded-xl">
        <div className="w-16 h-16 rounded-full bg-ro-bg flex items-center justify-center mx-auto mb-4 border border-ro-border">
          <Compass className="w-8 h-8 text-ro-gold" />
        </div>
        <h3 className="font-cinzel text-xl font-bold text-white mb-2">
          No Characters Created Yet
        </h3>
        <p className="text-sm text-ro-text-secondary max-w-md mx-auto mb-6 leading-relaxed">
          Launch the <strong className="text-white">KelsGaming RO Client</strong>, log in with your registered account, and create your first adventurer in Midgard!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-ro-gold" />
          <h2 className="font-cinzel text-xl font-bold text-white">
            Character Roster ({characters.length} / 9 Slots)
          </h2>
        </div>
        <span className="text-xs text-ro-text-muted">
          Read-Only Game Sync
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((char) => {
          const hpPercent = char.maxHp > 0 ? Math.min(100, Math.round((char.hp / char.maxHp) * 100)) : 100;
          const spPercent = char.maxSp > 0 ? Math.min(100, Math.round((char.sp / char.maxSp) * 100)) : 100;

          return (
            <div
              key={char.charId}
              className="ro-card p-5 ro-card-hover rounded-xl border border-ro-border flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Row: Slot & Online Indicator */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono font-bold text-ro-text-muted uppercase tracking-wider">
                    Slot #{char.charNum + 1}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${char.online ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}></span>
                    <span className={`text-[11px] font-semibold ${char.online ? 'text-emerald-400' : 'text-gray-400'}`}>
                      {char.online ? 'In Game' : 'Offline'}
                    </span>
                  </div>
                </div>

                {/* Character Name & Class Badge */}
                <div className="mb-4">
                  <h3 className="font-cinzel text-lg font-bold text-white truncate" title={char.name}>
                    {char.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getTierBadgeClass(char.classTier)}`}>
                      {char.className}
                    </span>
                    <span className="text-xs font-bold text-amber-300">
                      Lv. {char.baseLevel} / {char.jobLevel}
                    </span>
                  </div>
                </div>

                {/* HP & SP Bars */}
                <div className="space-y-2 mb-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-0.5">
                      <span className="text-red-400 font-semibold flex items-center gap-1">
                        <Heart className="w-3 h-3" /> HP
                      </span>
                      <span className="text-ro-text-secondary font-mono">{char.hp} / {char.maxHp}</span>
                    </div>
                    <div className="w-full h-1.5 bg-ro-bg rounded-full overflow-hidden border border-red-950">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
                        style={{ width: `${hpPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-0.5">
                      <span className="text-sky-400 font-semibold flex items-center gap-1">
                        <Zap className="w-3 h-3" /> SP
                      </span>
                      <span className="text-ro-text-secondary font-mono">{char.sp} / {char.maxSp}</span>
                    </div>
                    <div className="w-full h-1.5 bg-ro-bg rounded-full overflow-hidden border border-sky-950">
                      <div
                        className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full"
                        style={{ width: `${spPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Zeny & Guild */}
                <div className="space-y-1.5 pt-3 border-t border-ro-border/60 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-ro-text-muted flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-400" /> Zeny
                    </span>
                    <span className="font-mono font-bold text-amber-300">
                      {formatZeny(char.zeny)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-ro-text-muted flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-ro-gold" /> Guild
                    </span>
                    <span className="font-medium text-white truncate max-w-[140px]">
                      {char.guild || 'None'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-ro-text-muted flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Last Map
                    </span>
                    <span className="font-mono text-gray-300">
                      {char.lastMap || 'prontera'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer timestamp */}
              <div className="mt-4 pt-3 border-t border-ro-border/40 text-[10px] text-ro-text-muted">
                Last active: {formatDate(char.lastLogin)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
