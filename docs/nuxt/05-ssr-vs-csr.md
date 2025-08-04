# Server-Side Rendering (SSR) vs Client-Side Rendering (CSR) in Nuxt.js

## Introduction

Nuxt.js provides flexible rendering strategies to optimize your application for different use cases. Understanding when to use SSR, CSR, or hybrid approaches is crucial for building performant web applications.

## Rendering Strategies Overview

### Server-Side Rendering (SSR)
- Pages are rendered on the server and sent as HTML to the client
- The client then "hydrates" the HTML to make it interactive
- Better SEO and faster initial page loads

### Client-Side Rendering (CSR/SPA)
- Initial page is a minimal HTML shell
- JavaScript renders the entire application in the browser
- Faster navigation after initial load

### Static Site Generation (SSG)
- Pages are pre-rendered at build time
- Best performance for content that doesn't change frequently

### Hybrid Rendering
- Mix different rendering strategies per route
- Optimize each page for its specific needs

## Server-Side Rendering (SSR)

### How SSR Works

1. User requests a page
2. Server renders the Vue component to HTML
3. Server sends complete HTML to browser
4. Browser displays the HTML immediately
5. JavaScript loads and "hydrates" the page
6. Page becomes fully interactive

### Configuring SSR

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // Default - enables SSR
  
  // Optional: Configure SSR behavior
  nitro: {
    prerender: {
      crawlLinks: true // Pre-render linked pages
    }
  }
})
```

### SSR Example

```vue
<!-- pages/blog/[slug].vue -->
<template>
  <article>
    <h1>{{ post.title }}</h1>
    <p class="meta">Published: {{ formatDate(post.publishedAt) }}</p>
    <div class="content" v-html="post.content"></div>
    
    <!-- This content is rendered on the server -->
    <div class="comments">
      <h3>Comments ({{ comments.length }})</h3>
      <div v-for="comment in comments" :key="comment.id">
        <p><strong>{{ comment.author }}</strong>: {{ comment.text }}</p>
      </div>
    </div>
  </article>
</template>

<script setup>
const route = useRoute()

// Data is fetched on the server before rendering
const { data: post } = await useFetch(`/api/posts/${route.params.slug}`)
const { data: comments } = await useLazyFetch(`/api/posts/${route.params.slug}/comments`)

// SEO optimized - runs on server
useHead({
  title: post.value.title,
  meta: [
    { name: 'description', content: post.value.excerpt },
    { property: 'og:title', content: post.value.title },
    { property: 'og:description', content: post.value.excerpt },
    { property: 'og:image', content: post.value.featuredImage }
  ]
})

// Handle 404 on server
if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post not found'
  })
}
</script>
```

### SSR Benefits

✅ **Better SEO**: Search engines can crawl fully rendered HTML
✅ **Faster Initial Load**: Users see content immediately
✅ **Better Accessibility**: Screen readers work with server HTML
✅ **Social Media Sharing**: Meta tags are present in initial HTML
✅ **Performance on Slow Devices**: Less JavaScript processing on client

### SSR Drawbacks

❌ **Server Load**: Every request requires server processing
❌ **Slower Navigation**: Each page requires server round-trip
❌ **Hydration Issues**: Mismatches between server and client rendering
❌ **More Complex Deployment**: Requires server infrastructure

## Client-Side Rendering (CSR/SPA)

### How CSR Works

1. User requests the application
2. Server sends minimal HTML shell with JavaScript
3. JavaScript loads and renders the entire application
4. Subsequent navigation happens client-side

### Configuring CSR

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false, // Disable SSR for SPA mode
  
  // Optional SPA configuration
  app: {
    // Customize the loading page
    head: {
      title: 'Loading...',
      meta: [
        { name: 'robots', content: 'noindex' } // Prevent indexing during load
      ]
    }
  }
})
```

### Per-Route CSR

```typescript
// nuxt.config.ts - Hybrid approach
export default defineNuxtConfig({
  routeRules: {
    // Admin pages as SPA
    '/admin/**': { ssr: false },
    
    // Dashboard as SPA
    '/dashboard/**': { ssr: false, prerender: false },
    
    // API routes
    '/api/**': { cors: true }
  }
})
```

### CSR Example

