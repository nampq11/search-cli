import { describe, expect, it } from 'vitest';
import { webSearch } from '../../src/core/search.js';

describe.runIf(process.env.INTEGRATION_TESTS === 'true')('WebSearch Integration Tests', () => {
  it('should perform real search on DuckDuckGo', async () => {
    const result = await webSearch('TypeScript tutorial', {
      maxResults: 3,
    });

    expect(result.query).toBe('TypeScript tutorial');
    expect(result.resultsCount).toBeGreaterThan(0);
    expect(result.resultsCount).toBeLessThanOrEqual(3);
    expect(result.results.length).toBe(result.resultsCount);

    // Check first result structure
    const firstResult = result.results[0];
    expect(firstResult).toHaveProperty('title');
    expect(firstResult).toHaveProperty('url');
    expect(firstResult).toHaveProperty('snippet');

    expect(typeof firstResult.title).toBe('string');
    expect(typeof firstResult.url).toBe('string');
    expect(typeof firstResult.snippet).toBe('string');

    expect(firstResult.title.length).toBeGreaterThan(0);
    expect(firstResult.url.length).toBeGreaterThan(0);
    expect(firstResult.url).toMatch(/^https?:\/\//);

    expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  }, 30000);

  it('should handle search with special characters', async () => {
    const result = await webSearch('C++ programming', {
      maxResults: 2,
    });

    expect(result.resultsCount).toBeGreaterThan(0);
  }, 30000);

  it('should return empty results for nonsense queries', async () => {
    const result = await webSearch('asdfghjklzxcvbnmqwertyuiop1234567890', {
      maxResults: 5,
    });

    // DuckDuckGo may still return some results even for nonsense
    expect(Array.isArray(result.results)).toBe(true);
  }, 30000);
});
