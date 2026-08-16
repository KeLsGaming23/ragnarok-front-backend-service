/**
 * Server Rates & Mechanics Grid
 */
import React from 'react';
import { 
  Zap, 
  TrendingUp, 
  Gift, 
  Flame, 
  Crown, 
  Award, 
  Gauge, 
  Layers 
} from 'lucide-react';

export default function ServerRatesGrid() {
  const rateItems = [
    {
      title: 'Base Experience',
      value: '25x',
      desc: 'Balanced leveling progression for solo & party adventures',
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-500/5'
    },
    {
      title: 'Job Experience',
      value: '25x',
      desc: 'Fast job skill unlocking for Transcendent classes',
      icon: <TrendingUp className="w-6 h-6 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-500/5'
    },
    {
      title: 'Common Item Drops',
      value: '10x',
      desc: 'Comfortable loot drops for zeny farming & potion crafting',
      icon: <Gift className="w-6 h-6 text-sky-400" />,
      color: 'border-sky-500/30 bg-sky-500/5'
    },
    {
      title: 'Monster Cards',
      value: '10x',
      desc: '0.10% base card drop rate with dedicated card hunting areas',
      icon: <Layers className="w-6 h-6 text-sky-400" />,
      color: 'border-sky-500/30 bg-sky-500/5'
    },
    {
      title: 'MVP & Boss Drops',
      value: '5x',
      desc: 'Competitive MVP reward system and rare boss gear',
      icon: <Crown className="w-6 h-6 text-purple-400" />,
      color: 'border-purple-500/30 bg-purple-500/5'
    },
    {
      title: 'Max Level Cap',
      value: '99 / 70',
      desc: 'Classic Transcendent 2nd class cap (Lord Knight, High Wizard)',
      icon: <Award className="w-6 h-6 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-500/5'
    },
    {
      title: 'Max Stats & ASPD',
      value: '99 / 190',
      desc: 'Authentic pre-renewal combat calculations & cast times',
      icon: <Gauge className="w-6 h-6 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-500/5'
    },
    {
      title: 'Active Episode',
      value: 'Ep 13.2',
      desc: 'Encounter with the Unknown, Satan Morroc & Ash Vacuum',
      icon: <Flame className="w-6 h-6 text-red-400" />,
      color: 'border-red-500/30 bg-red-500/5'
    }
  ];

  return (
    <section className="py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white mb-4">
          Server Rates & Game Mechanics
        </h2>
        <p className="text-ro-text-secondary text-sm sm:text-base">
          Carefully tuned rates to preserve the thrill of rare drops and the excitement of guild progression without tedious grind.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {rateItems.map((item, idx) => (
          <div
            key={idx}
            className={`ro-card p-6 rounded-xl border ${item.color} ro-card-hover flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-ro-bg/80 border border-ro-border">
                  {item.icon}
                </div>
                <span className="font-cinzel text-2xl font-extrabold text-white">
                  {item.value}
                </span>
              </div>
              <h3 className="font-cinzel text-base font-semibold text-ro-text-primary mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-ro-text-secondary leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
