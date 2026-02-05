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
    const $ = cheerio.load(html);

    // Extract title (Python: soup.find("title"))
    let title = '';
    const titleElem = $('title').first();
    if (titleElem.length > 0) {
      title = titleElem.text().trim();
    }

    // Remove unwanted elements (Python: script.decompose() for these)
    $('script, style, nav, header, footer, aside, iframe, noscript').remove();

    // Find main content with priority order
    // Python: soup.find("main") or soup.find("article") or soup.find("div", class_=re.compile(r"content|article|post|main")) or soup.body
    let mainContent = $('main').first();

    if (mainContent.length === 0) {
      mainContent = $('article').first();
    }

    if (mainContent.length === 0) {
      // Match regex pattern /(content|article|post|main)/i
      $('div, section').each((_, elem) => {
        const className = $(elem).attr('class') || '';
        if (/content|article|post|main/i.test(className)) {
          mainContent = $(elem);
          return false; // Break
        }
      });
    }

    if (mainContent.length === 0) {
      mainContent = $('body');
    }

    // Convert to markdown
    const markdown = markdownConverter.convert(mainContent.html() || '');

    // Clean up excessive whitespace (Python: re.sub(r"\n+", "\n", text))
    const cleanedContent = markdown.replace(/\n{3,}/g, '\n\n').trim();

    // Apply max length if specified
    let finalContent = cleanedContent;
    if (options.maxLength && cleanedContent.length > options.maxLength) {
      finalContent = `${cleanedContent.substring(0, options.maxLength)}\n\n[Content truncated...]`;
    }

    // Calculate word count
    const wordCount = finalContent.split(/\s+/).filter((w) => w.length > 0).length;

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
