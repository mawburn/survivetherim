# Components Directory (`src/components/`)

This directory contains all reusable Vue.js components, organized by category and automatically imported by Nuxt.js.

## Structure

```
components/
├── Base/           # Generic, reusable UI components
├── Demo/           # Demo-specific components
└── RimWorld/       # RimWorld-themed components
```

## Auto-Import Convention

Components are automatically imported based on their file path:

- `Base/Button.vue` → `<BaseButton>`
- `RimWorld/ColonistCard.vue` → `<RimWorldColonistCard>`
- `Demo/RandomGenerator.vue` → `<DemoRandomGenerator>`

## Base Components (`Base/`)

### `Button.vue` - `<BaseButton>`

- **Purpose**: Flexible button component with multiple variants and states
- **Props**:
  - `variant`: 'primary' | 'secondary' | 'danger' | 'success'
  - `size`: 'small' | 'medium' | 'large'
  - `loading`: boolean (shows spinner)
  - `disabled`: boolean
- **Events**: `click`
- **Features**: Loading states, accessibility, hover effects

### `Card.vue` - `<BaseCard>`

- **Purpose**: Container component with header, body, and footer slots
- **Props**:
  - `variant`: 'default' | 'elevated' | 'bordered'
- **Slots**: `header`, `default`, `footer`
- **Features**: Flexible content layout, shadow variants

### `Input.vue` - `<BaseInput>`

- **Purpose**: Form input with label, validation, and error states
- **Props**:
  - `modelValue`: string (v-model support)
  - `label`: string
  - `type`: string (default: 'text')
  - `placeholder`: string
  - `required`: boolean
  - `disabled`: boolean
  - `errorMessage`: string
- **Events**: `update:modelValue`, `blur`
- **Features**: Two-way binding, validation display, accessibility

## RimWorld Components (`RimWorld/`)

### `ColonistCard.vue` - `<RimWorldColonistCard>`

- **Purpose**: Display detailed colonist information in card format
- **Props**:
  - `colonist`: Colonist interface object
- **Events**: `assign-task`, `view-details`
- **Features**:
  - Skill visualization with star ratings
  - Health bar with color coding
  - Mood indicators
  - Trait display
  - Interactive action buttons

**Colonist Interface:**

```typescript
interface Colonist {
  id: number
  name: string
  age: number
  health: number
  mood: string
  skills: Array<{ name: string; level: number }>
  traits: string[]
}
```

## Demo Components (`Demo/`)

### `RandomGenerator.vue` - `<DemoRandomGenerator>`

- **Purpose**: Interactive component that generates random items from a list
- **Props**:
  - `title`: string (display title)
  - `type`: string (item type name)
  - `items`: string[] (list of items to generate from)
  - `generateDelay`: number (milliseconds, default: 1000)
- **Features**:
  - Animated generation with delay
  - History tracking (last 10 items)
  - Clickable history to re-select items
  - Loading states
  - Auto-generation on mount

## Component Guidelines

### TypeScript Usage

- All components use `<script setup lang="ts">` syntax
- Props are defined with TypeScript interfaces
- Events are properly typed with `defineEmits<{}>()`

### Styling

- All components use Tailwind CSS classes
- Scoped styles for component-specific styling
- Consistent color scheme and spacing
- Responsive design patterns

### Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly

### Reusability

- Generic base components for common UI patterns
- Domain-specific components for RimWorld features
- Props for customization without modification
- Event-driven communication with parent components

## Usage Examples

```vue
<template>
  <!-- Basic button -->
  <BaseButton @click="handleClick">Click me</BaseButton>

  <!-- Loading button -->
  <BaseButton :loading="isLoading" variant="primary">
    {{ isLoading ? 'Saving...' : 'Save' }}
  </BaseButton>

  <!-- Card with content -->
  <BaseCard variant="elevated">
    <template #header>
      <h3>Card Title</h3>
    </template>
    <p>Card content goes here</p>
    <template #footer>
      <BaseButton size="small">Action</BaseButton>
    </template>
  </BaseCard>

  <!-- Form input -->
  <BaseInput
    v-model="form.name"
    label="Name"
    placeholder="Enter your name"
    :error-message="errors.name"
    required
  />

  <!-- Colonist card -->
  <RimWorldColonistCard
    :colonist="colonist"
    @assign-task="handleTask"
    @view-details="showDetails"
  />

  <!-- Random generator -->
  <DemoRandomGenerator
    title="Weapon Generator"
    type="Weapon"
    :items="weapons"
    :generate-delay="800"
  />
</template>
```
