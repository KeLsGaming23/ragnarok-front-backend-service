/**
 * Troubleshooting & Client FAQ Component
 */
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function Troubleshooting() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'The game opens in a small window or gives a resolution error (Cannot init d3d). How do I fix it?',
      a: 'Run OpenSetup.exe or Setup.exe inside your KelsGaming RO folder as Administrator. Under Graphic Device, select Direct3D HAL or your dedicated graphics card. Set your screen resolution (e.g. 1920x1080) and check "Window" mode if desired.'
    },
    {
      q: 'Windows Defender / Antivirus flags KelsGamingRO.exe as a suspicious file.',
      a: 'This is a common false positive triggered by the Gepard Shield 3.0 anti-cheat wrapper (which encrypts game memory to prevent bots). KelsGaming RO is 100% clean and virus-free. Simply add your KelsGaming RO directory to your Windows Defender / Antivirus whitelist / exclusions list.'
    },
    {
      q: 'I get disconnected at the character selection screen or cannot connect to server.',
      a: 'Ensure your firewall allows outgoing connections on TCP ports 6900 (Login), 6121 (Character), and 5121 (Map). Check our homepage server status to ensure the map server is online. If you are behind a corporate or school proxy, you may need to use a VPN.'
    },
    {
      q: 'Sprites or headgears show as red question marks or cause sprite errors.',
      a: 'This occurs if you are missing core game textures. Make sure you downloaded the Full Standalone Client rather than the Lite Patch, and verify that data.ini is located in the same folder as KelsGamingRO.exe.'
    }
  ];

  return (
    <section id="troubleshooting" className="py-12 border-t border-ro-border/60">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-ro-gold" />
          Troubleshooting & FAQs
        </h2>
        <p className="text-xs sm:text-sm text-ro-text-secondary">
          Quick solutions to get you back into Midgard without delays.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="ro-card rounded-xl border border-ro-border overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 text-white font-cinzel font-semibold text-sm sm:text-base hover:text-ro-gold transition-colors focus:outline-none"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-ro-gold shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-ro-text-muted shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-ro-text-secondary leading-relaxed border-t border-ro-border/40 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
