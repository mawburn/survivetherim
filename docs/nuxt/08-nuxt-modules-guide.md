# Nuxt Modules Guide

Essential Nuxt modules for modern web development in 2025, covering content management, image optimization, icons, fonts, scripts, linting, and testing.

## @nuxt/content

**Purpose**: File-based CMS for Nuxt with full-text search and rich content features.

**Key Features**:
- Supports Markdown, YAML, JSON, and CSV files in `content/` directory
- MDC (Markdown + Vue Components) syntax for embedding Vue components in Markdown
- Powerful SQLite-based query builder with full TypeScript support
- Code highlighting with Shiki
- Auto-generated navigation
- Works in serverless and edge environments

**Installation**:
```bash
pnpm install @nuxt/content
```

**Basic Usage**:
```vue
<template>
  <div>
    <!-- Query and display content -->
    <ContentDoc />
    <!-- Or use programmatic queries -->
    <article v-for="post in posts" :key="post._path">
      <h2>{{ post.title }}</h2>
      <ContentRenderer :value="post" />
    </article>
  </div>
</template>

<script setup>
// Query content with full TypeScript support
const { data: posts } = await queryContent('/blog').find()
</script>
```

**MDC Syntax Example**:
```markdown
# My Blog Post

Regular markdown content here.

::alert{type="warning"}
This is a Vue component in Markdown!
::

:button[Click me]{href="/contact"}
```

## @nuxt/image

**Purpose**: Drop-in image optimization with automatic resizing, lazy loading, and modern format support.

**Key Features**:
- Built-in image resizer and transformer
- 20+ provider integrations (Cloudinary, Netlify, etc.)
- Automatic responsive image generation
- Modern format optimization (WebP, AVIF)
- Progressive loading and lazy loading

**Installation**:
```bash
pnpm install @nuxt/image
```

**Basic Usage**:
```vue
<template>
  <div>
    <!-- Basic optimized image -->
    <NuxtImg src="/hero.jpg" alt="Hero image" />
    
    <!-- Responsive image with sizes -->
    <NuxtImg 
      src="/hero.jpg" 
      sizes="sm:100vw md:50vw lg:400px"
      alt="Responsive hero"
    />
    
    <!-- Picture element with multiple formats -->
    <NuxtPicture
      src="/hero.jpg"
      :img-attrs="{alt: 'Hero image'}"
      sizes="sm:100vw md:50vw lg:400px"
    />
  </div>
</template>
```

**Advanced Configuration**:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  image: {
    provider: 'cloudinary',
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/your-cloud/image/fetch/'
    }
  }
})
```

## @nuxt/icon

**Purpose**: 200,000+ ready-to-use icons from Iconify with SSR support.

**Key Features**:
- Massive icon collection from popular icon sets
- SSR friendly with both CSS and SVG rendering modes
- Custom SVG support
- Dynamic icon loading
- TypeScript support

**Installation**:
```bash
npx nuxi module add icon
```

**Basic Usage**:
```vue
<template>
  <div>
    <!-- Basic icon usage -->
    <Icon name="uil:github" />
    
    <!-- With custom size and color -->
    <Icon name="mdi:heart" size="24" color="red" />
    
    <!-- Using CSS prefix syntax -->
    <Icon name="i-heroicons-heart" />
    
    <!-- Custom local SVG -->
    <Icon name="custom:my-logo" />
  </div>
</template>
```

**Icon Collection Installation**:
```bash
# Install specific icon collections
pnpm install -D @iconify-json/heroicons
pnpm install -D @iconify-json/mdi
```

## @nuxt/fonts

**Purpose**: Zero-configuration web font optimization with automatic performance enhancements.

**Key Features**:
- Support for Google Fonts, Bunny Fonts, Fontshare, Fontsource, Adobe Fonts
- Automatic font metric optimization
- Build/dev time font caching
- Local font support
- Powered by fontaine and capsize for performance

**Installation**:
```bash
pnpm install @nuxt/fonts
```

**Basic Usage**:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  fonts: {
    google: {
      families: {
        Inter: [400, 500, 600, 700],
        'Fira Code': [400, 500]
      }
    },
    local: [
      {
        name: 'Custom Font',
        src: './assets/fonts/custom-font.woff2'
      }
    ]
  }
})
```

