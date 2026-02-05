import type { FetchedContent, SearchResponse } from '../../types/index.js';

/**
 * Format search results as markdown
 */
export function formatSearchResults(response: SearchResponse): string {
  const lines: string[] = [];

  lines.push(`# Search Results for "${response.query}"`);
  lines.push('');
  lines.push(
    `**Found ${response.resultsCount} results** (${new Date(response.timestamp).toLocaleString()})`
  );
  lines.push('');
  lines.push('---');
  lines.push('');

  if (response.results.length === 0) {
    lines.push('No results found.');
    return lines.join('\n');
  }

  response.results.forEach((result, index) => {
    lines.push(`${index + 1}. **${escapeMarkdown(result.title)}**`);
    lines.push(`   ${result.url}`);
    lines.push('');
    lines.push(`   ${escapeMarkdown(result.snippet)}`);
    lines.push('');
  });

  return lines.join('\n');
}

/**
 * Format fetched content as markdown
 */
export function formatFetchedContent(content: FetchedContent): string {
  const lines: string[] = [];

  lines.push(`# ${escapeMarkdown(content.title)}`);
  lines.push('');
  lines.push(`**Source:** ${content.url}`);
  lines.push('');
  lines.push(`**Word Count:** ${content.wordCount}`);
  lines.push('');
  lines.push(`**Fetched:** ${new Date(content.timestamp).toLocaleString()}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(content.content);

  return lines.join('\n');
}

/**
 * Escape markdown special characters in plain text
 */
function escapeMarkdown(text: string): string {
  // Don't escape if it looks like it already contains markdown
  if (/[\*_#`\[\]]/.test(text)) {
    return text;
  }
  return text.replace(/[\\*_#`\[\]{}()]/g, '\\$&');
}

/**
 * Format an error message
 */
export function formatError(message: string): string {
  return `**Error:** ${message}`;
}
