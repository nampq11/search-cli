import { contentExtractor } from '../parsers/content.js';
import type { FetchOptions, FetchedContent } from '../types/index.js';
import { httpClient } from '../utils/http.js';

/**
 * Web content fetcher that extracts and converts to markdown
 */
export class WebFetcher {
  private defaultMaxLength = 50000;

  /**
   * Fetch a URL and extract its main content as markdown
   * Based on the Python read_url function behavior
   *
   * @param url - The URL to fetch
   * @param options - Fetch options
   * @returns Fetched content with metadata
   */
  async fetch(url: string, options: FetchOptions = {}): Promise<FetchedContent> {
    // Validate URL
    const normalizedUrl = url.trim();
    if (!normalizedUrl) {
      throw new Error('URL cannot be empty');
    }

    try {
      new URL(normalizedUrl);
    } catch {
      throw new Error(`Invalid URL: ${normalizedUrl}`);
    }

    const timeout = options.timeout ?? 30000;
    const maxLength = options.maxLength ?? this.defaultMaxLength;

    // Fetch the URL
    const response = await Promise.race([
      httpClient.get(normalizedUrl),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Fetch timeout after ${timeout}ms`)), timeout)
      ),
    ]);

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: Failed to fetch URL`);
    }

    // Extract content
    const { title, content, wordCount } = contentExtractor.extract(response.data, {
      maxLength,
    });

    return {
      url: response.headers.location || normalizedUrl, // Use final URL after redirects
      title,
      content,
      wordCount,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Export the fetcher class
 */
export const webFetcherClass = new WebFetcher();

/**
 * Convenience function for web content fetching
 *
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @returns Fetched content with metadata
 */
export async function webFetch(url: string, options?: FetchOptions): Promise<FetchedContent> {
  return webFetcherClass.fetch(url, options);
}
