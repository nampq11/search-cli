import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DuckDuckGoScraper } from '../../src/core/scraper.js';
import { HttpClient } from '../../src/utils/http.js';

// Mock the HTTP client
vi.mock('../../src/utils/http.js', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
  HttpClient: vi.fn(),
}));

describe('DuckDuckGoScraper', () => {
  let scraper: DuckDuckGoScraper;
  let mockGet: any;
  let mockPost: any;

  beforeEach(async () => {
    scraper = new DuckDuckGoScraper();
    const { httpClient } = await import('../../src/utils/http.js');
    mockGet = httpClient.get;
    mockPost = httpClient.post;
    vi.clearAllMocks();
  });

  it('should throw an error for empty query', async () => {
    await expect(scraper.search('')).rejects.toThrow('Query cannot be empty');
    await expect(scraper.search('   ')).rejects.toThrow('Query cannot be empty');
  });

  it('should perform search and return results', async () => {
    // Mock GET response (session establishment)
    mockGet.mockResolvedValue({
      data: '<html></html>',
      status: 200,
      headers: {},
      cookies: 'session=abc123',
    });

    // Mock POST response (search results)
    mockPost.mockResolvedValue({
      data: `
        <html>
          <div class="result">
            <a class="result__a" href="https://example.com">Example Title</a>
            <div class="result__snippet">This is a snippet</div>
          </div>
          <div class="result">
            <a class="result__a" href="https://example.org">Another Title</a>
            <div class="result__snippet">Another snippet</div>
          </div>
        </html>
      `,
      status: 200,
      headers: {},
    });

    const results = await scraper.search('test query', 5);

    expect(mockGet).toHaveBeenCalledWith('https://html.duckduckgo.com/html/');
    expect(mockPost).toHaveBeenCalledWith(
      'https://html.duckduckgo.com/html/',
      { q: 'test query', kl: '' },
      { cookie: 'session=abc123' }
    );

    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      title: 'Example Title',
      url: 'https://example.com',
      snippet: 'This is a snippet',
    });
    expect(results[1]).toEqual({
      title: 'Another Title',
      url: 'https://example.org',
      snippet: 'Another snippet',
    });
  });

  it('should respect maxResults limit', async () => {
    mockGet.mockResolvedValue({
      data: '<html></html>',
      status: 200,
      headers: {},
      cookies: 'session=abc123',
    });

    // Create 15 results
    const manyResults = Array.from(
      { length: 15 },
      (_, i) => `
      <div class="result">
        <a class="result__a" href="https://example.com/${i}">Title ${i}</a>
        <div class="result__snippet">Snippet ${i}</div>
      </div>
    `
    ).join('');

    mockPost.mockResolvedValue({
      data: `<html>${manyResults}</html>`,
      status: 200,
      headers: {},
    });

    const results = await scraper.search('test', 5);

    expect(results).toHaveLength(5);
  });

  it('should handle results without snippets', async () => {
    mockGet.mockResolvedValue({
      data: '<html></html>',
      status: 200,
      headers: {},
      cookies: 'session=abc123',
    });

    mockPost.mockResolvedValue({
      data: `
        <html>
          <div class="result">
            <a class="result__a" href="https://example.com">Title without snippet</a>
          </div>
        </html>
      `,
      status: 200,
      headers: {},
    });

    const results = await scraper.search('test');

    expect(results).toHaveLength(1);
    expect(results[0].snippet).toBe('');
  });

  it('should handle results without URLs gracefully', async () => {
    mockGet.mockResolvedValue({
      data: '<html></html>',
      status: 200,
      headers: {},
      cookies: 'session=abc123',
    });

    mockPost.mockResolvedValue({
      data: `
        <html>
          <div class="result">
            <a class="result__a">Title without href</a>
            <div class="result__snippet">Some snippet</div>
          </div>
        </html>
      `,
      status: 200,
      headers: {},
    });

    const results = await scraper.search('test');

    // Results without URLs should be skipped
    expect(results).toHaveLength(0);
  });
});