**CSS Usage**:
```css
body {
  font-family: 'Inter', sans-serif;
}

code {
  font-family: 'Fira Code', monospace;
}
```

## @nuxt/scripts

**Purpose**: Performance-optimized third-party script loading with privacy protection.

**Key Features**:
- 20+ third-party script integrations
- Advanced loading triggers and consent management
- Performance optimizations with minimal runtime (~2kb)
- DevTools for script monitoring
- Zero dependencies

**Installation**:
```bash
npx nuxi@latest module add scripts
```

**Basic Usage**:
```vue
<template>
  <div>
    <!-- Script will load when component mounts -->
    <div ref="target">Script content here</div>
  </div>
</template>

<script setup>
// Load Google Analytics
useScript({
  key: 'google-analytics',
  src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID',
  async: true
})

// Load script with consent
useScript({
  key: 'facebook-pixel',
  src: 'https://connect.facebook.net/en_US/fbevents.js',
  trigger: 'consent' // Wait for user consent
})
</script>
```

**Global Configuration**:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  scripts: {
    registry: {
      googleAnalytics: {
        id: 'GA_MEASUREMENT_ID'
      }
    }
  }
})
```

## @nuxt/eslint

**Purpose**: Project-aware ESLint integration with flat config support and DevTools integration.

**Key Features**:
- ESLint v9 flat config support
- Project-aware configuration generation
- ESLint Config Inspector in DevTools
- Integration with ESLint Stylistic for formatting
- Auto-initialization and dev server checking

**Installation**:
```bash
pnpm install -D @nuxt/eslint
```

**Basic Setup**:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  eslint: {
    config: {
      stylistic: true // Enable formatting rules
    },
    checker: true // Run ESLint alongside dev server
  }
})
```

**ESLint Config**:
```javascript
// eslint.config.mjs
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Your custom rules
    'vue/multi-word-component-names': 'off'
  }
})
```

## @nuxt/test-utils

**Purpose**: First-class testing utilities for Nuxt applications with e2e and unit test support.

**Key Features**:
- Comprehensive testing utilities for Nuxt projects
- Support for both end-to-end and unit testing
- Used in Nuxt's own test suite
- Module testing support for library authors

**Installation**:
```bash
pnpm install -D @nuxt/test-utils vitest
```

**Basic Unit Test**:
```typescript
// tests/components/MyComponent.test.ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import MyComponent from '~/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders properly', async () => {
    const component = await mountSuspended(MyComponent, {
      props: {
        title: 'Test Title'
      }
    })
    
    expect(component.text()).toContain('Test Title')
  })
})
```

**E2E Test Example**:
```typescript
// tests/e2e/homepage.test.ts
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('Homepage', async () => {
  await setup({
    // test context options
  })

  it('renders the homepage', async () => {
    const html = await $fetch('/')
    expect(html).toContain('Welcome to Nuxt!')
  })
})
```

**Vitest Configuration**:
```typescript
// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  // Vitest configuration
})
```

## Module Integration Tips

**Combining Modules**: These modules work well together. For example:
- Use `@nuxt/content` for blog posts with `@nuxt/image` for optimized images
- Combine `@nuxt/icon` with `@nuxt/fonts` for complete visual design
- Use `@nuxt/scripts` for analytics while testing with `@nuxt/test-utils`

**Performance**: All modules are designed for modern web performance standards and work well in serverless/edge environments.

**TypeScript**: Full TypeScript support across all modules with auto-generated types and IntelliSense.