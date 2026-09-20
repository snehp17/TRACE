/**
 * TRACE Insight Calculator
 * Computes live, accurate distributions, heatmaps, and pattern analytics
 * directly from the active dataset.
 */

export function calculateInsights(records, adapter) {
  if (!records || records.length === 0) {
    return null;
  }

  // 1. Annual Activity
  const annualCounts = {};
  const monthlyCounts = {};
  const hourlyCounts = Array(24).fill(0);
  const dayOfWeekCounts = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0
  };
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // 2. Category & Topic Distributions
  const categoryCounts = {};
  const modeCounts = {};
  let totalVolume = 0;
  let numericValues = [];

  records.forEach(r => {
    // Timestamp breakdowns
    if (r.timestamp) {
      const year = r.timestamp.slice(0, 4);
      if (year && !isNaN(year)) {
        annualCounts[year] = (annualCounts[year] || 0) + 1;
      }

      const monthYear = r.timestamp.slice(0, 7);
      if (monthYear) {
        monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
      }

      const dateObj = new Date(r.timestamp);
      if (!isNaN(dateObj.getTime())) {
        const hour = dateObj.getHours();
        if (hour >= 0 && hour < 24) hourlyCounts[hour]++;
        const day = dayNames[dateObj.getDay()];
        if (day) dayOfWeekCounts[day]++;
      }
    }

    // Categories
    const cat = r.category || 'Uncategorized';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

    // Modes
    const m = r.mode || 'Standard';
    modeCounts[m] = (modeCounts[m] || 0) + 1;

    if (typeof r.amount === 'number' && !isNaN(r.amount)) {
      totalVolume += r.amount;
      numericValues.push(r.amount);
    }
  });

  // Sort top categories
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / records.length) * 100)
    }));

  // Sort top years
  const sortedYears = Object.entries(annualCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([year, count]) => ({ year, count }));

  // Peak activity hour
  let maxHour = 0;
  let maxHourCount = 0;
  hourlyCounts.forEach((count, h) => {
    if (count > maxHourCount) {
      maxHourCount = count;
      maxHour = h;
    }
  });

  // Top day of week
  let topDay = 'Monday';
  let topDayCount = 0;
  Object.entries(dayOfWeekCounts).forEach(([d, count]) => {
    if (count > topDayCount) {
      topDayCount = count;
      topDay = d;
    }
  });

  return {
    totalRecords: records.length,
    totalVolume: Math.round(totalVolume),
    topCategories,
    annualTrend: sortedYears,
    hourlyDistribution: hourlyCounts,
    peakHour: `${maxHour}:00 - ${(maxHour + 1) % 24}:00`,
    dayOfWeekDistribution: dayOfWeekCounts,
    topDay,
    modes: Object.entries(modeCounts).sort((a, b) => b[1] - a[1]),
    adapterMetrics: adapter?.getMetrics ? adapter.getMetrics() : {}
  };
}
