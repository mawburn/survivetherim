# Vue.js 3 Fundamentals

## Introduction

Vue.js is a progressive JavaScript framework for building user interfaces. Vue 3 introduces the Composition API, which provides a more flexible and powerful way to organize component logic.

## Key Concepts

### Reactivity System

Vue's reactivity system automatically detects changes in data and updates the DOM accordingly. It uses a dependency-tracking based system that tracks every ref used during rendering and triggers re-renders when refs are mutated.

### Composition API vs Options API

Vue 3 offers two ways to write components:

- **Options API**: The traditional Vue 2 style with `data()`, `methods`, `computed`, etc.
- **Composition API**: The modern approach that allows better code organization and reusability

## Composition API Fundamentals

### `ref()` and `reactive()`

The core of Vue's reactivity system:

```javascript
import { ref, reactive } from 'vue'

// ref() - for primitive values and single values
const count = ref(0)
const message = ref('Hello')

// Access value with .value
console.log(count.value) // 0
count.value++

// reactive() - for objects with multiple properties
const state = reactive({
  user: {
    name: 'John',
    age: 30
  },
  items: []
})

// Access directly (no .value needed)
state.user.name = 'Jane'
```

### Basic Component Structure

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Reactive data
const title = ref('My Component')
const count = ref(0)

// Methods
const increment = () => {
  count.value++
}
</script>

<style scoped>
/* Component styles */
</style>
```

### Computed Properties

Computed properties are cached and only re-evaluate when their dependencies change:

```javascript
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})
```

### Watchers

Watch for changes in reactive data:

```javascript
import { ref, watch } from 'vue'

const count = ref(0)

// Watch a single ref
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})

// Watch multiple sources
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log('Name changed')
})
```

### Lifecycle Hooks

```javascript
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  console.log('Component mounted')
})

onUnmounted(() => {
  console.log('Component unmounted')
})
```

## Template Syntax

### Interpolation

```vue
<template>
  <!-- Text interpolation -->
  <p>{{ message }}</p>
  
  <!-- Raw HTML -->
  <div v-html="rawHtml"></div>
  
  <!-- Attributes -->
  <div :id="dynamicId" :class="{ active: isActive }"></div>
</template>
```

### Directives

```vue
<template>
  <!-- Conditional rendering -->
  <p v-if="show">Visible when show is true</p>
  <p v-else>Alternative content</p>
  
  <!-- List rendering -->
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
  
  <!-- Event handling -->
  <button @click="handleClick">Click me</button>
  <input @keyup.enter="handleEnter" v-model="inputValue">
  
  <!-- Two-way binding -->
  <input v-model="message" placeholder="Type here">
</template>
```

## Composables

Composables are functions that encapsulate and reuse stateful logic:

```javascript
// composables/useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  
  return {
    count,
    increment,
    decrement,
    reset
  }
}
```

Using in a component:

```vue
<script setup>
import { useCounter } from '@/composables/useCounter'

const { count, increment, decrement, reset } = useCounter(10)
</script>
```

## Props and Emits

### Defining Props

```vue
<script setup>
// Define props
const props = defineProps({
  title: String,
  count: {
    type: Number,
    default: 0
  },
  items: {
    type: Array,
    required: true
  }
})

// Use props
console.log(props.title)
</script>
```

### Emitting Events

```vue
<script setup>
// Define emits
const emit = defineEmits(['update', 'delete'])

// Emit events
const handleUpdate = () => {
  emit('update', { id: 1, data: 'new data' })
}

const handleDelete = () => {
  emit('delete', { id: 1 })
}
</script>
```

## Best Practices

1. **Use `ref()` for primitives**, `reactive()` for objects
2. **Prefer Composition API** for new projects
3. **Create composables** for reusable logic
4. **Use TypeScript** for better development experience
5. **Keep components small** and focused on a single responsibility
6. **Use `<script setup>`** for cleaner syntax
7. **Leverage Vue DevTools** for debugging

## Next Steps

- Learn about Nuxt.js for full-stack Vue applications
- Explore Vue ecosystem (Vue Router, Pinia, etc.)
- Practice building components and composables
- Study Vue 3 performance optimizations