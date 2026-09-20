import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Tag,
  CreditCard,
  Music,
  Network,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Hash,
  Clock,
  Sparkles,
  Share2,
  Check,
  Disc,
  Volume2,
  Flame,
  Zap,
  Moon,
  Radio,
  FileCheck
} from 'lucide-react';

export default function ReceiptDetailModal({
  receipt,
  onClose,
  relationshipData,
  onNavigateToReceipt
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!receipt) return null;

  // Find all direct connections for this receipt
  const directConnections = (relationshipData?.connections || []).filter(
    c => c.source === receipt.id || c.target === receipt.id
  );

  const isMusic = receipt.source === 'spotify';
  const isTransact = receipt.source === 'indiatransact';
  const dateStr = receipt.rawDate || receipt.timestamp;

  let formattedValue = null;
  if (isMusic) {
    const mins = Math.floor(receipt.amount / 60);
    const secs = receipt.amount % 60;
    formattedValue = `${mins}m ${secs}s`;
  } else if (receipt.amount !== undefined) {
    formattedValue = `₹${receipt.amount.toLocaleString()} ${receipt.currency || 'INR'}`;
  }

  // Gen Z "Vibe Check" / Aura Analysis
  const vibeData = useMemo(() => {
    const isSkipped = receipt.metadata?.skipped || receipt.type?.toLowerCase().includes('skip');
    const ts = receipt.timestamp || receipt.rawDate || '';
    const hour = ts && ts.length >= 13 ? parseInt(ts.slice(11, 13), 10) : 12;
    const isNocturnal = !isNaN(hour) && hour >= 0 && hour <= 4;
    const durationSec = receipt.amount || 0;

    if (isMusic) {
      if (isSkipped && durationSec <= 5) {
        return {
          tag: 'SKIP DEMON',
          emoji: '⚡',
          color: '#F43F5E',
          bg: 'rgba(244, 63, 94, 0.15)',
          border: 'rgba(244, 63, 94, 0.4)',
          desc: `Skipped in ${durationSec}s · Zero tolerance mood`
        };
      }
      if (isNocturnal) {
        return {
          tag: '12 AM INSOMNIA VIBE',
          emoji: '🌙',
          color: '#A855F7',
          bg: 'rgba(168, 85, 247, 0.15)',
          border: 'rgba(168, 85, 247, 0.4)',
          desc: 'Late-night existential listening session'
        };
      }
      if (durationSec >= 240) {
        return {
          tag: 'FULL IMMERSION',
          emoji: '🎧',
          color: '#10B981',
          bg: 'rgba(16, 185, 129, 0.15)',
          border: 'rgba(16, 185, 129, 0.4)',
          desc: `${Math.round(durationSec / 60)} min deep focus stream`
        };
      }
      return {
        tag: 'HEAVY ROTATION',
        emoji: '🔥',
        color: '#F59E0B',
        bg: 'rgba(245, 158, 11, 0.15)',
        border: 'rgba(245, 158, 11, 0.4)',
        desc: 'Core track in personal life soundtrack'
      };
    } else {
      if (receipt.amount >= 2000) {
        return {
          tag: 'BIG SPLURGE ENERGY',
          emoji: '💸',
          color: '#F59E0B',
          bg: 'rgba(245, 158, 11, 0.15)',
          border: 'rgba(245, 158, 11, 0.4)',
          desc: `₹${receipt.amount.toLocaleString()} high-conviction expenditure`
        };
      }
      if (receipt.category?.toLowerCase().includes('food') || receipt.category?.toLowerCase().includes('dining')) {
        return {
          tag: 'FOOD RUN ESSENTIAL',
          emoji: '🍜',
          color: '#EC4899',
          bg: 'rgba(236, 72, 153, 0.15)',
          border: 'rgba(236, 72, 153, 0.4)',
          desc: 'Fueling the daily grind'
        };
      }
      return {
        tag: 'VERIFIED LIFE ANCHOR',
        emoji: '✨',
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.4)',
        desc: 'Everyday lifestyle receipt preserved'
      };
    }
  }, [receipt, isMusic]);

  // Copy Receipt (Receiptify / Share style)
  const handleCopyReceipt = () => {
    const textReceipt = `
╔════════════════════════════════════════╗
║     TRACE · DIGITAL LIFE RECEIPT       ║
║     "Every moment leaves a trace"      ║
╠════════════════════════════════════════╣
║ ITEM:      ${receipt.title}
║ ARTIST:    ${receipt.metadata?.artist || receipt.category}
║ TIMESTAMP: ${receipt.timestamp || receipt.rawDate}
║ PLAY/VAL:  ${formattedValue || 'N/A'}
║ VIBE:      ${vibeData.emoji} ${vibeData.tag}
║ PLATFORM:  ${receipt.mode || 'Mobile'}
║ STATUS:    ${receipt.type || 'Verified Record'}
╠════════════════════════════════════════╣
║ Barcode: ||| | |||| | || ||||| | |||  ║
║ Verified on TRACE · 100% Client-Side   ║
╚════════════════════════════════════════╝
`.trim();
    navigator.clipboard.writeText(textReceipt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-modal-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      
      {/* Ambient Glow Aura */}
      <div
        className="fixed pointer-events-none w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse-subtle"
        style={{ backgroundColor: vibeData.color }}
      />

      {/* Main Ticket / Physical Thermal Receipt Card */}
      <div className="relative bg-gradient-to-b from-[#20201B] via-[#1A1A16] to-[#141411] border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] space-y-6 animate-slide-up text-left my-auto overflow-hidden">
        
        {/* Ticket Notch Cutouts (Left and Right) */}
        <div className="ticket-notch-left" />
        <div className="ticket-notch-right" />

        {/* Top Header: Brand & Close */}
        <div className="flex items-center justify-between border-b border-dashed border-archive-700/80 pb-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-accent animate-ping" />
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-amber-accent uppercase">
                TRACE // LIFE RECEIPT
              </span>
              <span className="text-[10px] font-mono text-archive-500 block leading-none mt-0.5">
                VERIFIED ARCHIVAL RECORD #{receipt.id}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Share / Copy Receipt Button */}
            <button
              onClick={handleCopyReceipt}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-archive-800 hover:bg-archive-750 text-archive-200 hover:text-white border border-archive-700/80 text-xs font-mono transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Copy aesthetic receipt to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied! ✨</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-accent" />
                  <span>Share</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-archive-400 hover:text-white hover:bg-archive-800 border border-transparent hover:border-archive-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Gen Z Vibe Banner */}
        <div
          className="flex items-center justify-between px-4 py-2.5 rounded-2xl border transition-all"
          style={{
            backgroundColor: vibeData.bg,
            borderColor: vibeData.border
          }}
        >
          <div className="flex items-center space-x-2.5">
            <span className="text-xl">{vibeData.emoji}</span>
            <div>
              <div className="text-xs font-mono font-black tracking-wider" style={{ color: vibeData.color }}>
                {vibeData.tag}
              </div>
              <div className="text-[11px] text-archive-300 font-mono">
                {vibeData.desc}
              </div>
            </div>
          </div>

          {/* Animated Equalizer Soundbars for Music */}
          {isMusic && (
            <div className="flex items-end space-x-1 h-5 pl-3">
              <span className="w-1 bg-lavender-accent rounded-full animate-eq-1" />
              <span className="w-1 bg-lavender-accent rounded-full animate-eq-2" />
              <span className="w-1 bg-amber-accent rounded-full animate-eq-3" />
              <span className="w-1 bg-amber-accent rounded-full animate-eq-4" />
              <span className="w-1 bg-sage-accent rounded-full animate-eq-5" />
            </div>
          )}
        </div>

        {/* Visual Hero Feature: Vinyl Record Sleeve (Music) or Holographic Ledger Stamp (Finance) */}
        {isMusic ? (
          <div className="relative flex items-center gap-5 p-4 rounded-2xl bg-black/40 border border-white/5 overflow-hidden">
            
            {/* Vinyl Disc Peeking out */}
            <div className="relative flex-shrink-0 w-24 h-24 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center shadow-2xl animate-spin-vinyl overflow-hidden">
              {/* Concentric Vinyl Grooves */}
              <div className="absolute inset-1 rounded-full border border-neutral-800" />
              <div className="absolute inset-3 rounded-full border border-neutral-800/80" />
              <div className="absolute inset-5 rounded-full border border-neutral-700/60" />
              <div className="absolute inset-7 rounded-full border border-neutral-800/80" />
              
              {/* Spindle Label Center */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-[8px] font-bold text-black font-mono shadow-inner">
                TRACE
              </div>
            </div>

            {/* Song / Album Typography */}
            <div className="min-w-0 flex-1 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-accent font-semibold flex items-center space-x-1">
                <Music className="w-3 h-3" />
                <span>{receipt.metadata?.artist || receipt.subcategory || 'Featured Artist'}</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-tight truncate leading-tight">
                {receipt.title}
              </h3>
              <p className="text-xs text-archive-400 font-mono truncate">
                Album: <span className="text-archive-200">{receipt.metadata?.album || 'Single / Live Session'}</span>
              </p>
              <div className="flex items-center space-x-2 pt-1 text-[11px] font-mono">
                <span className="text-paper font-semibold bg-white/10 px-2 py-0.5 rounded-full">
                  {formattedValue}
                </span>
                <span className="text-archive-400">·</span>
                <span className="text-archive-400">{receipt.mode}</span>
              </div>
            </div>

            {/* Diagonal Rubber Stamp if Skipped */}
            {receipt.metadata?.skipped && (
              <div className="absolute -right-2 top-2 rubber-stamp px-2.5 py-0.5 text-[10px] font-black rounded pointer-events-none opacity-85">
                SKIPPED ⚡
              </div>
            )}
          </div>
        ) : (
          <div className="relative p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1 overflow-hidden">
            <span className="text-[10px] font-mono uppercase tracking-widest text-sage-accent font-semibold flex items-center space-x-1">
              <CreditCard className="w-3 h-3" />
              <span>{receipt.category}</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-tight truncate">
              {receipt.title}
            </h3>
            <p className="text-xs text-archive-300 font-mono">
              {receipt.description}
            </p>
            <div className="text-2xl font-bold font-mono text-amber-accent pt-1">
              {formattedValue}
            </div>

            {/* Diagonal Verified Stamp */}
            <div className="absolute right-4 top-3 rubber-stamp-lavender px-2.5 py-0.5 text-[10px] font-black rounded pointer-events-none opacity-85">
              AUDITED PRIVACY ✓
            </div>
          </div>
        )}

        {/* Itemized Thermal Receipt Slip */}
        <div className="p-4 rounded-2xl bg-[#171714] border border-archive-700/60 font-receipt text-xs space-y-2 relative shadow-inner">
          <div className="text-[10px] uppercase text-archive-500 text-center tracking-widest pb-1 border-b border-dashed border-archive-700">
            * * * TRANSACTION BREAKDOWN * * *
          </div>

          <div className="space-y-1.5 text-archive-300 pt-1">
            <div className="flex justify-between items-center">
              <span className="text-archive-500">TIMESTAMP</span>
              <span className="font-semibold text-paper">{dateStr}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-archive-500">PLAY / AMOUNT</span>
              <span className="font-bold text-amber-accent">{formattedValue || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-archive-500">RECORD TYPE</span>
              <span className="text-paper">{receipt.type || 'Standard Record'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-archive-500">PLATFORM</span>
              <span className="text-paper">{receipt.mode || 'Mobile'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-archive-500">LOCATION</span>
              <span className="text-paper truncate max-w-[200px] text-right">{receipt.location || 'Client Local'}</span>
            </div>
          </div>

          {/* Evidence tags */}
          {receipt.metadata && Object.keys(receipt.metadata).length > 0 && (
            <div className="pt-2 border-t border-dashed border-archive-700/70 flex flex-wrap gap-1.5">
              {Object.entries(receipt.metadata).map(([k, v]) => {
                if (typeof v === 'object' || v === null || v === undefined || v === '') return null;
                return (
                  <span
                    key={k}
                    className="px-2 py-0.5 rounded bg-archive-900 border border-archive-700/80 text-[10px] text-archive-400"
                  >
                    {k}: <strong className="text-archive-200">{String(v)}</strong>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Discovered Connected Receipts (Relationships) */}
        {directConnections.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-mono text-archive-400">
              <span className="flex items-center space-x-1.5">
                <Network className="w-3.5 h-3.5 text-lavender-accent" />
                <span>Connected Moments ({directConnections.length})</span>
              </span>
              <span className="text-[10px] text-archive-500">Click to trace</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {directConnections.slice(0, 4).map((conn) => {
                const targetId = conn.source === receipt.id ? conn.target : conn.source;
                const neighbor = (relationshipData?.nodes || []).find(n => n.id === targetId);

                return (
                  <div
                    key={conn.id}
                    onClick={() => neighbor && onNavigateToReceipt && onNavigateToReceipt(neighbor)}
                    className="p-2.5 rounded-xl bg-archive-900 border border-archive-700/60 hover:border-amber-accent/50 cursor-pointer transition-all flex items-center justify-between text-xs font-mono group"
                  >
                    <div className="truncate mr-2">
                      <div className="text-[10px] text-amber-accent font-semibold truncate">{conn.type}</div>
                      <div className="text-paper font-medium truncate group-hover:text-amber-accent transition-colors">
                        {neighbor ? neighbor.title : targetId}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-archive-500 group-hover:text-amber-accent transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Authentic Sawtooth Barcode & Ticket Footer */}
        <div className="pt-3 border-t border-dashed border-archive-700/80 text-center space-y-2">
          
          {/* Barcode Graphic */}
          <div className="flex items-center justify-center space-x-[2px] sm:space-x-[3px] h-9 py-1 opacity-70 hover:opacity-100 transition-opacity">
            {[4, 1, 3, 2, 5, 2, 1, 4, 3, 1, 2, 4, 1, 5, 2, 3, 1, 4, 2, 3, 5, 1, 2, 4, 3, 1, 2, 5, 1, 4, 2, 3].map((w, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[0.5px]"
                style={{
                  width: `${w}px`,
                  height: idx % 5 === 0 ? '100%' : '80%'
                }}
              />
            ))}
          </div>

          <div className="text-[10px] font-mono tracking-widest text-archive-500">
            * TRACE // {receipt.id} // {receipt.timestamp?.slice(0, 10) || 'LOCAL'} *
          </div>

          <div className="text-[9px] font-mono text-archive-600">
            100% PRIVATE CLIENT-SIDE ARCHIVE • ZERO EXTERNAL TRACKERS
          </div>
        </div>

      </div>
    </div>
  );
}
