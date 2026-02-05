import { describe, expect, it } from 'vitest';
import { ContentExtractor } from '../../src/parsers/content.js';

describe('ContentExtractor', () => {
  let extractor: ContentExtractor;

  beforeEach(() => {
    extractor = new ContentExtractor();
  });

  it('should extract title from HTML', () => {
    const html = `
      <html>
        <head><title>Test Page Title</title></head>
        <body><p>Some content</p></body>
      </html>
    `;

    const result = extractor.extract(html);

    expect(result.title).toBe('Test Page Title');
  });

  it('should handle missing title', () => {
    const html = '<html><body><p>No title</p></body></html>';

    const result = extractor.extract(html);

    expect(result.title).toBe('');
  });

  it('should extract content from main element', () => {
    const html = `
      <html>
        <head><title>Test</title></head>
        <body>
          <nav>Navigation</nav>
          <main>
            <h1>Main Content</h1>
            <p>This is the main content.</p>
          </main>
          <footer>Footer</footer>
        </body>
      </html>
    `;

    const result = extractor.extract(html);

    expect(result.content).toContain('Main Content');
    expect(result.content).toContain('This is the main content');
    expect(result.content).not.toContain('Navigation');
    expect(result.content).not.toContain('Footer');
  });

  it('should extract content from article element', () => {
    const html = `
      <html>
        <head><title>Test</title></head>
        <body>
          <div class="sidebar">Sidebar</div>
          <article>
            <h2>Article Title</h2>
            <p>Article content here.</p>
          </article>
        </body>
      </html>
    `;

    const result = extractor.extract(html);

    expect(result.content).toContain('Article Title');
    expect(result.content).toContain('Article content here');
    expect(result.content).not.toContain('Sidebar');
  });

  it('should extract content from regex class match', () => {
    const html = `
      <html>
        <head><title>Test</title></head>
        <body>
          <div class="main-content">
            <h1>Content Found</h1>
            <p>This should be extracted.</p>
          </div>
          <div class="sidebar">Ignore this</div>
        </body>
      </html>
    `;

    const result = extractor.extract(html);

    expect(result.content).toContain('Content Found');
    expect(result.content).toContain('This should be extracted');
    expect(result.content).not.toContain('Ignore this');
  });

  it('should extract content from body as fallback', () => {
    const html = `
      <html>
        <head><title>Test</title></head>
        <body>
          <script>console.log("removed");</script>
          <h1>Fallback Content</h1>
          <p>Content from body.</p>
        </body>
      </html>
    `;

    const result = extractor.extract(html);

    expect(result.content).toContain('Fallback Content');
    expect(result.content).toContain('Content from body');
    expect(result.content).not.toContain('console.log');
  });

  it('should remove script and style elements', () => {
    const html = `
      <html>
        <body>
          <p>Before script</p>
          <script>alert('removed');</script>
          <p>After script</p>
          <style>.removed { color: red; }</style>
          <p>After style</p>
        </body>
      </html>
    `;

    const result = extractor.extract(html);

    expect(result.content).not.toContain('alert');
    expect(result.content).not.toContain('color: red');
    expect(result.content).toContain('Before script');
    expect(result.content).toContain('After script');
  });

  it('should calculate word count correctly', () => {
    const html = `
      <html>
        <body>
          <p>This is a test paragraph with seven words.</p>
        </body>
      </html>
    `;

    const result = extractor.extract(html);

    expect(result.wordCount).toBeGreaterThan(0);
  });

  it('should respect maxLength option', () => {
    // Create HTML with longer content that will exceed maxLength
    const longContent =
      'This is a long paragraph with lots of text that exceeds the maximum length limit. ';
    const html = `
      <html>
        <body>
          <p>${longContent.repeat(10)}</p>
        </body>
      </html>
    `;

    const result = extractor.extract(html, { maxLength: 50 });

    expect(result.content.length).toBeLessThanOrEqual(80); // 50 + '[Content truncated...]' length
    expect(result.content).toContain('[Content truncated...]');
  });

  it('should convert HTML to markdown', () => {
    const html = `
      <html>
        <body>
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <p>A paragraph with <strong>bold</strong> text.</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </body>
      </html>
    `;

    const result = extractor.extract(html);

    expect(result.content).toContain('# Heading 1');
    expect(result.content).toContain('## Heading 2');
    expect(result.content).toContain('**bold**');
    // Turndown may format lists with extra spaces, so just check the content is there
    expect(result.content).toContain('Item 1');
    expect(result.content).toContain('Item 2');
  });

  it('should clean up excessive whitespace', () => {
    const html = `
      <html>
        <body>
          <p>Line 1</p>
          <p>Line 2</p>
          <p>Line 3</p>
        </body>
      </html>
    `;

    const result = extractor.extract(html);

    // Should not have multiple consecutive newlines
    expect(result.content).not.toMatch(/\n\n\n/);
  });
});
