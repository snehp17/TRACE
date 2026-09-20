/**
 * @fileoverview TRACE Core Domain Data Contracts & Type Schemas
 * Defines authoritative JSDoc schemas for records, connections, chapters, and adapters.
 */

/**
 * @typedef {Object} ReceiptRecord
 * @property {string} id - Unique identifier
 * @property {string} title - Primary descriptive label
 * @property {string} timestamp - ISO-8601 formatted timestamp
 * @property {string} [rawDate] - Unparsed source date string
 * @property {string} category - Normalized primary category
 * @property {string} [subcategory] - Secondary subcategory
 * @property {number|null} [amount] - Monetary value (null for streaming records)
 * @property {string} mode - Transaction mode or playback client
 * @property {string} [location] - Geographic location or municipal hub
 * @property {'household'|'spotify'|'indiatransact'|'user'} source - Originating archive dataset
 * @property {Record<string, any>} [metadata] - Dataset-specific telemetry attributes
 */

/**
 * @typedef {Object} RelationshipConnection
 * @property {string} id - Connection identifier
 * @property {string} source - Source receipt ID
 * @property {string} target - Target receipt ID
 * @property {string} type - Classification of relationship (e.g. 'Commute & Sustenance Pair')
 * @property {string} category - Broader connection theme
 * @property {string[]} evidence - Array of observed factual data points
 * @property {string} interpretation - Cautious analytical deduction
 * @property {number} confidence - Statistical confidence score (0-100)
 * @property {number} [strength] - Visual link weight (0.0 - 1.0)
 */

/**
 * @typedef {Object} StoryChapter
 * @property {string} id - Unique chapter ID
 * @property {string} title - Evocative chapter title
 * @property {string} epoch - Chronological timeframe (e.g. '2018 – 2019')
 * @property {string} theme - Underlying behavioral motif
 * @property {string} summary - Narrative exposition
 * @property {string[]} observedFacts - Verifiable facts derived strictly from data
 * @property {string} cautiousInterpretation - Analytical inference
 * @property {string[]} sampleReceiptIds - IDs of exemplar receipts
 * @property {string} [accentColor] - Hex color for thematic rendering
 * @property {string} [coverImage] - Visual theme banner
 */

/**
 * @typedef {Object} DatasetAdapter
 * @property {string} id - Adapter identifier
 * @property {string} name - Human-readable archive name
 * @property {function(): { id: string, name: string, description: string, recordCount: number, timeRange: string, primaryCategories: string[] }} getMetadata
 * @property {function(): ReceiptRecord[]} getAllRecords
 * @property {function(): Record<string, any>} getMetrics
 * @property {function(ReceiptRecord[]=): { nodes: ReceiptRecord[], connections: RelationshipConnection[] }} detectRelationships
 * @property {function(): StoryChapter[]} getStoryChapters
 * @property {function(): string[]} getCategories
 * @property {function(): string[]} getYears
 */

export const SchemaValidation = {
  isValidRecord(record) {
    return Boolean(record && record.id && record.title && record.source);
  },
  isValidConnection(connection) {
    return Boolean(connection && connection.source && connection.target && connection.type);
  }
};
