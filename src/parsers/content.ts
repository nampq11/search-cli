import * as cheerio from 'cheerio';
import { markdownConverter } from './markdown.js';

/**
 * Content extraction options
 */
export interface ContentExtractionOptions {
  /** Maximum content length in characters */
  maxLength?: number;
}

/**
 * Extract main content from HTML
 * Based on the Python read_url function behavior
 */
export class ContentExtractor {
  /**
   * Extract main content from HTML and convert to markdown
   *
   * @param html - The HTML content to parse
   * @param options - Extraction options
   * @returns Extracted content with metadata
   */
  extract(
    html: string,
    options: ContentExtractionOptions = {}
  ): {
    title: string;
    content: string;
    wordCount: number;
  } {
    const startTime = performance.now();
    const $ = cheerio.load(html);
    const parseTime = performance.now() - startTime;

    // Extract title (Python: soup.find("title"))
    let title = '';
    const titleElem = $('title').first();
    if (titleElem.length > 0) {
      title = titleElem.text().trim();
    }

    // Remove unwanted elements (Python: script.decompose() for these)
    const removeStart = performance.now();
    $('script, style, nav, header, footer, aside, iframe, noscript').remove();
    const removeTime = performance.now() - removeStart;

    // Find main content with priority order - optimized with direct selectors
    const findStart = performance.now();
    let mainContent = $('main').first();

    if (mainContent.length === 0) {
      mainContent = $('article').first();
    }

    if (mainContent.length === 0) {
      // Optimized: use attribute selector instead of iterating all elements
      mainContent = $('div[class*="content"], div[class*="article"], div[class*="post"], div[class*="main"], section[class*="content"], section[class*="article"], section[class*="post"], section[class*="main"]').first();
    }

    if (mainContent.length === 0) {
      mainContent = $('body');
    }
    const findTime = performance.now() - findStart;

    // Convert to markdown
    const convertStart = performance.now();
    const markdown = markdownConverter.convert(mainContent.html() || '');
    const convertTime = performance.now() - convertStart;

    // Clean up excessive whitespace (Python: re.sub(r"\n+", "\n", text))
    const cleanedContent = markdown.replace(/\n{3,}/g, '\n\n').trim();

    // Apply max length if specified
    let finalContent = cleanedContent;
    if (options.maxLength && cleanedContent.length > options.maxLength) {
      finalContent = `${cleanedContent.substring(0, options.maxLength)}\n\n[Content truncated...]`;
    }

    // Calculate word count
    const wordCount = finalContent.split(/\s+/).filter((w) => w.length > 0).length;

    const totalTime = performance.now() - startTime;

    // Log timing diagnostics to stderr (won't interfere with stdout output)
    if (process.env.DEBUG_TIMING === 'true') {
      console.error(`[Timing] Parse: ${parseTime.toFixed(1)}ms, Remove: ${removeTime.toFixed(1)}ms, Find: ${findTime.toFixed(1)}ms, Convert: ${convertTime.toFixed(1)}ms, Total: ${totalTime.toFixed(1)}ms`);
    }

    return {
      title,
      content: finalContent,
      wordCount,
    };
  }
}

/**
 * Singleton extractor instance
 */
export const contentExtractor = new ContentExtractor();
