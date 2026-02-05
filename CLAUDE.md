# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`search-cli` is a TypeScript CLI tool for web search and content fetching using DuckDuckGo HTML scraping. It's designed for AI coding agents with clean, predictable markdown output. The project has two interfaces:

1. **CLI tool**: `search-cli search <query>` and `search-cli fetch <url>`
2. **Programmatic API**: `webSearch()` and `webFetch()` functions exported from `src/index.ts`

## Development Commands

```bash
# Install dependencies
npm install

# Build (TypeScript -> dist/)
npm run build

# Run CLI in development mode
npm run dev

# Testing
npm test                    # Run unit tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run with coverage report
INTEGRATION_TESTS=true npm test  # Run integration tests (requires network)

# Code quality
npm run lint                # Run oxlint (fast linter)
npm run lint:fix            # Fix oxlint issues automatically
npm run check               # Run Biome comprehensive check
npm run check:fix           # Fix Biome issues automatically
npm run format              # Format code with Biome

# Local CLI testing
npm link
search-cli search "test query"
```

## Architecture

### Layered Architecture

```
src/
├── core/           # Business logic (WebSearch, WebFetcher, DuckDuckGoScraper)
├── parsers/        # Data transformation (MarkdownConverter, ContentExtractor)
├── cli/            # CLI interface (commands, output formatting)
├── utils/          # HTTP client wrapper
└── types/          # TypeScript interfaces
```

### Key Patterns

1. **Singleton instances**: `httpClient`, `contentExtractor`, `markdownConverter`, `scraper` are exported as singletons from their modules
2. **Dual exports**: Each core module exports both a class instance and a convenience function (e.g., `WebSearch` class + `webSearch` function)
3. **Reference implementation**: The Python implementation in `example/quick-search.py` is the source of truth for scraping logic and content extraction

### DuckDuckGo Scraping

The scraper uses a two-step process (see `src/core/scraper.ts`):
1. GET request to establish session and get cookies
2. POST with form data `{q: query, kl: ''}`

CSS selectors match the Python reference:
- `.result` - each search result
- `.result__a` - title and URL
- `.result__snippet` - description

### Content Extraction Priority

Content extraction (see `src/parsers/content.ts`) follows this priority:
1. `<main>` element
2. `<article>` element
3. `<div>` or `<section>` with class matching `/(content|article|post|main)/i`
4. `<body>` as fallback

Unwanted elements are removed first: `script, style, nav, header, footer, aside, iframe, noscript`

## Tech Stack

- **Runtime**: Node.js 18+ (ES Modules)
- **Language**: TypeScript 5.3 (target: ES2022, module: ESNext)
- **HTTP**: Axios with custom cookie-handling wrapper
- **HTML parsing**: Cheerio (jQuery-like)
- **Markdown**: Turndown for HTML→Markdown
- **Testing**: Vitest with V8 coverage
- **CLI**: Commander.js

## Integration Tests

Integration tests are opt-in via `INTEGRATION_TESTS=true` environment variable. They make real network requests to DuckDuckGo and external URLs. Located in `tests/integration/`.

## Type Definitions

Main types in `src/types/index.ts`:
- `SearchResult`: `{title, url, snippet}`
- `SearchResponse`: `{query, resultsCount, results, timestamp}`
- `FetchedContent`: `{url, title, content, wordCount, timestamp}`
- `SearchOptions`: `{maxResults?, timeout?}`
- `FetchOptions`: `{timeout?, maxLength?}`
