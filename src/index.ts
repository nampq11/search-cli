/**
 * search-cli - A modern TypeScript CLI tool for web search and content fetching
 *
 * @packageDocumentation
 */

// Export core functions
export { webSearch, webSearchClass as WebSearch } from './core/search.js';
export { webFetch, webFetcherClass as WebFetcher } from './core/fetch.js';

// Export classes for advanced usage
export { DuckDuckGoScraper } from './core/scraper.js';
export { HttpClient } from './utils/http.js';
export { MarkdownConverter } from './parsers/markdown.js';
export { ContentExtractor } from './parsers/content.js';

// Export types
export type {
  SearchResult,
  SearchResponse,
  FetchedContent,
  SearchOptions,
  FetchOptions,
  RequestOptions,
} from './types/index.js';
