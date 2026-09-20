import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Clock,
  Calendar,
  TrendingUp,
  Music,
  Layers,
  ArrowUpRight,
  CheckCircle,
  PieChart,
  Activity,
  Search,
  Eye,
  ArrowRight,
  Sparkles,
  CalendarDays
} from 'lucide-react';
import { calculateInsights } from '../engine/insightCalculator';

export default function PatternInsights({
  records,
  activeAdapter,
  onFilterByCategory,
  onFilterByDate,
  onFilterByDayOfWeek
}) {
  const insights = calculateInsights(records, activeAdapter);
  const metadata = activeAdapter.getMetadata();
  const isSpotify = activeAdapter.id === 'spotify';
  const isHousehold = activeAdapter.id === 'household';
  const isTransact = activeAdapter.id === 'indiatransact';

  // Discover high-activity dates and overall date boundaries
  const { topDays, earliestDate, latestDate } = useMemo(() => {
    const dayCounts = {};
    records.forEach(r => {
      const d = r.timestamp ? r.timestamp.slice(0, 10) : '';
      if (d && d.length === 10) {
        dayCounts[d] = (dayCounts[d] || 0) + 1;
      }
    });

    const sortedDays = Object.entries(dayCounts).sort((a, b) => b[1] - a[1]);
    const allDates = Object.keys(dayCounts).sort();

    return {
      topDays: sortedDays.slice(0, 4).map(([date, count]) => ({ date, count })),
      earliestDate: allDates[0] || metadata.dateRange?.start || '2013-01-01',
      latestDate: allDates[allDates.length - 1] || metadata.dateRange?.end || '2024-12-31'
    };
  }, [records, metadata]);

  // Specific Day Inspector State (default to the top active day or latest date)
  const [inspectedDate, setInspectedDate] = useState(() => {
    return topDays[0]?.date || latestDate || '';
  });

  // Calculate stats for the inspected date
  const inspectedDayData = useMemo(() => {
    if (!inspectedDate) return null;

    const matching = records.filter(r => {
      const ts = r.timestamp || '';
      const raw = r.rawDate || '';
      if (ts.startsWith(inspectedDate) || raw.startsWith(inspectedDate)) return true;
      if (inspectedDate.includes('-')) {
        const [y, m, d] = inspectedDate.split('-');
        if (raw.includes(`${d}/${m}/${y}`) || raw.includes(`${parseInt(d, 10)}/${parseInt(m, 10)}/${y}`)) return true;
      }
      return false;
    });

    let volume = 0;
    const catCounts = {};
    matching.forEach(r => {
      if (typeof r.amount === 'number') volume += r.amount;
      const c = r.category || 'General';
      catCounts[c] = (catCounts[c] || 0) + 1;
    });

    const topCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    // Day of week
    const dObj = new Date(inspectedDate);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = !isNaN(dObj.getTime()) ? dayNames[dObj.getDay()] : 'Unknown';

    return {
      date: inspectedDate,
      dayName,
      records: matching,
      count: matching.length,
      volume: Math.round(volume),
      topCategory
    };
  }, [inspectedDate, records]);

  if (!insights) {
    return (
      <div className="bg-archive-850 border border-archive-700/60 rounded-2xl p-12 text-center text-archive-400">
        <BarChart3 className="w-10 h-10 mx-auto mb-2 text-archive-500" />
        <p className="font-mono text-sm">Calculating dataset patterns...</p>
      </div>
    );
  }

  const maxHourVal = Math.max(...insights.hourlyDistribution, 1);
  const maxYearVal = Math.max(...insights.annualTrend.map(y => y.count), 1);

  // Day of week values
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeekVals = dayNames.map(name => ({
    name,
    short: name.slice(0, 3),
    count: insights.dayOfWeekDistribution?.[name] || 0
  }));
  const maxDayVal = Math.max(...dayOfWeekVals.map(d => d.count), 1);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Header */}
      <div className="bg-archive-850 border border-archive-700/70 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-amber-accent/20 border border-amber-accent/40 text-amber-accent">
            <BarChart3 className="w-4 h-4" />
          </span>
          <h2 className="text-2xl font-editorial font-medium text-paper">
            Pattern Insights · Behavioral Distributions
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-archive-400 font-mono mt-1">
          Quantitative patterns, temporal rhythms, and category frequency derived from {metadata.name}.
        </p>
      </div>

      {/* Primary KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-xl bg-archive-850 border border-archive-700/60">
          <div className="flex items-center justify-between mb-1.5 text-xs font-mono text-archive-400">
            <span>Peak Activity Time</span>
            <Clock className="w-3.5 h-3.5 text-amber-accent" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-paper">
            {insights.peakHour}
          </div>
          <div className="text-[11px] text-archive-400 font-mono mt-0.5">
            Highest concentration of records
          </div>
        </div>

        <div className="p-5 rounded-xl bg-archive-850 border border-archive-700/60">
          <div className="flex items-center justify-between mb-1.5 text-xs font-mono text-archive-400">
            <span>Primary Active Day</span>
            <Calendar className="w-3.5 h-3.5 text-lavender-accent" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-paper">
            {insights.topDay}
          </div>
          <div className="text-[11px] text-archive-400 font-mono mt-0.5">
            Weekly behavioral peak
          </div>
        </div>

        <div className="p-5 rounded-xl bg-archive-850 border border-archive-700/60">
          <div className="flex items-center justify-between mb-1.5 text-xs font-mono text-archive-400">
            <span>{isSpotify ? 'Total Listening' : 'Financial Volume'}</span>
            <TrendingUp className="w-3.5 h-3.5 text-sage-accent" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-paper">
            {isSpotify
              ? `${metadata.metrics?.totalListeningHours?.toLocaleString()} hrs`
              : `₹${insights.totalVolume?.toLocaleString()}`}
          </div>
          <div className="text-[11px] text-archive-400 font-mono mt-0.5">
            Accumulated life volume
          </div>
        </div>

        <div className="p-5 rounded-xl bg-archive-850 border border-archive-700/60">
          <div className="flex items-center justify-between mb-1.5 text-xs font-mono text-archive-400">
            <span>{isSpotify ? 'Overall Skip Rate' : isHousehold ? 'Total Expense' : 'Fraud Flags'}</span>
            <Activity className="w-3.5 h-3.5 text-amber-accent" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-accent">
            {isSpotify
              ? `${metadata.metrics?.overallSkipRate || 31}%`
              : isHousehold
              ? `₹${metadata.metrics?.totalExpense?.toLocaleString()}`
              : `${metadata.metrics?.anomaliesDetected || 0} flagged`}
          </div>
          <div className="text-[11px] text-archive-400 font-mono mt-0.5">
            {isSpotify ? 'Skipped before completion' : isHousehold ? 'Total tracked expenses' : 'Risk anomalies detected'}
          </div>
        </div>

      </div>

      {/* Grid: 24-Hour Day Clock & Weekly Day-of-Week Rhythm */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 24-Hour Time of Day Distribution */}
        <div className="p-6 rounded-2xl bg-archive-850 border border-archive-700/70 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-archive-700/50 pb-3">
            <h3 className="font-editorial text-lg text-paper font-semibold flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-accent" />
              <span>24-Hour Time-of-Day Rhythm</span>
            </h3>
            <span className="text-xs font-mono text-archive-400">00:00 – 23:00 (UTC/Local)</span>
          </div>

          <p className="text-xs text-archive-400 font-mono">
            Circadian distribution of receipts across all 24 hours of the day.
          </p>

          {/* Bar Chart with explicit pixel heights */}
          <div className="h-44 flex items-end justify-between gap-1 pt-6 pb-6 px-1 relative border-b border-archive-700/50">
            {insights.hourlyDistribution.slice(0, 24).map((count, hour) => {
              const maxBarHeight = 112; // px
              const barHeightPx = count === 0 ? 0 : Math.max(6, Math.round((count / maxHourVal) * maxBarHeight));
              const isNocturnal = hour >= 0 && hour <= 4;
              const isPeak = count === maxHourVal && count > 0;
              const barColor = isPeak ? '#D9A15C' : isNocturnal ? '#9B83D8' : '#7CB49C';

              return (
                <div
                  key={hour}
                  className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 bg-archive-950/95 backdrop-blur-md border border-archive-600 text-archive-100 text-[11px] font-mono px-2.5 py-1.5 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-30 transform group-hover:-translate-y-1">
                    <div className="font-semibold text-amber-accent">
                      {String(hour).padStart(2, '0')}:00 – {String((hour + 1) % 24).padStart(2, '0')}:00
                    </div>
                    <div className="text-archive-300">
                      {count.toLocaleString()} receipts ({Math.round((count / Math.max(insights.totalRecords, 1)) * 100)}%)
                    </div>
                    {isPeak && <div className="text-amber-accent font-bold mt-0.5">★ Peak Circadian Hour</div>}
                    {isNocturnal && <div className="text-lavender-accent text-[10px]">🌙 Nocturnal Window</div>}
                  </div>

                  {/* Bar with explicit pixel height */}
                  {count > 0 ? (
                    <div
                      className="w-full max-w-[22px] rounded-t transition-all duration-300 group-hover:brightness-125 group-hover:scale-y-105 origin-bottom"
                      style={{
                        height: `${barHeightPx}px`,
                        backgroundColor: barColor,
                        boxShadow: isPeak ? '0 0 10px rgba(217, 161, 92, 0.5)' : isNocturnal ? '0 0 8px rgba(155, 131, 216, 0.3)' : 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full max-w-[22px] h-1 rounded-sm bg-archive-700/40" />
                  )}

                  {/* Hour label */}
                  {hour % 4 === 0 && (
                    <span className="text-[10px] font-mono text-archive-400 absolute -bottom-5">
                      {hour}h
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-archive-400 pt-1">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-lavender-accent" />
              <span>Nocturnal Window (00h–04h)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-sage-accent" />
              <span>Daytime Window</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-accent shadow-sm" />
              <span>Peak Hourly Window</span>
            </span>
          </div>
        </div>

        {/* 7-Day Weekly Behavioral Rhythm */}
        <div className="p-6 rounded-2xl bg-archive-850 border border-archive-700/70 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-archive-700/50 pb-3">
            <h3 className="font-editorial text-lg text-paper font-semibold flex items-center space-x-2">
              <CalendarDays className="w-4 h-4 text-lavender-accent" />
              <span>Weekly Day-of-Week Rhythm</span>
            </h3>
            <span className="text-xs font-mono text-archive-400">Click day to filter</span>
          </div>

          <p className="text-xs text-archive-400 font-mono">
            Weekly rhythm across Monday through Sunday. Peak day is <span className="text-amber-accent font-semibold">{insights.topDay}</span>.
          </p>

          {/* 7 Day Vertical Bars */}
          <div className="h-44 flex items-end justify-around gap-2 pt-6 pb-6 px-2 relative border-b border-archive-700/50">
            {dayOfWeekVals.map((d) => {
              const maxBarHeight = 112; // px
              const barHeightPx = d.count === 0 ? 0 : Math.max(8, Math.round((d.count / maxDayVal) * maxBarHeight));
              const isPeak = d.name === insights.topDay;
              const isWeekend = d.name === 'Saturday' || d.name === 'Sunday';

              return (
                <div
                  key={d.name}
                  onClick={() => onFilterByDayOfWeek && onFilterByDayOfWeek(d.name)}
                  className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                  title={`Click to filter receipts from all ${d.name}s`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 bg-archive-950/95 backdrop-blur-md border border-archive-600 text-archive-100 text-[11px] font-mono px-2.5 py-1.5 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-30 transform group-hover:-translate-y-1">
                    <div className="font-semibold text-paper flex items-center space-x-1">
                      <span>{d.name}</span>
                      {isPeak && <span className="text-amber-accent font-bold">★ Top Day</span>}
                    </div>
                    <div className="text-amber-accent font-mono">
                      {d.count.toLocaleString()} receipts ({Math.round((d.count / Math.max(insights.totalRecords, 1)) * 100)}%)
                    </div>
                    <div className="text-[10px] text-archive-400 mt-0.5">Click to explore {d.name}s →</div>
                  </div>

                  {/* Bar */}
                  {d.count > 0 ? (
                    <div
                      className="w-full max-w-[34px] rounded-t transition-all duration-300 group-hover:brightness-125 group-hover:scale-y-105 origin-bottom"
                      style={{
                        height: `${barHeightPx}px`,
                        backgroundColor: isPeak ? '#D9A15C' : isWeekend ? '#9B83D8' : '#7CB49C',
                        boxShadow: isPeak ? '0 0 12px rgba(217, 161, 92, 0.5)' : 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full max-w-[34px] h-1 rounded-sm bg-archive-700/40" />
                  )}

                  {/* Day label */}
                  <span className={`text-[11px] font-mono mt-1 absolute -bottom-5 ${isPeak ? 'text-amber-accent font-bold' : 'text-archive-400'}`}>
                    {d.short}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-archive-400 pt-1">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-lavender-accent" />
              <span>Weekend (Sat / Sun)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-sage-accent" />
              <span>Weekday Window</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-accent shadow-sm" />
              <span>Primary Day Peak ({insights.topDay})</span>
            </span>
          </div>
        </div>

      </div>

      {/* SPECIFIC DAY INSPECTOR — Exact Day Temporal Slice */}
      <div className="p-6 rounded-2xl bg-archive-850 border border-amber-accent/40 shadow-xl space-y-5 relative overflow-hidden">
        
        {/* Glow ambient accent */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-amber-accent/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-archive-700/50 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-amber-accent/20 border border-amber-accent/40 text-amber-accent text-xs font-mono mb-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Single-Day Temporal Deep Dive</span>
            </div>
            <h3 className="font-editorial text-xl text-paper font-semibold">
              Specific Day Inspector · Look Up Any Exact Date
            </h3>
            <p className="text-xs sm:text-sm text-archive-400 font-mono mt-0.5">
              Pick any exact date from {metadata.name} ({earliestDate} – {latestDate}) to inspect its receipts and volume.
            </p>
          </div>

          {/* Date Picker Input */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-archive-900 px-3 py-2 rounded-xl border border-archive-700/80 focus-within:border-amber-accent">
              <Calendar className="w-4 h-4 text-amber-accent" />
              <span className="text-xs font-mono text-archive-400">Date:</span>
              <input
                type="date"
                value={inspectedDate}
                min={earliestDate}
                max={latestDate}
                onChange={(e) => setInspectedDate(e.target.value)}
                className="bg-transparent text-paper font-mono text-xs outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Quick Date Presets */}
        {topDays.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-mono text-archive-400">High-Activity Days:</span>
            {topDays.map(({ date, count }) => (
              <button
                key={date}
                onClick={() => setInspectedDate(date)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  inspectedDate === date
                    ? 'bg-amber-accent text-archive-950 font-bold shadow-glow-amber'
                    : 'bg-archive-900 text-archive-300 hover:text-white border border-archive-700 hover:border-archive-600'
                }`}
              >
                {date} · {count} receipts
              </button>
            ))}
          </div>
        )}

        {/* Inspected Date Insights Card */}
        {inspectedDayData && (
          <div className="bg-archive-900/90 rounded-xl border border-archive-700/80 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-archive-700/50 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-accent font-semibold">{inspectedDayData.dayName}</span>
                <h4 className="text-lg font-editorial font-bold text-paper">
                  {inspectedDayData.date}
                </h4>
              </div>

              {/* View all in explorer button */}
              {inspectedDayData.count > 0 && (
                <button
                  onClick={() => onFilterByDate && onFilterByDate(inspectedDayData.date)}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-accent hover:bg-amber-light text-archive-950 font-semibold text-xs font-mono transition-all shadow-sm"
                >
                  <span>View All {inspectedDayData.count} Receipts in Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Metrics Ribbon for this day */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-archive-850 border border-archive-700/50">
                <div className="text-[11px] font-mono text-archive-400">Recorded Receipts</div>
                <div className="text-lg font-bold font-mono text-paper mt-0.5">{inspectedDayData.count}</div>
              </div>

              <div className="p-3 rounded-lg bg-archive-850 border border-archive-700/50">
                <div className="text-[11px] font-mono text-archive-400">
                  {isSpotify ? 'Listening Duration' : 'Total Amount'}
                </div>
                <div className="text-lg font-bold font-mono text-amber-accent mt-0.5">
                  {isSpotify
                    ? `${Math.round(inspectedDayData.volume / 60)} mins`
                    : `₹${inspectedDayData.volume.toLocaleString()}`}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-archive-850 border border-archive-700/50">
                <div className="text-[11px] font-mono text-archive-400">Top Activity / Category</div>
                <div className="text-xs font-bold font-mono text-paper mt-1 truncate">
                  {inspectedDayData.topCategory}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-archive-850 border border-archive-700/50">
                <div className="text-[11px] font-mono text-archive-400">Day of Week</div>
                <div className="text-xs font-bold font-mono text-lavender-accent mt-1">
                  {inspectedDayData.dayName}
                </div>
              </div>
            </div>

            {/* Preview receipts from this day */}
            {inspectedDayData.count > 0 ? (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-mono text-archive-400 font-semibold">
                  Sample Receipts on {inspectedDayData.date}:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {inspectedDayData.records.slice(0, 4).map(r => (
                    <div
                      key={r.id}
                      className="p-2.5 rounded-lg bg-archive-850 border border-archive-700/60 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="truncate mr-2">
                        <div className="text-paper font-medium truncate">{r.title}</div>
                        <div className="text-[11px] text-archive-400 truncate">
                          {r.timestamp?.slice(11, 16) || ''} · {r.category}
                        </div>
                      </div>
                      <span className="text-amber-accent font-semibold whitespace-nowrap">
                        {isSpotify ? `${r.amount}s` : `₹${r.amount}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs font-mono text-archive-400">
                No receipts recorded in this archive for {inspectedDayData.date}. Try choosing one of the high-activity days above.
              </div>
            )}
          </div>
        )}

      </div>

      {/* Category Breakdown with Click-to-Filter */}
      <div className="p-6 rounded-2xl bg-archive-850 border border-archive-700/70 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-archive-700/50 pb-3">
          <h3 className="font-editorial text-lg text-paper font-semibold flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-lavender-accent" />
            <span>Category & Domain Distribution</span>
          </h3>
          <span className="text-xs font-mono text-archive-400">Click row to filter</span>
        </div>

        <div className="space-y-3">
          {insights.topCategories.map((cat, idx) => (
            <div
              key={cat.name}
              onClick={() => onFilterByCategory && onFilterByCategory(cat.name)}
              className="group cursor-pointer p-2 rounded-xl hover:bg-archive-900 border border-transparent hover:border-archive-700 transition-all"
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-paper font-semibold group-hover:text-amber-accent transition-colors flex items-center space-x-1.5">
                  <span className="text-archive-500">{idx + 1}.</span>
                  <span>{cat.name}</span>
                </span>
                <span className="text-archive-400 flex items-center space-x-2">
                  <span>{cat.count} receipts</span>
                  <strong className="text-amber-accent">{cat.percent}%</strong>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-archive-900 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${cat.percent}%`,
                    backgroundColor: idx === 0 ? '#D9A15C' : idx === 1 ? '#9B83D8' : '#7CB49C'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Year Timeline Evolution */}
      <div className="p-6 rounded-2xl bg-archive-850 border border-archive-700/70 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-archive-700/50 pb-3">
          <h3 className="font-editorial text-lg text-paper font-semibold flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-sage-accent" />
            <span>Chronological Annual Volume Timeline</span>
          </h3>
          <span className="text-xs font-mono text-archive-400">
            {metadata.dateRange?.start?.slice(0, 4)} — {metadata.dateRange?.end?.slice(0, 4)}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2 pt-2">
          {insights.annualTrend.map((item) => {
            const heightRatio = Math.round((item.count / maxYearVal) * 100);
            return (
              <div key={item.year} className="bg-archive-900 p-3 rounded-xl border border-archive-700/60 text-center space-y-1">
                <div className="text-[11px] font-mono text-archive-400 font-semibold">{item.year}</div>
                <div className="text-sm font-bold font-mono text-paper">{item.count}</div>
                <div className="w-full h-1.5 rounded-full bg-archive-800 overflow-hidden mt-1">
                  <div className="h-full bg-amber-accent rounded-full" style={{ width: `${heightRatio}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dataset Specific Insights (Spotify Top Artists / Household Payment Modes) */}
      {isSpotify && metadata.metrics?.topArtists && (
        <div className="p-6 rounded-2xl bg-archive-850 border border-archive-700/70 space-y-4">
          <div className="flex items-center justify-between border-b border-archive-700/50 pb-3">
            <h3 className="font-editorial text-lg text-paper font-semibold flex items-center space-x-2">
              <Music className="w-4 h-4 text-lavender-accent" />
              <span>Top Recurring Artists Across 11-Year Stream History</span>
            </h3>
            <span className="text-xs font-mono text-archive-400">149,860 Streams Aggregated</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {metadata.metrics.topArtists.slice(0, 8).map((a, i) => (
              <div key={a.artist} className="p-3.5 rounded-xl bg-archive-900 border border-archive-700/60 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-mono text-amber-accent font-bold">#{i + 1}</span>
                  <span className="text-xs font-semibold text-paper truncate max-w-[130px]">{a.artist}</span>
                </div>
                <span className="text-[11px] font-mono text-archive-400">{a.streams} plays</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
