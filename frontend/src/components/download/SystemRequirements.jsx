/**
 * System Requirements Table Component
 */
import React from 'react';
import { Monitor, Cpu, MemoryStick, Disc, HardDrive, CheckCircle2 } from 'lucide-react';

export default function SystemRequirements({ reqs }) {
  const min = reqs?.minimum || {
    os: 'Windows 7 / 8 / 10 / 11',
    cpu: 'Intel Pentium 4 2.0 GHz or AMD Athlon XP',
    ram: '1 GB RAM',
    gpu: 'DirectX 9.0c compatible graphics card (128 MB VRAM)',
    storage: '4 GB available space',
    directX: 'Version 9.0c'
  };

  const rec = reqs?.recommended || {
    os: 'Windows 10 / 11 (64-bit)',
    cpu: 'Intel Core i3 / AMD Ryzen 3 or higher',
    ram: '4 GB RAM or more',
    gpu: 'NVIDIA GeForce / AMD Radeon with 1GB+ VRAM',
    storage: '6 GB available space (SSD recommended)',
    directX: 'Version 9.0c / 11'
  };

  return (
    <section className="py-12 border-t border-ro-border/60">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mb-2">
          System Requirements
        </h2>
        <p className="text-xs sm:text-sm text-ro-text-secondary">
          KelsGaming RO runs smoothly on virtually any modern PC or laptop.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Minimum Specs */}
        <div className="ro-card p-6 rounded-xl border border-ro-border">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-ro-border">
            <Monitor className="w-5 h-5 text-ro-text-secondary" />
            <h3 className="font-cinzel text-lg font-bold text-white">
              Minimum Specifications
            </h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-1.5 border-b border-ro-border/40">
              <span className="text-ro-text-muted">Operating System</span>
              <span className="font-medium text-white">{min.os}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-ro-border/40">
              <span className="text-ro-text-muted">Processor</span>
              <span className="font-medium text-white">{min.cpu}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-ro-border/40">
              <span className="text-ro-text-muted">System Memory</span>
              <span className="font-medium text-white">{min.ram}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-ro-border/40">
              <span className="text-ro-text-muted">Graphics</span>
              <span className="font-medium text-white">{min.gpu}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-ro-border/40">
              <span className="text-ro-text-muted">Hard Drive</span>
              <span className="font-medium text-white">{min.storage}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-ro-text-muted">DirectX</span>
              <span className="font-medium text-white">{min.directX}</span>
            </div>
          </div>
        </div>

        {/* Recommended Specs */}
        <div className="ro-card p-6 rounded-xl border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              <h3 className="font-cinzel text-lg font-bold text-white">
                Recommended Specifications
              </h3>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              60 FPS / WoE
            </span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-1.5 border-b border-amber-500/10">
              <span className="text-ro-text-secondary">Operating System</span>
              <span className="font-medium text-amber-200">{rec.os}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-amber-500/10">
              <span className="text-ro-text-secondary">Processor</span>
              <span className="font-medium text-amber-200">{rec.cpu}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-amber-500/10">
              <span className="text-ro-text-secondary">System Memory</span>
              <span className="font-medium text-amber-200">{rec.ram}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-amber-500/10">
              <span className="text-ro-text-secondary">Graphics</span>
              <span className="font-medium text-amber-200">{rec.gpu}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-amber-500/10">
              <span className="text-ro-text-secondary">Hard Drive</span>
              <span className="font-medium text-amber-200">{rec.storage}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-ro-text-secondary">DirectX</span>
              <span className="font-medium text-amber-200">{rec.directX}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
