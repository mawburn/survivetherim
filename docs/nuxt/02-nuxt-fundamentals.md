# Nuxt.js 3 Fundamentals

## Introduction

Nuxt.js is a full-stack Vue.js framework that provides an opinionated structure for building web applications. It offers file-based routing, auto-imports, server-side rendering (SSR), static site generation (SSG), and many other features out of the box.

## Key Features

- **File-based routing** - Pages are automatically created from files in the `pages/` directory
- **Auto-imports** - Components, composables, and utilities are automatically imported
- **Server-side rendering (SSR)** - Better SEO and performance
- **Static site generation (SSG)** - Generate static sites for optimal performance
- **Hybrid rendering** - Mix SSR, CSR, and SSG on different routes
- **Built-in TypeScript support**
- **CSS framework integration**
- **Plugin ecosystem**

## Project Structure

```
project/
├── assets/          # Uncompiled assets (CSS, images, fonts)
├── components/      # Vue components (auto-imported)
├── composables/     # Vue composables (auto-imported)
├── content/         # Content files (with @nuxt/content)
├── layouts/         # Application layouts
├── middleware/      # Route middleware
├── pages/           # Application pages (file-based routing)
├── plugins/         # Plugins to run before mounting the app
├── public/          # Public assets served at the root
├── server/          # Server-side code (API routes, middleware)
├── utils/           # Utility functions (auto-imported)
└── nuxt.config.ts   # Nuxt configuration file
```

## Configuration

### Basic `nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  // App configuration
  app: {
    head: {
      title: 'My Nuxt App',
      meta: [
        { name: 'description', content: 'My amazing Nuxt application' }
      ]
    }
  },

  // CSS framework
  css: ['~/assets/css/main.css'],

  // Modules
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/icon'
  ],

  // TypeScript configuration
  typescript: {
    strict: true
  },

  // Development server
  devtools: { enabled: true }
})
```

## Rendering Modes

### Server-Side Rendering (SSR) - Default

Pages are rendered on the server and sent as HTML to the client:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true // Default
})
```

Benefits:
- Better SEO
- Faster initial page load
- Better accessibility

### Client-Side Rendering (CSR/SPA)

Renders everything on the client-side:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false
})
```

Benefits:
- Faster navigation after initial load
- Better for highly interactive applications

### Static Site Generation (SSG)

Pre-render pages at build time:

```bash
# Generate static site
npm run generate
```

Benefits:
- Best performance
- Can be deployed to CDN
- No server required

### Hybrid Rendering

Mix different rendering modes per route:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Homepage pre-rendered at build time
    '/': { prerender: true },
    
    // Admin section rendered on-demand as SPA
    '/admin/**': { ssr: false },
    
    // Blog posts pre-rendered at build time, revalidated in background
    '/blog/**': { isr: true },
    
    // API routes
    '/api/**': { cors: true }
  }
})
```

## Auto-imports

Nuxt automatically imports:

### Components

```vue
<!-- components/MyButton.vue -->
<template>
  <button class="btn">
    <slot />
  </button>
</template>

<!-- pages/index.vue - MyButton is auto-imported -->
<template>
  <div>
    <MyButton>Click me</MyButton>
  </div>
</template>
```

### Composables

```typescript
// composables/useAuth.ts
export const useAuth = () => {
  const user = ref(null)
  
  const login = async (credentials) => {
    // Login logic
  }
  
  const logout = () => {
    user.value = null
  }
  
  return {
    user: readonly(user),
    login,
    logout
  }
}
```

```vue
<!-- pages/profile.vue - useAuth is auto-imported -->
<script setup>
const { user, login, logout } = useAuth()
</script>
```

### Utils

```typescript
// utils/formatDate.ts
export const formatDate = (date: Date) => {
  return date.toLocaleDateString()
}
```

```vue
<!-- formatDate is auto-imported -->
<template>
  <p>{{ formatDate(new Date()) }}</p>
</template>
```

## Built-in Composables

### `useState()` - Shared State

```typescript
// Reactive state shared across components
const counter = useState('counter', () => 0)

// With type
const user = useState<User>('user', () => null)
```

### `useFetch()` - Data Fetching

