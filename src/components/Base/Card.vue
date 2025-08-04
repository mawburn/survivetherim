<template>
  <div :class="['card', `card--${variant}`]">
    <header v-if="$slots.header" class="card__header">
      <slot name="header" />
    </header>

    <div class="card__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'elevated' | 'bordered'
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg overflow-hidden;
}

.card--default {
  @apply shadow-sm;
}

.card--elevated {
  @apply shadow-lg;
}

.card--bordered {
  @apply border border-gray-200;
}

.card__header {
  @apply px-6 py-4 border-b border-gray-200 bg-gray-50;
}

.card__body {
  @apply p-6;
}

.card__footer {
  @apply px-6 py-4 border-t border-gray-200 bg-gray-50;
}
</style>
