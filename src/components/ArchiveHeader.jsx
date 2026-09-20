import React, { useState } from "react";
import { Network, BookOpen, BarChart3, Search, Compass, Menu, X, ChevronRight, Database, Shield, Plus } from "lucide-react";

const NAV_ITEMS = [
  { id: "overview",       label: "Archive Overview", icon: Compass,   desc: "Dashboard & stats"   },
  { id: "explorer",       label: "Receipt Explorer", icon: Search,    desc: "Browse all records"  },
  { id: "connection-map", label: "Connection Map",   icon: Network,   desc: "Relationship graph" },
  { id: "stories",        label: "Story Chapters",   icon: BookOpen,  desc: "Narrative timeline"  },
  { id: "insights",       label: "Pattern Insights", icon: BarChart3, desc: "Behavioral patterns" },
];

export default function ArchiveHeader({ activeTab, onSelectTab, activeAdapter, onOpenAddReceipt }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-56 xl:w-60 z-40 bg-archive-950 border-r border-archive-700/50 select-none">
        <div
          role="button"
          tabIndex={0}
          aria-label="Go to Archive Overview"
          className="flex items-center space-x-3 px-5 py-5 border-b border-archive-700/40 cursor-pointer group focus:outline-none focus:ring-1 focus:ring-amber-accent/50"
          onClick={() => onSelectTab("overview")}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelectTab("overview"); }}
        >
          <div className="relative flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-archive-800 to-archive-900 border border-amber-accent/50 shadow-glow-amber group-hover:border-amber-accent transition-all">
            <span className="font-editorial text-xl font-bold tracking-wider text-amber-accent">T</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-accent animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold tracking-tight text-base text-white font-sans">TRACE</span>
              <span className="text-[9px] uppercase font-mono px-1 py-0.5 rounded bg-archive-800 border border-archive-700/60 text-archive-400">Archive</span>
            </div>
            <p className="text-[10px] text-archive-500 font-editorial italic leading-tight mt-0.5">Every moment leaves a trace.</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left transition-all group relative ${isActive ? "bg-archive-850 text-paper" : "text-archive-400 hover:text-archive-100 hover:bg-archive-900"}`}>
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full transition-all duration-200 ${isActive ? "bg-amber-accent opacity-100" : "opacity-0"}`} />
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-amber-accent" : "text-archive-500 group-hover:text-archive-300"}`} />
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-medium leading-none mb-0.5 ${isActive ? "text-paper" : ""}`}>{item.label}</div>
                  <div className="text-[10px] text-archive-600 font-mono leading-none truncate">{item.desc}</div>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-accent/60 flex-shrink-0" />}
              </button>
            );
          })}

          {/* Dedicated Sidebar "Leave Your Trace" CTA — never blocks reading text */}
          <div className="pt-3">
            <button
              onClick={() => onOpenAddReceipt && onOpenAddReceipt()}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-accent/15 via-archive-850 to-archive-850 hover:from-amber-accent/25 border border-amber-accent/35 hover:border-amber-accent/60 text-amber-accent text-xs font-mono transition-all group shadow-sm"
              title="Add a personal life receipt to your archive"
            >
              <div className="flex items-center space-x-2">
                <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300 text-amber-accent" />
                <span className="font-semibold text-paper font-sans">Leave Your Trace</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-accent/20 text-amber-accent border border-amber-accent/30 font-mono">
                + ADD
              </span>
            </button>
          </div>
        </nav>

        <div className="px-3 pb-3 pt-2 border-t border-archive-700/40 space-y-2">
          <div className="flex items-center space-x-2 px-3 py-2.5 rounded-xl border text-xs font-mono"
            style={{ backgroundColor: `${activeAdapter.color}12`, borderColor: `${activeAdapter.color}35`, color: activeAdapter.color }}>
            <Database className="w-3.5 h-3.5 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-semibold truncate">{activeAdapter.shortName}</div>
              <div className="text-[10px] opacity-60 truncate">{activeAdapter.name}</div>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 px-1 text-[10px] font-mono text-archive-600">
            <Shield className="w-3 h-3 text-sage-accent/50 flex-shrink-0" />
            <span>No APIs · 100% Client-Side</span>
          </div>
        </div>
      </aside>

      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-archive-950/95 backdrop-blur-md border-b border-archive-700/50 flex items-center justify-between px-4">
        <div
          role="button"
          tabIndex={0}
          aria-label="Go to Archive Overview"
          className="flex items-center space-x-2.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-accent/50"
          onClick={() => onSelectTab("overview")}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelectTab("overview"); }}
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-archive-800 to-archive-900 border border-amber-accent/50">
            <span className="font-editorial text-lg font-bold text-amber-accent">T</span>
          </div>
          <span className="font-bold text-white font-sans">TRACE</span>
          <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-archive-800 border border-archive-700 text-archive-400">Archive</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          className="p-2 rounded-lg text-archive-300 hover:text-white hover:bg-archive-800 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {mobileOpen && (
        <div className="lg:hidden fixed top-14 left-0 right-0 z-40 bg-archive-950 border-b border-archive-700/50 px-3 py-3 space-y-1 shadow-2xl">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => { onSelectTab(item.id); setMobileOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? "bg-archive-800 text-amber-accent border border-amber-accent/30" : "text-archive-300 hover:text-white hover:bg-archive-900"}`}>
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-accent" : "text-archive-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => { if (onOpenAddReceipt) onOpenAddReceipt(); setMobileOpen(false); }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium bg-amber-accent/15 border border-amber-accent/40 text-amber-accent transition-colors mt-2"
          >
            <div className="flex items-center space-x-3">
              <Plus className="w-4 h-4 text-amber-accent" />
              <span>Leave Your Trace</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-accent/20">+ ADD</span>
          </button>
          <div className="mt-1 flex items-center space-x-2 px-4 py-2.5 rounded-xl border text-xs font-mono"
            style={{ backgroundColor: `${activeAdapter.color}12`, borderColor: `${activeAdapter.color}35`, color: activeAdapter.color }}>
            <Database className="w-3.5 h-3.5" />
            <span className="font-semibold">{activeAdapter.shortName}</span>
          </div>
        </div>
      )}
    </>
  );
}
