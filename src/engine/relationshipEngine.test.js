import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeConnections, filterReceipts, getNodeCategoryColor } from './relationshipEngine.js';
import { getChapterAesthetics } from './chapterAesthetics.js';

describe('Relationship Engine & Architecture Tests', () => {
  const sampleRecords = [
    {
      id: 'r-1',
      title: 'Morning Train Ticket',
      timestamp: '2024-05-10T08:30:00',
      category: 'transportation',
      location: 'Place 5',
      amount: 10,
      mode: 'Transit Ticket',
      source: 'household'
    },
    {
      id: 'r-2',
      title: 'South Indian Breakfast',
      timestamp: '2024-05-10T09:00:00',
      category: 'food',
      location: 'Place 5',
      amount: 45,
      mode: 'Cash',
      source: 'household'
    },
    {
      id: 'r-3',
      title: 'Netflix Subscription Renewal',
      timestamp: '2024-05-19T10:00:00',
      category: 'subscription',
      amount: 199,
      mode: 'Bank Account 1',
      source: 'household'
    },
    {
      id: 'r-4',
      title: 'Late Night Stream - Ambient Echoes',
      timestamp: '2024-05-20T02:30:00',
      category: 'ambient',
      amount: 320,
      mode: 'Mobile App',
      source: 'spotify'
    }
  ];

  test('analyzeConnections detects relationships and separates facts from interpretations', () => {
    const result = analyzeConnections(sampleRecords);
    assert.ok(result.nodes && result.nodes.length === 4);
    assert.ok(Array.isArray(result.connections));
    assert.ok(result.connections.length > 0, 'Should find connections in sample records');

    result.connections.forEach(conn => {
      assert.ok(conn.source && conn.target);
      assert.ok(conn.type);
      assert.ok(Array.isArray(conn.evidence), 'Evidence must be array of observed facts');
      assert.ok(conn.evidence.length > 0);
      assert.ok(typeof conn.interpretation === 'string', 'Interpretation must be analytical string');
      assert.ok(typeof conn.confidence === 'number');
      assert.ok(conn.confidence >= 50 && conn.confidence <= 100);
    });
  });

  test('filterReceipts filters by search query accurately', () => {
    const searchBreakfast = filterReceipts(sampleRecords, { search: 'breakfast' });
    assert.equal(searchBreakfast.length, 1);
    assert.equal(searchBreakfast[0].id, 'r-2');
  });

  test('filterReceipts filters by category correctly', () => {
    const filterCat = filterReceipts(sampleRecords, { category: 'transportation' });
    assert.equal(filterCat.length, 1);
    assert.equal(filterCat[0].id, 'r-1');
  });

  test('filterReceipts sorts by amount descending', () => {
    const sorted = filterReceipts(sampleRecords, { sortBy: 'amount-desc' });
    assert.equal(sorted[0].id, 'r-4'); // 320
    assert.equal(sorted[sorted.length - 1].id, 'r-1'); // 10
  });

  test('chapterAesthetics provides deterministic themes and visual types', () => {
    const mockTrainChapter = {
      title: 'The Train & Idli Morning Rituals',
      epoch: '2018 - 2019',
      theme: 'Morning Sustenance'
    };
    const aes = getChapterAesthetics(mockTrainChapter);
    assert.equal(aes.visualType, 'train-ticket');
    assert.ok(aes.accentColor);
    assert.ok(aes.emoji);
  });

  test('getNodeCategoryColor maps categories accurately and securely', () => {
    assert.equal(getNodeCategoryColor('Transportation'), '#7CB49C');
    assert.equal(getNodeCategoryColor('food'), '#D9A15C');
    assert.equal(getNodeCategoryColor('Music Stream'), '#9B83D8');
    assert.equal(getNodeCategoryColor('online_shopping'), '#BEAEE8');
    assert.equal(getNodeCategoryColor(null), '#D9A15C');
    assert.equal(getNodeCategoryColor(undefined), '#D9A15C');
    assert.equal(getNodeCategoryColor('unknown_category'), '#D9A15C');
  });
});