```typescript
// Basic usage
const { data, pending, error, refresh } = await useFetch('/api/users')

// With options
const { data } = await useFetch('/api/posts', {
  key: 'posts',
  default: () => [],
  transform: (data) => data.map(post => ({ ...post, formatted: true }))
})
```

### `useAsyncData()` - Custom Data Fetching

```typescript
const { data, pending, error } = await useAsyncData('posts', () => {
  return $fetch('/api/posts')
})
```

### `useHead()` - SEO and Meta Tags

```typescript
useHead({
  title: 'My Page',
  meta: [
    { name: 'description', content: 'Page description' },
    { property: 'og:title', content: 'My Page' }
  ],
  link: [
    { rel: 'canonical', href: 'https://example.com/page' }
  ]
})
```

### `useRoute()` and `useRouter()`

```typescript
// Current route information
const route = useRoute()
console.log(route.params.id)

// Navigation
const router = useRouter()
router.push('/dashboard')
```

## Error Handling

### Error Pages

Create custom error pages:

```vue
<!-- error.vue -->
<template>
  <div>
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusMessage }}</p>
    <button @click="handleError">Go Home</button>
  </div>
</template>

<script setup>
const props = defineProps(['error'])

const handleError = () => clearError({ redirect: '/' })
</script>
```

### Try-Catch with Composables

```vue
<script setup>
const { data, error } = await useFetch('/api/users')

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Users not found'
  })
}
</script>
```

## Environment Variables

### Runtime Config

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: '123',
    
    // Public keys (exposed to client-side)
    public: {
      apiBase: '/api'
    }
  }
})
```

```typescript
// Access in components/composables
const config = useRuntimeConfig()
console.log(config.public.apiBase) // Available on client
console.log(config.apiSecret) // Only available on server
```

## Plugins

### Client-side Plugin

```typescript
// plugins/analytics.client.ts
export default defineNuxtPlugin(() => {
  // Initialize analytics
  gtag('config', 'GA_MEASUREMENT_ID')
})
```

### Server-side Plugin

```typescript
// plugins/database.server.ts
export default defineNuxtPlugin(async () => {
  // Initialize database connection
  await connectDatabase()
})
```

### Universal Plugin

```typescript
// plugins/api.ts
export default defineNuxtPlugin(() => {
  const { $fetch } = useNuxtApp()
  
  // Provide custom $api
  return {
    provide: {
      api: {
        users: {
          get: () => $fetch('/api/users'),
          create: (data) => $fetch('/api/users', { method: 'POST', body: data })
        }
      }
    }
  }
})
```

## Performance Optimization

### Lazy Loading

```vue
<!-- Lazy load components -->
<template>
  <div>
    <LazyMyHeavyComponent v-if="showComponent" />
  </div>
</template>
```

### Image Optimization

```vue
<template>
  <!-- Using @nuxt/image -->
  <NuxtImg
    src="/hero.jpg"
    alt="Hero image"
    width="800"
    height="600"
    format="webp"
    loading="lazy"
  />
</template>
```

### Code Splitting

```typescript
// Lazy load pages
const LazyAdminPage = defineAsyncComponent(() => import('~/pages/admin.vue'))
```

## Best Practices

1. **Use TypeScript** for better development experience
2. **Leverage auto-imports** - don't manually import what Nuxt provides
3. **Use `useState()` for shared state** instead of external state libraries for simple cases
4. **Optimize images** with `@nuxt/image`
5. **Use proper error handling** with error pages and boundaries
6. **Implement proper SEO** with `useHead()` and meta tags
7. **Choose the right rendering mode** for each route
8. **Use composables** for reusable logic
9. **Keep pages lightweight** - move logic to composables and components
10. **Use Nuxt DevTools** for debugging and optimization

## Development vs Production

### Development

```bash
npm run dev
```

Features:
- Hot module replacement
- DevTools integration
- Detailed error messages

### Production Build

```bash
npm run build
npm run preview
```

Features:
- Optimized bundles
- Tree shaking
- Minification
- Static asset optimization

## Next Steps

- Learn about Nuxt pages and routing
- Explore Nuxt modules ecosystem
- Study server-side API development
- Practice with different rendering strategies