# Pages and Routing in Nuxt.js

## File-Based Routing

Nuxt.js uses file-based routing, which means pages are automatically created based on the file structure in the `pages/` directory. No need to manually configure routes!

## Basic Page Structure

### Simple Pages

```
pages/
├── index.vue          # → /
├── about.vue          # → /about
├── contact.vue        # → /contact
└── blog.vue           # → /blog
```

### Example Page

```vue
<!-- pages/about.vue -->
<template>
  <div>
    <h1>About Us</h1>
    <p>Welcome to our about page!</p>
  </div>
</template>

<script setup>
// Page-specific logic
useHead({
  title: 'About Us',
  meta: [{ name: 'description', content: 'Learn more about our company' }],
})
</script>
```

## Nested Routes

### Directory Structure

```
pages/
├── index.vue          # → /
├── users/
│   ├── index.vue      # → /users
│   ├── profile.vue    # → /users/profile
│   └── settings.vue   # → /users/settings
└── blog/
    ├── index.vue      # → /blog
    └── post.vue       # → /blog/post
```

### Parent Layout for Nested Routes

```vue
<!-- pages/users.vue -->
<template>
  <div class="users-layout">
    <nav>
      <NuxtLink to="/users">Users</NuxtLink>
      <NuxtLink to="/users/profile">Profile</NuxtLink>
      <NuxtLink to="/users/settings">Settings</NuxtLink>
    </nav>

    <!-- Child pages will be rendered here -->
    <NuxtPage />
  </div>
</template>
```

## Dynamic Routes

### Single Parameter

```
pages/
├── users/
│   └── [id].vue       # → /users/123, /users/456
└── blog/
    └── [slug].vue     # → /blog/my-post, /blog/another-post
```

```vue
<!-- pages/users/[id].vue -->
<template>
  <div>
    <h1>User Profile</h1>
    <p>User ID: {{ $route.params.id }}</p>
    <div v-if="pending">Loading...</div>
    <div v-else-if="user">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: user, pending } = await useFetch(`/api/users/${route.params.id}`)

// Set page title dynamically
useHead({
  title: computed(() => (user.value ? `${user.value.name} - Profile` : 'User Profile')),
})
</script>
```

### Multiple Parameters

```
pages/
└── blog/
    └── [category]/
        └── [slug].vue  # → /blog/tech/vue-tutorial, /blog/news/update-2024
```

```vue
<!-- pages/blog/[category]/[slug].vue -->
<script setup>
const route = useRoute()
const { category, slug } = route.params

const { data: post } = await useFetch(`/api/posts/${category}/${slug}`)
</script>
```

### Catch-All Routes

```
pages/
└── [...slug].vue      # → /a, /a/b, /a/b/c
```

```vue
<!-- pages/[...slug].vue -->
<script setup>
const route = useRoute()
// route.params.slug will be an array: ['a', 'b', 'c']
console.log(route.params.slug)
</script>
```

### Optional Parameters

```
pages/
└── [[slug]].vue       # → /, /optional-page
```

## Navigation

### NuxtLink Component

```vue
<template>
  <nav>
    <!-- Basic navigation -->
    <NuxtLink to="/">Home</NuxtLink>
    <NuxtLink to="/about">About</NuxtLink>

    <!-- Dynamic routes -->
    <NuxtLink :to="`/users/${user.id}`">Profile</NuxtLink>

    <!-- External links -->
    <NuxtLink to="https://example.com" external>External Site</NuxtLink>

    <!-- With custom classes -->
    <NuxtLink to="/blog" class="nav-link" active-class="active" exact-active-class="exact-active">
      Blog
    </NuxtLink>
  </nav>
</template>
```

### Programmatic Navigation

```vue
<script setup>
const router = useRouter()

// Navigate to a route
const goToProfile = () => {
  router.push('/users/profile')
}

// Navigate with parameters
const goToUser = id => {
  router.push(`/users/${id}`)
}

// Navigate with query parameters
const goToSearch = () => {
  router.push({
    path: '/search',
    query: { q: 'vue', category: 'tutorial' },
  })
}

// Replace current route (no history entry)
const replaceRoute = () => {
  router.replace('/new-page')
}

// Go back/forward
const goBack = () => router.back()
const goForward = () => router.forward()
</script>
```

## Route Parameters and Query Strings

### Accessing Route Data

```vue
<script setup>
const route = useRoute()

// Route parameters
console.log(route.params.id) // Dynamic route param
console.log(route.params.slug) // Slug parameter

// Query parameters
console.log(route.query.search) // ?search=vue
console.log(route.query.page) // ?page=2

// Hash
console.log(route.hash) // #section1

// Full path
console.log(route.fullPath) // /users/123?tab=profile#details
</script>
```

### Reactive Route Data

```vue
<script setup>
const route = useRoute()

// Watch for route changes
watch(
  () => route.params.id,
  (newId, oldId) => {
    console.log(`User changed from ${oldId} to ${newId}`)
    // Refetch data or update component
  }
)

// Computed based on route
const currentTab = computed(() => route.query.tab || 'profile')
</script>
```

## Route Validation

### Validate Parameters

