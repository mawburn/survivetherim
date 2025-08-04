# State Management in Vue.js and Nuxt.js

## Introduction

State management is crucial for building scalable Vue.js applications. This guide covers various approaches from simple reactive state to advanced patterns using Pinia and Nuxt's built-in state management.

## Built-in Reactive State

### Basic Reactive State with Composition API

```typescript
// composables/useCounter.ts
export const useCounter = () => {
  const count = ref(0)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = 0
  
  return {
    count: readonly(count),
    increment,
    decrement,
    reset
  }
}
```

### Shared State with Composables

```typescript
// composables/useAuth.ts
const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export const useAuth = () => {
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      
      user.value = response.user
      
      // Store token
      const token = useCookie('auth-token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      })
      token.value = response.token
      
    } catch (err) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      user.value = null
      const token = useCookie('auth-token')
      token.value = null
      await navigateTo('/login')
    }
  }
  
  const checkAuth = async () => {
    const token = useCookie('auth-token')
    if (!token.value) return
    
    try {
      const response = await $fetch('/api/auth/me')
      user.value = response.user
    } catch {
      // Token invalid, clear it
      token.value = null
    }
  }
  
  return {
    user: readonly(user),
    isLoading: readonly(isLoading),
    error: readonly(error),
    login,
    logout,
    checkAuth,
    isAuthenticated: computed(() => !!user.value)
  }
}
```

### Using Shared State

```vue
<!-- components/UserProfile.vue -->
<template>
  <div class="user-profile">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="user">
      <h2>Welcome, {{ user.name }}</h2>
      <p>{{ user.email }}</p>
      <button @click="logout">Logout</button>
    </div>
    <div v-else>
      <button @click="showLogin = true">Login</button>
    </div>
  </div>
</template>

<script setup>
const { user, isLoading, error, logout } = useAuth()
const showLogin = ref(false)
</script>
```

## Nuxt Built-in State Management

### useState - Shared State Across Components

```typescript
// Simple shared state
const counter = useState('counter', () => 0)

// With TypeScript
const user = useState<User | null>('user', () => null)

// With initial function
const preferences = useState('preferences', () => ({
  theme: 'light',
  language: 'en',
  notifications: true
}))
```

### Server-Side State Hydration

```vue
<!-- pages/dashboard.vue -->
<script setup>
// State initialized on server, hydrated on client
const stats = useState('dashboard-stats', async () => {
  // This runs on server during SSR
  return await $fetch('/api/dashboard/stats')
})

// Client-side only state
const clientState = useState('client-data', () => null)

onMounted(() => {
  // Initialize client-only state
  clientState.value = {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
})
</script>
```

### Global State with useState

```typescript
// composables/useAppState.ts
export const useAppState = () => {
  const theme = useState('app.theme', () => 'light')
  const sidebar = useState('app.sidebar', () => false)
  const notifications = useState('app.notifications', () => [])
  
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  
  const toggleSidebar = () => {
    sidebar.value = !sidebar.value
  }
  
  const addNotification = (notification: Notification) => {
    notifications.value.push({
      ...notification,
      id: Date.now(),
      timestamp: new Date()
    })
  }
  
  const removeNotification = (id: number) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  return {
    theme: readonly(theme),
    sidebar: readonly(sidebar),
    notifications: readonly(notifications),
    toggleTheme,
    toggleSidebar,
    addNotification,
    removeNotification
  }
}
```

## Pinia - Advanced State Management

### Installation and Setup

```bash
npm install pinia @pinia/nuxt
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt']
})
```

### Basic Store

```typescript
// stores/counter.ts
export const useCounterStore = defineStore('counter', () => {
  // State
  const count = ref(0)
  const name = ref('Counter')
  
  // Getters (computed)
  const doubleCount = computed(() => count.value * 2)
  const isEven = computed(() => count.value % 2 === 0)
  
  // Actions
  const increment = () => {
    count.value++
  }
  
  const decrement = () => {
    count.value--
  }
  
  const reset = () => {
    count.value = 0
  }
  
  const setCount = (value: number) => {
    count.value = value
  }
  
  return {
    // State
    count,
    name,
    
    // Getters
    doubleCount,
    isEven,
    
    // Actions
    increment,
    decrement,
    reset,
    setCount
  }
})
```

