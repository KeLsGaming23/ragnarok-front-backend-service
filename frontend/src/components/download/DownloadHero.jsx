/**
 * Game Client Download Cards & Google Drive Host Component
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
  FileArchive, 
  FolderCheck, 
  RefreshCw 
} from 'lucide-react';

export default function DownloadHero({ downloadData }) {
  const [copied, setCopied] = React.useState(false);

  const googleDriveLink = 'https://drive.google.com/file/d/1MaeJbH7gIZErQ9hTETIQf9PyOwso4tLQ/view?usp=sharing';
  const fullClient = downloadData?.fullClient;
  const downloadUrl = fullClient?.mirrors?.[0]?.url || googleDriveLink;

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
            Google Drive Hosted Client &bull; v1.2.0
          </span>
        </div>
        <h1 className="font-cinzel text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Download KelsGaming RO Client
        </h1>
        <p className="text-sm sm:text-base text-ro-text-secondary leading-relaxed">
          Pre-configured for our AWS EC2 game server (<code className="text-amber-300 font-mono">3.107.209.130</code>). Hosted on high-speed Google Drive for fast, unlimited downloads.
        </p>
      </div>

      {/* Main Download Options Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Full Client Card (Featured / 2 columns wide on LG) */}
        <div className="lg:col-span-2 ro-card p-6 sm:p-8 rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-ro-surface to-ro-card shadow-2xl relative overflow-hidden flex flex-col justify-between">
          
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-black font-extrabold text-xs px-4 py-1.5 rounded-bl-xl shadow-md uppercase tracking-wider">
            Official Google Drive Host
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40">
                <FileArchive className="w-7 h-7 text-ro-gold" />
              </div>
              <div>
                <h2 className="font-cinzel text-2xl font-bold text-white">
                  Ragnarok-Configured-Client.zip
                </h2>
                <p className="text-xs text-ro-text-secondary">
                  Complete Standalone Package &bull; Size: <strong className="text-white">1.85 GB</strong> &bull; Google Drive
                </p>
              </div>
            </div>

            <p className="text-sm text-ro-text-secondary mb-5 leading-relaxed">
              Contains the complete game client with all sound assets, BGM, and pre-patched executable:
              <br />
              <code className="text-amber-300 font-mono text-xs block mt-1.5 p-2 rounded bg-ro-bg border border-ro-border truncate">
                Ragnarok-Configured-Client\2025-06-04_Ragexe_1748494356_clientinfo.xml_patched.exe
              </code>
            </p>

            {/* Direct High-Speed Download CTA */}
            <div className="mb-6">
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full !py-4 text-base font-extrabold flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-5 h-5" />
                <span>Download via Google Drive (1.85 GB)</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* IP Maintenance Note */}
            <div className="p-4 rounded-xl bg-ro-bg/80 border border-ro-border/80 mb-6 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <RefreshCw className="w-4 h-4 text-ro-gold shrink-0" />
                <span>Cost-Efficient Dynamic IP Notice — No Redownload Needed!</span>
              </div>
              <p className="text-xs text-ro-text-secondary leading-relaxed">
                If the server IP updates in the future, you <strong className="text-white">DO NOT</strong> need to redownload the client. Simply open <code className="text-amber-300 font-mono">Ragnarok-Configured-Client\data\clientinfo.xml</code> in Notepad, change <code className="text-sky-300 font-mono">&lt;address&gt;3.107.209.130&lt;/address&gt;</code> to the new server IP, and save!
              </p>
            </div>
          </div>

          {/* Checksum Verification Box */}
          <div className="p-3.5 rounded-lg bg-ro-bg/60 border border-ro-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-ro-text-muted">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-mono truncate max-w-[280px] sm:max-w-md">
                Package: Ragnarok-Configured-Client.zip
              </span>
            </div>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-ro-gold hover:text-amber-300 font-medium shrink-0"
            >
              <span>Open Drive Folder</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Quick Launch & Shortcut Guide Card */}
        <div className="ro-card p-6 sm:p-8 rounded-2xl border border-ro-border bg-gradient-to-b from-ro-surface to-ro-card shadow-xl flex flex-col justify-between">
          <div>
            <div className="p-3 rounded-xl bg-sky-500/20 border border-sky-500/40 w-fit mb-4">
              <FolderCheck className="w-6 h-6 text-ro-crystal" />
            </div>

            <h3 className="font-cinzel text-xl font-bold text-white mb-2">
              Launcher Guide
            </h3>
            <p className="text-xs text-ro-text-secondary mb-4 leading-relaxed">
              After extracting the ZIP, run the patched executable:
            </p>

            <div className="space-y-3 mb-6">
              <div className="p-3 rounded-lg bg-ro-bg border border-ro-border">
                <span className="text-[11px] font-bold text-ro-gold uppercase tracking-wider block mb-1">
                  1. Target Folder
                </span>
                <code className="text-xs text-white font-mono block truncate">
                  Ragnarok-Configured-Client/
                </code>
              </div>

              <div className="p-3 rounded-lg bg-ro-bg border border-ro-border">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  2. Run Executable
                </span>
                <code className="text-xs text-emerald-300 font-mono block break-all">
                  2025-06-04_Ragexe_1748494356_clientinfo.xml_patched.exe
                </code>
              </div>

              <div className="p-3 rounded-lg bg-ro-bg border border-ro-border">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
                  3. Desktop Shortcut Tip
                </span>
                <p className="text-xs text-ro-text-secondary">
                  Right-click the .exe &rarr; <em>Send to &rarr; Desktop (create shortcut)</em> for fast 1-click launching!
                </p>
              </div>
            </div>
          </div>

          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-crystal w-full !py-3 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download on Google Drive</span>
          </a>
        </div>

      </div>

    </div>
  );
}
