<template>
  <button
    :class="[
      'px-4 py-2 rounded-sm font-medium transition-all duration-200 cursor-pointer border-2 border-transparent focus:outline-hidden focus:ring-2 focus:ring-offset-2',
      {
        'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
        'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500': variant === 'secondary',
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
        'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500': variant === 'success',
        'px-2 py-1 text-sm': size === 'small',
        'px-6 py-3 text-lg': size === 'large',
        'opacity-60 cursor-not-allowed': loading || disabled,
      },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span
      v-if="loading"
      class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
    />
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
