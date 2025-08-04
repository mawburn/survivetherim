# Nuxt Modules Reference

This document provides an overview of the core Nuxt modules used in this project, including their features, use cases, and basic usage examples.

## @nuxt/content

**What it does:** A file-based CMS module that allows you to write content in Markdown, YAML, CSV, or JSON files and query them with a MongoDB-like API.

**Key Features:**

- Reads files from the `content/` directory automatically
- Supports Vue components in Markdown (MDC syntax)
- Built-in code highlighting with Shiki
- Auto-generates navigation from content structure
- SEO-friendly with sitemap integration

**How to use:**

```vue
<template>
  <ContentDoc />
</template>
```

```javascript
// Query content programmatically
const { data } = await $content('articles').fetch()
```

**Best for:** Documentation sites, blogs, marketing pages, or any content-driven application.

## @nuxt/eslint

**What it does:** Provides modern ESLint v9 integration with flat config support and project-aware configurations for Nuxt applications.

**Key Features:**

- ESLint v9 flat config format support
- Project-aware configuration generation
- DevTools integration
- Stylistic rules integration
- TypeScript support out of the box

**How to use:**

```javascript
// eslint.config.mjs (auto-generated)
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt()
```

```bash
# Package.json scripts
npm run lint
npm run lint:fix
```

**Best for:** Maintaining consistent code quality, enforcing coding standards, and catching errors early in development.

## @nuxt/fonts

**What it does:** Plug-and-play web font optimization that automatically downloads, optimizes, and serves fonts with zero configuration.

**Key Features:**

- Zero-config font detection from CSS
- Supports 6+ font providers (Google Fonts, Bunny, Fontshare, etc.)
- Automatic font downloading for production
- Built-in optimization with fontaine and capsize
- Improves Core Web Vitals (FCP, CLS)

**How to use:**

```css
/* Simply declare font-family in CSS */
.title {
  font-family: 'Inter', sans-serif;
}
```

The module automatically detects and optimizes fonts from your CSS declarations.

**Best for:** Performance-critical applications, improving Core Web Vitals, and seamless font management.

## @nuxt/icon

**What it does:** Provides access to 200,000+ icons from Iconify with server-side optimization and local bundling.

**Key Features:**

- 200,000+ icons from Iconify
- Server bundle mode for local serving
- Custom collection support
- Remote CDN fallback options
- GDPR-compliant (no localStorage caching)

**How to use:**

```vue
<template>
  <Icon name="uil:github" />
  <Icon name="heroicons:home" />
</template>
```

```bash
# Install specific icon collections for better performance
npm install @iconify-json/uil @iconify-json/heroicons
```

**Best for:** Applications needing consistent iconography, design systems, and performance-conscious icon usage.

## @nuxt/image

**What it does:** Plug-and-play image optimization with automatic resizing, format conversion, and lazy loading.

**Key Features:**

- Automatic image transformation and resizing
- Progressive loading and lazy loading
- CDN provider support
- Modern format conversion (WebP, AVIF)
- Improves Largest Contentful Paint (LCP)

**How to use:**

```vue
<template>
  <NuxtImg src="/hero.jpg" alt="Hero image" width="800" height="600" loading="lazy" />
</template>
```

**Best for:** Media-heavy applications, e-commerce sites, and any application where image performance matters.

## @nuxt/scripts

**What it does:** Manages third-party scripts with enhanced performance, privacy, and developer experience.

**Key Features:**

- Load scripts on-demand or with triggers
- GDPR compliance and privacy protection
- Type-safe composables for popular services
- Facade components for better UX
- 21+ built-in script integrations

**How to use:**

```javascript
// Load Google Analytics conditionally
const { $gtag } = useScriptGoogleAnalytics({
  id: 'G-XXXXXXXXX',
  scriptOptions: {
    trigger: 'manual',
  },
})
```

```vue
<template>
  <!-- Facade component for YouTube -->
  <ScriptYouTubePlayer video-id="dQw4w9WgXcQ" />
</template>
```

**Best for:** Applications using analytics, marketing tools, social media embeds, or any third-party services.

## @nuxt/test-utils

**What it does:** Provides testing utilities specifically designed for Nuxt applications with Vitest integration.

**Key Features:**

- First-class Vitest integration
- Nuxt-specific testing environment
- Component mounting utilities (`mountSuspended`)
- Auto-import mocking (`mockNuxtImport`)
- SSR testing support

**How to use:**

```javascript
// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  // Your Vitest config
})
```

```javascript
// In tests
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'

// Mock auto-imported composables
mockNuxtImport('useAuth', () => ({
  user: { name: 'Test User' },
}))

// Mount Nuxt components
const component = await mountSuspended(MyComponent)
```

**Best for:** Unit testing, integration testing, and ensuring code quality in Nuxt applications.
