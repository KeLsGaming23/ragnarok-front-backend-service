/**
 * Server Features Section
 */
import React from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  CloudLightning, 
  Swords, 
  PackageCheck, 
  Users2 
} from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      title: 'Dedicated AWS Infrastructure',
      desc: 'Hosted on high-speed AWS EC2 cloud instances ensuring 99.9% uptime, minimal packet loss, and low ping for worldwide players.',
      icon: <CloudLightning className="w-6 h-6 text-sky-400" />
    },
    {
      title: 'Gepard Shield Anti-Cheat',
      desc: 'Strict client protection preventing WPE, bots, automated macro exploits, and unauthorized DLL injection to preserve fair competition.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />
    },
    {
      title: 'Essential Player Commands',
      desc: 'Convenient quality of life commands including @autoloot, @alootid, @rates, @whodrops, @whereis, and @time.',
      icon: <Terminal className="w-6 h-6 text-amber-400" />
    },
    {
      title: 'Pre-Configured Client',
      desc: 'Download and play immediately without tweaking XML files, editing GRFs, or manual IP setups. Everything works out-of-the-box.',
      icon: <PackageCheck className="w-6 h-6 text-purple-400" />
    },
    {
      title: 'Thrilling WoE & PvP Seasons',
      desc: 'Scheduled War of Emperium castle battles with exclusive guild rewards, Godly item quests, and structured Battlegrounds.',
      icon: <Swords className="w-6 h-6 text-red-400" />
    },
    {
      title: 'Community-Driven Development',
      desc: 'Regular server events, responsive staff, and frequent game balance adjustments based directly on player feedback.',
      icon: <Users2 className="w-6 h-6 text-amber-300" />
    }
  ];

  return (
    <section className="py-16 border-t border-ro-border/60">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white mb-4">
          Why Adventure in KelsGaming RO?
        </h2>
        <p className="text-ro-text-secondary text-sm sm:text-base">
          Built from the ground up for stability, nostalgia, and a balanced long-term MMORPG environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="ro-card p-6 ro-card-hover rounded-xl border border-ro-border flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-ro-bg flex items-center justify-center mb-4 border border-ro-border">
                {feat.icon}
              </div>
              <h3 className="font-cinzel text-lg font-bold text-white mb-2">
                {feat.title}
              </h3>
              <p className="text-sm text-ro-text-secondary leading-relaxed">
                {feat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
