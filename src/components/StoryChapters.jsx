import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Share2,
  Check,
  Disc,
  Radio,
  Flame,
  Volume2,
  Compass,
  ArrowRight
} from 'lucide-react';
import ReceiptCard from './ReceiptCard';
import ChapterVisualCard from './ChapterVisualCard';
import { getChapterAesthetics } from '../engine/chapterAesthetics';

export default function StoryChapters({
  chapters = [],
  activeAdapter,
  onSelectReceipt
}) {
  const [activeChapterId, setActiveChapterId] = useState(chapters[0]?.id || null);
  const [copied, setCopied] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState('forward');

  // Keep activeChapterId in sync when chapters array changes
  useEffect(() => {
    if (chapters.length > 0) {
      const exists = chapters.find((c) => c.id === activeChapterId);
      if (!exists) {
        setActiveChapterId(chapters[0].id);
      }
    }
  }, [chapters, activeChapterId]);

  const activeChapterIndex = useMemo(() => {
    const idx = chapters.findIndex((c) => c.id === activeChapterId);
    return idx >= 0 ? idx : 0;
  }, [chapters, activeChapterId]);

  const activeChapter = chapters[activeChapterIndex] || null;

  // Chapter navigation with smooth slide animation
  const navigateTo = (chapterId, direction = 'forward') => {
    if (chapterId === activeChapterId) return;
    setFlipDir(direction);
    setFlipping(true);
    setTimeout(() => {
      setActiveChapterId(chapterId);
      setFlipping(false);
    }, 280);
  };

  const goPrev = () => {
    if (activeChapterIndex > 0) navigateTo(chapters[activeChapterIndex - 1].id, 'backward');
  };
  const goNext = () => {
    if (activeChapterIndex < chapters.length - 1) navigateTo(chapters[activeChapterIndex + 1].id, 'forward');
  };

  // Era color & theme mapping — unique and tailored per dataset & chapter
  const eraAesthetics = useMemo(() => {
    return getChapterAesthetics(activeChapter, activeAdapter?.id);
  }, [activeChapter, activeAdapter]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && activeChapterIndex < chapters.length - 1) {
        navigateTo(chapters[activeChapterIndex + 1].id, 'forward');
      } else if (e.key === 'ArrowLeft' && activeChapterIndex > 0) {
        navigateTo(chapters[activeChapterIndex - 1].id, 'backward');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeChapterIndex, chapters]);

  // Share Era
  const handleShareEra = () => {
    if (!activeChapter) return;
    const shareText = `
📖 TRACE LIFE ARCHIVE // ${activeChapter.title}
✨ Vibe: ${eraAesthetics.vibe}
⏱️ Era: ${activeChapter.epoch}
💭 "${activeChapter.cautiousInterpretation}"
🔒 Verified client-side on TRACE · 100% Private
`.trim();
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!chapters || chapters.length === 0) {
    return (
      <div className="bg-archive-850 border border-archive-700/60 rounded-3xl p-12 text-center text-archive-400 space-y-3">
        <BookOpen className="w-10 h-10 mx-auto text-archive-500" />
        <h3 className="text-lg font-editorial text-paper">No Narrative Chapters Available</h3>
        <p className="text-xs font-mono">This archive does not contain sufficient clustering evidence for automatic chapter synthesis.</p>
      </div>
    );
  }

  // Smooth slide-and-fade animation
  const pageTransitionStyle = {
    transition: flipping ? 'opacity 0.15s ease-in, transform 0.28s cubic-bezier(0.2,0.8,0.2,1)' : 'opacity 0.3s ease-out, transform 0.3s cubic-bezier(0.2,0.8,0.2,1)',
    opacity: flipping ? 0 : 1,
    transform: flipping
      ? (flipDir === 'forward' ? 'translateX(18px) scale(0.985)' : 'translateX(-18px) scale(0.985)')
      : 'translateX(0) scale(1)'
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">

      {/* ── Gen Z Story Bar (Instagram / Spotify Wrapped Segmented Progress) ── */}
      <div className="bg-archive-850/80 backdrop-blur-md border border-archive-700/70 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
        
        {/* Story Segments */}
        <div className="flex items-center space-x-2">
          {chapters.map((ch, idx) => {
            const isCompleted = idx < activeChapterIndex;
            const isCurrent = idx === activeChapterIndex;

            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => navigateTo(ch.id, idx > activeChapterIndex ? 'forward' : 'backward')}
                className="group flex-1 py-1.5 focus:outline-none cursor-pointer"
                title={`Jump to Ch. ${idx + 1}: ${ch.title}`}
                aria-label={`Jump to Chapter ${idx + 1}: ${ch.title}`}
              >
                <div className="w-full h-1.5 rounded-full bg-archive-800 overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: isCompleted ? '100%' : isCurrent ? '100%' : '0%',
                      backgroundColor: isCurrent ? eraAesthetics.accentColor : isCompleted ? '#ECE8DD88' : 'transparent',
                      boxShadow: isCurrent ? `0 0 10px ${eraAesthetics.accentColor}` : 'none'
                    }}
                  />
                </div>
                <div className="hidden md:flex items-center justify-between mt-1 text-[10px] font-mono text-archive-500 group-hover:text-paper transition-colors">
                  <span className={isCurrent ? 'text-amber-accent font-bold' : ''}>
                    0{idx + 1}. {ch.epoch.slice(0, 9)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-archive-700/40">
          <div className="flex items-center space-x-2.5">
            <span className="p-1.5 rounded-lg bg-amber-accent/20 border border-amber-accent/40 text-amber-accent">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-lg font-editorial font-bold text-paper flex items-center space-x-2">
                <span>The Eras & Story Chapters</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-archive-800 border border-archive-700 text-archive-300">
                  {activeAdapter?.name}
                </span>
              </h2>
              <p className="text-xs text-archive-400 font-mono">
                Evidence-grounded life narratives synthesized across chronological receipts.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Share Era Button */}
            <button
              onClick={handleShareEra}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-archive-800 hover:bg-archive-750 text-archive-200 hover:text-white border border-archive-700 text-xs font-mono transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Copy Era story for social media"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Era Copied! ✨</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-accent" />
                  <span>Share Era Lore</span>
                </>
              )}
            </button>

            {/* Chapter Pill */}
            <div className="flex items-center space-x-2 text-xs font-mono text-archive-400 bg-archive-900 px-3 py-1.5 rounded-full border border-archive-700/60">
              <span className="text-archive-500">ERA</span>
              <strong className="text-amber-accent font-bold">{String(activeChapterIndex + 1).padStart(2, '0')}</strong>
              <span className="text-archive-600">/</span>
              <strong className="text-paper">{String(chapters.length).padStart(2, '0')}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* ── Main Era Deck (Animated on Chapter Switch) ── */}
      {activeChapter && (
        <div
          key={activeChapter.id}
          className={`relative bg-gradient-to-b from-[#1F1F1A] via-[#1A1A16] to-[#141411] border border-white/10 rounded-3xl shadow-2xl overflow-hidden ${eraAesthetics.glowClass} ${
            flipDir === 'forward' ? 'animate-era-next' : 'animate-era-prev'
          }`}
        >
          
          {/* Ambient Glow Aura */}
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: eraAesthetics.accentColor }}
          />

          {/* ── Era Banner Hero ── */}
          <div className="p-6 sm:p-10 lg:p-12 border-b border-archive-700/60 relative">
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              
              {/* Left Column: Typography & Badges */}
              <div className="space-y-4 max-w-2xl flex-1">
                
                {/* Era Pill Ribbon */}
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border"
                    style={{
                      backgroundColor: `${eraAesthetics.accentColor}18`,
                      borderColor: `${eraAesthetics.accentColor}40`,
                      color: eraAesthetics.accentColor
                    }}
                  >
                    <span>{eraAesthetics.emoji}</span>
                    <span>{eraAesthetics.vibe}</span>
                  </span>

                  <span className="px-3 py-1 rounded-full bg-archive-900 border border-archive-700 text-xs font-mono text-archive-300 font-semibold">
                    ⏱ {activeChapter.epoch}
                  </span>

                  {activeChapter.receipts?.length > 0 && (
                    <span className="px-3 py-1 rounded-full bg-archive-900 border border-archive-700 text-xs font-mono text-paper font-semibold">
                      {activeChapter.receipts.length} Verified Receipts
                    </span>
                  )}
                </div>

                {/* Big Editorial Headline */}
                <h3 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-bold tracking-tight text-white leading-[1.1]">
                  {activeChapter.title}
                </h3>

                {/* Theme subtitle */}
                <div className="text-sm sm:text-base font-mono text-archive-300 flex items-center space-x-2">
                  <span className="text-amber-accent font-bold">✦</span>
                  <span className="italic">{activeChapter.theme}</span>
                </div>

                {/* Lead Narrative Body */}
                <p className="text-base sm:text-lg text-archive-200 font-sans font-light leading-relaxed pt-2">
                  {activeChapter.summary}
                </p>
              </div>

              {/* Right Column: Dynamic Chapter-Specific Visual Representation */}
              <ChapterVisualCard
                chapter={activeChapter}
                chapterIndex={activeChapterIndex}
              />
            </div>

          </div>

          {/* ── Main Bento: Evidence vs Vibe Interpretation ── */}
          <div className="p-6 sm:p-10 lg:p-12 space-y-8">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Evidence Bento Box */}
              <div className="p-6 rounded-2xl bg-black/40 border border-sage-accent/30 space-y-4 relative overflow-hidden shadow-md">
                <div className="flex items-center justify-between border-b border-archive-700/50 pb-3">
                  <div className="flex items-center space-x-2 text-sage-accent font-mono text-xs uppercase font-bold tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hard Evidence & Observed Facts</span>
                  </div>
                  <span className="text-[10px] font-mono text-archive-400 bg-sage-accent/15 px-2 py-0.5 rounded-full border border-sage-accent/30">
                    Dataset Verifiable
                  </span>
                </div>

                <p className="text-xs text-archive-400 font-mono">
                  Strictly observed records from raw telemetry — zero fabricated assumptions.
                </p>

                <ul className="space-y-3 font-mono text-sm text-archive-200">
                  {activeChapter.observedFacts?.map((fact, i) => (
                    <li key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-archive-900/80 border border-archive-700/50">
                      <span className="text-sage-accent font-bold mt-0.5 shrink-0 text-base">✦</span>
                      <span className="leading-relaxed">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interpretation Bento Box */}
              <div className="p-6 rounded-2xl bg-black/40 border border-amber-accent/30 space-y-4 relative overflow-hidden shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-archive-700/50 pb-3">
                    <div className="flex items-center space-x-2 text-amber-accent font-mono text-xs uppercase font-bold tracking-wider">
                      <Flame className="w-4 h-4" />
                      <span>Era Vibe Check & Synthesis</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-accent bg-amber-accent/15 px-2 py-0.5 rounded-full border border-amber-accent/30 font-semibold">
                      Narrative Lore
                    </span>
                  </div>

                  <p className="text-xs text-archive-400 font-mono mt-3">
                    Analytical reading grounded in the chronological pattern.
                  </p>

                  <div className="mt-4 relative p-5 rounded-xl bg-archive-900/80 border border-amber-accent/40 shadow-inner">
                    <div className="text-4xl text-amber-accent/30 font-editorial font-bold absolute top-2 left-3 leading-none pointer-events-none">
                      “
                    </div>
                    <blockquote className="text-base sm:text-lg text-paper italic font-editorial leading-relaxed pl-5 relative z-10">
                      {activeChapter.cautiousInterpretation}
                    </blockquote>
                  </div>
                </div>

                {/* Authentic Rubber Stamp overlay */}
                <div className="flex items-center justify-between pt-4 border-t border-archive-700/50">
                  <div className="text-[11px] text-archive-400 font-mono flex items-center space-x-1.5">
                    <span className="text-amber-accent">🛡️</span>
                    <span>Cautious interpretation without biography assumptions.</span>
                  </div>

                  <div className="rubber-stamp px-3 py-1 text-[10px] font-bold rounded pointer-events-none">
                    TRACE CERTIFIED ✓
                  </div>
                </div>
              </div>

            </div>

            {/* ── Soundtrack / Supporting Receipts (Mini Cassette Tapes) ── */}
            {activeChapter.receipts?.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-archive-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-mono text-amber-accent font-bold flex items-center space-x-2">
                      <Bookmark className="w-4 h-4" />
                      <span>Soundtrack & Receipts of this Era ({activeChapter.receipts.length})</span>
                    </h4>
                    <p className="text-xs text-archive-400 font-mono mt-0.5">
                      Click any receipt to open the physical thermal slip & inspect relationships.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-archive-500 hidden sm:inline">
                    Click card to inspect
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {activeChapter.receipts.map((receipt) => (
                    <ReceiptCard
                      key={receipt.id}
                      receipt={receipt}
                      onSelectReceipt={onSelectReceipt}
                      connectionCount={2}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Navigation Footer Controls ── */}
            <div className="flex items-center justify-between pt-6 border-t border-archive-700/50">
              
              <button
                disabled={activeChapterIndex === 0}
                onClick={goPrev}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl border font-mono text-xs uppercase tracking-wider transition-all ${
                  activeChapterIndex === 0
                    ? 'opacity-30 cursor-not-allowed border-archive-700 text-archive-500'
                    : 'bg-archive-900 hover:bg-archive-800 text-archive-200 border-archive-700 hover:border-amber-accent/50 hover:text-white shadow-sm hover:scale-105 active:scale-95'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Era</span>
              </button>

              {/* Story Dot Track */}
              <div className="hidden sm:flex items-center space-x-2">
                {chapters.map((ch, i) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => navigateTo(ch.id, i > activeChapterIndex ? 'forward' : 'backward')}
                    className="rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      width: i === activeChapterIndex ? '28px' : '8px',
                      height: '8px',
                      backgroundColor: i === activeChapterIndex ? eraAesthetics.accentColor : '#32322C',
                      boxShadow: i === activeChapterIndex ? `0 0 10px ${eraAesthetics.accentColor}` : 'none'
                    }}
                    title={`Go to Era ${i + 1}: ${ch.title}`}
                    aria-label={`Go to Era ${i + 1}: ${ch.title}`}
                  />
                ))}
              </div>

              <button
                disabled={activeChapterIndex === chapters.length - 1}
                onClick={goNext}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl border font-mono text-xs uppercase tracking-wider font-bold transition-all ${
                  activeChapterIndex === chapters.length - 1
                    ? 'opacity-30 cursor-not-allowed border-archive-700 text-archive-500'
                    : 'bg-amber-accent hover:bg-amber-light text-archive-950 border-amber-accent shadow-glow-amber hover:scale-105 active:scale-95'
                }`}
              >
                <span>Next Era</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
