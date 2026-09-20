import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrency, formatDate, formatCompactNumber, formatTrackDuration } from './formatters.js';
import { sanitizeString, maskSensitiveId, sanitizeReceiptRecord } from './sanitizer.js';
import { generateDossierMarkdown } from './exportNarrative.js';
import { SchemaValidation } from '../types/schemas.js';

describe('Utility & Formatting Architecture Tests', () => {
  test('formatCurrency formats Indian Rupee notation and handles null values', () => {
    assert.equal(formatCurrency(45), '₹45');
    assert.equal(formatCurrency(1999), '₹1,999');
    assert.equal(formatCurrency(null), '—');
    assert.equal(formatCurrency(undefined), '—');
    assert.equal(formatCurrency(NaN), '—');
  });

  test('formatCompactNumber converts thousands and millions accurately', () => {
    assert.equal(formatCompactNumber(2500), '2.5k');
    assert.equal(formatCompactNumber(149860), '149.9k');
    assert.equal(formatCompactNumber(2000000), '2.0M');
    assert.equal(formatCompactNumber(45), '45');
  });

  test('formatTrackDuration converts milliseconds into M:SS notation', () => {
    assert.equal(formatTrackDuration(185000), '3:05');
    assert.equal(formatTrackDuration(60000), '1:00');
    assert.equal(formatTrackDuration(null), '—');
  });

  test('sanitizeString strips malicious scripts and HTML tags', () => {
    assert.equal(sanitizeString('<b>Clean Title</b>'), 'Clean Title');
    assert.equal(sanitizeString('<script>alert("hack")</script>Test'), 'Test');
    assert.equal(sanitizeString('javascript:void(0)'), 'void(0)');
  });

  test('maskSensitiveId obfuscates account and card identifiers', () => {
    assert.equal(maskSensitiveId('SB-1234567'), 'SB••••567');
    assert.equal(maskSensitiveId('123'), '123');
    assert.equal(maskSensitiveId(''), '—');
  });

  test('sanitizeReceiptRecord produces clean, validated record structures', () => {
    const raw = {
      id: 'rec-1',
      title: '<i>Evening Dinner</i>',
      category: 'Food <script>',
      amount: '120.5'
    };
    const sanitized = sanitizeReceiptRecord(raw);
    assert.equal(sanitized.title, 'Evening Dinner');
    assert.equal(sanitized.category, 'Food');
    assert.equal(sanitized.amount, 120.5);
  });

  test('generateDossierMarkdown creates structured museum exhibition export', () => {
    const md = generateDossierMarkdown({
      archiveName: 'Household Archive',
      chapters: [{ title: 'The Commute', epoch: '2018', summary: 'Daily transit summary', observedFacts: ['Ticket 1'] }],
      connections: [{ type: 'Commute Pair', confidence: 95, interpretation: 'Routine' }],
      totalRecords: 1500
    });
    assert.ok(md.includes('TRACE Museum Exhibition Dossier'));
    assert.ok(md.includes('Household Archive'));
    assert.ok(md.includes('The Commute'));
    assert.ok(md.includes('Commute Pair'));
  });

  test('SchemaValidation verifies record and connection integrity', () => {
    assert.ok(SchemaValidation.isValidRecord({ id: 'r1', title: 'Train', source: 'household' }));
    assert.equal(SchemaValidation.isValidRecord({ id: 'r1' }), false);
    assert.ok(SchemaValidation.isValidConnection({ source: 'r1', target: 'r2', type: 'Temporal' }));
    assert.equal(SchemaValidation.isValidConnection({ source: 'r1' }), false);
  });
});
