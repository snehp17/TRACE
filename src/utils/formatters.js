/**
 * @fileoverview TRACE Core Utility Formatters
 * Pure functions for deterministic currency, date, and numerical formatting.
 */

/**
 * Formats a monetary value into Indian Rupee notation with defensive null safety.
 * @param {number|null|undefined} amount - Numeric monetary amount
 * @param {string} [fallback='—'] - Fallback when amount is not a valid number
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, fallback = '—') {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return fallback;
  }
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

/**
 * Formats an ISO timestamp or date string into standard human-readable display.
 * @param {string|Date} date - ISO string or Date instance
 * @param {Intl.DateTimeFormatOptions} [options] - Intl options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = { year: 'numeric', month: 'short', day: 'numeric' }) {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    // If raw date string like "2018-05-12"
    return String(date).slice(0, 10);
  }
  return d.toLocaleDateString('en-US', options);
}

/**
 * Extracts a concise year string from a timestamp or raw date.
 * @param {string} timestamp
 * @returns {string}
 */
export function extractYear(timestamp) {
  if (!timestamp) return 'Unknown';
  const match = String(timestamp).match(/\b(19\d\d|20\d\d)\b/);
  return match ? match[1] : 'Unknown';
}

/**
 * Formats a large number into compact shorthand (e.g. 149.8k, 2.5k).
 * @param {number} num
 * @returns {string}
 */
export function formatCompactNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return String(num);
}

/**
 * Formats playback duration in milliseconds to "M:SS" notation.
 * @param {number} ms - Duration in milliseconds
 * @returns {string}
 */
export function formatTrackDuration(ms) {
  if (!ms || isNaN(ms)) return '—';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