```vue
<!-- pages/dashboard.vue -->
<template>
  <div class="dashboard">
    <DashboardSidebar />
    
    <main class="dashboard-main">
      <!-- Real-time data updates -->
      <div class="stats-grid">
        <StatCard 
          v-for="stat in stats" 
          :key="stat.id"
          :title="stat.title"
          :value="stat.value"
          :trend="stat.trend"
        />
      </div>
      
      <!-- Interactive charts -->
      <div class="charts">
        <LineChart :data="chartData" @point-click="handlePointClick" />
        <BarChart :data="barData" />
      </div>
      
      <!-- Real-time updates -->
      <div class="activity-feed">
        <h3>Recent Activity</h3>
        <div v-for="activity in activities" :key="activity.id">
          {{ activity.message }} - {{ formatTime(activity.timestamp) }}
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// Client-only page
definePageMeta({
  ssr: false, // Force CSR for this page
  middleware: 'auth'
})

// Real-time data fetching
const { data: stats, refresh: refreshStats } = await useLazyFetch('/api/dashboard/stats')
const { data: activities } = await useLazyFetch('/api/dashboard/activities')

// WebSocket for real-time updates
const { $socket } = useNuxtApp()

onMounted(() => {
  // Real-time stats updates
  $socket.on('stats-update', (newStats) => {
    stats.value = newStats
  })
  
  // Real-time activity feed
  $socket.on('new-activity', (activity) => {
    activities.value.unshift(activity)
  })
})

onUnmounted(() => {
  $socket.off('stats-update')
  $socket.off('new-activity')
})

// Interactive chart handlers
const handlePointClick = (point) => {
  // Show detailed view
  console.log('Chart point clicked:', point)
}
</script>
```

### CSR Benefits

✅ **Fast Navigation**: No server requests for route changes
✅ **Rich Interactions**: Full JavaScript capabilities
✅ **Offline Capability**: Can work offline with service workers
✅ **Lower Server Load**: Static files served from CDN
✅ **Real-time Features**: WebSockets, live updates work seamlessly

### CSR Drawbacks

❌ **Poor SEO**: Search engines struggle with JavaScript-rendered content
❌ **Slow Initial Load**: Large JavaScript bundles
❌ **Performance Issues**: Heavy computation on client devices
❌ **Poor Social Sharing**: No meta tags in initial HTML

## Hybrid Rendering Strategies

### Route-Level Configuration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Static pages - pre-rendered at build time
    '/': { prerender: true },
    '/about': { prerender: true },
    '/contact': { prerender: true },
    
    // Blog posts - ISR (Incremental Static Regeneration)
    '/blog/**': { 
      isr: true,
      headers: { 
        'cache-control': 's-maxage=60' // Cache for 60 seconds
      }
    },
    
    // Product pages - SSR with caching
    '/products/**': { 
      ssr: true,
      headers: {
        'cache-control': 's-maxage=300' // Cache for 5 minutes
      }
    },
    
    // User dashboard - CSR only
    '/dashboard/**': { ssr: false },
    
    // Admin panel - CSR with auth
    '/admin/**': { 
      ssr: false, 
      prerender: false,
      // Custom headers for admin
      headers: {
        'X-Frame-Options': 'DENY'
      }
    },
    
    // API routes
    '/api/**': { 
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
})
```

### Component-Level Rendering Control

```vue
<!-- pages/mixed-content.vue -->
<template>
  <div>
    <!-- SSR content for SEO -->
    <section class="hero">
      <h1>{{ page.title }}</h1>
      <p>{{ page.description }}</p>
    </section>
    
    <!-- Client-only interactive components -->
    <ClientOnly>
      <InteractiveMap :locations="locations" />
      <template #fallback>
        <div class="loading">Loading map...</div>
      </template>
    </ClientOnly>
    
    <!-- Lazy-loaded heavy components -->
    <LazyReviewsSection :product-id="productId" />
    
    <!-- Conditional client-side features -->
    <div v-if="$device.isMobile">
      <ClientOnly>
        <MobileAppBanner />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
// SSR data
const { data: page } = await useFetch('/api/page/product')

// Client-side only data
const locations = ref([])
const productId = computed(() => page.value?.id)

// Load data on client
onMounted(async () => {
  // This only runs on client
  locations.value = await $fetch('/api/locations')
})
</script>
```

## Performance Optimization

### SSR Optimization

```vue
<script setup>
// Optimize data fetching
const { data: posts } = await useFetch('/api/posts', {
  // Cache on server and client
  key: 'blog-posts',
  server: true,
  default: () => [],
  
  // Transform data to reduce payload
  transform: (data) => data.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt
  }))
})

// Preload critical data
await Promise.all([
  useFetch('/api/categories'),
  useFetch('/api/featured-posts')
])
</script>
```

### CSR Optimization

```vue
<script setup>
// Code splitting for large components
const HeavyChart = defineAsyncComponent(() => 
  import('~/components/charts/HeavyChart.vue')
)

