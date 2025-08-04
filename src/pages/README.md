# Pages Directory (`src/pages/`)

This directory contains the application's pages using Nuxt.js file-based routing. Each `.vue` file automatically becomes a route.

## Current Pages

### `index.vue` - Landing Page (`/`)

- **Purpose**: Main landing page and application entry point
- **Features**:
  - Hero section with navigation links
  - Random generators preview
  - Feature cards showcasing different sections
  - Live statistics display
- **Components Used**: DemoRandomGenerator, BaseCard, BaseButton

### `components.vue` - Component Library (`/components`)

- **Purpose**: Showcase all reusable Vue components
- **Features**:
  - Base components demonstration (buttons, cards, inputs)
  - RimWorld-specific components (ColonistCard)
  - Interactive examples with live state
  - Form validation examples
- **Components Used**: BaseButton, BaseCard, BaseInput, RimWorldColonistCard, DemoRandomGenerator

### `colony.vue` - Colony Simulator (`/colony`)

- **Purpose**: Full-featured RimWorld colony management simulation
- **Features**:
  - Generate and manage virtual colonists
  - Real-time statistics and mood tracking
  - Interactive colonist cards with detailed modals
  - Colony overview with charts and metrics
- **Components Used**: RimWorldColonistCard, BaseCard, BaseButton, BaseInput

### `guides.vue` - Survival Guides (`/guides`)

- **Purpose**: Browse and search RimWorld survival guides
- **Features**:
  - Search and filter functionality
  - Guide categorization (Beginner, Intermediate, Advanced)
  - Favorites system with localStorage persistence
  - Pagination for large guide collections
  - Mock data demonstration
- **Components Used**: BaseCard, BaseButton, BaseInput

## Routing Structure

```
/                    → index.vue (Landing Page)
/components          → components.vue (Component Library)
/colony              → colony.vue (Colony Simulator)
/guides              → guides.vue (Survival Guides)
```

## Technical Features

- **TypeScript**: All pages use TypeScript with proper interfaces
- **SEO Optimization**: Each page has proper meta tags and titles
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Local reactive state with Vue 3 Composition API
- **Navigation**: Breadcrumb navigation and cross-page linking
- **Loading States**: Proper loading indicators and empty states
- **Error Handling**: Graceful error handling and user feedback

## Development Notes

- Pages automatically become routes based on file names
- Use `definePageMeta()` for page-specific configuration
- Use `useHead()` for SEO and meta tag management
- All pages follow consistent styling patterns
- TypeScript interfaces are defined per-page for better organization
