import { describe, expect, it } from 'vitest';
import { webFetch } from '../../src/core/fetch.js';

describe.runIf(process.env.INTEGRATION_TESTS === 'true')('WebFetch Integration Tests', () => {
  it('should fetch and parse example.com', async () => {
    const result = await webFetch('https://example.com', {
      timeout: 15000,
    });

    expect(result.url).toContain('example.com');
    expect(result.title).toBeTruthy();
    expect(result.content).toBeTruthy();
    expect(result.wordCount).toBeGreaterThan(0);
    expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  }, 30000);

  it('should fetch and parse a real article', async () => {
    const result = await webFetch('https://www.debian.org/doc/manuals/system-administrator/', {
      timeout: 15000,
      maxLength: 10000,
    });

    expect(result.url).toBeTruthy();
    expect(result.title).toBeTruthy();
    expect(result.content).toBeTruthy();
    expect(result.wordCount).toBeGreaterThan(0);

    // Content should be markdown formatted
    if (result.content.length > 0) {
      expect(typeof result.content).toBe('string');
    }

    // Content length should be within maxLength
    expect(result.content.length).toBeLessThanOrEqual(10000 + '[Content truncated...]'.length);
  }, 30000);

  it('should handle invalid URLs', async () => {
    await expect(webFetch('not-a-valid-url')).rejects.toThrow();
  }, 10000);

  it('should handle non-existent domains', async () => {
    await expect(
      webFetch('https://this-domain-definitely-does-not-exist-12345.com')
    ).rejects.toThrow();
  }, 30000);

  it('should extract content from structured pages', async () => {
    const result = await webFetch('https://httpbin.org/html', {
      timeout: 15000,
    });

    expect(result.content).toBeTruthy();
    expect(result.wordCount).toBeGreaterThan(0);
    expect(result.title).toBeTruthy();
  }, 30000);
});
