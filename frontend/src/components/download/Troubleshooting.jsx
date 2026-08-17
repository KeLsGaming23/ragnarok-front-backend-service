/**
 * Troubleshooting & Client FAQ Component
 */
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function Troubleshooting() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Which file do I run to launch the game inside the client folder?',
      a: (
        <div className="space-y-2">
          <p>
            Inside your extracted <strong className="text-white font-mono">Ragnarok-Configured-Client</strong> folder, run:
          </p>
          <code className="block p-2.5 rounded bg-ro-bg border border-ro-border font-mono text-emerald-400 text-xs break-all">
            2025-06-04_Ragexe_1748494356_clientinfo.xml_patched.exe
          </code>
          <p className="text-amber-200/90 text-xs">
            💡 <strong>Pro Tip:</strong> Right-click this .exe file and choose <em>"Send to &rarr; Desktop (create shortcut)"</em> so you can launch KelsGaming RO directly from your desktop anytime!
          </p>
        </div>
      )
    },
    {
      q: 'What if the server IP changes? Do I need to re-download the game client?',
      a: (
        <div className="space-y-2">
          <p>
            <strong className="text-emerald-400">NO, you do not need to re-download the client!</strong> For AWS cloud cost-efficiency, the server IP may occasionally change upon server restarts.
          </p>
          <p>
            To update your client to the latest IP in seconds:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-ro-text-primary bg-ro-bg/70 p-3 rounded-lg border border-ro-border">
            <li>
              Open <code className="text-amber-300 font-mono">Ragnarok-Configured-Client\data\clientinfo.xml</code> in Notepad or any text editor.
            </li>
            <li>
              Find the line: <code className="text-sky-300 font-mono">&lt;address&gt;32.236.113.36&lt;/address&gt;</code>
            </li>
            <li>
              Replace <code className="text-sky-300 font-mono">32.236.113.36</code> with the new Server IP displayed at the top of our website.
            </li>
            <li>Save the file (<kbd className="px-1 py-0.5 rounded bg-ro-card border border-ro-border text-xs">Ctrl + S</kbd>) and launch the game!</li>
          </ol>
        </div>
      )
    },
    {
      q: 'The game opens in a small window or gives a resolution error (Cannot init d3d). How do I fix it?',
      a: 'Run OpenSetup.exe or Setup.exe inside your Ragnarok-Configured-Client folder as Administrator. Under Graphic Device, select Direct3D HAL or your dedicated graphics card (NVIDIA/AMD/Intel). Set your screen resolution (e.g. 1920x1080) and check "Window" mode if desired.'
    },
    {
      q: 'Windows Defender / Antivirus flags the game executable as suspicious.',
      a: 'This is a common false positive triggered by game packet protection. KelsGaming RO is 100% clean and virus-free. Simply add your "Ragnarok-Configured-Client" directory to your Windows Defender / Antivirus exclusions whitelist.'
    },
    {
      q: 'I get disconnected at the character selection screen or cannot connect to server.',
      a: 'Ensure your firewall allows outgoing connections on TCP ports 6900 (Login), 6121 (Character), and 5121 (Map). Check our website header to verify that the server status is ONLINE. Also confirm that the IP in clientinfo.xml matches the active server IP.'
    }
  ];

  return (
    <section id="troubleshooting" className="py-12 border-t border-ro-border/60">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-ro-gold" />
          Frequently Asked Questions & Troubleshooting
        </h2>
        <p className="text-xs sm:text-sm text-ro-text-secondary">
          Quick guides on launcher setup, desktop shortcuts, and cost-efficient IP updates.
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
