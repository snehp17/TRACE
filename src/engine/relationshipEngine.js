/**
 * TRACE Relationship Discovery Engine
 * Implements rule-based, evidence-backed relationship detection
 * across temporal, geographic, category, and habit dimensions.
 */

export function analyzeConnections(records, options = {}) {
  const maxNodes = options.maxNodes || 120;
  const sample = records.slice(0, maxNodes);
  const connections = [];
  const connectionCounts = {};

  // 1. Same Day or Temporal Proximity
  for (let i = 0; i < sample.length - 1; i++) {
    const a = sample[i];
    const b = sample[i + 1];

    if (a.timestamp && b.timestamp) {
      const tA = new Date(a.timestamp).getTime();
      const tB = new Date(b.timestamp).getTime();
      const diffHours = Math.abs(tA - tB) / (1000 * 60 * 60);

      if (diffHours <= 6 && !isNaN(diffHours)) {
        const connId = `time-${a.id}-${b.id}`;
        connections.push({
          id: connId,
          source: a.id,
          target: b.id,
          sourceReceipt: a,
          targetReceipt: b,
          type: 'Temporal Proximity',
          evidence: [
            `Occurred within ${diffHours < 1 ? Math.round(diffHours * 60) + ' minutes' : diffHours.toFixed(1) + ' hours'} of each other`,
            `Receipt A: "${a.title}" (${a.category})`,
            `Receipt B: "${b.title}" (${b.category})`,
            `Date: ${a.rawDate || a.timestamp}`
          ],
          interpretation: 'These records occurred in close temporal sequence, representing related steps in a single daily journey.',
          confidence: Math.min(96, Math.max(70, Math.round(98 - diffHours * 3))),
          strength: Math.max(0.4, 1 - diffHours / 12)
        });

        connectionCounts[a.id] = (connectionCounts[a.id] || 0) + 1;
        connectionCounts[b.id] = (connectionCounts[b.id] || 0) + 1;
      }
    }
  }

  // 2. Category / Subcategory / Topic Affinity
  const categoryGroups = {};
  sample.forEach(r => {
    const key = r.subcategory || r.category;
    if (!key) return;
    if (!categoryGroups[key]) categoryGroups[key] = [];
    categoryGroups[key].push(r);
  });

  Object.entries(categoryGroups).forEach(([topic, items]) => {
    if (items.length >= 2) {
      for (let i = 0; i < Math.min(items.length - 1, 3); i++) {
        const a = items[i];
        const b = items[i + 1];
        if (a.id === b.id) continue;

        const connId = `cat-${a.id}-${b.id}`;
        connections.push({
          id: connId,
          source: a.id,
          target: b.id,
          sourceReceipt: a,
          targetReceipt: b,
          type: 'Repeated Behavioral Affinity',
          evidence: [
            `Both receipts share common topic/category: "${topic}"`,
            `Instance 1: "${a.title}" on ${a.rawDate?.slice(0, 10) || a.timestamp?.slice(0, 10)}`,
            `Instance 2: "${b.title}" on ${b.rawDate?.slice(0, 10) || b.timestamp?.slice(0, 10)}`
          ],
          interpretation: `Repeated engagement with "${topic}" indicates recurring personal routine or interest.`,
          confidence: 90,
          strength: 0.85
        });

        connectionCounts[a.id] = (connectionCounts[a.id] || 0) + 1;
        connectionCounts[b.id] = (connectionCounts[b.id] || 0) + 1;
      }
    }
  });

  // Assign connection counts to nodes
  const nodes = sample.map(n => ({
    ...n,
    connectionCount: connectionCounts[n.id] || 0
  }));

  return {
    nodes,
    connections: connections.slice(0, 160)
  };
}

export function filterReceipts(records, filters = {}) {
  let filtered = [...records];

  // Search query (title, description, category, subcategory, location, note, date)
  if (filters.search && filters.search.trim()) {
    const query = filters.search.toLowerCase().trim();
    filtered = filtered.filter(r => {
      const matchTitle = r.title?.toLowerCase().includes(query);
      const matchDesc = r.description?.toLowerCase().includes(query);
      const matchCat = r.category?.toLowerCase().includes(query);
      const matchSub = r.subcategory?.toLowerCase().includes(query);
      const matchLoc = r.location?.toLowerCase().includes(query);
      const matchNote = r.metadata?.note?.toLowerCase().includes(query);
      const matchArtist = r.metadata?.artist?.toLowerCase().includes(query);
      const matchMerchant = r.metadata?.merchant?.toLowerCase().includes(query);
      const matchDate = r.timestamp?.toLowerCase().includes(query) || r.rawDate?.toLowerCase().includes(query);
      return matchTitle || matchDesc || matchCat || matchSub || matchLoc || matchNote || matchArtist || matchMerchant || matchDate;
    });
  }

  // Specific Calendar Date filter (e.g., '2024-05-12' or '12/05/2024')
  if (filters.date && filters.date.trim()) {
    const target = filters.date.trim();
    filtered = filtered.filter(r => {
      const ts = r.timestamp || '';
      const raw = r.rawDate || '';
      if (ts.startsWith(target)) return true;
      if (raw.startsWith(target)) return true;
      // If target is YYYY-MM-DD, also check DD/MM/YYYY variants
      if (target.includes('-')) {
        const parts = target.split('-');
        if (parts.length === 3) {
          const [y, m, d] = parts;
          const alt1 = `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
          const alt2 = `${parseInt(d, 10)}/${parseInt(m, 10)}/${y}`;
          const alt3 = `${m.padStart(2, '0')}/${d.padStart(2, '0')}/${y}`;
          if (raw.includes(alt1) || raw.includes(alt2) || raw.includes(alt3)) return true;
        }
      }
      return false;
    });
  }

  // Day of Week filter (e.g., 'Wednesday')
  if (filters.dayOfWeek && filters.dayOfWeek !== 'all') {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    filtered = filtered.filter(r => {
      if (!r.timestamp) return false;
      const d = new Date(r.timestamp);
      return !isNaN(d.getTime()) && dayNames[d.getDay()] === filters.dayOfWeek;
    });
  }

  // Category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(r => 
      r.category?.toLowerCase() === filters.category.toLowerCase() ||
      r.subcategory?.toLowerCase() === filters.category.toLowerCase() ||
      r.metadata?.artist?.toLowerCase() === filters.category.toLowerCase()
    );
  }

  // Payment mode / platform filter
  if (filters.mode && filters.mode !== 'all') {
    filtered = filtered.filter(r => r.mode?.toLowerCase() === filters.mode.toLowerCase());
  }

  // Year filter
  if (filters.year && filters.year !== 'all') {
    filtered = filtered.filter(r => r.timestamp?.startsWith(filters.year) || r.rawDate?.includes(filters.year));
  }

  // Sort
  if (filters.sortBy === 'date-asc') {
    filtered.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
  } else if (filters.sortBy === 'amount-desc') {
    filtered.sort((a, b) => (b.amount || 0) - (a.amount || 0));
  } else if (filters.sortBy === 'amount-asc') {
    filtered.sort((a, b) => (a.amount || 0) - (b.amount || 0));
  } else {
    // default: date-desc
    filtered.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  }

  return filtered;
}
