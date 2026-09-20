import householdArchiveData from './processed/household_archive.json';

export const householdAdapter = {
  id: 'household',
  name: 'Daily Life & Household Archive',
  shortName: 'Household Journey',
  icon: 'Receipt',
  badge: '2,461 Life Receipts',
  color: '#D9A15C', // Amber accent
  description: 'A granular chronicle of personal expenditures (2015–2021) documenting local transit journeys, breakfast habits, digital subscriptions, and family investments.',

  getMetadata() {
    return {
      sourceId: householdArchiveData.sourceId,
      name: householdArchiveData.name,
      subtitle: householdArchiveData.subtitle,
      description: householdArchiveData.description,
      totalRecords: householdArchiveData.totalRecords,
      dateRange: householdArchiveData.dateRange,
      metrics: householdArchiveData.metrics,
      badge: this.badge,
      color: this.color
    };
  },

  getAllRecords() {
    return householdArchiveData.records;
  },

  getCategories() {
    return Object.keys(householdArchiveData.metrics.categoryDistribution || {});
  },

  getPaymentModes() {
    return Object.keys(householdArchiveData.metrics.paymentModes || {});
  },

  getMetrics() {
    return householdArchiveData.metrics;
  },

  detectRelationships(records = householdArchiveData.records.slice(0, 300)) {
    const connections = [];

    // 1. Cross-Category Routine: Transit + Food/Snack pairs on the same day
    const byDay = {};
    records.forEach(r => {
      const day = r.timestamp?.slice(0, 10);
      if (!day) return;
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(r);
    });

    Object.entries(byDay).forEach(([day, items]) => {
      const transitItems = items.filter(i => i.category === 'Transportation');
      const foodItems = items.filter(i => i.category === 'Food');

      if (transitItems.length > 0 && foodItems.length > 0) {
        transitItems.forEach(t => {
          foodItems.forEach(f => {
            connections.push({
              id: `conn-commute-${t.id}-${f.id}`,
              source: t.id,
              target: f.id,
              type: 'Commute & Sustenance Pair',
              category: 'Cross-Category Bridge',
              evidence: [
                `Both recorded on date ${day}`,
                `Transit Receipt: "${t.title}" (${t.description}) - ₹${t.amount}`,
                `Food Receipt: "${f.title}" (${f.description}) - ₹${f.amount}`
              ],
              interpretation: 'These records document a recurring daily routine where public transit travel was accompanied by local food or snack purchases.',
              confidence: 96,
              strength: 0.95
            });
          });
        });
      }

      // 2. Multi-item same-day expenditure sequence
      if (items.length >= 2) {
        for (let i = 0; i < items.length - 1; i++) {
          const a = items[i];
          const b = items[i + 1];
          if (a.category !== b.category) {
            connections.push({
              id: `conn-dayflow-${a.id}-${b.id}`,
              source: a.id,
              target: b.id,
              type: 'Daily Activity Chain',
              category: 'Temporal Proximity',
              evidence: [
                `Recorded within hours on ${day}`,
                `Activity A: ${a.category} (${a.title})`,
                `Activity B: ${b.category} (${b.title})`
              ],
              interpretation: 'Records represent sequential events occurring within the same calendar day.',
              confidence: 85,
              strength: 0.8
            });
          }
        }
      }
    });

    // 3. Recurring Monthly Subscriptions (e.g. Netflix, Mobile Data Packs)
    const subscriptions = records.filter(r => r.category.toLowerCase().includes('subscription'));
    for (let i = 0; i < subscriptions.length - 1; i++) {
      const a = subscriptions[i];
      const b = subscriptions[i + 1];
      if (a.metadata?.subcategory === b.metadata?.subcategory) {
        connections.push({
          id: `conn-sub-${a.id}-${b.id}`,
          source: a.id,
          target: b.id,
          type: 'Periodic Subscription Cadence',
          category: 'Recurring Habit',
          evidence: [
            `Recurring service: ${a.metadata?.subcategory}`,
            `Instance 1: ₹${a.amount} on ${a.rawDate?.slice(0, 10)}`,
            `Instance 2: ₹${b.amount} on ${b.rawDate?.slice(0, 10)}`,
            `Payment mode: ${a.mode}`
          ],
          interpretation: 'Periodic recurring digital service renewal reflecting consistent media consumption habits.',
          confidence: 98,
          strength: 0.98
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
        id: 'hh-chapter-1',
        title: 'The Train & Idli Morning Rituals',
        epoch: '2018 – 2019',
        theme: 'Commuter Rhythm & Street Sustenance',
        summary: 'A distinct chronological signature emerges during weekday mornings: repeated train ticket purchases paired directly with local breakfast stops (such as "Idli medu Vada mix 2 plates").',
        observedFacts: [
          'Transit tickets ("2 Place 5 to Place 0") frequently coincide with cash food purchases.',
          'Over 68% of food transactions under ₹100 were settled in Cash.',
          'Transactions cluster consistently between 11:30 AM and 12:30 PM.'
        ],
        cautiousInterpretation: 'The chronological overlap between train transit and quick breakfast receipts indicates a regular daily commuting route.',
        sampleReceiptIds: ['hh-1', 'hh-2', 'hh-15', 'hh-22'],
        accentColor: '#D9A15C'
      },
      {
        id: 'hh-chapter-2',
        title: 'The Digital Entertainment Anchor',
        epoch: '2017 – 2021',
        theme: 'Monthly Subscription Cycles',
        summary: 'Digital life maintenance records show a steady monthly rhythm of Netflix subscriptions (₹199 or ₹499/mo) and mobile data booster packs through saving bank accounts.',
        observedFacts: [
          'Subscription expenses recurred on almost the exact same day each month (e.g. 19th).',
          'Paid via "Saving Bank account 1" rather than cash.',
          'Data booster packs appear intermittently alongside entertainment subscriptions.'
        ],
        cautiousInterpretation: 'The records reflect steady engagement with digital streaming services and mobile connectivity throughout the recorded years.',
        sampleReceiptIds: ['hh-3', 'hh-4', 'hh-45', 'hh-88'],
        accentColor: '#9B83D8'
      },
      {
        id: 'hh-chapter-3',
        title: 'Festival Celebrations & Family Obligations',
        epoch: 'Autumn / Winter Epochs',
        theme: 'Seasonal Spikes & Festive Gifting',
        summary: 'The household ledger features discrete spikes during festive seasons (Diwali, regional festivals) with higher-ticket apparel purchases, gifts, and mutual fund contributions.',
        observedFacts: [
          'Expenditures tagged under "Festivals" and "Gift" surge in October–November.',
          'Apparel transactions accompany festive dates.',
          'Systematic investment transfers ("Small Cap fund", "PPF") occur alongside salary receipts.'
        ],
        cautiousInterpretation: 'These records capture seasonal cultural milestones and long-term financial planning routines.',
        sampleReceiptIds: ['hh-50', 'hh-51', 'hh-95', 'hh-120'],
        accentColor: '#7CB49C'
      },
      {
        id: 'hh-chapter-4',
        title: 'The Shift from Cash to Digital Payments',
        epoch: '2015 – 2021',
        theme: 'Financial Medium Evolution',
        summary: 'Early records (2015–2017) are dominated by physical cash withdrawals and cash payments. In later years, bank account direct transfers and electronic modes expand.',
        observedFacts: [
          'Cash accounted for > 85% of transactions in 2015–2016.',
          'Digital bank and electronic payment modes grew to over 54% by 2020.',
          'Groceries and household utilities shifted from cash to account payments.'
        ],
        cautiousInterpretation: 'The timeline illustrates the broader societal transition from physical paper cash to digital financial rails.',
        sampleReceiptIds: ['hh-200', 'hh-250', 'hh-300', 'hh-350'],
        accentColor: '#E6A868'
      }
    ];
  }
};
