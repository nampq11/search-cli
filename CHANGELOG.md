# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-05

### Added
- Initial release of search-cli
- Web search functionality using DuckDuckGo HTML scraping
- Content fetching from URLs with markdown conversion
- CLI interface with `search` and `fetch` commands
- Programmatic API with `webSearch()` and `webFetch()` functions
- TypeScript support with full type definitions
- Comprehensive test suite with unit and integration tests
- Content extraction following semantic HTML priority (main > article > body)
- Clean markdown output optimized for AI coding agents

### CLI Commands
- `search-cli search <query>` - Search the web using DuckDuckGo
- `search-cli fetch <url>` - Fetch and convert web content to markdown

### API
- `webSearch(query, options?)` - Search and get results
- `webFetch(url, options?)` - Fetch and convert content
- TypeScript types: `SearchResult`, `SearchResponse`, `FetchedContent`, `SearchOptions`, `FetchOptions`

[1.0.0]: https://github.com/nampq/search-cli/releases/tag/v1.0.0
