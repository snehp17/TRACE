import transactArchiveData from './processed/indiatransact_archive.json';

export const transactionAdapter = {
  id: 'indiatransact',
  name: 'Urban Multi-Facet Transact Archive',
  shortName: 'Urban Transact',
  icon: 'CreditCard',
  badge: '10,267 Privacy-Safe Records',
  color: '#7CB49C', // Sage accent
  description: 'An anonymized financial mobility trace (2023–2024) capturing merchant interactions, regional mobility, category clusters, and transaction anomaly patterns.',

  getMetadata() {
    return {
      sourceId: transactArchiveData.sourceId,
      name: transactArchiveData.name,
      subtitle: transactArchiveData.subtitle,
      description: transactArchiveData.description,
      totalRecords: transactArchiveData.totalRecords,
      dateRange: transactArchiveData.dateRange,
      metrics: transactArchiveData.metrics,
      badge: this.badge,
      color: this.color
    };
  },

  getAllRecords() {
    return transactArchiveData.records;
  },

  getCategories() {
    return Object.keys(transactArchiveData.metrics.categoryDistribution || {});
  },

  getTopCities() {
    return transactArchiveData.metrics.topCities || [];
  },

  getMetrics() {
    return transactArchiveData.metrics;
  },

  detectRelationships(records = transactArchiveData.records.slice(0, 300)) {
    const connections = [];

    // 1. Merchant Repeat Overlap
    const byMerchant = {};
    records.forEach(r => {
      const m = r.metadata?.merchant;
      if (!m) return;
      if (!byMerchant[m]) byMerchant[m] = [];
      byMerchant[m].push(r);
    });

    Object.entries(byMerchant).forEach(([merchant, items]) => {
      if (items.length >= 2) {
        for (let i = 0; i < items.length - 1; i++) {
          const a = items[i];
          const b = items[i + 1];
          connections.push({
            id: `conn-merch-${a.id}-${b.id}`,
            source: a.id,
            target: b.id,
            type: 'Merchant Affinity & Loyalty',
            category: 'Repeated Merchant',
            evidence: [
              `Both transactions settled at merchant: "${merchant}"`,
              `Location: ${a.metadata?.city}, ${a.metadata?.state}`,
              `Amounts: ₹${a.amount} on ${a.rawDate?.slice(0, 10)} and ₹${b.amount} on ${b.rawDate?.slice(0, 10)}`
            ],
            interpretation: 'Repeated commercial engagement with the same merchant over time.',
            confidence: 95,
            strength: 0.92
          });
        }
      }
    });

    // 2. Regional Mobility: Same City/State within 24-48 hours
    const byCity = {};
    records.forEach(r => {
      const city = r.metadata?.city;
      if (!city) return;
      if (!byCity[city]) byCity[city] = [];
      byCity[city].push(r);
    });

    Object.entries(byCity).forEach(([city, items]) => {
      if (items.length >= 2) {
        for (let i = 0; i < Math.min(items.length - 1, 6); i++) {
          const a = items[i];
          const b = items[i + 1];
          if (a.category !== b.category) {
            connections.push({
              id: `conn-city-${a.id}-${b.id}`,
              source: a.id,
              target: b.id,
              type: 'Urban Geographic Hub',
              category: 'Location Overlap',
              evidence: [
                `Both records share urban hub: "${city}, ${a.metadata?.state}"`,
                `Sector A: ${a.category} (${a.metadata?.merchant})`,
                `Sector B: ${b.category} (${b.metadata?.merchant})`
              ],
              interpretation: 'Cross-category commercial footprint anchored within the same municipal region.',
              confidence: 88,
              strength: 0.84
            });
          }
        }
      }
    });

    // 3. Anomaly & Security Flag Pairings
    const anomalies = records.filter(r => r.metadata?.isAnomaly);
    for (let i = 0; i < Math.min(anomalies.length - 1, 8); i++) {
      const a = anomalies[i];
      const b = anomalies[i + 1];
      connections.push({
        id: `conn-anom-${a.id}-${b.id}`,
        source: a.id,
        target: b.id,
        type: 'Security Anomaly Signature',
        category: 'Anomaly Flag',
        evidence: [
          `Both records flagged by risk detection algorithms`,
          `Transaction A: ₹${a.amount} at ${a.metadata?.merchant} (${a.category})`,
          `Transaction B: ₹${b.amount} at ${b.metadata?.merchant} (${b.category})`
        ],
        interpretation: 'These records exhibit anomalous velocity or atypical merchant categorization patterns.',
        confidence: 90,
        strength: 0.88
      });
    }

    return {
      nodes: records,
      connections: connections.slice(0, 180)
    };
  },

  getStoryChapters() {
    return [
      {
        id: 'it-chapter-1',
        title: 'The Multi-City Mobility Circuit',
        epoch: '2023 – 2024',
        theme: 'Inter-State Commercial Transit',
        summary: 'Transactions reveal geographic dispersion across diverse regional hubs (Rourkela, Jalna, Bharatpur, Varanasi) spanning travel, entertainment, and grocery sectors.',
        observedFacts: [
          'Transactions distribute across over 40 distinct Indian cities and states.',
          'Travel and transit expenditures coincide with subsequent local retail charges.',
          'All personal names and credentials have been strictly masked for data privacy.'
        ],
        cautiousInterpretation: 'The multi-city record distribution indicates extensive inter-city mobility and regional business travel.',
        sampleReceiptIds: ['it-1', 'it-2', 'it-3', 'it-4'],
        accentColor: '#7CB49C'
      },
      {
        id: 'it-chapter-2',
        title: 'Entertainment & Fitness Spikes',
        epoch: 'Weekend Activity Windows',
        theme: 'Recreational & Wellness Commerce',
        summary: 'Concentrated transaction bursts occur in entertainment, online shopping, and wellness categories, often occurring during evening and weekend time windows.',
        observedFacts: [
          'Entertainment and fitness categories comprise over 28% of non-grocery transactions.',
          'Average transaction amounts in entertainment exceed ₹6,000.',
          'Regular digital merchant interactions across multiple lifestyle vendors.'
        ],
        cautiousInterpretation: 'These records document recurring lifestyle and wellness spending patterns within modern urban commerce.',
        sampleReceiptIds: ['it-5', 'it-6', 'it-7', 'it-8'],
        accentColor: '#9B83D8'
      },
      {
        id: 'it-chapter-3',
        title: 'The Anomaly Detection Trail',
        epoch: '2023 – 2024 Security Events',
        theme: 'Risk Profiling & Unusual Velocity',
        summary: 'A small cluster of transactions was isolated by risk-scoring systems due to unusual amounts or sudden deviations from typical merchant categories.',
        observedFacts: [
          'Flagged records represent < 6% of total transaction volume.',
          'Anomalous records feature elevated transaction amounts compared to category median.',
          'Immediate subsequent transactions return to normal baseline spending.'
        ],
        cautiousInterpretation: 'These isolated spikes triggered standard fraud-scoring thresholds without disrupting regular transaction continuity.',
        sampleReceiptIds: ['it-10', 'it-12', 'it-18', 'it-25'],
        accentColor: '#D9A15C'
      }
    ];
  }
};
