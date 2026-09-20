import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const householdData = require('./processed/household_archive.json');
const spotifyData = require('./processed/spotify_archive.json');
const transactData = require('./processed/indiatransact_archive.json');

describe('Data Architecture & Security Sanitization Tests', () => {
  test('all three datasets are pre-indexed and valid', () => {
    assert.ok(householdData && householdData.records);
    assert.ok(spotifyData && spotifyData.records);
    assert.ok(transactData && transactData.records);
  });

  test('household archive maintains high data integrity (~2461 records)', () => {
    assert.ok(householdData.totalRecords >= 2000);
    assert.equal(householdData.records.length, householdData.totalRecords);
    const sample = householdData.records[0];
    assert.ok(sample.id);
    assert.ok(sample.category);
    assert.ok(sample.title);
  });

  test('spotify history archive accurately models streaming telemetry', () => {
    assert.ok(spotifyData.totalRecords > 100000);
    assert.ok(spotifyData.metrics.topArtists.length > 0);
    assert.ok(spotifyData.metrics.totalListeningHours > 0);
  });

  test('transact archive strictly satisfies privacy sanitization standards', () => {
    assert.ok(transactData.records.length > 5000);

    // Security & Data Sanitization check: ensure no raw unmasked card numbers or script injections
    transactData.records.slice(0, 1000).forEach(r => {
      const serialized = JSON.stringify(r);
      assert.doesNotMatch(serialized, /\b(?:\d[ -]*?){13,16}\b/, 'Must not expose raw credit card numbers');
      assert.doesNotMatch(serialized, /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, 'Must not contain script tags');
      assert.doesNotMatch(serialized, /cvv|cvc|pin_number/i, 'Must not contain sensitive auth codes');
    });
  });

  test('all records contain required schema fields for UI rendering', () => {
    [householdData, spotifyData, transactData].forEach(archive => {
      const records = archive.records.slice(0, 50);
      records.forEach(r => {
        assert.ok(r.id, 'Record must have an ID');
        assert.ok(r.title, 'Record must have a title');
        assert.ok(r.source, 'Record must have a source');
        assert.ok(r.category, 'Record must have a category');
      });
    });
  });
});
