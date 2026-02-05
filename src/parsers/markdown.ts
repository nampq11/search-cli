import TurndownService from 'turndown';

/**
 * HTML to Markdown converter using turndown
 */
export class MarkdownConverter {
  private turndown: TurndownService;

  constructor() {
    this.turndown = new TurndownService({
      headingStyle: 'atx', // Use # style headings
      codeBlockStyle: 'fenced', // Use ``` code blocks
      bulletListMarker: '-', // Use - for bullets
      emDelimiter: '_', // Use _ for emphasis
    });

    // Add custom rules for better conversion
    this.turndown.addRule('strikethrough', {
      filter: ['del', 's', 'strike'],
      replacement: (content) => `~~${content}~~`,
    });
  }

  /**
   * Convert HTML to Markdown
   */
  convert(html: string): string {
    return this.turndown.turndown(html);
  }
}

/**
 * Singleton converter instance
 */
export const markdownConverter = new MarkdownConverter();
