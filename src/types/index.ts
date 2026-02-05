/**
 * A single search result from DuckDuckGo
 */
export interface SearchResult {
  /** The title of the search result */
  title: string;
  /** The URL of the search result */
  url: string;
  /** A snippet/description of the search result */
  snippet: string;
}

/**
 * Complete search response with metadata
 */
export interface SearchResponse {
  /** The original search query */
  query: string;
  /** Number of results returned */
  resultsCount: number;
  /** Array of search results */
  results: SearchResult[];
  /** ISO timestamp of when the search was performed */
  timestamp: string;
}

/**
 * Fetched web content converted to markdown
 */
export interface FetchedContent {
  /** The URL that was fetched */
  url: string;
  /** The page title */
  title: string;
  /** The content in markdown format */
  content: string;
  /** Approximate word count */
  wordCount: number;
  /** ISO timestamp of when the content was fetched */
  timestamp: string;
}

/**
 * Options for web search
 */
export interface SearchOptions {
  /** Maximum number of results to return (default: 10) */
  maxResults?: number;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

/**
 * Options for web fetch
 */
export interface FetchOptions {
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Maximum content length in characters (default: 50000) */
  maxLength?: number;
}

/**
 * HTTP request options
 */
export interface RequestOptions {
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Custom headers */
  headers?: Record<string, string>;
  /** Cookie string for session management */
  cookie?: string;
}
