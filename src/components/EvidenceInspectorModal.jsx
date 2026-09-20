import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

export default function EvidenceInspectorModal({
  selectedConnection,
  onClose,
  onSelectReceipt,
  allNodesMap = {}
}) {
  if (!selectedConnection) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-inspector-title"
      className="fixed inset-0 z-50 bg-archive-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-archive-850 border border-amber-accent/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-slide-up relative text-left">
        
        <div className="flex items-center justify-between border-b border-archive-700/60 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-amber-accent/20 text-amber-accent">
              <Sparkles className="w-4 h-4" />
            </span>
            <span id="evidence-inspector-title" className="font-mono text-xs uppercase tracking-wider text-amber-accent font-bold">
              Connection Evidence Inspector
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Connection Evidence Inspector"
            className="text-archive-400 hover:text-white font-mono text-sm px-2 py-1 rounded bg-archive-900 border border-archive-700 cursor-pointer"
          >
            ✕ Close
          </button>
        </div>

        <div>
          <span className="text-xs font-mono text-archive-400">Relationship Classification:</span>
          <h3 className="text-xl font-editorial font-bold text-paper mt-0.5">
            {selectedConnection.type}
          </h3>
        </div>

        {/* Evidence Facts List */}
        <div className="space-y-2 bg-archive-900 p-4 rounded-xl border border-archive-700/70">
          <span className="text-xs font-mono uppercase text-sage-accent font-semibold block">
            Observed Dataset Facts (Evidence):
          </span>
          <ul className="space-y-1.5 text-xs text-archive-300 font-mono">
            {selectedConnection.evidence?.map((ev, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-amber-accent font-bold">›</span>
                <span>{ev}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cautious Analytical Interpretation */}
        <div className="space-y-1.5 bg-archive-900/60 p-4 rounded-xl border border-archive-700/60">
          <span className="text-xs font-mono uppercase text-lavender-accent font-semibold block">
            Cautious Analytical Interpretation:
          </span>
          <p className="text-xs text-archive-300 leading-relaxed font-sans italic">
            “{selectedConnection.interpretation}”
          </p>
        </div>

        {/* Interactive Inspector Links */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs font-mono text-archive-400 border-t border-archive-700/50">
          <span>Statistical Confidence: <strong className="text-amber-accent">{selectedConnection.confidence}%</strong></span>
          <div className="flex items-center space-x-2">
            {onSelectReceipt && allNodesMap[selectedConnection.source] && (
              <button
                type="button"
                onClick={() => {
                  onSelectReceipt(allNodesMap[selectedConnection.source]);
                  onClose();
                }}
                className="inline-flex items-center space-x-1 text-paper hover:text-amber-accent font-semibold transition-colors cursor-pointer"
              >
                <span>Inspect Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            {onSelectReceipt && allNodesMap[selectedConnection.target] && (
              <button
                type="button"
                onClick={() => {
                  onSelectReceipt(allNodesMap[selectedConnection.target]);
                  onClose();
                }}
                className="inline-flex items-center space-x-1 text-paper hover:text-amber-accent font-semibold transition-colors cursor-pointer"
              >
                <span>Inspect Target</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
