<template>
  <div
    :class="[
      'bg-white rounded-sm overflow-hidden',
      {
        'shadow-xs': variant === 'default',
        'shadow-lg': variant === 'elevated',
        'border border-gray-200': variant === 'bordered',
      },
    ]"
  >
    <header v-if="$slots.header" class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <slot name="header" />
    </header>

    <div class="p-6">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
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
