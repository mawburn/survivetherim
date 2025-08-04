# Components in Vue.js and Nuxt.js

## Introduction

Components are the building blocks of Vue applications. In Nuxt.js, components are automatically imported and available throughout your application without explicit imports.

## Component Basics

### Creating Components

```vue
<!-- components/BaseButton.vue -->
<template>
  <button
    :class="['btn', `btn--${variant}`, `btn--${size}`, { 'btn--loading': loading }]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup>
// Define props with TypeScript
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  loading: false,
  disabled: false
})

// Define emits
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.btn {
  @apply px-4 py-2 rounded font-medium transition-colors;
}

.btn--primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn--secondary {
  @apply bg-gray-200 text-gray-800 hover:bg-gray-300;
}

.btn--danger {
  @apply bg-red-600 text-white hover:bg-red-700;
}

.btn--small {
  @apply px-2 py-1 text-sm;
}

.btn--large {
  @apply px-6 py-3 text-lg;
}

.btn--loading {
  @apply opacity-75 cursor-not-allowed;
}

.spinner {
  @apply inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin;
}
</style>
```

### Using Components

```vue
<!-- pages/index.vue -->
<template>
  <div>
    <!-- Components are auto-imported in Nuxt -->
    <BaseButton @click="handleSave">Save</BaseButton>
    <BaseButton variant="secondary" size="small">Cancel</BaseButton>
    <BaseButton variant="danger" :loading="isDeleting" @click="handleDelete"> Delete </BaseButton>
  </div>
</template>

<script setup>
const isDeleting = ref(false)

const handleSave = () => {
  console.log('Save clicked')
}

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await $fetch('/api/delete', { method: 'DELETE' })
  } finally {
    isDeleting.value = false
  }
}
</script>
```

## Auto-Import in Nuxt

### Directory Structure

```
components/
├── Base/
│   ├── Button.vue      # → <BaseButton>
│   ├── Input.vue       # → <BaseInput>
│   └── Card.vue        # → <BaseCard>
├── User/
│   ├── Profile.vue     # → <UserProfile>
│   └── Avatar.vue      # → <UserAvatar>
├── TheHeader.vue       # → <TheHeader>
└── AppFooter.vue       # → <AppFooter>
```

### Component Naming

Nuxt automatically generates component names based on file paths:

- `components/BaseButton.vue` → `<BaseButton>`
- `components/User/Profile.vue` → `<UserProfile>`
- `components/form/TextInput.vue` → `<FormTextInput>`

### Lazy Components

Add `Lazy` prefix to make components lazy-loaded:

```vue
<template>
  <div>
    <!-- Regular component -->
    <BaseButton>Click me</BaseButton>

    <!-- Lazy-loaded component -->
    <LazyExpensiveChart v-if="showChart" :data="chartData" />
  </div>
</template>
```

## Props and Events

### Advanced Prop Definitions

```vue
<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
}

interface Props {
  // Required prop
  user: User

  // Optional with default
  showEmail?: boolean

  // Union types
  size?: 'small' | 'medium' | 'large'

  // Array prop
  tags?: string[]

  // Function prop
  onUpdate?: (user: User) => void

  // Complex object
  config?: {
    theme: 'light' | 'dark'
    notifications: boolean
  }
}

const props = withDefaults(defineProps<Props>(), {
  showEmail: true,
  size: 'medium',
  tags: () => [],
  config: () => ({ theme: 'light', notifications: true }),
})

// Computed based on props
const displayName = computed(() => {
  return props.size === 'small' ? props.user.name.split(' ')[0] : props.user.name
})
</script>
```

### Event Handling

```vue
<!-- components/UserForm.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.name" placeholder="Name" />
    <input v-model="form.email" placeholder="Email" />

    <div class="actions">
      <button type="submit">Save</button>
      <button type="button" @click="handleCancel">Cancel</button>
    </div>
  </form>
</template>

<script setup>
interface User {
  name: string
  email: string
}

interface Props {
  initialData?: Partial<User>
}

const props = defineProps<Props>()

// Define typed emits
const emit = defineEmits<{
  save: [user: User]
  cancel: []
  'validation-error': [errors: Record<string, string>]
}>()

const form = reactive({
  name: props.initialData?.name || '',
  email: props.initialData?.email || ''
})

const handleSubmit = () => {
  // Validation
  const errors: Record<string, string> = {}

  if (!form.name.trim()) {
    errors.name = 'Name is required'
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
  }

  if (Object.keys(errors).length > 0) {
    emit('validation-error', errors)
    return
  }

  emit('save', { ...form })
}

const handleCancel = () => {
  emit('cancel')
}
</script>
```

## Slots