```vue
<!-- pages/users/[id].vue -->
<script setup>
definePageMeta({
  validate: async route => {
    // Check if id is a number
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})
</script>
```

### Custom Error Handling

```vue
<script setup>
const route = useRoute()
const { data: user, error } = await useFetch(`/api/users/${route.params.id}`)

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'User not found',
  })
}
</script>
```

## Page Metadata

### definePageMeta

```vue
<script setup>
definePageMeta({
  title: 'Custom Page Title',
  layout: 'dashboard',
  middleware: 'auth',
  keepalive: true,
  key: route => route.fullPath, // Custom page key

  // Custom properties
  requiresAuth: true,
  roles: ['admin', 'user'],
})
</script>
```

### Dynamic Metadata

```vue
<script setup>
const route = useRoute()
const { data: post } = await useFetch(`/api/posts/${route.params.slug}`)

// Dynamic page metadata
definePageMeta({
  title: computed(() => post.value?.title || 'Loading...'),
  key: route => `post-${route.params.slug}`,
})

// SEO metadata
useHead({
  title: computed(() => post.value?.title),
  meta: [
    { name: 'description', content: computed(() => post.value?.excerpt) },
    { property: 'og:title', content: computed(() => post.value?.title) },
    { property: 'og:description', content: computed(() => post.value?.excerpt) },
  ],
})
</script>
```

## Middleware

### Route-Level Middleware

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()

  if (!user.value) {
    return navigateTo('/login')
  }
})
```

```vue
<!-- pages/dashboard.vue -->
<script setup>
definePageMeta({
  middleware: 'auth',
})
</script>
```

### Global Middleware

```typescript
// middleware/analytics.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Track page views
  if (process.client) {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: to.path,
    })
  }
})
```

### Inline Middleware

```vue
<script setup>
definePageMeta({
  middleware: (to, from) => {
    console.log('Navigating to:', to.path)
  },
})
</script>
```

## Layouts

### Default Layout

```vue
<!-- layouts/default.vue -->
<template>
  <div class="app-layout">
    <header>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/about">About</NuxtLink>
      </nav>
    </header>

    <main>
      <slot />
      <!-- Page content will be rendered here -->
    </main>

    <footer>
      <p>&copy; 2024 My App</p>
    </footer>
  </div>
</template>
```

### Custom Layouts

```vue
<!-- layouts/dashboard.vue -->
<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <DashboardNav />
    </aside>

    <main class="content">
      <slot />
    </main>
  </div>
</template>
```

### Using Custom Layout

```vue
<!-- pages/admin/index.vue -->
<script setup>
definePageMeta({
  layout: 'dashboard',
})
</script>
```

## Route Groups

### Organize without affecting URL

```
pages/
├── (marketing)/
│   ├── about.vue      # → /about
│   └── contact.vue    # → /contact
└── (app)/
    ├── dashboard.vue  # → /dashboard
    └── profile.vue    # → /profile
```

Route groups use parentheses and don't affect the URL structure but help organize related pages.

## Best Practices

1. **Use descriptive file names** that match your URLs
2. **Keep dynamic routes specific** - use validation when needed
3. **Implement proper error handling** for dynamic routes
4. **Use middleware** for authentication and authorization
5. **Leverage layouts** for consistent page structure
6. **Set proper page metadata** for SEO
7. **Use NuxtLink** for internal navigation to enable prefetching
8. **Watch route changes** in components that need to react to navigation
9. **Validate route parameters** to prevent errors
10. **Use route groups** to organize related pages

## Common Patterns

### Search Page with Query Parameters

```vue
<!-- pages/search.vue -->
<template>
  <div>
    <input v-model="searchQuery" @input="performSearch" placeholder="Search..." />

    <div v-if="pending">Searching...</div>
    <div v-else>
      <div v-for="result in results" :key="result.id">
        {{ result.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const searchQuery = ref(route.query.q || '')
const { data: results, pending } = await useLazyFetch('/api/search', {
  query: computed(() => ({ q: searchQuery.value })),
  default: () => [],
})

const performSearch = useDebounceFn(() => {
  router.push({
    query: { q: searchQuery.value },
  })
}, 300)

// Update search query when route changes
watch(
  () => route.query.q,
  newQuery => {
    searchQuery.value = newQuery || ''
  }
)
</script>
```

### Pagination

```vue
<!-- pages/blog/index.vue -->
<template>
  <div>
    <div v-for="post in posts" :key="post.id">
      <h2>{{ post.title }}</h2>
    </div>

    <nav class="pagination">
      <NuxtLink v-if="currentPage > 1" :to="{ query: { page: currentPage - 1 } }">
        Previous
      </NuxtLink>

      <NuxtLink v-if="hasNextPage" :to="{ query: { page: currentPage + 1 } }"> Next </NuxtLink>
    </nav>
  </div>
</template>

<script setup>
const route = useRoute()
const currentPage = computed(() => parseInt(route.query.page) || 1)

const { data: posts } = await useFetch('/api/posts', {
  query: computed(() => ({ page: currentPage.value })),
})

const hasNextPage = computed(() => posts.value?.hasMore || false)
</script>
```