### Advanced Store with API Integration

```typescript
// stores/auth.ts
interface User {
  id: number
  name: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userName = computed(() => user.value?.name || 'Guest')
  
  // Actions
  const login = async (credentials: { email: string, password: string }) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      
      user.value = response.user
      token.value = response.token
      
      // Persist token
      const tokenCookie = useCookie('auth-token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
      tokenCookie.value = response.token
      
      return response
    } catch (err: any) {
      error.value = err.data?.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  const logout = async () => {
    try {
      if (token.value) {
        await $fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        })
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear state regardless of API call result
      user.value = null
      token.value = null
      error.value = null
      
      // Clear cookie
      const tokenCookie = useCookie('auth-token')
      tokenCookie.value = null
      
      // Redirect to login
      await navigateTo('/login')
    }
  }
  
  const fetchUser = async () => {
    if (!token.value) return
    
    try {
      const response = await $fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      
      user.value = response.user
    } catch (err) {
      // Token is invalid, clear auth state
      await logout()
    }
  }
  
  const updateProfile = async (profileData: Partial<User>) => {
    if (!user.value) return
    
    isLoading.value = true
    try {
      const response = await $fetch('/api/auth/profile', {
        method: 'PUT',
        body: profileData,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      
      user.value = { ...user.value, ...response.user }
      return response
    } catch (err: any) {
      error.value = err.data?.message || 'Profile update failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Initialize auth state
  const initialize = async () => {
    const tokenCookie = useCookie('auth-token')
    if (tokenCookie.value) {
      token.value = tokenCookie.value
      await fetchUser()
    }
  }
  
  return {
    // State
    user: readonly(user),
    token: readonly(token),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Getters
    isAuthenticated,
    isAdmin,
    userName,
    
    // Actions
    login,
    logout,
    fetchUser,
    updateProfile,
    initialize
  }
})
```

### Store with Nested State

```typescript
// stores/app.ts
interface AppSettings {
  theme: 'light' | 'dark'
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    desktop: boolean
  }
}

export const useAppStore = defineStore('app', () => {
  // Nested state
  const settings = ref<AppSettings>({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: true,
      desktop: false
    }
  })
  
  const ui = ref({
    sidebar: {
      isOpen: false,
      isPinned: false
    },
    modal: {
      isOpen: false,
      component: null as string | null,
      props: {} as Record<string, any>
    },
    loading: {
      global: false,
      operations: new Set<string>()
    }
  })
  
  // Getters
  const isDarkMode = computed(() => settings.value.theme === 'dark')
  const hasNotifications = computed(() => 
    Object.values(settings.value.notifications).some(Boolean)
  )
  const isLoading = computed(() => 
    ui.value.loading.global || ui.value.loading.operations.size > 0
  )
  
  // Actions
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
    persistSettings()
  }
  
  const toggleTheme = () => {
    settings.value.theme = settings.value.theme === 'light' ? 'dark' : 'light'
    persistSettings()
  }
  
  const toggleSidebar = () => {
    ui.value.sidebar.isOpen = !ui.value.sidebar.isOpen
  }
  
  const openModal = (component: string, props: Record<string, any> = {}) => {
    ui.value.modal = {
      isOpen: true,
      component,
      props
    }
  }
  
  const closeModal = () => {
    ui.value.modal = {
      isOpen: false,
      component: null,
      props: {}
    }
  }
  
  const startLoading = (operation?: string) => {
    if (operation) {
      ui.value.loading.operations.add(operation)
    } else {
      ui.value.loading.global = true
    }
  }
  
  const stopLoading = (operation?: string) => {
    if (operation) {
      ui.value.loading.operations.delete(operation)
    } else {
      ui.value.loading.global = false
    }
  }
  
  const persistSettings = async () => {
    try {
      await $fetch('/api/user/settings', {
        method: 'PUT',
        body: settings.value
      })
    } catch (err) {
      console.error('Failed to persist settings:', err)
    }
  }
  
  const loadSettings = async () => {
    try {
      const userSettings = await $fetch('/api/user/settings')
      settings.value = { ...settings.value, ...userSettings }
    } catch (err) {
      console.warn('Failed to load user settings, using defaults')
    }
  }
  
  return {
    // State
    settings: readonly(settings),
    ui: readonly(ui),
    
    // Getters
    isDarkMode,
    hasNotifications,
    isLoading,
    
    // Actions
    updateSettings,
    toggleTheme,
    toggleSidebar,
    openModal,
    closeModal,
    startLoading,
    stopLoading,
    loadSettings
  }
})
```

