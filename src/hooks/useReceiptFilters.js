import { useState, useMemo } from 'react';
import { filterReceipts } from '../engine/relationshipEngine';

/**
 * Custom React hook for managing multi-dimensional filtering, searching,
 * sorting, and pagination across thousands of life records.
 * 
 * @param {Array} records - Raw records from active adapter
 * @param {Object} [initialFilters={}] - Initial filter overrides
 * @returns {Object} Filter state, handlers, and paginated records
 */
export function useReceiptFilters(records = [], initialFilters = {}) {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    mode: 'all',
    year: 'all',
    date: '',
    dayOfWeek: 'all',
    sortBy: 'date-desc',
    ...initialFilters
  });

  const [visibleCount, setVisibleCount] = useState(30);

  // Apply filtering & sorting via engine
  const filteredRecords = useMemo(() => {
    return filterReceipts(records, filters);
  }, [records, filters]);

  // Paginated records for fast virtualized DOM rendering
  const paginatedRecords = useMemo(() => {
    return filteredRecords.slice(0, visibleCount);
  }, [filteredRecords, visibleCount]);

  const hasMore = visibleCount < filteredRecords.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + 30);
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setVisibleCount(30);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      mode: 'all',
      year: 'all',
      date: '',
      dayOfWeek: 'all',
      sortBy: 'date-desc'
    });
    setVisibleCount(30);
  };

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    filteredRecords,
    paginatedRecords,
    totalMatches: filteredRecords.length,
    hasMore,
    loadMore
  };
}
