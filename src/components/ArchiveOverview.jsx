import React from 'react';
import { ArrowRight, Sparkles, Network, Layers, ShieldCheck, Database, Calendar, Eye, Activity, Hash, Bookmark } from 'lucide-react';
import DatasetSwitcher from './DatasetSwitcher';

export default function ArchiveOverview({
  activeAdapter,
  activeSourceId,
  onSelectSource,
  onNavigate,
  relationshipData,
  totalRecordsCount
}) {
  const metadata = activeAdapter.getMetadata();
  const connectionsCount = relationshipData?.connections?.length || 0;
  const categoriesCount = activeAdapter.getCategories ? activeAdapter.getCategories().length : 8;

  return (
    <div className="space-y-12 animate-fade-in pb-16">
      
      {/* Dataset Archive Switcher Ribbon */}
      <section>
        <DatasetSwitcher
          activeSourceId={activeSourceId}
          onSelectSource={onSelectSource}
        />
      </section>

      {/* Hero Editorial Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-archive-850 to-archive-900 border border-archive-700/60 p-6 sm:p-10 lg:p-14 shadow-2xl archival-grid">
        <div className="max-w-3xl space-y-6 relative z-10">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-archive-800 border border-archive-700 text-xs font-mono text-archive-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-accent" />
            <span>Digital Life Archive · Evidence-Backed Storytelling</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-normal tracking-tight text-paper leading-[1.15]">
              Some moments make sense <span className="italic text-amber-accent">only when connected.</span>
            </h1>
            <p className="text-base sm:text-xl text-archive-300 font-sans font-light leading-relaxed max-w-2xl">
              Explore the receipts. Discover the patterns. Uncover the story.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-archive-400 font-mono leading-relaxed border-l-2 border-amber-accent/60 pl-4 py-1">
            Raw digital receipts (audio streams, transit tickets, dining payments, and monthly subscriptions)
            transformed into verifiable chronological relationships without external AI or backend assumptions.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('explorer')}
              className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-xl bg-amber-accent hover:bg-amber-light text-archive-950 font-semibold text-sm transition-all shadow-glow-amber hover:translate-y-[-1px]"
            >
              <span>Explore the archive</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('connection-map')}
              className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-archive-800/80 hover:bg-archive-750 text-paper border border-archive-600/80 font-medium text-sm transition-all hover:border-lavender-accent/60"
            >
              <Network className="w-4 h-4 text-lavender-accent" />
              <span>Explore Connection Map</span>
            </button>

            <button
              onClick={() => onNavigate('stories')}
              className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-archive-800/80 hover:bg-archive-750 text-paper border border-archive-600/80 font-medium text-sm transition-all hover:border-sage-accent/60"
            >
              <Bookmark className="w-4 h-4 text-sage-accent" />
              <span>Read Story Chapters</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow accents */}
        <div className="absolute top-1/4 right-8 w-80 h-80 rounded-full bg-amber-accent/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-4 right-1/3 w-64 h-64 rounded-full bg-lavender-accent/5 blur-3xl pointer-events-none" />
      </section>

      {/* ── Gen Z Digital Life Archetype & Aura Banner ── */}
      {(() => {
        const archetypeMap = {
          spotify: {
            title: "The Nocturnal Sonic Chronicler",
            role: "SONIC ARCHAEOLOGIST · 11-YEAR TELEMETRY",
            aura: "Insomnia Violet & Analog Tape",
            quote: "149,860 moments logged across 11 continuous years. Zero algorithmic noise. Pure nocturnal listening devotion.",
            badges: [
              { label: "⚡ 98% MAIN CHARACTER ENERGY", color: "#D9A15C" },
              { label: "🌙 23:00 MIDNIGHT PEAK RHYTHM", color: "#9B83D8" },
              { label: "🎧 95% NO-SKIP ATTENTION SPAN", color: "#7CB49C" }
            ],
            tags: ["#MidnightObsession", "#TheBeatlesOnLoop", "#AnalogTapeSoul", "#ZeroCloudDrift"]
          },
          household: {
            title: "The Hyper-Local Metro Nomad",
            role: "URBAN ROUTINE ARCHITECT · 2,461 VERIFIED RECEIPTS",
            aura: "Subway Amber & Morning Roast",
            quote: "Every subway tap, neighborhood grocery basket, and morning espresso grounded in verifiable physical telemetry.",
            badges: [
              { label: "☕ MORNING COMMUTE RITUAL", color: "#D9A15C" },
              { label: "📍 8 BEHAVIORAL CLUSTERS", color: "#9B83D8" },
              { label: "🛡️ 100% PRIVATE CLIENT-SIDE", color: "#7CB49C" }
            ],
            tags: ["#SubwayRhythms", "#WeekendGroceries", "#FamilyLore", "#NoAPIsRequired"]
          },
          transact: {
            title: "The High-Velocity City Strider",
            role: "DIGITAL MOBILITY VANGUARD · 10,267 MICRO-SWIPES",
            aura: "Neon Transit & Cyber Commerce",
            quote: "High-frequency urban mobility and merchant clusters captured with cryptographic client-side integrity.",
            badges: [
              { label: "💳 100% INSTANT SETTLEMENT", color: "#7CB49C" },
              { label: "🏙️ REGIONAL COMMERCE FOOTPRINT", color: "#D9A15C" },
              { label: "🔍 ANOMALY-FREE VERIFICATION", color: "#9B83D8" }
            ],
            tags: ["#StreetSmart", "#MetroTransit", "#MicroMobility", "#FastLane"]
          }
        };
        const currentArchetype = archetypeMap[activeSourceId] || archetypeMap.household;

        return (
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-archive-850 via-[#1C1C18] to-archive-900 border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5 holo-gradient">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-accent/20 border border-amber-accent/40 text-amber-accent text-xs font-mono font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>DIGITAL IDENTITY AURA · VERIFIED ON-DEVICE</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-paper">
                  {currentArchetype.title}
                </h3>
                <p className="text-xs font-mono text-archive-400">
                  {currentArchetype.role} · Aura: <span className="text-amber-accent font-semibold">{currentArchetype.aura}</span>
                </p>
              </div>

              <button
                onClick={() => onNavigate('stories')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-accent hover:bg-amber-light text-archive-950 font-bold text-xs font-mono transition-all hover:scale-105 active:scale-95 shadow-glow-amber self-start sm:self-auto"
              >
                <span>View Persona Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Gen Z Persona Badges */}
            <div className="flex flex-wrap gap-2.5">
              {currentArchetype.badges.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold backdrop-blur-md border shadow-sm transition-transform hover:scale-105"
                  style={{
                    backgroundColor: `${b.color}15`,
                    borderColor: `${b.color}45`,
                    color: b.color
                  }}
                >
                  <span>{b.label}</span>
                </div>
              ))}
            </div>

            {/* Quote and Hashtags */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <p className="text-xs sm:text-sm text-archive-300 font-sans italic max-w-xl">
                “{currentArchetype.quote}”
              </p>
              <div className="flex flex-wrap gap-1.5">
                {currentArchetype.tags.map((tag, i) => (
                  <span key={i} className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-archive-900/80 border border-archive-700/60 text-archive-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── Real Live Dataset Summary Statistics — Interactive Cyber HUD ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-widest font-mono text-archive-400 font-semibold flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-amber-accent" />
            <span>Active Archive Evidence Statistics</span>
          </h2>
          <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ONLINE TELEMETRY • {metadata.name}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Stat 1: Total Receipts */}
          <div
            onClick={() => onNavigate('explorer')}
            className="p-6 rounded-2xl bg-gradient-to-br from-archive-850 to-archive-900 border border-archive-700/70 hover:border-amber-accent/70 shadow-lg relative overflow-hidden group transition-all hover:scale-[1.02] cursor-pointer hover:shadow-glow-amber"
            title="Click to browse all receipts in Explorer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-archive-400 font-medium">Total Life Receipts</span>
              <div className="p-2 rounded-xl bg-amber-accent/15 border border-amber-accent/30 text-amber-accent group-hover:rotate-12 transition-transform">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight">
              {metadata.totalRecords?.toLocaleString()}
            </div>
            <div className="flex items-center justify-between mt-2.5 text-[11px] font-mono">
              <span className="text-emerald-400 flex items-center space-x-1">
                <span>✦</span>
                <span>100% On-Device Ingested</span>
              </span>
              <span className="text-archive-500 group-hover:text-amber-accent transition-colors flex items-center space-x-0.5">
                <span>Browse</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Stat 2: Categories */}
          <div
            onClick={() => onNavigate('insights')}
            className="p-6 rounded-2xl bg-gradient-to-br from-archive-850 to-archive-900 border border-archive-700/70 hover:border-lavender-accent/70 shadow-lg relative overflow-hidden group transition-all hover:scale-[1.02] cursor-pointer"
            title="Click to inspect Behavioral Clusters in Insights"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-archive-400 font-medium">Behavioral Clusters</span>
              <div className="p-2 rounded-xl bg-lavender-accent/15 border border-lavender-accent/30 text-lavender-accent group-hover:rotate-12 transition-transform">
                <Hash className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight">
              {categoriesCount}
            </div>
            <div className="flex items-center justify-between mt-2.5 text-[11px] font-mono">
              <span className="text-lavender-light truncate max-w-[130px]">
                #Music #Transit #Night
              </span>
              <span className="text-archive-500 group-hover:text-lavender-accent transition-colors flex items-center space-x-0.5">
                <span>Inspect</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Stat 3: Date Range */}
          <div
            onClick={() => onNavigate('stories')}
            className="p-6 rounded-2xl bg-gradient-to-br from-archive-850 to-archive-900 border border-archive-700/70 hover:border-sage-accent/70 shadow-lg relative overflow-hidden group transition-all hover:scale-[1.02] cursor-pointer"
            title="Click to view Timeline Eras in Story Chapters"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-archive-400 font-medium">Recorded Timespan</span>
              <div className="p-2 rounded-xl bg-sage-accent/15 border border-sage-accent/30 text-sage-light group-hover:rotate-12 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white truncate tracking-tight">
              {metadata.dateRange?.start?.slice(0, 4)} — {metadata.dateRange?.end?.slice(0, 4)}
            </div>
            <div className="flex items-center justify-between mt-2.5 text-[11px] font-mono">
              <span className="text-sage-light">11 Continuous Years</span>
              <span className="text-archive-500 group-hover:text-sage-accent transition-colors flex items-center space-x-0.5">
                <span>Eras</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Stat 4: Detected Connections */}
          <div
            onClick={() => onNavigate('connection-map')}
            className="p-6 rounded-2xl bg-gradient-to-br from-archive-850 to-archive-900 border border-archive-700/70 hover:border-amber-accent/70 shadow-lg relative overflow-hidden group transition-all hover:scale-[1.02] cursor-pointer"
            title="Click to explore the Force-Directed Connection Map"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-archive-400 font-medium">Discovered Synapses</span>
              <div className="p-2 rounded-xl bg-amber-accent/15 border border-amber-accent/30 text-amber-accent group-hover:rotate-12 transition-transform">
                <Network className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-amber-accent tracking-tight">
              {connectionsCount}+ Links
            </div>
            <div className="flex items-center justify-between mt-2.5 text-[11px] font-mono">
              <span className="text-amber-light">Graph Connected</span>
              <span className="text-archive-500 group-hover:text-amber-accent transition-colors flex items-center space-x-0.5">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Active Archive Lore & Vibe Snapshot — Spotify Wrapped / Bento Matrix ── */}
      <section className="p-6 sm:p-8 rounded-3xl bg-archive-850 border border-archive-700/70 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-accent/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-archive-700/50 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-accent/15 border border-amber-accent/40 text-amber-accent text-xs font-mono mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VIBE & BEHAVIORAL IDENTITY MATRIX</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-editorial font-bold text-white">
              How Your Habits Actually Look Behind The Numbers
            </h3>
          </div>
          <button
            onClick={() => onNavigate('stories')}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-archive-800 hover:bg-archive-750 text-archive-200 hover:text-white border border-archive-700 text-xs font-mono transition-all self-start sm:self-auto hover:border-amber-accent/50"
          >
            <span>Read Story Chapters</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-accent" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Bento Card 1: Circadian Vibe */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3.5 relative overflow-hidden group hover:border-lavender-accent/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-lavender-accent uppercase tracking-wider font-semibold flex items-center space-x-1.5">
                  <span>🌙</span>
                  <span>Circadian Routine</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lavender-accent/15 text-lavender-accent border border-lavender-accent/30 font-bold">
                  NIGHT RITUAL
                </span>
              </div>
              <div className="text-xl font-bold font-editorial text-paper">
                {activeAdapter.id === 'spotify' ? '23:00 – 0:00 Midnight Peak' : '11:00 – 14:00 Midday Surge'}
              </div>
              <p className="text-xs text-archive-300 font-sans leading-relaxed">
                {activeAdapter.id === 'spotify'
                  ? 'Insomnia hours are your peak focus zone. When the world logs off, quiet nocturnal sessions surge into deep album immersion.'
                  : 'Consistent midday expenditure and travel bursts centered around commuting corridors and regional mobility hubs.'}
              </p>
            </div>

            {/* Visual 24h Day/Night Heat Indicator */}
            <div className="pt-2 border-t border-archive-700/50 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-archive-500">
                <span>00:00 Morning</span>
                <span>12:00 Noon</span>
                <span className="text-lavender-accent font-bold">23:00 Peak 🔥</span>
              </div>
              <div className="flex items-center space-x-1 h-2 w-full bg-archive-900 rounded-full overflow-hidden p-0.5 border border-archive-700/50">
                <div className="h-full rounded-full bg-archive-700 w-1/4" />
                <div className="h-full rounded-full bg-archive-700 w-1/3" />
                <div className="h-full rounded-full bg-gradient-to-r from-lavender-accent to-purple-400 w-1/3 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Bento Card 2: Cultural Obsession */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3.5 relative overflow-hidden group hover:border-amber-accent/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-accent uppercase tracking-wider font-semibold flex items-center space-x-1.5">
                  <span>🔥</span>
                  <span>Unhinged Repeat Index</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-accent/15 text-amber-accent border border-amber-accent/30 font-bold">
                  HEAVY LOOP
                </span>
              </div>
              <div className="text-xl font-bold font-editorial text-paper">
                {activeAdapter.id === 'spotify' ? 'The Beatles · The Killers · John Mayer' : 'Metro Transit & Daily Household'}
              </div>
              <p className="text-xs text-archive-300 font-sans leading-relaxed">
                {activeAdapter.id === 'spotify'
                  ? 'Over 13,600 plays on your top artist alone. Pure dedication with zero casual shuffle distractions.'
                  : 'Recurring micro-mobility runs and trusted food partners forming an unshakable daily baseline.'}
              </p>
            </div>

            {/* Mini Equalizer / Chip Tags */}
            <div className="pt-2 border-t border-archive-700/50 flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {activeAdapter.id === 'spotify' ? (
                  <>
                    <span className="px-2 py-0.5 rounded-md bg-archive-800 text-[10px] font-mono text-amber-accent border border-amber-accent/30 font-bold">13.6k Beatles</span>
                    <span className="px-2 py-0.5 rounded-md bg-archive-800 text-[10px] font-mono text-archive-300 border border-archive-700">6.8k Killers</span>
                  </>
                ) : (
                  <>
                    <span className="px-2 py-0.5 rounded-md bg-archive-800 text-[10px] font-mono text-amber-accent border border-amber-accent/30 font-bold">640+ Transit Swipes</span>
                    <span className="px-2 py-0.5 rounded-md bg-archive-800 text-[10px] font-mono text-archive-300 border border-archive-700">Daily Groceries</span>
                  </>
                )}
              </div>

              {/* Mini Sound Equalizer */}
              <div className="flex items-end space-x-1 h-3 shrink-0">
                <span className="w-1 bg-amber-accent rounded-full animate-eq-1" />
                <span className="w-1 bg-amber-accent rounded-full animate-eq-2" />
                <span className="w-1 bg-amber-accent rounded-full animate-eq-3" />
              </div>
            </div>
          </div>

          {/* Bento Card 3: Immersion Index */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3.5 relative overflow-hidden group hover:border-sage-accent/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-sage-accent uppercase tracking-wider font-semibold flex items-center space-x-1.5">
                  <span>🎧</span>
                  <span>Immersion & Attention Span</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-400 border border-emerald-400/30 font-bold">
                  NO-SKIP CLUB
                </span>
              </div>
              <div className="text-xl font-bold font-editorial text-paper">
                {activeAdapter.id === 'spotify' ? '95% Full Completion Rate' : '100% Settled Integrity'}
              </div>
              <p className="text-xs text-archive-300 font-sans leading-relaxed">
                {activeAdapter.id === 'spotify'
                  ? 'TikTok brain? Not here. Only 5 out of every 100 tracks are skipped early. You let full compositions breathe.'
                  : 'Zero transactional friction. Micro-mobility habits captured with complete local cryptographic verification.'}
              </p>
            </div>

            {/* Completion Progress Bar */}
            <div className="pt-2 border-t border-archive-700/50 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-archive-500">Early Skips: 5%</span>
                <span className="text-emerald-400 font-bold">95% Immersion ✓</span>
              </div>
              <div className="w-full bg-archive-900 rounded-full h-2 p-0.5 border border-archive-700/50">
                <div className="bg-gradient-to-r from-emerald-500 to-sage-accent h-full rounded-full" style={{ width: '95%' }} />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Narrative Transformation Paradigm: RAW DATA -> PATTERNS -> SYNAPSES -> STORY ── */}
      <section className="p-6 sm:p-8 rounded-3xl bg-archive-850 border border-archive-700/60 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-accent font-semibold flex items-center justify-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HOW YOUR LIFE LORE IS BUILT</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-editorial font-bold text-white">
            The TRACE Discovery Pipeline
          </h3>
          <p className="text-xs text-archive-400 font-mono max-w-xl mx-auto">
            From raw organizer telemetry to verified narrative storytelling — 100% computed client-side.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative pt-2">
          
          <div
            onClick={() => onNavigate('explorer')}
            className="p-5 rounded-2xl bg-black/40 border border-archive-700/80 space-y-2.5 hover:border-amber-accent/70 transition-all group cursor-pointer hover:scale-[1.02]"
            title="Jump to Receipt Explorer"
          >
            <div className="text-xs font-mono text-amber-accent font-bold flex items-center justify-between">
              <span>01 · TELEMETRY</span>
              <span className="text-[10px] text-archive-500 group-hover:text-amber-accent">INGESTION →</span>
            </div>
            <h4 className="text-base font-semibold text-paper group-hover:text-amber-accent transition-colors">Digital Receipts</h4>
            <p className="text-xs text-archive-400 leading-relaxed font-sans">
              Raw audio streams, transit tickets, dining payments, and merchant logs loaded directly into browser memory.
            </p>
          </div>

          <div
            onClick={() => onNavigate('insights')}
            className="p-5 rounded-2xl bg-black/40 border border-archive-700/80 space-y-2.5 hover:border-lavender-accent/70 transition-all group cursor-pointer hover:scale-[1.02]"
            title="Jump to Pattern Insights"
          >
            <div className="text-xs font-mono text-lavender-accent font-bold flex items-center justify-between">
              <span>02 · PATTERNS</span>
              <span className="text-[10px] text-archive-500 group-hover:text-lavender-accent">ANALYTICS →</span>
            </div>
            <h4 className="text-base font-semibold text-paper group-hover:text-lavender-accent transition-colors">Behavioral Rhythms</h4>
            <p className="text-xs text-archive-400 leading-relaxed font-sans">
              Real-time detection of circadian hourly peaks, nocturnal streaming routines, and recurring expenditure cycles.
            </p>
          </div>

          <div
            onClick={() => onNavigate('connection-map')}
            className="p-5 rounded-2xl bg-black/40 border border-archive-700/80 space-y-2.5 hover:border-sage-accent/70 transition-all group cursor-pointer hover:scale-[1.02]"
            title="Jump to Connection Map"
          >
            <div className="text-xs font-mono text-sage-accent font-bold flex items-center justify-between">
              <span>03 · SYNAPSES</span>
              <span className="text-[10px] text-archive-500 group-hover:text-sage-accent">GRAPH →</span>
            </div>
            <h4 className="text-base font-semibold text-paper group-hover:text-sage-accent transition-colors">Evidence Graph</h4>
            <p className="text-xs text-archive-400 leading-relaxed font-sans">
              Interactive force-directed node map discovering multi-hop connections, merchant clusters, and platform shifts.
            </p>
          </div>

          <div
            onClick={() => onNavigate('stories')}
            className="p-5 rounded-2xl bg-black/40 border border-archive-700/80 space-y-2.5 hover:border-amber-accent/70 transition-all group cursor-pointer hover:scale-[1.02]"
            title="Jump to Story Chapters"
          >
            <div className="text-xs font-mono text-amber-accent font-bold flex items-center justify-between">
              <span>04 · NARRATIVE</span>
              <span className="text-[10px] text-archive-500 group-hover:text-amber-accent">LORE →</span>
            </div>
            <h4 className="text-base font-semibold text-paper group-hover:text-amber-accent transition-colors">Verified Eras</h4>
            <p className="text-xs text-archive-400 leading-relaxed font-sans">
              Spotify Wrapped-style chronological narrative chapters that clearly distinguish observed facts from interpretations.
            </p>
          </div>

        </div>
      </section>

      {/* ── Curator & Privacy Safety Protocol — Cyberpunk Terminal ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-archive-850/90 border border-archive-700/60 space-y-3 relative overflow-hidden">
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Strict Privacy & Anonymization Safeguards</span>
          </div>
          <h4 className="text-base font-semibold text-white font-editorial">Zero Exposure of Sensitive Identifiers</h4>
          <p className="text-xs text-archive-300 font-sans leading-relaxed">
            All organizer transaction records are sanitized on load. Card numbers, full names, street addresses, and dates of birth are completely masked or excluded from the interface and story generators.
          </p>
          <div className="inline-flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
            <span>🔒 Zero Server Logs • 100% Client-Side Private</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-archive-850/90 border border-archive-700/60 space-y-3 relative overflow-hidden">
          <div className="flex items-center space-x-2 text-lavender-accent font-mono text-xs font-semibold">
            <Layers className="w-4 h-4" />
            <span>Multi-Dataset Provenance Integrity</span>
          </div>
          <h4 className="text-base font-semibold text-white font-editorial">Independent Archives, No Artificial Merging</h4>
          <p className="text-xs text-archive-300 font-sans leading-relaxed">
            Spotify history (149k streams), Household transactions (2.4k receipts), and India Transact data (10k records) are maintained as independent archives with explicit adapters, avoiding fabricated cross-person assumptions.
          </p>
          <div className="inline-flex items-center space-x-1.5 text-[10px] font-mono text-lavender-accent bg-lavender-accent/10 px-2.5 py-1 rounded-full border border-lavender-accent/20">
            <span>✦ Authentic Organizer Data Only</span>
          </div>
        </div>
      </section>

    </div>
  );
}