### Basic Slots

```vue
<!-- components/BaseCard.vue -->
<template>
  <div class="card">
    <header class="card-header" v-if="$slots.header">
      <slot name="header" />
    </header>

    <div class="card-body">
      <!-- Default slot -->
      <slot />
    </div>

    <footer class="card-footer" v-if="$slots.footer">
      <slot name="footer" />
    </footer>
  </div>
</template>
```

### Using Named Slots

```vue
<template>
  <BaseCard>
    <template #header>
      <h2>User Profile</h2>
    </template>

    <!-- Default slot content -->
    <UserProfile :user="user" />

    <template #footer>
      <BaseButton @click="edit">Edit</BaseButton>
      <BaseButton variant="danger" @click="delete">Delete</BaseButton>
    </template>
  </BaseCard>
</template>
```

### Scoped Slots

```vue
<!-- components/DataTable.vue -->
<template>
  <table class="data-table">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key">
          {{ column.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="item.id">
        <td v-for="column in columns" :key="column.key">
          <!-- Scoped slot with data -->
          <slot :name="column.key" :item="item" :value="item[column.key]" :index="index">
            <!-- Default content -->
            {{ item[column.key] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
interface Column {
  key: string
  label: string
}

interface Props {
  data: any[]
  columns: Column[]
}

defineProps<Props>()
</script>
```

### Using Scoped Slots

```vue
<template>
  <DataTable :data="users" :columns="columns">
    <!-- Custom cell rendering -->
    <template #email="{ item, value }">
      <a :href="`mailto:${value}`">{{ value }}</a>
    </template>

    <template #status="{ item }">
      <span :class="statusClass(item.status)">
        {{ item.status }}
      </span>
    </template>

    <template #actions="{ item }">
      <BaseButton size="small" @click="editUser(item)">Edit</BaseButton>
      <BaseButton size="small" variant="danger" @click="deleteUser(item)"> Delete </BaseButton>
    </template>
  </DataTable>
</template>

<script setup>
const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
]

const statusClass = (status: string) => ({
  'text-green-600': status === 'active',
  'text-red-600': status === 'inactive',
  'text-yellow-600': status === 'pending'
})
</script>
```

## Composables in Components

### Creating Reusable Logic

```typescript
// composables/useModal.ts
export const useModal = () => {
  const isOpen = ref(false)

  const open = () => {
    isOpen.value = true
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
  }

  const close = () => {
    isOpen.value = false
    document.body.style.overflow = ''
  }

  const toggle = () => {
    isOpen.value ? close() : open()
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (isOpen.value) {
      document.body.style.overflow = ''
    }
  })

  return {
    isOpen: readonly(isOpen),
    open,
    close,
    toggle,
  }
}
```

### Using Composables in Components

```vue
<!-- components/UserModal.vue -->
<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="close">
      <div class="modal-content" @click.stop>
        <header class="modal-header">
          <h2>{{ title }}</h2>
          <button @click="close" class="close-btn">&times;</button>
        </header>

        <div class="modal-body">
          <slot />
        </div>

        <footer class="modal-footer">
          <slot name="footer">
            <BaseButton @click="close">Close</BaseButton>
          </slot>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
interface Props {
  title: string
}

defineProps<Props>()

const { isOpen, close } = useModal()

// Expose methods to parent
defineExpose({
  open: () => useModal().open(),
  close
})
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-content {
  @apply bg-white rounded-lg shadow-xl max-w-md w-full mx-4;
}

.modal-header {
  @apply flex justify-between items-center p-4 border-b;
}

.modal-body {
  @apply p-4;
}

.modal-footer {
  @apply p-4 border-t flex justify-end gap-2;
}

.close-btn {
  @apply text-gray-500 hover:text-gray-700 text-xl;
}
</style>
```

## Component Communication

### Parent-Child Communication

```vue
<!-- Parent Component -->
<template>
  <div>
    <UserList
      :users="users"
      :loading="loading"
      @user-selected="handleUserSelected"
      @refresh="loadUsers"
    />

    <UserModal ref="userModal" :title="selectedUser ? 'Edit User' : 'Add User'">
      <UserForm :initial-data="selectedUser" @save="handleUserSave" @cancel="closeModal" />
    </UserModal>
  </div>
</template>

<script setup>
const users = ref([])
const loading = ref(false)
const selectedUser = ref(null)
const userModal = ref()

const loadUsers = async () => {
  loading.value = true
  try {
    users.value = await $fetch('/api/users')
  } finally {
    loading.value = false
  }
}

const handleUserSelected = user => {
  selectedUser.value = user
  userModal.value.open()
}

const handleUserSave = async userData => {
  // Save logic
  await loadUsers()
  closeModal()
}

const closeModal = () => {
  selectedUser.value = null
  userModal.value.close()
}

onMounted(loadUsers)
</script>
```

