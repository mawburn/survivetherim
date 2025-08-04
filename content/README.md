# Content Directory

This directory contains content files for the Nuxt Content module.

## Structure

- **guides/** - RimWorld survival guides and tutorials
- **data/** - Structured data files (JSON, YAML)
- **database/** - SQLite database files and schemas

## Usage

The `@nuxt/content` module automatically processes files in this directory and makes them available via the `queryContent()` API.

Example:
```typescript
// Query all guides
const guides = await queryContent('/guides').find()

// Query specific guide
const guide = await queryContent('/guides/getting-started').findOne()
```

## Database Integration

If using SQLite with better-sqlite3, database files should be stored in the `database/` subdirectory.