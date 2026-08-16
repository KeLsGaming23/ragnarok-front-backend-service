/**
 * Game Client Download Cards & Mirrors Component
 */
import React from 'react';
import { 
  Download, 
  HardDrive, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  FileArchive 
} from 'lucide-react';

export default function DownloadHero({ downloadData }) {
  const [copied, setCopied] = React.useState(false);

  const fullClient = downloadData?.fullClient;
  const litePatch = downloadData?.litePatch;

  const handleCopySha = (sha) => {
    if (!sha) return;
    navigator.clipboard.writeText(sha);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      
      {/* Page Headline */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ro-card border border-ro-border mb-4">
          <Sparkles className="w-4 h-4 text-ro-gold" />
          <span className="text-xs font-semibold uppercase tracking-wider text-ro-gold">
            Pre-Configured Client v1.2.0
          </span>
        </div>
        <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Download KelsGaming RO Client
        </h1>
        <p className="text-sm sm:text-base text-ro-text-secondary leading-relaxed">
          Pre-configured for our AWS EC2 game server (<code className="text-amber-300 font-mono">54.253.142.107</code>). No manual XML tweaking or IP changes required. Just download, extract, and start playing!
        </p>
      </div>

      {/* Main Download Options Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Full Client Card (Featured / 2 columns wide on LG) */}
        <div className="lg:col-span-2 ro-card p-6 sm:p-8 rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-ro-surface to-ro-card shadow-2xl relative overflow-hidden flex flex-col justify-between">
          
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-black font-extrabold text-xs px-4 py-1.5 rounded-bl-xl shadow-md uppercase tracking-wider">
            Recommended for All Players
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40">
                <FileArchive className="w-7 h-7 text-ro-gold" />
              </div>
              <div>
                <h2 className="font-cinzel text-2xl font-bold text-white">
                  Full Standalone Game Client
                </h2>
                <p className="text-xs text-ro-text-secondary">
                  Complete package &bull; Size: <strong className="text-white">{fullClient?.fileSize || '1.85 GB'}</strong> &bull; Version 1.2.0
                </p>
              </div>
            </div>

            <p className="text-sm text-ro-text-secondary mb-6 leading-relaxed">
              Includes all Ragnarok sound effects, full BGM library, custom sprites, Gepard 3.0 protection, and pre-configured <code className="text-amber-300 font-mono">KelsGamingRO.exe</code> ready to connect.
            </p>

            {/* Direct High-Speed Download CTA */}
            <div className="mb-6">
              <a
                href={fullClient?.mirrors?.[0]?.url || '#'}
                className="btn-gold w-full !py-4 text-base font-extrabold flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-5 h-5" />
                <span>Download Full Client ({fullClient?.fileSize || '1.85 GB'})</span>
              </a>
            </div>

            {/* Alternative Cloud Mirrors */}
            <div className="space-y-2 mb-6">
              <span className="text-xs font-semibold text-ro-text-muted uppercase tracking-wider block">
                Alternative Cloud Mirrors:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {fullClient?.mirrors?.slice(1).map((mirror, idx) => (
                  <a
                    key={idx}
                    href={mirror.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-ro-bg/80 hover:bg-ro-card-hover border border-ro-border hover:border-ro-gold/40 text-xs font-medium text-ro-text-primary transition-colors"
                  >
                    <span>{mirror.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-ro-gold" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Checksum Verification Box */}
          <div className="p-3.5 rounded-lg bg-ro-bg/60 border border-ro-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-ro-text-muted">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-mono truncate max-w-[280px] sm:max-w-md">
                SHA256: {fullClient?.sha256 || 'e3b0c44298fc1c149afbf4c8996fb924...'}
              </span>
            </div>
            <button
              onClick={() => handleCopySha(fullClient?.sha256)}
              className="flex items-center gap-1 text-ro-gold hover:text-amber-300 font-medium shrink-0"
              title="Copy Checksum"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Hash'}</span>
            </button>
          </div>

        </div>

        {/* Lite Patch Card */}
        <div className="ro-card p-6 sm:p-8 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl flex flex-col justify-between">
          <div>
            <div className="p-3 rounded-xl bg-sky-500/20 border border-sky-500/40 w-fit mb-4">
              <HardDrive className="w-6 h-6 text-ro-crystal" />
            </div>

            <h3 className="font-cinzel text-xl font-bold text-white mb-1">
              Lite Patch Installer
            </h3>
            <p className="text-xs text-ro-text-secondary mb-4">
              For players with existing kRO &bull; Size: <strong className="text-white">{litePatch?.fileSize || '45.2 MB'}</strong>
            </p>

            <p className="text-xs sm:text-sm text-ro-text-secondary leading-relaxed mb-6">
              Contains only KelsGaming RO data GRFs, custom palettes, and launcher. Requires an existing clean Ragnarok client data folder.
            </p>

            <div className="space-y-3 mb-6">
              {litePatch?.mirrors?.map((mirror, idx) => (
                <a
                  key={idx}
                  href={mirror.url}
                  className="btn-secondary w-full !py-3 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-ro-gold" />
                  <span>{mirror.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/80 leading-relaxed">
            Note: If you encounter missing sound or sprite errors with the Lite Patch, please download the Full Standalone Client.
          </div>
        </div>

      </div>

    </div>
  );
}