// Lazy load data
const { data: heavyData, pending } = await useLazyFetch('/api/heavy-data', {
  server: false // Client-only
})

// Progressive enhancement
const supportsWebGL = ref(false)

onMounted(() => {
  // Feature detection
  supportsWebGL.value = !!window.WebGLRenderingContext
})
</script>

<template>
  <div>
    <!-- Progressive enhancement -->
    <HeavyChart v-if="supportsWebGL && heavyData" :data="heavyData" />
    <SimpleChart v-else-if="heavyData" :data="heavyData" />
    <div v-else-if="pending">Loading visualization...</div>
  </div>
</template>
```

### Hybrid Optimization

```typescript
// composables/useOptimizedFetch.ts
export const useOptimizedFetch = (url: string, options = {}) => {
  // Different strategies based on environment
  if (process.server) {
    // Server-side: fetch immediately for SEO
    return useFetch(url, {
      ...options,
      server: true,
      client: false
    })
  } else {
    // Client-side: lazy load for performance
    return useLazyFetch(url, {
      ...options,
      server: false
    })
  }
}
```

## Common Patterns and Best Practices

### E-commerce Site

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Homepage - static for performance
    '/': { prerender: true },
    
    // Category pages - ISR for fresh content
    '/category/**': { isr: 60 },
    
    // Product pages - SSR for SEO
    '/product/**': { ssr: true },
    
    // User account - CSR for interactions
    '/account/**': { ssr: false },
    
    // Checkout - SSR for reliability
    '/checkout/**': { ssr: true },
    
    // Search - CSR for real-time results
    '/search': { ssr: false }
  }
})
```

### Blog/Content Site

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Static pages
    '/': { prerender: true },
    '/about': { prerender: true },
    
    // Blog posts - ISR for updates
    '/blog/**': { 
      isr: true,
      headers: { 'cache-control': 's-maxage=3600' }
    },
    
    // Admin - CSR only
    '/admin/**': { ssr: false }
  }
})
```

### SaaS Application

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Marketing pages - static
    '/': { prerender: true },
    '/features': { prerender: true },
    '/pricing': { prerender: true },
    
    // Documentation - ISR
    '/docs/**': { isr: true },
    
    // Application - CSR
    '/app/**': { ssr: false },
    '/dashboard/**': { ssr: false }
  }
})
```

## Decision Matrix

| Use Case | SSR | CSR | Hybrid | Reason |
|----------|-----|-----|--------|--------|
| Landing pages | ✅ | ❌ | ✅ | SEO critical |
| Blog posts | ✅ | ❌ | ✅ | SEO + sharing |
| Product catalogs | ✅ | ❌ | ✅ | SEO + performance |
| User dashboards | ❌ | ✅ | ✅ | Interactivity |
| Admin panels | ❌ | ✅ | ✅ | Rich interactions |
| Real-time apps | ❌ | ✅ | ✅ | Live updates |
| Documentation | ✅ | ❌ | ✅ | SEO + fast navigation |
| E-commerce | 🟡 | ❌ | ✅ | Mixed needs |

## Debugging Rendering Issues

### Common Hydration Errors

```vue
<script setup>
// ❌ Wrong - causes hydration mismatch
const timestamp = Date.now()

// ✅ Correct - use client-only
const timestamp = ref(null)
onMounted(() => {
  timestamp.value = Date.now()
})
</script>
```

### Development Tools

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Debug hydration issues
  debug: process.env.NODE_ENV === 'development',
  
  // Show render timing
  ssr: {
    noExternal: ['debug']
  }
})
```

### Performance Monitoring

```vue
<script setup>
// Monitor rendering performance
onMounted(() => {
  const navigationEntry = performance.getEntriesByType('navigation')[0]
  
  console.log('Time to Interactive:', navigationEntry.loadEventEnd)
  console.log('First Contentful Paint:', 
    performance.getEntriesByName('first-contentful-paint')[0]?.startTime
  )
})
</script>
```

## Best Practices Summary

1. **Choose the right strategy** based on content type and user needs
2. **Use hybrid rendering** to optimize each route individually
3. **Prioritize critical content** for SSR (above-the-fold)
4. **Use CSR for highly interactive** features
5. **Implement proper error boundaries** for both SSR and CSR
6. **Monitor performance** and adjust strategies accordingly
7. **Consider your users' devices** and network conditions
8. **Test social media sharing** for SSR pages
9. **Use proper caching strategies** for each rendering mode
10. **Avoid hydration mismatches** with client-only components

The key is to understand your application's needs and choose the appropriate rendering strategy for each part of your application.