/**
 * Chapter Aesthetics & Theme Resolution Engine
 * Resolves tailored vibes, emojis, accent colors, and visual types
 * for narrative story chapters across Household, Transact, and Spotify archives.
 */

export function getChapterAesthetics(chapter, adapterId = "") {
  const id = (chapter?.id || "").toLowerCase();
  const title = (chapter?.title || "").toLowerCase();
  const theme = (chapter?.theme || "").toLowerCase();

  // 1. Household Journey Chapters
  if (id.includes("hh-chapter-1") || title.includes("train") || title.includes("idli")) {
    return {
      vibe: "COMMUTER SUBWAY & MORNING RITUAL",
      emoji: "🚂",
      accentColor: "#D9A15C",
      glowClass: "story-glow-amber",
      categoryTag: "TRANSIT & MORNING SUSTENANCE",
      visualType: "train-ticket"
    };
  }
  if (id.includes("hh-chapter-2") || title.includes("entertainment") || title.includes("subscription")) {
    return {
      vibe: "STREAMING & TELECOM SUBSCRIBER LOOPS",
      emoji: "📡",
      accentColor: "#9B83D8",
      glowClass: "story-glow-purple",
      categoryTag: "MONTHLY RECURRING AUTOPAY",
      visualType: "digital-streaming"
    };
  }
  if (id.includes("hh-chapter-3") || title.includes("festival") || title.includes("festive")) {
    return {
      vibe: "SEASONAL FESTIVITIES & CULTURAL SURGES",
      emoji: "🪔",
      accentColor: "#E6A868",
      glowClass: "story-glow-amber",
      categoryTag: "AUTUMN DIWALI & MILESTONE LEDGER",
      visualType: "festive-gift"
    };
  }
  if (id.includes("hh-chapter-4") || title.includes("cash") || title.includes("digital payments")) {
    return {
      vibe: "FINANCIAL PARADIGM: CASH TO DIGITAL RAILS",
      emoji: "💳",
      accentColor: "#7CB49C",
      glowClass: "story-glow-sage",
      categoryTag: "FINANCIAL MEDIUM EVOLUTION",
      visualType: "cash-digital"
    };
  }

  // 2. Urban Transact Chapters
  if (id.includes("it-chapter-1") || title.includes("multi-city") || title.includes("circuit")) {
    return {
      vibe: "INTER-STATE HIGH-VELOCITY TRANSIT",
      emoji: "🗺️",
      accentColor: "#7CB49C",
      glowClass: "story-glow-sage",
      categoryTag: "40+ REGIONAL HUBS MAPPED",
      visualType: "multi-city"
    };
  }
  if (id.includes("it-chapter-2") || title.includes("fitness") || title.includes("entertainment")) {
    return {
      vibe: "WEEKEND WELLNESS & RECREATIONAL BURSTS",
      emoji: "🏋️",
      accentColor: "#9B83D8",
      glowClass: "story-glow-purple",
      categoryTag: "LIFESTYLE & FITNESS PASS",
      visualType: "lifestyle-pass"
    };
  }
  if (id.includes("it-chapter-3") || title.includes("anomaly") || title.includes("detection")) {
    return {
      vibe: "AI RISK TELEMETRY & SECURITY SENTINEL",
      emoji: "🛡️",
      accentColor: "#D9A15C",
      glowClass: "story-glow-amber",
      categoryTag: "ISOLATED VELOCITY DRIFT (<6%)",
      visualType: "anomaly-sentinel"
    };
  }

  // 3. Spotify Chapters
  if (id.includes("sp-chapter-1") || title.includes("web player") || title.includes("2013")) {
    return {
      vibe: "2013 TUMBLR & INDIE SLEAZE ROOTS",
      emoji: "💻",
      accentColor: "#D9A15C",
      glowClass: "story-glow-amber",
      categoryTag: "HTML5 DESKTOP BROWSER DECK",
      visualType: "web-player"
    };
  }
  if (id.includes("sp-chapter-2") || title.includes("mobile") || title.includes("migration")) {
    return {
      vibe: "SMARTPHONE & URBAN COMMUTE SOUNDTRACKS",
      emoji: "📱",
      accentColor: "#9B83D8",
      glowClass: "story-glow-purple",
      categoryTag: "MOBILE COMMUTE SCRUBBER",
      visualType: "smartphone-audio"
    };
  }
  if (id.includes("sp-chapter-3") || title.includes("nocturnal") || title.includes("late-night")) {
    return {
      vibe: "12 AM INSOMNIA & MIDNIGHT RESONANCE",
      emoji: "🌙",
      accentColor: "#818CF8",
      glowClass: "story-glow-purple",
      categoryTag: "NIGHT SESSIONS // 01:00 - 04:30",
      visualType: "nocturnal-tape"
    };
  }
  if (id.includes("sp-chapter-4") || title.includes("artist") || title.includes("immersion")) {
    return {
      vibe: "UNHINGED ALBUM DISCOGRAPHY MARATHONS",
      emoji: "💿",
      accentColor: "#E6A868",
      glowClass: "story-glow-amber",
      categoryTag: "COLLECTOR'S VINYL RECORD",
      visualType: "golden-vinyl"
    };
  }

  // Generic / Default
  return {
    vibe: "VERIFIED CHRONOLOGICAL ERA",
    emoji: "✦",
    accentColor: "#D9A15C",
    glowClass: "story-glow-amber",
    categoryTag: "EVIDENCE-GROUNDED CHAPTER",
    visualType: "generic-archive"
  };
}
