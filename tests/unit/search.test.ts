import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WebSearch, webSearch } from '../../src/core/search.js';

// Mock the scraper
vi.mock('../../src/core/scraper.js', () => ({
  scraper: {
    search: vi.fn(),
  },
  DuckDuckGoScraper: vi.fn(),
}));

describe('WebSearch', () => {
  let webSearchClass: WebSearch;
  let mockScraperSearch: any;

  beforeEach(async () => {
    webSearchClass = new WebSearch();
    const { scraper } = await import('../../src/core/scraper.js');
    mockScraperSearch = scraper.search;
    vi.clearAllMocks();
  });

  it('should throw an error for empty query', async () => {
    await expect(webSearchClass.search('')).rejects.toThrow('Search query cannot be empty');
    await expect(webSearchClass.search('   ')).rejects.toThrow('Search query cannot be empty');
  });

  it('should return search results', async () => {
    mockScraperSearch.mockResolvedValue([
      {
        title: 'Test Result',
        url: 'https://example.com',
        snippet: 'A test snippet',
      },
    ]);

    const result = await webSearchClass.search('test query');

    expect(mockScraperSearch).toHaveBeenCalledWith('test query', 10);
    expect(result).toEqual({
      query: 'test query',
      resultsCount: 1,
      results: [
        {
          title: 'Test Result',
          url: 'https://example.com',
          snippet: 'A test snippet',
        },
      ],
      timestamp: expect.any(String),
    });
  });

  it('should use custom maxResults option', async () => {
    mockScraperSearch.mockResolvedValue([]);

    await webSearchClass.search('test', { maxResults: 5 });

    expect(mockScraperSearch).toHaveBeenCalledWith('test', 5);
  });

  it('should use default options when not provided', async () => {
    mockScraperSearch.mockResolvedValue([]);

    await webSearchClass.search('test');

    expect(mockScraperSearch).toHaveBeenCalledWith('test', 10);
  });

  it('should timeout after specified time', async () => {
    // Mock a slow scraper that takes longer than the timeout
    mockScraperSearch.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve([]), 1000);
        })
    );

    await expect(webSearchClass.search('test', { timeout: 100 })).rejects.toThrow(
      'Search timeout after 100ms'
    );
  });

  it('should normalize whitespace in query', async () => {
    mockScraperSearch.mockResolvedValue([]);

    await webSearchClass.search('  test   query  ');

    // The scraper receives the normalized query (single spaces)
    expect(mockScraperSearch).toHaveBeenCalledWith('test query', 10);
  });
});

describe('webSearch convenience function', () => {
  it('should call the webSearch class method', async () => {
    const { scraper } = await import('../../src/core/scraper.js');
    vi.mocked(scraper.search).mockResolvedValue([]);

    await webSearch('test query');

    expect(scraper.search).toHaveBeenCalledWith('test query', 10);
  });
});
