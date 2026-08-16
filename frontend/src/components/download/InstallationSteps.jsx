/**
 * Visual Installation Steps Component
 */
import React from 'react';
import { Download, FolderArchive, PlayCircle, Gamepad2 } from 'lucide-react';

export default function InstallationSteps() {
  const steps = [
    {
      num: '01',
      title: 'Download from Google Drive',
      desc: 'Grab Ragnarok-Configured-Client.zip (~1.85 GB) from our high-speed Google Drive link.',
      icon: <Download className="w-6 h-6 text-amber-400" />
    },
    {
      num: '02',
      title: 'Extract Folder',
      desc: 'Extract the ZIP file. You will get the folder "Ragnarok-Configured-Client" with all pre-configured game files.',
      icon: <FolderArchive className="w-6 h-6 text-sky-400" />
    },
    {
      num: '03',
      title: 'Run Game Executable',
      desc: 'Open the folder and run "2025-06-04_Ragexe_1748494356_clientinfo.xml_patched.exe". (Right-click to create a desktop shortcut!)',
      icon: <PlayCircle className="w-6 h-6 text-emerald-400" />
    },
    {
      num: '04',
      title: 'Login & Start Playing',
      desc: 'Enter your registered username and password. You are now ready to conquer Midgard!',
      icon: <Gamepad2 className="w-6 h-6 text-purple-400" />
    }
  ];

  return (
    <section className="py-12 border-t border-ro-border/60">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mb-2">
          How to Play in 4 Easy Steps
        </h2>
        <p className="text-xs sm:text-sm text-ro-text-secondary">
          Pre-configured client — extract, launch executable, and enter the world of KelsGaming RO.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="ro-card p-6 rounded-xl border border-ro-border relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-3 right-4 font-cinzel text-3xl font-black text-white/5 select-none">
              {step.num}
            </div>

            <div>
              <div className="w-12 h-12 rounded-lg bg-ro-bg flex items-center justify-center mb-4 border border-ro-border">
                {step.icon}
              </div>
              <h3 className="font-cinzel text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-ro-gold text-xs font-mono">{step.num}.</span>
                {step.title}
              </h3>
              <p className="text-xs text-ro-text-secondary leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