### Provide/Inject

```vue
<!-- Provider Component -->
<template>
  <div class="theme-provider">
    <slot />
  </div>
</template>

<script setup>
interface Theme {
  primary: string
  secondary: string
  background: string
}

const theme = ref<Theme>({
  primary: '#3b82f6',
  secondary: '#6b7280',
  background: '#ffffff'
})

const toggleDarkMode = () => {
  theme.value = theme.value.background === '#ffffff'
    ? { primary: '#60a5fa', secondary: '#9ca3af', background: '#1f2937' }
    : { primary: '#3b82f6', secondary: '#6b7280', background: '#ffffff' }
}

// Provide theme to children
provide('theme', {
  theme: readonly(theme),
  toggleDarkMode
})
</script>
```

```vue
<!-- Consumer Component -->
<template>
  <button
    :style="{
      backgroundColor: theme.primary,
      color: theme.background,
    }"
    @click="toggleDarkMode"
  >
    Toggle Theme
  </button>
</template>

<script setup>
// Inject theme from provider
const { theme, toggleDarkMode } = inject('theme')
</script>
```

## Dynamic Components

### Component Switching

```vue
<template>
  <div>
    <nav>
      <button
        v-for="tab in tabs"
        :key="tab.name"
        :class="{ active: currentTab === tab.name }"
        @click="currentTab = tab.name"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- Dynamic component -->
    <component :is="currentComponent" v-bind="currentProps" @update="handleUpdate" />
  </div>
</template>

<script setup>
const currentTab = ref('profile')

const tabs = [
  { name: 'profile', label: 'Profile', component: 'UserProfile' },
  { name: 'settings', label: 'Settings', component: 'UserSettings' },
  { name: 'billing', label: 'Billing', component: 'UserBilling' },
]

const currentComponent = computed(() => {
  return tabs.find(tab => tab.name === currentTab.value)?.component
})

const currentProps = computed(() => {
  // Pass different props based on current tab
  return {
    userId: 123,
    editable: currentTab.value !== 'billing',
  }
})

const handleUpdate = data => {
  console.log('Component updated:', data)
}
</script>
```

### Async Components

```vue
<script setup>
// Lazy load heavy components
const HeavyChart = defineAsyncComponent(() => import('~/components/HeavyChart.vue'))

const ExpensiveTable = defineAsyncComponent({
  loader: () => import('~/components/ExpensiveTable.vue'),
  loadingComponent: () => h('div', 'Loading...'),
  errorComponent: () => h('div', 'Error loading component'),
  delay: 300,
  timeout: 3000,
})
</script>
```

## Component Testing

### Unit Test Example

```typescript
// tests/components/BaseButton.test.ts
import { mount } from '@vue/test-utils'
import BaseButton from '~/components/BaseButton.vue'

describe('BaseButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me',
      },
    })

    expect(wrapper.text()).toBe('Click me')
  })

  it('emits click event', async () => {
    const wrapper = mount(BaseButton)

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('applies correct variant class', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'danger',
      },
    })

    expect(wrapper.classes()).toContain('btn--danger')
  })

  it('disables button when loading', () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true,
      },
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('btn--loading')
  })
})
```

## Best Practices

1. **Use TypeScript** for better prop and emit definitions
2. **Keep components small** and focused on a single responsibility
3. **Use composition API** and composables for reusable logic
4. **Leverage auto-imports** in Nuxt - no need to manually import components
5. **Use scoped styles** to prevent style leakage
6. **Provide default props** where appropriate
7. **Emit events** instead of modifying props directly
8. **Use slots** for flexible content composition
9. **Create reusable components** in the `components/` directory
10. **Test components** with clear, focused unit tests
11. **Use provide/inject** for deep component communication
12. **Lazy load** heavy components with `defineAsyncComponent`
13. **Use `defineExpose`** to expose methods to parent components
14. **Follow naming conventions** for auto-import to work correctly

## Common Patterns

### Form Components with Validation

```vue
<!-- components/BaseInput.vue -->
<template>
  <div class="input-group">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="['input', { 'input--error': hasError }]"
      @input="handleInput"
      @blur="handleBlur"
    />

    <div v-if="hasError" class="input-error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
interface Props {
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
}>()

const inputId = `input-${Math.random().toString(36).substr(2, 9)}`
const hasError = computed(() => !!props.errorMessage)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>
```

This comprehensive guide covers the essential aspects of working with components in Vue.js and Nuxt.js, from basic component creation to advanced patterns and best practices.
