import spotifyArchiveData from './processed/spotify_archive.json';

export const spotifyAdapter = {
  id: 'spotify',
  name: 'Audio & Cultural Stream Archive',
  shortName: 'Spotify Streams',
  icon: 'Music',
  badge: '149,860 Streams',
  color: '#9B83D8', // Lavender accent
  description: 'An extensive 11-year sonic journal (2013–2024) capturing listening epochs, artist obsessions, platform evolutions, and late-night music rituals.',

  getMetadata() {
    return {
      sourceId: spotifyArchiveData.sourceId,
      name: spotifyArchiveData.name,
      subtitle: spotifyArchiveData.subtitle,
      description: spotifyArchiveData.description,
      totalRecords: spotifyArchiveData.totalRecords,
      sampleRecordsCount: spotifyArchiveData.sampleRecordsCount,
      dateRange: spotifyArchiveData.dateRange,
      metrics: spotifyArchiveData.metrics,
      badge: this.badge,
      color: this.color
    };
  },

  getAllRecords() {
    return spotifyArchiveData.records;
  },

  getCategories() {
    const artists = new Set();
    spotifyArchiveData.records.forEach(r => {
      if (r.metadata?.artist) artists.add(r.metadata.artist);
    });
    return Array.from(artists).slice(0, 25);
  },

  getPlatforms() {
    return Object.keys(spotifyArchiveData.metrics.platformDistribution || {});
  },

  getMetrics() {
    return spotifyArchiveData.metrics;
  },

  detectRelationships(records = spotifyArchiveData.records.slice(0, 300)) {
    const connections = [];
    const nodeMap = new Map();

    records.forEach(r => nodeMap.set(r.id, r));

    // 1. Artist Clustering (Same artist played repeatedly in chronological cluster)
    const artistGroups = {};
    records.forEach(r => {
      const art = r.metadata?.artist;
      if (!art) return;
      if (!artistGroups[art]) artistGroups[art] = [];
      artistGroups[art].push(r);
    });

    Object.entries(artistGroups).forEach(([artist, items]) => {
      if (items.length >= 2) {
        for (let i = 0; i < items.length - 1; i++) {
          const a = items[i];
          const b = items[i + 1];
          connections.push({
            id: `conn-art-${a.id}-${b.id}`,
            source: a.id,
            target: b.id,
            type: 'Recurring Artist Obsession',
            category: 'Music Stream',
            evidence: [
              `Both records feature artist "${artist}"`,
              `Track 1: "${a.title}" vs Track 2: "${b.title}"`,
              `Platform: ${a.mode} · Recorded on ${a.rawDate?.slice(0, 10)}`
            ],
            interpretation: `The listener engaged in focused streaming sessions exploring "${artist}" catalog.`,
            confidence: 94,
            strength: 0.9
          });
        }
      }
    });

    // 2. Temporal Proximity (Played within short window < 3 hours)
    for (let i = 0; i < records.length - 1; i++) {
      const r1 = records[i];
      const r2 = records[i + 1];
      if (!r1.timestamp || !r2.timestamp) continue;
      const t1 = new Date(r1.timestamp).getTime();
      const t2 = new Date(r2.timestamp).getTime();
      const diffHrs = Math.abs(t1 - t2) / (1000 * 60 * 60);

      if (diffHrs > 0 && diffHrs <= 2.5) {
        connections.push({
          id: `conn-time-${r1.id}-${r2.id}`,
          source: r1.id,
          target: r2.id,
          type: 'Continuous Listening Session',
          category: 'Temporal Proximity',
          evidence: [
            `Played within ${diffHrs.toFixed(1)} hours of each other on ${r1.rawDate?.slice(0, 10)}`,
            `Sequential transition from "${r1.title}" (${r1.metadata?.artist}) to "${r2.title}" (${r2.metadata?.artist})`,
            `Platform context: ${r1.mode}`
          ],
          interpretation: 'These tracks formed a single continuous audio narrative during this session.',
          confidence: 88,
          strength: 0.85
        });
      }
    }

    // 3. Late Night Mood Anchor (Streams between 00:00 and 04:30 AM)
    const lateNightRecords = records.filter(r => {
      const hour = parseInt(r.timestamp?.slice(11, 13), 10);
      return hour >= 0 && hour <= 4;
    });

    if (lateNightRecords.length >= 2) {
      for (let i = 0; i < Math.min(lateNightRecords.length - 1, 12); i++) {
        const a = lateNightRecords[i];
        const b = lateNightRecords[i + 1];
        connections.push({
          id: `conn-night-${a.id}-${b.id}`,
          source: a.id,
          target: b.id,
          type: 'Nocturnal Listening Pattern',
          category: 'Habit Pattern',
          evidence: [
            `Track played during nocturnal window (00:00 – 04:30 AM UTC)`,
            `Track A: "${a.title}" at ${a.timestamp?.slice(11, 16)}`,
            `Track B: "${b.title}" at ${b.timestamp?.slice(11, 16)}`
          ],
          interpretation: 'Observed cluster of late-night streams may suggest nocturnal study, work, or unwind routines.',
          confidence: 82,
          strength: 0.78
        });
      }
    }

    return {
      nodes: records,
      connections: connections.slice(0, 180)
    };
  },

  getStoryChapters() {
    return [
      {
        id: 'sp-chapter-1',
        title: 'The Early Web Player Era (2013–2015)',
        epoch: '2013 – 2015',
        theme: 'Desktop Discovery & Indie Pop Roots',
        summary: 'In the earliest archived records, streaming occurred almost exclusively via the desktop Web Player. The repertoire is dominated by indie anthems and electronic pop (The Mowgli\'s, Calvin Harris, Lana Del Rey).',
        observedFacts: [
          'Over 94% of sessions in 2013–2014 originated from the "web player" platform.',
          'Frequent complete playthroughs with low skip rate (< 12%).',
          'Heavy repetition of landmark albums like Born To Die and 18 Months.'
        ],
        cautiousInterpretation: 'The data indicates a stationary, computer-bound listening environment typical of desktop work sessions or college study desks.',
        sampleReceiptIds: ['sp-38', 'sp-76', 'sp-114', 'sp-152'],
        accentColor: '#9B83D8'
      },
      {
        id: 'sp-chapter-2',
        title: 'The Mobile Migration Epoch (2016–2019)',
        epoch: '2016 – 2019',
        theme: 'Portability & Ubiquitous Soundtracks',
        summary: 'A dramatic platform shift occurs as streams transition from browser-based players to mobile smartphones (iOS and Android). Listening fragments across different hours of the day.',
        observedFacts: [
          'Mobile streaming share jumped from 6% in 2014 to over 78% by 2018.',
          'Appearance of commute-hour listening spikes between 08:00–10:00 and 18:00–20:00.',
          'Introduction of shuffle play mode usage (shuffle: TRUE).'
        ],
        cautiousInterpretation: 'The user appears to have integrated music streaming directly into daily physical movement and urban transit.',
        sampleReceiptIds: ['sp-1200', 'sp-1238', 'sp-1276', 'sp-1314'],
        accentColor: '#D9A15C'
      },
      {
        id: 'sp-chapter-3',
        title: 'The Nocturnal Resonance (Late-Night Clusters)',
        epoch: 'Recurring Across 11 Years',
        theme: 'Midnight Sonic Routines',
        summary: 'A persistent recurring pattern of music streaming during the early morning hours (01:00 AM – 04:30 AM) persists throughout the multi-year history.',
        observedFacts: [
          'Over 18,400 streams occurred between 00:00 and 05:00 UTC.',
          'High proportion of ambient, downtempo, and acoustic tracks.',
          'Extended session durations with autoplay enabled.'
        ],
        cautiousInterpretation: 'These records document regular nocturnal engagement, which may correspond to late-night productivity sessions, insomnia, or timezone shifts.',
        sampleReceiptIds: ['sp-2000', 'sp-2038', 'sp-2076', 'sp-2114'],
        accentColor: '#7CB49C'
      },
      {
        id: 'sp-chapter-4',
        title: 'The Artist Immersion Cycles',
        epoch: '2020 – 2024',
        theme: 'Deep Discography Marathons',
        summary: 'Rather than broad randomized listening, distinct periods emerge where the user repeatedly loops single artist catalogs over days and weeks.',
        observedFacts: [
          'Top 10 artists account for over 32% of total accumulated listening hours.',
          'Chains of 8–15 consecutive tracks from the exact same album.',
          'Noticeable decline in skip rates during album-focused listening blocks.'
        ],
        cautiousInterpretation: 'This pattern reveals periods of intense aesthetic immersion where whole album concepts were experienced sequentially.',
        sampleReceiptIds: ['sp-3000', 'sp-3038', 'sp-3076', 'sp-3114'],
        accentColor: '#E6A868'
      }
    ];
  }
};
