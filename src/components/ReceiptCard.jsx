import React from 'react';
import { Network, Calendar, MapPin, Tag, CreditCard, Music, ArrowUpRight } from 'lucide-react';

export default function ReceiptCard({
  receipt,
  onSelectReceipt,
  connectionCount = 0,
  searchQuery = ''
}) {
  const isMusic = receipt.source === 'spotify';
  const isTransact = receipt.source === 'indiatransact';

  // Format timestamp
  const dateStr = receipt.rawDate || receipt.timestamp;
  const displayDate = dateStr ? dateStr.slice(0, 10) : 'Archive Date';
  const displayTime = dateStr && dateStr.length > 10 ? dateStr.slice(11, 16) : null;

  // Format amount or duration
  let valueLabel = null;
  if (isMusic) {
    const mins = Math.floor(receipt.amount / 60);
    const secs = receipt.amount % 60;
    valueLabel = `${mins}m ${secs}s`;
  } else if (receipt.amount !== undefined) {
    valueLabel = `₹${receipt.amount.toLocaleString()}`;
  }

  return (
    <div
      onClick={() => onSelectReceipt(receipt)}
      className="group relative bg-archive-850 hover:bg-archive-800 border border-archive-700/60 hover:border-amber-accent/50 rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-glow-amber text-left"
    >
      {/* Top Header: ID & Timestamp */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-mono text-archive-400 mb-2 border-b border-archive-700/40 pb-2">
          <span className="flex items-center space-x-1">
            <span className="text-amber-accent/80 font-bold">#</span>
            <span className="truncate max-w-[90px]">{receipt.id}</span>
          </span>
          <span className="flex items-center space-x-1 text-archive-300">
            <Calendar className="w-3 h-3 text-archive-400" />
            <span>{displayDate}</span>
            {displayTime && <span className="text-archive-400 text-[10px]">@{displayTime}</span>}
          </span>
        </div>

        {/* Category & Badge */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="inline-flex items-center space-x-1 text-[11px] font-mono px-2 py-0.5 rounded bg-archive-800 border border-archive-700 text-archive-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-accent" />
            <span className="truncate max-w-[120px]">{receipt.category}</span>
          </span>

          <div className="flex items-center space-x-1">
            {receipt.metadata?.skipped && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/15 text-rose-300 border border-rose-500/30">
                ⚡ Skipped
              </span>
            )}
            {connectionCount > 0 && (
              <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-lavender-accent/15 text-lavender-light border border-lavender-accent/30 font-medium">
                <Network className="w-2.5 h-2.5 text-lavender-accent" />
                <span>{connectionCount} linked</span>
              </span>
            )}
          </div>
        </div>

        {/* Title / Description */}
        <h4 className="font-semibold text-sm text-paper group-hover:text-amber-accent transition-colors line-clamp-1 mb-1">
          {receipt.title}
        </h4>
        <p className="text-xs text-archive-400 line-clamp-2 leading-relaxed mb-3">
          {receipt.description}
        </p>
      </div>

      {/* Card Footer: Amount/Duration, Mode, Location */}
      <div className="pt-2.5 border-t border-archive-700/40 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          {valueLabel && (
            <span className="font-bold text-paper text-sm">
              {valueLabel}
            </span>
          )}
          <span className="text-[10px] text-archive-400 px-1.5 py-0.5 rounded bg-archive-900 border border-archive-700/60 truncate max-w-[100px]">
            {receipt.mode}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-archive-400 group-hover:text-amber-accent transition-colors">
          <span className="text-[11px] hidden sm:inline">Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
