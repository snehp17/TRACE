import { spotifyAdapter } from './spotifyAdapter.js';
import { householdAdapter } from './householdAdapter.js';
import { transactionAdapter } from './transactionAdapter.js';

export const ALL_ADAPTERS = [
  householdAdapter,
  spotifyAdapter,
  transactionAdapter
];

export const ADAPTER_MAP = {
  household: householdAdapter,
  spotify: spotifyAdapter,
  indiatransact: transactionAdapter
};

export const dataRegistry = {
  getAdapters() {
    return ALL_ADAPTERS;
  },

  getAdapter(sourceId) {
    return ADAPTER_MAP[sourceId] || householdAdapter;
  },

  getGlobalSummary() {
    const totalReceipts = ALL_ADAPTERS.reduce((sum, a) => sum + (a.getMetadata().totalRecords || 0), 0);
    const totalCategories = ALL_ADAPTERS.reduce((sum, a) => {
      const cats = a.getCategories ? a.getCategories() : [];
      return sum + cats.length;
    }, 0);

    return {
      totalReceipts,
      totalArchives: ALL_ADAPTERS.length,
      totalCategories,
      dateSpan: '2013 – 2024 (11 Years)',
      archives: ALL_ADAPTERS.map(a => a.getMetadata())
    };
  }
};
