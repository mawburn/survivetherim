# Source Directory (`src/`)

This is the main source directory for the SurviveTheRim application, containing all the Vue.js and Nuxt.js application code.

## Project Structure

```
project-root/
├── src/                 # Main application source code
│   ├── app.vue          # Root Vue component
│   ├── components/      # Reusable Vue components
│   ├── composables/     # Vue composables for shared logic
│   └── pages/          # File-based routing pages
├── server/             # Server-side API and backend logic
│   ├── api/            # API endpoints
│   │   ├── db/         # Database initialization
│   │   └── guides/     # Guide API endpoints
│   └── tsconfig.json   # Server TypeScript configuration
├── content/            # Content management and database
│   ├── data/           # Static content files
│   ├── database/       # SQLite database schema
│   └── guides/         # Markdown guide content
├── docs/               # Project documentation
│   └── nuxt/          # Vue/Nuxt learning guides
├── public/             # Static assets (favicon, robots.txt)
├── dist/               # Build output directory
└── netlify/            # Netlify deployment configuration
```

## Source Directory (`src/`)

### `app.vue`

- **Purpose**: Root Vue component that wraps all pages
- **Features**: Global layout, navigation, meta tags

### `components/`

- **Purpose**: Reusable Vue components organized by category
- **Structure**:
  - `Base/` - Generic UI components (buttons, cards, inputs)
  - `RimWorld/` - Game-specific components (colonist cards)
  - `Demo/` - Interactive demo components
- **Auto-Import**: Components are automatically imported based on file path

### `composables/`

- **Purpose**: Shared reactive logic and utilities
- **Files**:
  - `useRimWorldData.ts` - RimWorld-specific data generation and game logic
- **Auto-Import**: Composables are automatically available in all components

### `pages/`

- **Purpose**: Application pages using Nuxt.js file-based routing
- **Routes**:
  - `index.vue` → `/` (Landing page)
  - `components.vue` → `/components` (Component showcase)
  - `colony.vue` → `/colony` (Colony simulator)
  - `guides.vue` → `/guides` (Guide browser)

## Server Directory (`server/`)

### `api/`

- **Purpose**: Server-side API endpoints for data fetching
- **Structure**:
  - `db/init.post.ts` - Database initialization endpoint
  - `guides/index.get.ts` - Guide listing API
  - `guides/[slug].get.ts` - Individual guide API

## Content Directory (`content/`)

### `database/`

- **Purpose**: SQLite database schema and configuration
- **Files**: `schema.sql` - Database table definitions

### `guides/`

- **Purpose**: Markdown content for survival guides
- **Integration**: Used by @nuxt/content for static site generation

## Other Directories

### `docs/`

- **Purpose**: Project documentation and learning materials
- **Content**: Vue.js and Nuxt.js tutorial guides

### `public/`

- **Purpose**: Static assets served directly by the web server
- **Files**: favicon.ico, robots.txt, images

## Key Features

- **Nuxt 3** with Vue 3 Composition API
- **TypeScript** for type safety throughout the application
- **Auto-imports** for components and composables
- **File-based routing** for intuitive page organization
- **Component-driven architecture** with reusable UI elements
- **Server-side API** with SQLite database integration
- **Content management** with Markdown support

## Development Notes

- All components in `src/components/` are automatically imported
- All composables in `src/composables/` are automatically imported
- Pages use the `.vue` extension and follow Nuxt routing conventions
- TypeScript interfaces are defined inline for better component isolation
- Server APIs follow Nuxt's server directory conventions
- Content is managed through @nuxt/content for static generation
