import React, { useState, useMemo, useEffect } from 'react';
import ReceiptCard from './ReceiptCard';
import { filterReceipts } from '../engine/relationshipEngine';
import { Search, Filter, Calendar, SlidersHorizontal, RotateCcw, Layers, ArrowUpDown, ChevronDown, Clock } from 'lucide-react';

export default function ReceiptExplorer({
  records,
  activeAdapter,
  onSelectReceipt,
  relationshipData,
  activeFilters,
  onUpdateFilters
}) {
  const [searchQuery, setSearchQuery] = useState(activeFilters?.search || '');
  const [selectedCategory, setSelectedCategory] = useState(activeFilters?.category || 'all');
  const [selectedMode, setSelectedMode] = useState(activeFilters?.mode || 'all');
  const [selectedYear, setSelectedYear] = useState(activeFilters?.year || 'all');
  const [selectedDate, setSelectedDate] = useState(activeFilters?.date || '');
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(activeFilters?.dayOfWeek || 'all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [visibleCount, setVisibleCount] = useState(30);

  // Sync with external navigation (e.g. from PatternInsights)
  useEffect(() => {
    if (activeFilters) {
      if (activeFilters.category !== undefined) setSelectedCategory(activeFilters.category);
      if (activeFilters.date !== undefined) setSelectedDate(activeFilters.date);
      if (activeFilters.dayOfWeek !== undefined) setSelectedDayOfWeek(activeFilters.dayOfWeek);
      if (activeFilters.year !== undefined) setSelectedYear(activeFilters.year);
      if (activeFilters.search !== undefined) setSearchQuery(activeFilters.search);
      setVisibleCount(30);
    }
  }, [activeFilters]);

  // Compute dataset date range
  const { earliestDate, latestDate } = useMemo(() => {
    let min = '';
    let max = '';
    records.forEach(r => {
      const ts = r.timestamp ? r.timestamp.slice(0, 10) : '';
      if (ts && ts.length === 10) {
        if (!min || ts < min) min = ts;
        if (!max || ts > max) max = ts;
      }
    });
    return { earliestDate: min, latestDate: max };
  }, [records]);

  // Available categories & years
  const categories = useMemo(() => {
    const cats = new Set();
    records.forEach(r => {
      if (r.category) cats.add(r.category);
    });
    return Array.from(cats).slice(0, 20);
  }, [records]);

  const modes = useMemo(() => {
    const mSet = new Set();
    records.forEach(r => {
      if (r.mode) mSet.add(r.mode);
    });
    return Array.from(mSet);
  }, [records]);

  const years = useMemo(() => {
    const ySet = new Set();
    records.forEach(r => {
      const ts = r.timestamp || r.rawDate;
      if (ts) {
        const y = ts.slice(0, 4);
        if (y && !isNaN(y)) ySet.add(y);
      }
    });
    return Array.from(ySet).sort((a, b) => b.localeCompare(a));
  }, [records]);

  // Connection count mapping
  const connectionCounts = useMemo(() => {
    const map = {};
    if (relationshipData?.connections) {
      relationshipData.connections.forEach(c => {
        map[c.source] = (map[c.source] || 0) + 1;
        map[c.target] = (map[c.target] || 0) + 1;
      });
    }
    return map;
  }, [relationshipData]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return filterReceipts(records, {
      search: searchQuery,
      category: selectedCategory,
      mode: selectedMode,
      year: selectedYear,
      date: selectedDate,
      dayOfWeek: selectedDayOfWeek,
      sortBy: sortBy
    });
  }, [records, searchQuery, selectedCategory, selectedMode, selectedYear, selectedDate, selectedDayOfWeek, sortBy]);

  const displayedRecords = filteredRecords.slice(0, visibleCount);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedMode('all');
    setSelectedYear('all');
    setSelectedDate('');
    setSelectedDayOfWeek('all');
    setSortBy('date-desc');
    setVisibleCount(30);
    if (onUpdateFilters) {
      onUpdateFilters({
        search: '',
        category: 'all',
        mode: 'all',
        year: 'all',
        date: '',
        dayOfWeek: 'all'
      });
    }
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedMode !== 'all' || selectedYear !== 'all' || selectedDate || selectedDayOfWeek !== 'all' || sortBy !== 'date-desc';

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header & Search Control Bar */}
      <div className="bg-archive-850 border border-archive-700/70 rounded-2xl p-4 sm:p-6 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-editorial font-medium text-paper flex items-center space-x-2">
              <span>Receipt Explorer</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-archive-800 border border-archive-700 text-archive-300">
                {activeAdapter.name}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-archive-400 font-mono mt-0.5">
              Search, filter by exact day, and inspect verifiable life receipts.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-archive-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(30);
              }}
              placeholder="Search title, artist, note, city, or date (e.g. 2024-05-12)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-archive-900 border border-archive-700/80 focus:border-amber-accent/80 focus:ring-1 focus:ring-amber-accent/50 text-sm text-paper placeholder-archive-500 font-sans transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-archive-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-archive-700/50 text-xs font-mono">
          
          {/* Specific Calendar Date Picker */}
          <div className="flex items-center space-x-1.5 bg-archive-900/90 px-2.5 py-1.5 rounded-lg border border-archive-700/60 focus-within:border-amber-accent">
            <Calendar className="w-3.5 h-3.5 text-amber-accent" />
            <span className="text-archive-400">Day:</span>
            <input
              type="date"
              value={selectedDate}
              min={earliestDate}
              max={latestDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setVisibleCount(30);
              }}
              className="bg-transparent text-paper font-mono outline-none cursor-pointer text-xs"
              title="Pick a specific calendar day"
            />
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate('')}
                className="text-archive-400 hover:text-amber-accent text-xs font-mono ml-0.5 cursor-pointer"
                title="Clear specific day"
                aria-label="Clear specific day filter"
              >
                ✕
              </button>
            )}
          </div>

          {/* Day of the Week Filter */}
          <div className="flex items-center space-x-1.5 bg-archive-900/90 px-2.5 py-1.5 rounded-lg border border-archive-700/60">
            <Clock className="w-3.5 h-3.5 text-lavender-accent" />
            <span className="text-archive-400">Weekday:</span>
            <select
              value={selectedDayOfWeek}
              onChange={(e) => {
                setSelectedDayOfWeek(e.target.value);
                setVisibleCount(30);
              }}
              className="bg-transparent text-paper font-mono outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-archive-900">All Weekdays</option>
              <option value="Monday" className="bg-archive-900">Monday</option>
              <option value="Tuesday" className="bg-archive-900">Tuesday</option>
              <option value="Wednesday" className="bg-archive-900">Wednesday</option>
              <option value="Thursday" className="bg-archive-900">Thursday</option>
              <option value="Friday" className="bg-archive-900">Friday</option>
              <option value="Saturday" className="bg-archive-900">Saturday</option>
              <option value="Sunday" className="bg-archive-900">Sunday</option>
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex items-center space-x-1.5 bg-archive-900/90 px-2.5 py-1.5 rounded-lg border border-archive-700/60">
            <span className="text-archive-400">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setVisibleCount(30);
              }}
              className="bg-transparent text-paper font-mono outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-archive-900">All Years</option>
              {years.map(y => (
                <option key={y} value={y} className="bg-archive-900">{y}</option>
              ))}
            </select>
          </div>

          {/* Mode / Platform Filter */}
          <div className="flex items-center space-x-1.5 bg-archive-900/90 px-2.5 py-1.5 rounded-lg border border-archive-700/60">
            <Layers className="w-3.5 h-3.5 text-archive-400" />
            <span className="text-archive-400">Mode:</span>
            <select
              value={selectedMode}
              onChange={(e) => {
                setSelectedMode(e.target.value);
                setVisibleCount(30);
              }}
              className="bg-transparent text-paper font-mono outline-none cursor-pointer text-xs max-w-[130px] truncate"
            >
              <option value="all" className="bg-archive-900">All Modes</option>
              {modes.map(m => (
                <option key={m} value={m} className="bg-archive-900">{m}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-1.5 bg-archive-900/90 px-2.5 py-1.5 rounded-lg border border-archive-700/60">
            <ArrowUpDown className="w-3.5 h-3.5 text-archive-400" />
            <span className="text-archive-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-paper font-mono outline-none cursor-pointer text-xs"
            >
              <option value="date-desc" className="bg-archive-900">Date (Newest First)</option>
              <option value="date-asc" className="bg-archive-900">Date (Oldest First)</option>
              <option value="amount-desc" className="bg-archive-900">Value (High to Low)</option>
              <option value="amount-asc" className="bg-archive-900">Value (Low to High)</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-archive-800 hover:bg-archive-750 text-archive-300 hover:text-white border border-archive-700/80 transition-colors ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Active Temporal Filter Feedback */}
        {(selectedDate || selectedDayOfWeek !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-archive-700/40">
            {selectedDate && (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-amber-accent/20 border border-amber-accent/50 text-amber-accent text-xs font-mono">
                <span>Filtered to Specific Day: <strong>{selectedDate}</strong> ({filteredRecords.length} records)</span>
                <button
                  type="button"
                  onClick={() => setSelectedDate('')}
                  className="hover:text-white font-bold ml-1 cursor-pointer"
                  title="Clear day filter"
                  aria-label="Clear day filter"
                >
                  ✕
                </button>
              </span>
            )}
            {selectedDayOfWeek !== 'all' && (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-lavender-accent/20 border border-lavender-accent/50 text-lavender-accent text-xs font-mono">
                <span>Filtered to: <strong>{selectedDayOfWeek}s</strong> ({filteredRecords.length} records)</span>
                <button
                  type="button"
                  onClick={() => setSelectedDayOfWeek('all')}
                  className="hover:text-white font-bold ml-1 cursor-pointer"
                  title="Clear weekday filter"
                  aria-label="Clear weekday filter"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setVisibleCount(30);
            }}
            className={`px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-accent text-archive-950 font-semibold shadow-sm'
                : 'bg-archive-900/80 text-archive-400 hover:text-archive-200 border border-archive-700/60'
            }`}
          >
            All Categories ({records.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(30);
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-accent text-archive-950 font-semibold shadow-sm'
                  : 'bg-archive-900/80 text-archive-400 hover:text-archive-200 border border-archive-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Result Status Ribbon */}
      <div className="flex items-center justify-between text-xs font-mono text-archive-400 px-1">
        <span>
          Showing <strong className="text-paper">{displayedRecords.length}</strong> of{' '}
          <strong className="text-paper">{filteredRecords.length.toLocaleString()}</strong> matching receipts
          {selectedDate && <span className="text-amber-accent ml-1">on {selectedDate}</span>}
        </span>
        {filteredRecords.length === 0 && (
          <span className="text-amber-accent">No matching records found. Try adjusting filters or picking another date.</span>
        )}
      </div>

      {/* Receipt Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedRecords.map((receipt) => (
          <ReceiptCard
            key={receipt.id}
            receipt={receipt}
            onSelectReceipt={onSelectReceipt}
            connectionCount={connectionCounts[receipt.id] || 0}
            searchQuery={searchQuery}
          />
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredRecords.length && (
        <div className="text-center pt-6">
          <button
            onClick={() => setVisibleCount(prev => prev + 30)}
            className="px-6 py-2.5 rounded-xl bg-archive-850 hover:bg-archive-800 border border-archive-700 text-sm font-mono text-paper transition-all hover:border-amber-accent/50 shadow-sm"
          >
            Load Next 30 Receipts ({filteredRecords.length - visibleCount} remaining)
          </button>
        </div>
      )}

    </div>
  );
}
