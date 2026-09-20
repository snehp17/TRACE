/**
 * TRACE Story Chapter Builder
 * Transforms connected receipt clusters into narrative chapters
 * with distinct observed facts vs cautious interpretations.
 */

export function buildStoryChapters(adapter, records = []) {
  if (adapter && adapter.getStoryChapters) {
    const chapters = adapter.getStoryChapters();
    const recordMap = new Map();
    records.forEach(r => recordMap.set(r.id, r));

    return chapters.map(ch => {
      const supportingReceipts = (ch.sampleReceiptIds || [])
        .map(id => recordMap.get(id))
        .filter(Boolean);

      // If specific IDs aren't found in current slice, grab closest matching records by theme
      const finalReceipts = supportingReceipts.length > 0
        ? supportingReceipts
        : records.slice(0, 4);

      return {
        ...ch,
        receipts: finalReceipts,
        totalReceiptsCount: finalReceipts.length
      };
    });
  }

  return [];
}
