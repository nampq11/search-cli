import { Command } from 'commander';
import { webSearch } from '../../core/search.js';
import { formatError, formatSearchResults } from '../utils/output.js';

/**
 * Search command implementation
 */
export const searchCommand = new Command('search')
  .description('Search the web using DuckDuckGo HTML scraping. Returns results in markdown format.')
  .argument('<query>', 'Search query string')
  .option('-l, --limit <number>', 'Maximum number of results (default: 10)', '10')
  .option('-t, --timeout <ms>', 'Request timeout in milliseconds (default: 30000)', '30000')
  .addHelpText(
    'after',
    `
Examples:
  $ search-cli search "TypeScript tutorials"
  $ search-cli search "AI news" --limit 5
  $ search-cli search "best Node.js packages" --timeout 60000

Output Format:
  The results are returned as markdown with:
  - Numbered list of results
  - Title (bold)
  - URL
  - Snippet/description

For AI Agents:
  This command is designed for AI coding agents. The output is
  structured markdown that can be parsed programmatically.`
  )
  .action(async (query, options) => {
    try {
      const limit = Number.parseInt(options.limit, 10);
      const timeout = Number.parseInt(options.timeout, 10);

      if (Number.isNaN(limit) || limit < 1) {
        console.log(formatError('Limit must be a positive number'));
        process.exit(1);
      }

      if (Number.isNaN(timeout) || timeout < 1) {
        console.log(formatError('Timeout must be a positive number'));
        process.exit(1);
      }

      const response = await webSearch(query, {
        maxResults: limit,
        timeout,
      });

      console.log(formatSearchResults(response));
      process.exit(0);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.log(formatError(message));
      process.exit(1);
    }
  });
