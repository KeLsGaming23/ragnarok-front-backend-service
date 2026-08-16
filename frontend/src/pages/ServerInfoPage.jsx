/**
 * Server Information & Mechanics Page
 */
import React from 'react';
import { 
  Shield, 
  Zap, 
  Swords, 
  Terminal, 
  Crown, 
  Award, 
  Settings, 
  Layers, 
  MapPin, 
  Calendar 
} from 'lucide-react';
import ServerRatesGrid from '../components/home/ServerRatesGrid';

export default function ServerInfoPage() {
  const commands = [
    { cmd: '@autoloot <%>', desc: 'Automatically store looted monster drops into inventory based on drop percentage rate.' },
    { cmd: '@alootid <item_id>', desc: 'Autoloot only specific item IDs (up to 10 simultaneous items).' },
    { cmd: '@rates', desc: 'Display current server experience and drop multipliers.' },
    { cmd: '@whodrops <item_id/name>', desc: 'List monsters that drop a specific item with exact drop percentage.' },
    { cmd: '@whereis <mob_name>', desc: 'Find maps where a specific monster spawns and count.' },
    { cmd: '@time / @date', desc: 'Display current server time and date in UTC.' },
    { cmd: '@refresh', desc: 'Synchronize client sprite position if you experience visual position lag.' },
    { cmd: '@duel / @accept', desc: 'Initiate or accept a 1v1 PvP duel anywhere in non-restricted towns.' }
  ];

  const woeSchedule = [
    { castle: 'Kriemhild (Prontera Castle)', day: 'Wednesday', time: '20:00 - 21:00 UTC+8' },
    { castle: 'Sacred Altar (Geffen Castle)', day: 'Friday', time: '20:00 - 21:00 UTC+8' },
    { castle: 'Bamboo Grove (Payon Castle)', day: 'Sunday', time: '20:00 - 21:00 UTC+8' }
  ];

  const npcs = [
    { name: 'Universal Warper', desc: 'Free warps to all major towns, dungeons, fields, and guild castles.' },
    { name: 'Job Master & Stylist', desc: 'Instant job changes, Platinum Skills, and hundreds of custom hair styles and cloth dyes.' },
    { name: 'Healer & Buffer', desc: 'Full HP/SP restoration with Agi Up and Blessing level 10 buffs.' },
    { name: 'Reset Master', desc: 'Skill and Stat reset services in Prontera main square.' },
    { name: 'Card Separator', desc: 'Safely unslot monster cards from weapons and armors with high success rates.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Server Information & Mechanics
        </h1>
        <p className="text-sm sm:text-base text-ro-text-secondary leading-relaxed">
          Everything you need to know about <strong className="text-amber-300 font-semibold">KelsGaming RO</strong> rates, episode content, available commands, and castle siege schedules.
        </p>
      </div>

      {/* Rates Grid */}
      <ServerRatesGrid />

      {/* WoE Schedule */}
      <div className="ro-card p-6 sm:p-8 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
            <Swords className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="font-cinzel text-2xl font-bold text-white">
              War of Emperium (WoE 1.0) Schedule
            </h2>
            <p className="text-xs text-ro-text-secondary">
              Transcendent guild warfare with exclusive castle treasure drops.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {woeSchedule.map((woe, idx) => (
            <div key={idx} className="bg-ro-bg/60 p-4 rounded-xl border border-ro-border flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-ro-gold block mb-1">{woe.day}</span>
                <h3 className="font-cinzel text-base font-bold text-white">{woe.castle}</h3>
              </div>
              <div className="mt-3 pt-3 border-t border-ro-border/60 text-xs text-ro-text-muted flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>{woe.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Player Commands */}
      <div className="ro-card p-6 sm:p-8 rounded-2xl border border-ro-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <Terminal className="w-6 h-6 text-ro-gold" />
          </div>
          <div>
            <h2 className="font-cinzel text-2xl font-bold text-white">
              Player Commands
            </h2>
            <p className="text-xs text-ro-text-secondary">
              In-game @ commands accessible to all players without restrictions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commands.map((cmd, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-ro-bg/50 border border-ro-border/60 flex items-start gap-3">
              <code className="text-xs font-mono font-bold text-amber-300 bg-amber-950/40 px-2 py-1 rounded border border-amber-500/20 shrink-0">
                {cmd.cmd}
              </code>
              <p className="text-xs text-ro-text-secondary leading-relaxed">
                {cmd.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quality of Life NPCs */}
      <div className="ro-card p-6 sm:p-8 rounded-2xl border border-ro-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30">
            <Crown className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <h2 className="font-cinzel text-2xl font-bold text-white">
              Key NPC Services
            </h2>
            <p className="text-xs text-ro-text-secondary">
              Convenient helpers located in Prontera City (`prontera 155 180`).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {npcs.map((npc, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-ro-bg/40 border border-ro-border">
              <h3 className="font-cinzel text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-ro-gold"></span>
                {npc.name}
              </h3>
              <p className="text-xs text-ro-text-secondary leading-relaxed">
                {npc.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
