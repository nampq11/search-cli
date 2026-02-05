# search-cli

A modern TypeScript CLI tool for web search and content fetching powered by DuckDuckGo HTML scraping. Designed for AI coding agents with clean, predictable, type-safe APIs.

## Features

- **No API Key Required**: Uses DuckDuckGo HTML scraping (free, no rate limits)
- **Dual Interface**: CLI tool and programmatic TypeScript/JavaScript API
- **Markdown Output**: Clean markdown format perfect for AI consumption
- **Type-Safe**: Full TypeScript support with exported types
- **Content Extraction**: Smart content extraction that removes navigation, scripts, and other noise

## Installation

```bash
npm install -g search-cli
```

Or use with npx:

```bash
npx search-cli search "your query"
```

## CLI Usage

### Search the Web

```bash
search-cli search "TypeScript tutorials"
search-cli search "AI news" --limit 5
search-cli search "best Node.js packages" --timeout 60000
```

### Fetch Web Content

```bash
search-cli fetch https://example.com/article
search-cli fetch https://example.com --max-length 10000
search-cli fetch https://docs.python.org --timeout 60000
```

### CLI Options

#### search-cli search `<query>`

| Option | Default | Description |
|--------|---------|-------------|
| `--limit <number>` | 10 | Maximum number of results |
| `--timeout <ms>` | 30000 | Request timeout in milliseconds |

#### search-cli fetch `<url>`

| Option | Default | Description |
|--------|---------|-------------|
| `--timeout <ms>` | 30000 | Request timeout in milliseconds |
| `--max-length <chars>` | 50000 | Maximum content length in characters |

## Programmatic API

### Search

```typescript
import { webSearch } from 'search-cli';

const results = await webSearch('TypeScript tutorials', {
  maxResults: 5,
});

console.log(`Found ${results.resultsCount} results:`);
results.results.forEach((result, i) => {
  console.log(`${i + 1}. ${result.title}`);
  console.log(`   ${result.url}`);
  console.log(`   ${result.snippet}`);
});
```

### Fetch Content

```typescript
import { webFetch } from 'search-cli';

const content = await webFetch('https://example.com/article', {
  maxLength: 10000,
});

console.log(`Title: ${content.title}`);
console.log(`URL: ${content.url}`);
console.log(`Word count: ${content.wordCount}`);
console.log(content.content);
```

### Advanced Usage

```typescript
import { WebSearch, WebFetcher, DuckDuckGoScraper } from 'search-cli';

// Use classes directly
const searcher = new WebSearch();
const fetcher = new WebFetcher();
const scraper = new DuckDuckGoScraper();

// Search with custom options
const searchResults = await searcher.search('query', {
  maxResults: 20,
  timeout: 60000,
});

// Fetch with custom options
const pageContent = await fetcher.fetch('https://example.com', {
  timeout: 60000,
  maxLength: 50000,
});

// Raw scraper access
const rawResults = await scraper.search('query', 10);
```

## Output Format

### Search Results

Search results are returned as markdown:

```markdown
# Search Results for "TypeScript tutorials"

**Found 5 results** (1/1/2024, 12:00:00 PM)

---

1. **TypeScript Tutorial**
   https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
   A quick 5-minute introduction to TypeScript...

2. **Complete TypeScript Guide**
   https://example.com/typescript-guide
   Learn TypeScript from basics to advanced topics...
```

### Fetched Content

Fetched content is returned as markdown:

```markdown
# Page Title

**Source:** https://example.com/article
**Word Count:** 1234
**Fetched:** 1/1/2024, 12:00:00 PM

---

# Article Content

This is the main content of the page...
```

## Type Definitions

```typescript
interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface SearchResponse {
  query: string;
  resultsCount: number;
  results: SearchResult[];
  timestamp: string;
}

interface FetchedContent {
  url: string;
  title: string;
  content: string;        // Markdown formatted
  wordCount: number;
  timestamp: string;
}

interface SearchOptions {
  maxResults?: number;
  timeout?: number;
}

interface FetchOptions {
  timeout?: number;
  maxLength?: number;
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run integration tests (requires network)
INTEGRATION_TESTS=true npm test

# Test coverage
npm run test:coverage

# Link for local CLI testing
npm link
search-cli search "test query"
```

## Tech Stack

- **Runtime**: Node.js 18+ (ES Modules)
- **Language**: TypeScript 5.3 (target: ES2022, module: ESNext)
- **HTTP**: Axios with custom cookie-handling wrapper
- **HTML parsing**: Cheerio (jQuery-like)
- **Markdown**: Turndown for HTML→Markdown
- **Testing**: Vitest with V8 coverage
- **CLI**: Commander.js
- **Linting**: Biome (formatting + linting) + oxlint (fast TypeScript linter)

## How It Works

This tool uses DuckDuckGo HTML scraping, which:

1. Makes a GET request to establish a session
2. POSTs the search query with form data
3. Parses the HTML response using CSS selectors
4. Extracts title, URL, and snippet from each result

For content fetching:

1. Fetches the target URL following redirects
2. Removes non-content elements (scripts, navigation, etc.)
3. Finds main content using priority: `main` → `article` → regex class match → `body`
4. Converts HTML to clean markdown format

## For AI Agents

This CLI is designed specifically for AI coding agents:

- **Structured Output**: Predictable markdown format
- **No Authentication**: No API keys needed
- **Type-Safe**: Full TypeScript exports for programmatic use
- **Error Handling**: Clear error messages
- **Help Documentation**: Comprehensive `--help` output

### Example for AI Agents

```bash
# Search for information
search-cli search "how to implement binary search" --limit 3

# Fetch documentation
search-cli fetch https://docs.python.org/3/tutorial/

# Combine: search then fetch
search-cli search "React hooks documentation" --limit 1
# (Extract URL from results and fetch)
search-cli fetch <extracted_url>
```

## License

MIT
