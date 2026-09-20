import React from 'react';
import { Sparkles, X, ExternalLink } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function NodeInspectorHUD({
  activeSelectedNode,
  activeNodeConnections = [],
  allNodesMap = {},
  onClose,
  onSelectReceipt,
  onConnectionClick
}) {
  if (!activeSelectedNode) return null;

  return (
    <div className="absolute bottom-16 right-4 max-w-sm w-full bg-archive-900/95 backdrop-blur-md border border-amber-accent/50 rounded-xl p-4 shadow-2xl z-20 animate-slide-up text-left space-y-3">
      <div className="flex items-center justify-between border-b border-archive-700/60 pb-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-amber-accent font-semibold flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Selected Node Inspector</span>
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-archive-400 hover:text-white p-1 rounded hover:bg-archive-800 transition-colors"
          aria-label="Close Inspector"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div>
        <h4 className="font-editorial text-base text-paper font-semibold leading-tight">
          {activeSelectedNode.title}
        </h4>
        <div className="flex items-center space-x-2 mt-1.5 text-xs font-mono">
          <span
            className="px-2 py-0.5 rounded text-[10px] font-semibold border"
            style={{
              color: activeSelectedNode.color,
              borderColor: `${activeSelectedNode.color}40`,
              backgroundColor: `${activeSelectedNode.color}15`
            }}
          >
            {activeSelectedNode.category || 'General'}
          </span>
          {activeSelectedNode.rawDate && (
            <span className="text-archive-400">{activeSelectedNode.rawDate.slice(0, 10)}</span>
          )}
          {activeSelectedNode.amount !== undefined && activeSelectedNode.amount !== null && (
            <span className="text-amber-light font-bold">
              {formatCurrency(activeSelectedNode.amount)}
            </span>
          )}
        </div>
      </div>

      {/* Active Connections List */}
      <div className="text-xs font-mono text-archive-400">
        <span className="text-archive-300 font-medium">
          {activeNodeConnections.length} Connected Relationship{activeNodeConnections.length === 1 ? '' : 's'}:
        </span>
        <div className="mt-1.5 space-y-1 max-h-24 overflow-y-auto pr-1">
          {activeNodeConnections.slice(0, 4).map(c => {
            const otherId = c.source === activeSelectedNode.id ? c.target : c.source;
            const otherNode = allNodesMap[otherId] || { title: otherId };
            return (
              <div
                key={c.id}
                onClick={() => onConnectionClick && onConnectionClick(c)}
                className="p-1.5 rounded bg-archive-800 hover:bg-archive-750 border border-archive-700/60 cursor-pointer flex items-center justify-between text-[11px] group"
              >
                <span className="truncate max-w-[75%] text-paper group-hover:text-amber-accent">
                  › {otherNode.title}
                </span>
                <span className="text-amber-accent/80 text-[10px]">{c.confidence}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action to view full details modal */}
      {onSelectReceipt && (
        <button
          type="button"
          onClick={() => onSelectReceipt(activeSelectedNode)}
          className="w-full py-1.5 px-3 rounded-lg bg-amber-accent/15 hover:bg-amber-accent/25 border border-amber-accent/40 text-amber-accent hover:text-amber-light text-xs font-mono font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <span>Open Full Receipt Details</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
