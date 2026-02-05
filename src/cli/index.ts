#!/usr/bin/env node
import { Command } from 'commander';
import { fetchCommand } from './commands/fetch.js';
import { searchCommand } from './commands/search.js';

const program = new Command();

program
  .name('search-cli')
  .description('A modern CLI tool for web search and content fetching powered by DuckDuckGo.')
  .version('1.0.0')
  .addHelpCommand(true)
  .addHelpText(
    'after',
    `
Usage Examples:
  $ search-cli search "TypeScript tutorials"
  $ search-cli search "AI news" --limit 5
  $ search-cli fetch https://example.com/article
  $ search-cli fetch https://example.com --max-length 10000

For more help on each command:
  $ search-cli search --help
  $ search-cli fetch --help

For AI Agents:
  This CLI tool is designed for AI coding agents with:
  - Clean, structured markdown output
  - No API key required (uses DuckDuckGo HTML scraping)
  - Type-safe programmatic API available
  - Predictable, parseable output format

Programmatic API:
  import { webSearch, webFetch } from 'search-cli';

  const results = await webSearch('TypeScript');
  const content = await webFetch('https://example.com');`
  );

// Add subcommands
program.addCommand(searchCommand);
program.addCommand(fetchCommand);

// Parse and execute
program.parseAsync(process.argv).catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
