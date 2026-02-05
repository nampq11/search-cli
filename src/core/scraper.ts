import * as cheerio from 'cheerio';
import type { SearchResult } from '../types/index.js';
import { httpClient } from '../utils/http.js';

/**
 * DuckDuckGo HTML scraper
 * Based on the Python reference implementation in example/quick-search.py
 */
export class DuckDuckGoScraper {
  private readonly searchUrl = 'https://html.duckduckgo.com/html/';

  /**
   * Search DuckDuckGo and parse the HTML results.
   * Matches the Python search_duckduckgo function behavior.
   *
   * @param query - The search query
   * @param maxResults - Maximum number of results to return (default: 10)
   * @returns Array of search results with title, URL, and snippet
   */
  async search(query: string, maxResults = 10): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) {
      throw new Error('Query cannot be empty');
    }

    // Step 1: GET request to establish session and get cookies
    const getSessionResponse = await httpClient.get(this.searchUrl);

    // Step 2: POST with form data and cookies
    const formData = {
      q: query,
      kl: '',
    };

    const searchResponse = await httpClient.post(this.searchUrl, formData, {
      cookie: getSessionResponse.cookies,
    });

    // Step 3: Parse HTML with Cheerio using same selectors as Python (BeautifulSoup)
    const $ = cheerio.load(searchResponse.data);
    const results: SearchResult[] = [];

    // Python uses: soup.select(".result")
    $('.result').each((_, element) => {
      if (results.length >= maxResults) {
        return false; // Break out of the loop
      }

      const $result = $(element);

      // Python uses: result.select_one(".result__a") for both title and URL
      const $titleLink = $result.find('.result__a').first();

      // Python uses: result.select_one(".result__snippet") for description
      const $snippet = $result.find('.result__snippet').first();

      if ($titleLink.length > 0) {
        const title = $titleLink.text().trim();
        const url = $titleLink.attr('href');
        const snippet = $snippet.length > 0 ? $snippet.text().trim() : '';

        if (url) {
          results.push({
            title,
            url,
            snippet,
          });
        }
      }
    });

    return results;
  }
}

/**
 * Singleton scraper instance
 */
export const scraper = new DuckDuckGoScraper();
