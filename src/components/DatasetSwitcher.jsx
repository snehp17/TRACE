import React from 'react';
import { ALL_ADAPTERS } from '../data/dataRegistry';
import { Receipt, Music, CreditCard, Layers, Calendar, Database } from 'lucide-react';

const ICON_MAP = {
  Receipt: Receipt,
  Music: Music,
  CreditCard: CreditCard
};

export default function DatasetSwitcher({ activeSourceId, onSelectSource }) {
  return (
    <div className="bg-archive-850 border border-archive-700/60 rounded-xl p-3 shadow-lg">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-archive-400 font-mono font-medium">
          <Database className="w-3.5 h-3.5 text-amber-accent" />
          <span>Select Digital Life Archive</span>
        </div>
        <span className="text-[11px] text-archive-400 font-mono">
          3 Independent Provenances
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {ALL_ADAPTERS.map((adapter) => {
          const meta = adapter.getMetadata();
          const isSelected = activeSourceId === adapter.id;
          const IconComp = ICON_MAP[adapter.icon] || Layers;

          return (
            <button
              key={adapter.id}
              type="button"
              onClick={() => onSelectSource(adapter.id)}
              aria-pressed={isSelected}
              aria-label={`Switch to ${adapter.name} archive (${meta.totalRecords?.toLocaleString()} records)`}
              className={`group text-left p-3 rounded-lg transition-all duration-200 border relative overflow-hidden flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-accent/50 ${
                isSelected
                  ? 'bg-archive-800 border-amber-accent/80 shadow-md ring-1 ring-amber-accent/30'
                  : 'bg-archive-900/60 border-archive-700/40 hover:bg-archive-800/80 hover:border-archive-600 text-archive-300'
              }`}
            >
              {isSelected && (
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: adapter.color }}
                />
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center text-archive-950 font-bold"
                      style={{ backgroundColor: adapter.color }}
                    >
                      <IconComp className="w-4 h-4 text-archive-950" />
                    </div>
                    <span className="font-semibold text-sm text-archive-100 group-hover:text-white transition-colors">
                      {adapter.shortName}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded font-medium"
                    style={{
                      backgroundColor: `${adapter.color}20`,
                      color: adapter.color,
                      border: `1px solid ${adapter.color}40`
                    }}
                  >
                    {meta.totalRecords?.toLocaleString()} records
                  </span>
                </div>

                <p className="text-xs text-archive-400 line-clamp-2 leading-relaxed mb-2">
                  {meta.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-archive-700/40 text-[11px] font-mono text-archive-400">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-archive-400" />
                  <span>{meta.dateRange?.start?.slice(0, 4)} – {meta.dateRange?.end?.slice(0, 4)}</span>
                </span>
                <span className="text-archive-300 group-hover:text-amber-accent transition-colors font-medium">
                  {isSelected ? '● Active' : 'Switch Archive →'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
