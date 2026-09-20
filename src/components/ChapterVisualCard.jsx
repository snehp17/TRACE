import React from "react";
import {
  Train, Coffee, Tv, Wifi, Gift, Sparkles, CreditCard, Banknote,
  MapPin, Compass, Dumbbell, Film, ShieldAlert, ShieldCheck,
  Laptop, Smartphone, Disc, Moon, Radio, Music, Volume2, Clock, Check
} from "lucide-react";
import { getChapterAesthetics } from "../engine/chapterAesthetics";

export default function ChapterVisualCard({ chapter, chapterIndex = 0 }) {
  const aesthetics = getChapterAesthetics(chapter);

  return (
    <div className="relative flex-shrink-0 w-full lg:w-72 p-4 rounded-2xl bg-black/60 border border-white/10 shadow-2xl space-y-3 overflow-hidden group">
      
      {/* Visual Header */}
      <div className="flex items-center justify-between text-[10px] font-mono border-b border-archive-800 pb-2">
        <span className="font-bold flex items-center space-x-1.5" style={{ color: aesthetics.accentColor }}>
          <span>{aesthetics.emoji}</span>
          <span className="tracking-wider">{aesthetics.categoryTag}</span>
        </span>
        <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">
          CH. {chapterIndex + 1}
        </span>
      </div>

      {/* ── Dynamic Visual Content Based on Visual Type ── */}
      {renderVisualContent(aesthetics.visualType, chapter, aesthetics)}

      {/* Footer Vibe Strip */}
      <div className="p-2.5 rounded-lg bg-[#1E1E1A] border border-archive-700/80 flex items-center justify-between">
        <div className="text-[10px] font-mono tracking-wider font-bold truncate max-w-[170px]" style={{ color: aesthetics.accentColor }}>
          {chapter.epoch}
        </div>
        
        <div className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
          <Check className="w-2.5 h-2.5" />
          <span>VERIFIED</span>
        </div>
      </div>

    </div>
  );
}

