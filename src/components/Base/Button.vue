<template>
  <button
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      { 'btn--loading': loading, 'btn--disabled': disabled },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="btn__spinner" />
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  loading: false,
  disabled: false,
})

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
  @apply px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer border-2 border-transparent;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn--primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}

.btn--secondary {
  @apply bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500;
}

.btn--danger {
  @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
}

.btn--success {
  @apply bg-green-600 text-white hover:bg-green-700 focus:ring-green-500;
}

.btn--small {
  @apply px-2 py-1 text-sm;
}

.btn--large {
  @apply px-6 py-3 text-lg;
}

.btn--loading,
.btn--disabled {
  @apply opacity-60 cursor-not-allowed;
}

.btn__spinner {
  @apply inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin;
}
</style>
