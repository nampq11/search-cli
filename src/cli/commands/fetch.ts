import { Command } from 'commander';
import { webFetch } from '../../core/fetch.js';
import { formatError, formatFetchedContent } from '../utils/output.js';

/**
 * Fetch command implementation
 */
export const fetchCommand = new Command('fetch')
  .description(
    'Fetch web content and convert to markdown format. Removes navigation, scripts, and extracts main content.'
  )
  .argument('<url>', 'URL to fetch')
  .option('-t, --timeout <ms>', 'Request timeout in milliseconds (default: 30000)', '30000')
  .option(
    '-m, --max-length <chars>',
    'Maximum content length in characters (default: 50000)',
    '50000'
  )
  .addHelpText(
    'after',
    `
Examples:
  $ search-cli fetch https://example.com/article
  $ search-cli fetch https://example.com --max-length 10000
  $ search-cli fetch https://docs.python.org --timeout 60000

Output Format:
  The content is returned as markdown with:
  - Page title as heading
  - Source URL
  - Word count
  - Main content in markdown format

For AI Agents:
  This command is designed for AI coding agents. The output is
  clean markdown suitable for parsing and analysis. Navigation,
  scripts, and other non-content elements are automatically removed.`
  )
  .action(async (url, options) => {
    try {
      const timeout = Number.parseInt(options.timeout, 10);
      // Commander converts hyphens to underscores in property names
      const maxLength = Number.parseInt((options.maxLength as string | undefined) || '50000', 10);

      if (Number.isNaN(timeout) || timeout < 1) {
        console.log(formatError('Timeout must be a positive number'));
        process.exit(1);
      }

      if (Number.isNaN(maxLength) || maxLength < 1) {
        console.log(formatError('Max length must be a positive number'));
        process.exit(1);
      }

      const content = await webFetch(url, {
        timeout,
        maxLength,
      });

      console.log(formatFetchedContent(content));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.log(formatError(message));
      process.exit(1);
    }
  });
