/**
 * Detailed Item Encyclopedia Inspector Modal
 * Displays complete stats, collection art, allowed jobs, equip locations, and rAthena script effects.
 */
import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Sword,
  Shield,
  Coins,
  Package,
  Layers,
  Send,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Code2,
  Users,
  Compass
} from 'lucide-react';
import ItemSprite from '../common/ItemSprite';
import { useNavigate } from 'react-router-dom';

export default function ItemDetailModal({
  item,
  isOpen,
  onClose,
  onEditCustom,
  onDeleteCustom
}) {
  const navigate = useNavigate();
  const [collectionError, setCollectionError] = useState(false);

  if (!isOpen || !item) return null;

  const handleDispatchRedirect = () => {
    onClose();
    navigate(`/admin/dispatch?itemId=${item.itemId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="ro-card bg-gradient-to-b from-ro-surface via-ro-card to-ro-bg w-full max-w-2xl rounded-2xl border-2 border-ro-gold/40 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-ro-border/80 pb-4">
          <div className="flex items-center gap-4">
            <ItemSprite
              itemId={item.itemId}
              itemType={item.type}
              size="xl"
              className="border-2 border-ro-gold/50 shadow-lg bg-ro-bg p-1"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-cinzel text-xl font-bold text-white">
                  {item.name}
                </h2>
                {item.isCustom && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-yellow-300 text-black shadow-gold-glow">
                    ✨ CUSTOM ITEM
                  </span>
                )}
                {item.refineable && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Refineable
                  </span>
                )}
              </div>
              <p className="text-xs text-ro-text-muted font-mono mt-0.5">
                AegisName: <span className="text-amber-300">{item.aegisName}</span> &bull; ID: <span className="text-ro-gold font-bold">#{item.itemId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-ro-bg hover:bg-ro-card text-ro-text-muted hover:text-white border border-ro-border transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Split: Stats Grid & Collection Illustration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Collection Art Card */}
          <div className="p-3 rounded-xl bg-ro-bg/80 border border-ro-border flex flex-col items-center justify-center text-center">
            {!collectionError ? (
              <img
                src={item.collectionUrl || `https://static.divine-pride.net/images/items/collection/${item.itemId}.png`}
                alt={item.name}
                onError={() => setCollectionError(true)}
                className="max-h-32 object-contain drop-shadow-md rounded"
              />
            ) : (
              <ItemSprite itemId={item.itemId} itemType={item.type} size="xl" />
            )}
            <span className="text-[10px] text-ro-text-muted font-mono mt-2 block">
              Type: <strong className="text-white capitalize">{item.type} {item.subType ? `(${item.subType})` : ''}</strong>
            </span>
          </div>

          {/* Core Combat & Property Stats */}
          <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Attack (Atk)</span>
              <span className="font-mono text-base font-bold text-red-400">{item.attack || 0}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Magic Attack</span>
              <span className="font-mono text-base font-bold text-sky-400">{item.magicAttack || 0}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Defense (Def)</span>
              <span className="font-mono text-base font-bold text-emerald-400">{item.defense || 0}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Card Slots</span>
              <span className="font-mono text-base font-bold text-amber-300">
                {item.slots > 0 ? `[${item.slots}] Slots` : 'No Slots'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Weight</span>
              <span className="font-mono text-base font-bold text-gray-300">{item.weight || 0}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Level Req</span>
              <span className="font-mono text-base font-bold text-purple-300">
                {item.equipLevelMin > 0 ? `Lv ${item.equipLevelMin}+` : 'Lv 1'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Weapon Lv</span>
              <span className="font-mono text-sm font-bold text-gray-300">{item.weaponLevel || '-'}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Buy Price</span>
              <span className="font-mono text-sm font-bold text-ro-gold">{item.buy ? `${item.buy.toLocaleString()} Z` : 'N/A'}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-ro-surface/80 border border-ro-border">
              <span className="text-[10px] font-bold text-ro-text-muted uppercase block">Attack Range</span>
              <span className="font-mono text-sm font-bold text-gray-300">{item.range || 1} Cell</span>
            </div>
          </div>
        </div>

        {/* Equip Locations */}
        {item.locations && item.locations.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-ro-text-muted block flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-ro-gold" /> Equipment Position / Placement:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {item.locations.map((loc) => (
                <span
                  key={loc}
                  className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/30 text-xs font-semibold"
                >
                  🛡️ {loc.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Job Eligibility */}
        {item.jobs && item.jobs.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-ro-text-muted block flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-ro-gold" /> Allowed Character Classes:
            </span>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 rounded-xl bg-ro-bg/60 border border-ro-border">
              {item.jobs.map((job) => (
                <span
                  key={job}
                  className="px-2 py-0.5 rounded bg-ro-card text-gray-300 border border-ro-border text-[10px] font-medium"
                >
                  {job}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* rAthena Bonus Script Effects */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-ro-gold block flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-ro-gold" /> rAthena Script Execution / Bonus Effects:
          </span>
          {item.script ? (
            <pre className="p-3.5 rounded-xl bg-black/90 border border-ro-border text-emerald-400 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner max-h-40">
              {item.script}
            </pre>
          ) : (
            <div className="p-3 rounded-xl bg-ro-bg border border-ro-border text-xs text-ro-text-muted italic">
              No special passive scripts attached to this item.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-ro-border/80">
          <div className="flex items-center gap-2">
            {item.isCustom && (
              <>
                <button
                  type="button"
                  onClick={() => { onClose(); onEditCustom && onEditCustom(item); }}
                  className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Custom Item</span>
                </button>

                <button
                  type="button"
                  onClick={() => { onClose(); onDeleteCustom && onDeleteCustom(item); }}
                  className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-ro-card hover:bg-ro-bg text-ro-text-secondary hover:text-white border border-ro-border transition-all"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleDispatchRedirect}
              className="btn-gold !py-2 !px-4 text-xs font-cinzel font-bold shadow-gold-glow flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch to Player</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
