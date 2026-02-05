import type { SearchOptions, SearchResponse, SearchResult } from '../types/index.js';
import { scraper } from './scraper.js';

/**
 * Web search API using DuckDuckGo HTML scraping
 */
export class WebSearch {
  private defaultMaxResults = 10;

  /**
   * Search the web using DuckDuckGo
   *
   * @param query - Search query string
   * @param options - Search options
   * @returns Search response with results and metadata
   */
  async search(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
    // Validate input and normalize whitespace
    const normalizedQuery = query.trim().replace(/\s+/g, ' ');
    if (!normalizedQuery) {
      throw new Error('Search query cannot be empty');
    }

    const maxResults = options.maxResults ?? this.defaultMaxResults;
    const timeout = options.timeout ?? 30000;

    // Perform search
    const results = await Promise.race([
      scraper.search(normalizedQuery, maxResults),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Search timeout after ${timeout}ms`)), timeout)
      ),
    ]);

    return {
      query: normalizedQuery,
      resultsCount: results.length,
      results,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Export the search class
 */
export const webSearchClass = new WebSearch();

/**
 * Convenience function for web search
 *
 * @param query - Search query string
 * @param options - Search options
 * @returns Search response with results and metadata
 */
export async function webSearch(query: string, options?: SearchOptions): Promise<SearchResponse> {
  return webSearchClass.search(query, options);
}