### Using Stores in Components

```vue
<!-- components/AppHeader.vue -->
<template>
  <header :class="{ 'dark': isDarkMode }">
    <div class="header-content">
      <button @click="toggleSidebar" class="sidebar-toggle">
        <Icon name="menu" />
      </button>
      
      <h1>{{ appTitle }}</h1>
      
      <div class="header-actions">
        <button @click="toggleTheme" class="theme-toggle">
          <Icon :name="isDarkMode ? 'sun' : 'moon'" />
        </button>
        
        <div v-if="isAuthenticated" class="user-menu">
          <span>{{ userName }}</span>
          <button @click="logout">Logout</button>
        </div>
        <NuxtLink v-else to="/login">Login</NuxtLink>
      </div>
    </div>
    
    <!-- Global loading indicator -->
    <div v-if="isLoading" class="loading-bar"></div>
  </header>
</template>

<script setup>
const appStore = useAppStore()
const authStore = useAuthStore()

// Destructure with storeToRefs to maintain reactivity
const { isDarkMode, isLoading } = storeToRefs(appStore)
const { isAuthenticated, userName } = storeToRefs(authStore)

// Actions can be destructured directly
const { toggleTheme, toggleSidebar } = appStore
const { logout } = authStore

const appTitle = 'My App'
</script>
```

### Store Composition

```typescript
// stores/todo.ts - Composing multiple stores
export const useTodoStore = defineStore('todo', () => {
  // Use other stores
  const authStore = useAuthStore()
  const appStore = useAppStore()
  
  // State
  const todos = ref<Todo[]>([])
  const filter = ref<'all' | 'active' | 'completed'>('all')
  
  // Getters
  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'active':
        return todos.value.filter(todo => !todo.completed)
      case 'completed':
        return todos.value.filter(todo => todo.completed)
      default:
        return todos.value
    }
  })
  
  const completedCount = computed(() => 
    todos.value.filter(todo => todo.completed).length
  )
  
  // Actions
  const fetchTodos = async () => {
    if (!authStore.isAuthenticated) return
    
    appStore.startLoading('todos')
    try {
      const response = await $fetch('/api/todos', {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      todos.value = response.todos
    } finally {
      appStore.stopLoading('todos')
    }
  }
  
  const addTodo = async (text: string) => {
    const optimisticTodo = {
      id: Date.now(),
      text,
      completed: false,
      userId: authStore.user?.id
    }
    
    // Optimistic update
    todos.value.push(optimisticTodo)
    
    try {
      const response = await $fetch('/api/todos', {
        method: 'POST',
        body: { text },
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      
      // Replace optimistic todo with server response
      const index = todos.value.findIndex(t => t.id === optimisticTodo.id)
      if (index > -1) {
        todos.value[index] = response.todo
      }
    } catch (err) {
      // Revert optimistic update
      const index = todos.value.findIndex(t => t.id === optimisticTodo.id)
      if (index > -1) {
        todos.value.splice(index, 1)
      }
      throw err
    }
  }
  
  return {
    todos: readonly(todos),
    filter,
    filteredTodos,
    completedCount,
    fetchTodos,
    addTodo
  }
})
```

## Data Persistence

### Local Storage Persistence

```typescript
// composables/usePersistedState.ts
export const usePersistedState = <T>(
  key: string,
  defaultValue: T,
  storage: 'localStorage' | 'sessionStorage' = 'localStorage'
) => {
  const state = ref<T>(defaultValue)
  
  // Load from storage on client
  onMounted(() => {
    try {
      const stored = window[storage].getItem(key)
      if (stored) {
        state.value = JSON.parse(stored)
      }
    } catch (err) {
      console.warn(`Failed to load ${key} from ${storage}:`, err)
    }
  })
  
  // Save to storage when state changes
  watch(
    state,
    (newValue) => {
      try {
        window[storage].setItem(key, JSON.stringify(newValue))
      } catch (err) {
        console.warn(`Failed to save ${key} to ${storage}:`, err)
      }
    },
    { deep: true }
  )
  
  return state
}
```

