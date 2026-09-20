/**
 * @fileoverview TRACE Security & Privacy Data Sanitizer
 * Enforces client-side sanitization, preventing XSS and masking personal data.
 */

/**
 * Strips HTML tags and prevents script injection.
 * @param {string} input - Untrusted raw string
 * @returns {string} Sanitized string
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

/**
 * Masks sensitive account numbers or identifiers (e.g. "SB-1234567" -> "SB-••••567").
 * @param {string} val
 * @returns {string}
 */
export function maskSensitiveId(val) {
  if (!val) return '—';
  const str = String(val).trim();
  if (str.length <= 4) return str;
  return `${str.slice(0, 2)}••••${str.slice(-3)}`;
}

/**
 * Sanitizes a receipt object before saving or displaying.
 * @param {import('../types/schemas').ReceiptRecord} receipt
 * @returns {import('../types/schemas').ReceiptRecord}
 */
export function sanitizeReceiptRecord(receipt) {
  if (!receipt) return null;
  return {
    ...receipt,
    title: sanitizeString(receipt.title),
    category: sanitizeString(receipt.category) || 'General',
    mode: sanitizeString(receipt.mode) || 'Direct',
    location: sanitizeString(receipt.location),
    amount: receipt.amount !== undefined && receipt.amount !== null && !isNaN(Number(receipt.amount))
      ? Number(receipt.amount)
      : null
  };
}
