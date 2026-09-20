import React, { useState, useMemo } from 'react';
import { GitCompare, Calendar, ArrowRight, TrendingUp, Sparkles, X, Layers } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function EraComparisonModal({
  isOpen,
  onClose,
  records = [],
  activeAdapter
}) {
  if (!isOpen) return null;

  const years = useMemo(() => {
    const set = new Set();
    records.forEach(r => {
      const y = r.timestamp?.slice(0, 4) || r.rawDate?.match(/\b(19\d\d|20\d\d)\b/)?.[0];
      if (y) set.add(y);
    });
    return Array.from(set).sort();
  }, [records]);

  const defaultEraA = years[0] || '2017';
  const defaultEraB = years[years.length - 1] || '2021';

  const [eraA, setEraA] = useState(defaultEraA);
  const [eraB, setEraB] = useState(defaultEraB);

  const computeEraStats = (year) => {
    const eraRecords = records.filter(r => (r.timestamp?.slice(0, 4) === year || r.rawDate?.includes(year)));
    const totalAmount = eraRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
    
    // Category distribution
    const catCounts = {};
    eraRecords.forEach(r => {
      const c = r.category || 'Other';
      catCounts[c] = (catCounts[c] || 0) + 1;
    });
    const topCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

    // Mode / Platform distribution
    const modeCounts = {};
    eraRecords.forEach(r => {
      const m = r.mode || 'Standard';
      modeCounts[m] = (modeCounts[m] || 0) + 1;
    });
    const topMode = Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0] || ['None', 0];

    return {
      count: eraRecords.length,
      totalAmount,
      topCategory: topCategory[0],
      topCategoryCount: topCategory[1],
      topMode: topMode[0],
      topModeCount: topMode[1]
    };
  };

  const statsA = useMemo(() => computeEraStats(eraA), [eraA, records]);
  const statsB = useMemo(() => computeEraStats(eraB), [eraB, records]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="era-comparison-title"
      className="fixed inset-0 z-50 bg-archive-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-archive-900 border border-amber-accent/50 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-slide-up text-left">
        
        <div className="flex items-center justify-between border-b border-archive-700/60 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-accent/15 text-amber-accent border border-amber-accent/30">
              <GitCompare className="w-4 h-4" />
            </span>
            <div>
              <h3 id="era-comparison-title" className="font-editorial text-lg text-paper font-semibold">
                Chrono-Era Behavioral Synthesizer
              </h3>
              <p className="text-[11px] font-mono text-archive-400">
                Contrast habits, transaction velocities, and lifestyle shifts across time horizons.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-archive-400 hover:text-white p-1 rounded-lg hover:bg-archive-800 transition-colors cursor-pointer"
            aria-label="Close Era Comparison"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Era Selectors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-archive-850 rounded-xl border border-archive-700/60 space-y-1.5">
            <label className="text-[11px] font-mono text-archive-400 block font-semibold">
              Baseline Era A:
            </label>
            <select
              value={eraA}
              onChange={(e) => setEraA(e.target.value)}
              className="w-full bg-archive-900 border border-archive-700 rounded-lg p-2 text-xs font-mono text-paper focus:outline-none focus:border-amber-accent"
            >
              {years.map(y => (
                <option key={`a-${y}`} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-archive-850 rounded-xl border border-archive-700/60 space-y-1.5">
            <label className="text-[11px] font-mono text-archive-400 block font-semibold">
              Comparison Era B:
            </label>
            <select
              value={eraB}
              onChange={(e) => setEraB(e.target.value)}
              className="w-full bg-archive-900 border border-archive-700 rounded-lg p-2 text-xs font-mono text-paper focus:outline-none focus:border-amber-accent"
            >
              {years.map(y => (
                <option key={`b-${y}`} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparative Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          
          <div className="p-3.5 rounded-xl bg-archive-850 border border-archive-700/60 text-center space-y-1">
            <div className="text-[10px] text-archive-400 uppercase tracking-wider">Record Volume</div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-paper font-bold text-sm">{statsA.count}</span>
              <ArrowRight className="w-3.5 h-3.5 text-archive-500" />
              <span className="text-amber-accent font-bold text-sm">{statsB.count}</span>
            </div>
            <div className="text-[10px] text-archive-400">
              {statsB.count > statsA.count ? `+${Math.round(((statsB.count - statsA.count) / Math.max(1, statsA.count)) * 100)}% velocity` : 'Contracted'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-archive-850 border border-archive-700/60 text-center space-y-1">
            <div className="text-[10px] text-archive-400 uppercase tracking-wider">Primary Habit</div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-paper font-bold text-xs truncate max-w-[45%]">{statsA.topCategory}</span>
              <ArrowRight className="w-3.5 h-3.5 text-archive-500 flex-shrink-0" />
              <span className="text-sage-accent font-bold text-xs truncate max-w-[45%]">{statsB.topCategory}</span>
            </div>
            <div className="text-[10px] text-archive-400">Dominant footprint</div>
          </div>

          <div className="p-3.5 rounded-xl bg-archive-850 border border-archive-700/60 text-center space-y-1">
            <div className="text-[10px] text-archive-400 uppercase tracking-wider">Settlement Mode</div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-paper font-bold text-xs truncate max-w-[45%]">{statsA.topMode}</span>
              <ArrowRight className="w-3.5 h-3.5 text-archive-500 flex-shrink-0" />
              <span className="text-lavender-accent font-bold text-xs truncate max-w-[45%]">{statsB.topMode}</span>
            </div>
            <div className="text-[10px] text-archive-400">Channel migration</div>
          </div>

        </div>

        {/* Synthesis Narrative Box */}
        <div className="p-4 rounded-xl bg-archive-950/60 border border-archive-800 space-y-1.5 font-sans">
          <div className="flex items-center space-x-1.5 text-amber-accent text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Behavioral Delta Synthesis</span>
          </div>
          <p className="text-xs text-archive-300 leading-relaxed italic">
            Transitioning from <strong className="text-paper font-semibold">{eraA}</strong> to <strong className="text-paper font-semibold">{eraB}</strong> reveals an observable migration in behavioral footprint. In {eraA}, activities centered predominantly on <strong className="text-amber-light">{statsA.topCategory}</strong> via {statsA.topMode}. By {eraB}, routines evolved toward <strong className="text-sage-light">{statsB.topCategory}</strong>, illustrating the generational shifts across human personal archives.
          </p>
        </div>

      </div>
    </div>
  );
}