### Cookie-based Persistence

```typescript
// composables/useCookieState.ts
export const useCookieState = <T>(
  key: string,
  defaultValue: T,
  cookieOptions: any = {}
) => {
  const cookie = useCookie<T>(key, {
    default: () => defaultValue,
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    ...cookieOptions
  })
  
  return cookie
}
```

## State Patterns

### Form State Management

```typescript
// composables/useFormState.ts
export const useFormState = <T extends Record<string, any>>(
  initialData: T,
  validationRules?: Record<keyof T, (value: any) => string | null>
) => {
  const data = reactive<T>({ ...initialData })
  const errors = ref<Partial<Record<keyof T, string>>>({})
  const touched = ref<Partial<Record<keyof T, boolean>>>({})
  const isSubmitting = ref(false)
  
  const isDirty = computed(() => 
    JSON.stringify(data) !== JSON.stringify(initialData)
  )
  
  const isValid = computed(() => 
    Object.keys(errors.value).length === 0
  )
  
  const validate = (field?: keyof T) => {
    if (!validationRules) return true
    
    const fieldsToValidate = field ? [field] : Object.keys(validationRules)
    let isFormValid = true
    
    for (const fieldName of fieldsToValidate) {
      const rule = validationRules[fieldName as keyof T]
      if (rule) {
        const error = rule(data[fieldName as keyof T])
        if (error) {
          errors.value[fieldName as keyof T] = error
          isFormValid = false
        } else {
          delete errors.value[fieldName as keyof T]
        }
      }
    }
    
    return isFormValid
  }
  
  const setFieldValue = (field: keyof T, value: any) => {
    data[field] = value
    touched.value[field] = true
    validate(field)
  }
  
  const reset = () => {
    Object.assign(data, initialData)
    errors.value = {}
    touched.value = {}
    isSubmitting.value = false
  }
  
  const submit = async (onSubmit: (data: T) => Promise<any>) => {
    if (!validate()) return
    
    isSubmitting.value = true
    try {
      const result = await onSubmit(data)
      return result
    } finally {
      isSubmitting.value = false
    }
  }
  
  return {
    data,
    errors: readonly(errors),
    touched: readonly(touched),
    isSubmitting: readonly(isSubmitting),
    isDirty,
    isValid,
    setFieldValue,
    validate,
    reset,
    submit
  }
}
```

### Async State Management

```typescript
// composables/useAsyncState.ts
export const useAsyncState = <T>(
  asyncFn: () => Promise<T>,
  initialValue: T | null = null,
  options: {
    immediate?: boolean
    resetOnExecute?: boolean
  } = {}
) => {
  const { immediate = true, resetOnExecute = true } = options
  
  const data = ref<T | null>(initialValue)
  const error = ref<Error | null>(null)
  const isLoading = ref(false)
  
  const execute = async () => {
    isLoading.value = true
    error.value = null
    
    if (resetOnExecute) {
      data.value = null
    }
    
    try {
      const result = await asyncFn()
      data.value = result
      return result
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  if (immediate) {
    execute()
  }
  
  return {
    data: readonly(data),
    error: readonly(error),
    isLoading: readonly(isLoading),
    execute
  }
}
```

## Best Practices

1. **Choose the right tool**: 
   - Simple reactive state for local component state
   - Composables for shared logic
   - `useState` for simple Nuxt-wide state
   - Pinia for complex application state

2. **Keep state minimal**: Only store what needs to be shared

3. **Use TypeScript**: Define interfaces for better developer experience

4. **Normalize complex data**: Avoid deep nesting in stores

5. **Handle loading and error states**: Always provide feedback to users

6. **Persist important state**: Use cookies or localStorage appropriately

7. **Optimize reactivity**: Use `readonly()` for state that shouldn't be mutated

8. **Avoid watchers when possible**: Prefer computed properties

9. **Test your state management**: Write unit tests for stores and composables

10. **Use development tools**: Leverage Vue DevTools and Pinia DevTools

This comprehensive guide covers the spectrum of state management approaches in Vue.js and Nuxt.js, from simple reactive state to advanced patterns with Pinia.