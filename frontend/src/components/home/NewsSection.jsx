/**
 * News & Announcements Section
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowUpRight, Megaphone, Sparkles } from 'lucide-react';

export default function NewsSection() {
  const articles = [
    {
      id: 1,
      category: 'Launch',
      title: 'Grand Opening: KelsGaming RO Official Server Launch!',
      date: 'Aug 16, 2026',
      summary: 'Midgard awakens! The server is now open for registration and pre-configured client downloads. Claim your starter pack in Prontera today.',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 2,
      category: 'Event',
      title: 'Race to 99/70: First Transcendent Master Rewards',
      date: 'Aug 16, 2026',
      summary: 'The first adventurers of each class tier to achieve base level 99 and job level 70 will be permanently immortalized in the Prontera Hall of Fame with exclusive headgears.',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
    },
    {
      id: 3,
      category: 'System',
      title: 'Pre-Configured Client v1.2.0 Released',
      date: 'Aug 16, 2026',
      summary: 'Download our 1-click standalone package featuring pre-patched clientinfo.xml, HD wide-screen resolutions, and full BGM pack.',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    }
  ];

  return (
    <section className="py-16 border-t border-ro-border/60">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="font-cinzel text-3xl font-bold text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-ro-gold" />
            Latest Announcements & Patch Notes
          </h2>
          <p className="text-ro-text-secondary text-sm mt-1">
            Stay updated with event schedules, maintenance notices, and server changes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((item) => (
          <article
            key={item.id}
            className="ro-card p-6 ro-card-hover rounded-xl border border-ro-border flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                  {item.category}
                </span>
                <span className="text-xs text-ro-text-muted flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.date}
                </span>
              </div>

              <h3 className="font-cinzel text-lg font-bold text-white mb-2 line-clamp-2">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-ro-text-secondary line-clamp-3 leading-relaxed mb-4">
                {item.summary}
              </p>
            </div>

            <Link
              to="/server-info"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ro-gold hover:text-amber-300 transition-colors pt-3 border-t border-ro-border/50"
            >
              <span>Read Full Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