function renderVisualContent(visualType, chapter, aesthetics) {
  switch (visualType) {

    // ─────────────────────────────────────────────────────────────
    // 1. Train & Breakfast Ticket (Household Journey Ch. 1)
    // ─────────────────────────────────────────────────────────────
    case "train-ticket":
      return (
        <div className="relative h-32 rounded-xl bg-gradient-to-br from-[#241F18] via-[#1A1813] to-[#14120E] border border-amber-accent/40 p-3 flex flex-col justify-between overflow-hidden shadow-inner font-mono">
          {/* Railway Tracks illustration top */}
          <div className="flex items-center justify-between text-[10px] text-amber-accent/90 border-b border-amber-accent/20 pb-1">
            <div className="flex items-center space-x-1">
              <Train className="w-3.5 h-3.5 text-amber-accent" />
              <span className="font-bold tracking-tight">SUBURBAN TRANSIT TICKET</span>
            </div>
            <span className="text-[9px] text-archive-400 font-bold">₹10.00 CASH</span>
          </div>

          {/* Route path */}
          <div className="py-1 flex items-center justify-between text-xs font-bold text-paper">
            <span>PLACE 5</span>
            <div className="flex-1 mx-2 border-b-2 border-dashed border-amber-accent/40 relative">
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[9px] bg-[#1A1813] px-1 text-amber-accent">➔</span>
            </div>
            <span>PLACE 0</span>
          </div>

          {/* Breakfast Token Slip */}
          <div className="p-1.5 rounded-lg bg-black/50 border border-archive-700 flex items-center justify-between gap-2 text-[10px]">
            <div className="flex items-center space-x-1.5 text-amber-light min-w-0 flex-1">
              <Coffee className="w-3 h-3 text-amber-accent shrink-0" />
              <span className="truncate">Idli Medu Vada (2 Pl)</span>
            </div>
            <span className="text-emerald-400 font-bold shrink-0 px-1.5 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/20 text-[9px] whitespace-nowrap">
              11:30 AM
            </span>
          </div>
        </div>
      );

    // ─────────────────────────────────────────────────────────────
    // 2. Digital Streaming & 4G Telecom Pass (Household Journey Ch. 2)
    // ─────────────────────────────────────────────────────────────
    case "digital-streaming":
      return (
        <div className="relative h-32 rounded-xl bg-gradient-to-br from-[#1E1929] via-[#161220] to-[#0F0D17] border border-purple-400/40 p-3 flex flex-col justify-between overflow-hidden shadow-inner font-mono">
          <div className="flex items-center justify-between text-[10px] text-lavender-accent border-b border-purple-500/20 pb-1">
            <div className="flex items-center space-x-1.5">
              <Tv className="w-3.5 h-3.5 text-lavender-accent" />
              <span className="font-bold">OTT & TELECOM ARCHIVE</span>
            </div>
            <span className="text-[9px] text-purple-300 font-bold">RECURRING</span>
          </div>

          {/* Media Player Simulation */}
          <div className="space-y-1.5 py-1">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Netflix Monthly Sub</span>
              <span className="text-lavender-accent">₹199 / mo</span>
            </div>
            {/* Stream scrubber bar */}
            <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-purple-400/30 p-0.5">
              <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-lavender-accent w-4/5 animate-pulse" />
            </div>
          </div>

          {/* Telecom Data Pass */}
          <div className="p-1.5 rounded-lg bg-black/50 border border-purple-500/30 flex items-center justify-between text-[10px]">
            <div className="flex items-center space-x-1 text-purple-300">
              <Wifi className="w-3 h-3 text-lavender-accent" />
              <span>4G Data Booster Pack</span>
            </div>
            <span className="text-xs text-archive-400 font-bold">19th Autopay</span>
          </div>
        </div>
      );

    // ─────────────────────────────────────────────────────────────
    // 3. Festive Gift & Auspicious Ledger (Household Journey Ch. 3)
    // ─────────────────────────────────────────────────────────────
    case "festive-gift":
      return (
        <div className="relative h-32 rounded-xl bg-gradient-to-br from-[#261E14] via-[#1F170E] to-[#140F08] border border-[#E6A868]/50 p-3 flex flex-col justify-between overflow-hidden shadow-inner font-mono">
          <div className="flex items-center justify-between text-[10px] text-[#E6A868] border-b border-[#E6A868]/20 pb-1">
            <div className="flex items-center space-x-1.5">
              <Gift className="w-3.5 h-3.5 text-[#E6A868]" />
              <span className="font-bold">SEASONAL DIWALI LEDGER</span>
            </div>
            <span className="text-[9px] text-amber-300">AUTUMN</span>
          </div>

          {/* Gift allocation chips */}
          <div className="py-1 space-y-1">
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>Traditional Apparel & Gifts</span>
              <Sparkles className="w-3.5 h-3.5 text-[#E6A868] animate-pulse" />
            </div>
            <p className="text-[10px] text-archive-300">Annual festive spikes in Oct–Nov</p>
          </div>

          {/* Investment transfer note */}
          <div className="p-1.5 rounded-lg bg-black/50 border border-[#E6A868]/30 flex items-center justify-between text-[10px]">
            <span className="text-[#E6A868]">PPF & Small Cap Fund</span>
            <span className="text-emerald-400 font-bold">SIP Verified ✓</span>
          </div>
        </div>
      );

    // ─────────────────────────────────────────────────────────────
    // 4. Cash-to-Digital Smart Card (Household Journey Ch. 4)
    // ─────────────────────────────────────────────────────────────
    case "cash-digital":
      return (
        <div className="relative h-32 rounded-xl bg-gradient-to-br from-[#13221C] via-[#0E1914] to-[#0A120E] border border-sage-accent/40 p-3 flex flex-col justify-between overflow-hidden shadow-inner font-mono">
          <div className="flex items-center justify-between text-[10px] text-sage-accent border-b border-sage-accent/20 pb-1">
            <div className="flex items-center space-x-1.5">
              <CreditCard className="w-3.5 h-3.5 text-sage-accent" />
              <span className="font-bold">PAYMENT MEDIUM MIGRATION</span>
            </div>
            <span className="text-[9px] text-sage-light font-bold">2015 ➔ 2021</span>
          </div>

          {/* Cash vs Electronic split visual */}
          <div className="grid grid-cols-2 gap-2 py-1">
            <div className="p-1.5 rounded bg-black/40 border border-archive-700/60 text-center">
              <div className="text-[9px] text-archive-400 flex items-center justify-center space-x-0.5">
                <Banknote className="w-2.5 h-2.5 text-amber-accent" />
                <span>2015 CASH</span>
              </div>
              <div className="text-xs font-bold text-amber-accent">&gt; 85%</div>
            </div>
            <div className="p-1.5 rounded bg-black/40 border border-sage-accent/40 text-center">
              <div className="text-[9px] text-sage-light flex items-center justify-center space-x-0.5">
                <CreditCard className="w-2.5 h-2.5 text-sage-accent" />
                <span>2021 DIGITAL</span>
              </div>
              <div className="text-xs font-bold text-sage-accent">&gt; 54%</div>
            </div>
          </div>

          <div className="p-1 rounded bg-black/40 text-center text-[10px] text-sage-light">
            Bank Account 1 &amp; UPI Electronic Expansion
          </div>
        </div>
      );

    // ─────────────────────────────────────────────────────────────
    // 5. Multi-City Transit Waybill (Urban Transact Ch. 1)
    // ─────────────────────────────────────────────────────────────
    case "multi-city":
      return (
        <div className="relative h-32 rounded-xl bg-gradient-to-br from-[#14231E] via-[#0E1A16] to-[#0A120F] border border-sage-accent/40 p-3 flex flex-col justify-between overflow-hidden shadow-inner font-mono">
          <div className="flex items-center justify-between text-[10px] text-sage-accent border-b border-sage-accent/20 pb-1">
            <div className="flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-sage-accent animate-spin-slow" />
              <span className="font-bold">INTER-STATE MOBILITY CIRCUIT</span>
            </div>
            <span className="text-[9px] text-sage-light font-bold">40+ HUBS</span>
          </div>

          {/* Node route waypoints */}
          <div className="space-y-1 py-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-white">
              <span>Rourkela</span>
              <span className="text-sage-accent">➔ Jalna</span>
              <span className="text-sage-light">➔ Varanasi</span>
            </div>
            <div className="w-full bg-archive-900 h-1.5 rounded-full overflow-hidden border border-sage-accent/30">
              <div className="h-full bg-gradient-to-r from-sage-accent to-emerald-400 w-3/4 animate-pulse" />
            </div>
          </div>

          <div className="p-1.5 rounded-lg bg-black/50 border border-sage-accent/30 flex items-center justify-between text-[10px]">
            <span className="text-sage-light flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-sage-accent" />
              <span>Multi-City Geo Dispersion</span>
            </span>
            <span className="text-emerald-400 font-bold">Active</span>
          </div>
        </div>
      );

    // ─────────────────────────────────────────────────────────────
    // 6. Lifestyle & Fitness Pass (Urban Transact Ch. 2)
    // ─────────────────────────────────────────────────────────────
    case "lifestyle-pass":
      return (
        <div className="relative h-32 rounded-xl bg-gradient-to-br from-[#1E1929] via-[#161220] to-[#0F0D17] border border-purple-400/40 p-3 flex flex-col justify-between overflow-hidden shadow-inner font-mono">
          <div className="flex items-center justify-between text-[10px] text-lavender-accent border-b border-purple-500/20 pb-1">
            <div className="flex items-center space-x-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-lavender-accent" />
              <span className="font-bold">WELLNESS &amp; CINEMA COMMERCE</span>
            </div>
            <span className="text-[9px] text-purple-300 font-bold">WEEKEND</span>
          </div>

          <div className="py-1 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center space-x-1">
                <Film className="w-3 h-3 text-lavender-accent" />
                <span>Entertainment &amp; Dining</span>
              </span>
              <span className="text-lavender-accent font-bold">₹6,000+</span>
            </div>
            <p className="text-[10px] text-archive-300">28% of non-grocery transaction share</p>
          </div>

          <div className="p-1.5 rounded-lg bg-black/50 border border-purple-500/30 flex items-center justify-between text-[10px]">
            <span className="text-purple-300">Evening &amp; Weekend Concentration</span>
            <span className="text-emerald-400 font-bold">Surge ✓</span>
          </div>
        </div>
      );

    // ─────────────────────────────────────────────────────────────
    // 7. AI Anomaly & Risk Sentinel (Urban Transact Ch. 3)
    // ─────────────────────────────────────────────────────────────
    case "anomaly-sentinel":
      return (
        <div className="relative h-32 rounded-xl bg-gradient-to-br from-[#241A14] via-[#1A120E] to-[#120C09] border border-amber-accent/40 p-3 flex flex-col justify-between overflow-hidden shadow-inner font-mono">
          <div className="flex items-center justify-between text-[10px] text-amber-accent border-b border-amber-accent/20 pb-1">
            <div className="flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-accent" />
              <span className="font-bold">RISK SCORING SENTINEL</span>
            </div>
            <span className="text-[9px] text-amber-300 font-bold">TELEMETRY</span>
          </div>

          <div className="py-1 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Isolated Spikes Flagged</span>
              <span className="text-amber-accent">&lt; 6% Volume</span>
            </div>
            <p className="text-[10px] text-archive-400">Higher amounts than median category baseline</p>
          </div>

          <div className="p-1.5 rounded-lg bg-black/50 border border-amber-accent/30 flex items-center justify-between text-[10px]">
            <span className="text-amber-light flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Normal Continuity Resumed</span>
            </span>
            <span className="text-emerald-400 font-bold">Secure</span>
          </div>
        </div>
      );

    // ─────────────────────────────────────────────────────────────
    // 8. 2013 Retro Desktop Web Player (Spotify Ch. 1)
    // ─────────────────────────────────────────────────────────────
    case "web-player":
      return (
        <div className="relative h-32 rounded-xl bg-gradient-to-br from-[#241F18] via-[#1A1813] to-[#14120E] border border-amber-accent/40 p-3 flex flex-col justify-between overflow-hidden shadow-inner font-mono">
          <div className="flex items-center justify-between text-[10px] text-amber-accent border-b border-amber-accent/20 pb-1">
            <div className="flex items-center space-x-1.5">
              <Laptop className="w-3.5 h-3.5 text-amber-accent" />
              <span className="font-bold">DESKTOP WEB PLAYER (2013)</span>
            </div>
            <span className="text-[9px] text-amber-300 font-bold">94% SHARE</span>
          </div>

          <div className="py-1 space-y-1">
            <div className="text-xs font-bold text-white truncate">
              The Mowgli's · Calvin Harris · Lana Del Rey
            </div>
            <div className="text-[10px] text-amber-light/80">
              Low skip rate (&lt; 12%) · Desktop study sessions
            </div>
          </div>

          <div className="p-1.5 rounded-lg bg-black/50 border border-amber-accent/30 flex items-center justify-between text-[10px]">
            <span className="text-amber-light">Born To Die // 18 Months</span>
            <div className="flex items-end space-x-1 h-3 shrink-0">
              <span className="w-1 bg-amber-accent rounded-full animate-eq-1" />
              <span className="w-1 bg-amber-accent rounded-full animate-eq-2" />
              <span className="w-1 bg-amber-accent rounded-full animate-eq-3" />
            </div>
          </div>
        </div>
      );

    // ─────────────────────────────────────────────────────────────
    // 9. Smartphone Commute Scrubber (Spotify Ch. 2)
    // ─────────────────────────────────────────────────────────────
    case "smartphone-audio":
      return (
        <div className="relative h-32 rounded-xl bg-gradient-to-br from-[#1E1929] via-[#161220] to-[#0F0D17] border border-purple-400/40 p-3 flex flex-col justify-between overflow-hidden shadow-inner font-mono">
          <div className="flex items-center justify-between text-[10px] text-lavender-accent border-b border-purple-500/20 pb-1">
            <div className="flex items-center space-x-1.5">
              <Smartphone className="w-3.5 h-3.5 text-lavender-accent" />
              <span className="font-bold">MOBILE MIGRATION LOCKSCREEN</span>
            </div>
            <span className="text-[9px] text-purple-300 font-bold">78% BY 2018</span>
          </div>

          <div className="py-1 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Commute Hours Surge</span>
              <span className="text-lavender-accent">Shuffle: ON</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-purple-400/30 p-0.5">
              <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-lavender-accent w-2/3 animate-pulse" />
            </div>
          </div>

          <div className="p-1.5 rounded-lg bg-black/50 border border-purple-500/30 flex items-center justify-between text-[10px]">
            <span className="text-purple-300">Peak: 08:00–10:00 &amp; 18:00–20:00</span>
            <span className="text-emerald-400 font-bold">Commute ✓</span>
          </div>
        </div>
      );

    // ─────────────────────────────────────────────────────────────
    // 10. Nocturnal Cassette Tape (Spotify Ch. 3)
    // ─────────────────────────────────────────────────────────────
    case "nocturnal-tape":
      return (
        <div className="relative h-32 rounded-xl bg-gradient-to-br from-[#19192E] via-[#121223] to-[#0B0B17] border border-indigo-400/40 p-3 flex flex-col justify-between overflow-hidden shadow-inner font-mono">
          <div className="flex items-center justify-between text-[10px] text-indigo-300 border-b border-indigo-500/20 pb-1">
            <div className="flex items-center space-x-1.5">
              <Moon className="w-3.5 h-3.5 text-indigo-300" />
              <span className="font-bold">NOCTURNAL INSOMNIA REEL</span>
            </div>
            <span className="text-[9px] text-indigo-400 font-bold">01:00 - 04:30</span>
          </div>

          {/* Dual spinning tape reels */}
          <div className="flex items-center justify-around py-1">
            <div className="w-10 h-10 rounded-full bg-black border border-indigo-400 flex items-center justify-center animate-spin-reel">
              <div className="w-4 h-4 rounded-full border border-indigo-300 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              </div>
            </div>
            <div className="text-[10px] text-center text-indigo-200">
              <span className="font-bold block">18,400+</span>
              <span className="text-[9px] text-archive-400">Night Streams</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-black border border-indigo-400 flex items-center justify-center animate-spin-reel">
              <div className="w-4 h-4 rounded-full border border-indigo-300 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              </div>
            </div>
          </div>

          <div className="p-1 rounded bg-black/40 text-center text-[10px] text-indigo-300">
            Ambient, Downtempo &amp; Acoustic Autoplay
          </div>
        </div>
      );

    // ─────────────────────────────────────────────────────────────
    // 11. Golden Vinyl Disc Record (Spotify Ch. 4)
    // ─────────────────────────────────────────────────────────────
    case "golden-vinyl":
      return (
        <div className="relative h-32 rounded-xl bg-gradient-to-br from-[#261E14] via-[#1E170E] to-[#120D08] border border-[#E6A868]/50 p-3 flex flex-col justify-between overflow-hidden shadow-inner font-mono">
          <div className="flex items-center justify-between text-[10px] text-[#E6A868] border-b border-[#E6A868]/20 pb-1">
            <div className="flex items-center space-x-1.5">
              <Disc className="w-3.5 h-3.5 text-[#E6A868]" />
              <span className="font-bold">ANALOG VINYL DISCOGRAPHY</span>
            </div>
            <span className="text-[9px] text-amber-300 font-bold">LOOPS</span>
          </div>

          <div className="flex items-center space-x-3 py-1">
            {/* Spinning Golden Vinyl */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-neutral-900 via-amber-950 to-neutral-900 border-2 border-[#E6A868] flex items-center justify-center animate-spin-vinyl shrink-0 shadow-lg">
              <div className="w-5 h-5 rounded-full bg-black border border-[#E6A868] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#E6A868]" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">The Beatles 13.6k</div>
              <div className="text-[10px] text-archive-300 truncate">The Killers 6.8k · Mayer 4.8k</div>
              <div className="text-[9px] text-emerald-400 font-semibold">&lt; 5% Skip Rate</div>
            </div>
          </div>

          <div className="p-1 rounded bg-black/40 text-center text-[10px] text-[#E6A868]">
            Sequential Concept Album Immersion
          </div>
        </div>
      );

    // Default generic archive
    default:
      return (
        <div className="relative h-32 rounded-xl bg-black/40 border border-archive-700 p-3 flex flex-col justify-between">
          <span className="text-xs font-bold text-paper">{chapter.title}</span>
          <span className="text-xs text-archive-400">{chapter.theme}</span>
        </div>
      );
  }
}
