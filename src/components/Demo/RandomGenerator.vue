<template>
  <BaseCard variant="bordered">
    <template #header>
      <h3 class="text-xl font-bold">{{ title }}</h3>
    </template>

    <div class="generator-content">
      <div class="current-result">
        <div class="result-display">
          <span v-if="isGenerating" class="generating-text"> Generating... </span>
          <span v-else class="result-text">
            {{ currentResult || 'Click generate to start!' }}
          </span>
        </div>
      </div>

      <div class="controls">
        <BaseButton :loading="isGenerating" :disabled="isGenerating" @click="generate">
          Generate {{ type }}
        </BaseButton>

        <BaseButton
          v-if="history.length > 0"
          variant="secondary"
          size="small"
          @click="clearHistory"
        >
          Clear History
        </BaseButton>
      </div>

      <div v-if="history.length > 0" class="history-section">
        <h4 class="history-title">Previous Results</h4>
        <div class="history-list">
          <div
            v-for="(item, index) in history"
            :key="index"
            class="history-item"
            @click="currentResult = item"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
interface Props {
  title: string
  type: string
  items: string[]
  generateDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  generateDelay: 1000,
})

const currentResult = ref<string>('')
const isGenerating = ref(false)
const history = ref<string[]>([])

const generate = async () => {
  isGenerating.value = true

  // Simulate generation delay
  await new Promise(resolve => setTimeout(resolve, props.generateDelay))

  const randomIndex = Math.floor(Math.random() * props.items.length)
  const result = props.items[randomIndex]

  currentResult.value = result

  // Add to history if not already there
  if (!history.value.includes(result)) {
    history.value.unshift(result)

    // Keep only last 10 items
    if (history.value.length > 10) {
      history.value = history.value.slice(0, 10)
    }
  }

  isGenerating.value = false
}

const clearHistory = () => {
  history.value = []
}

// Auto-generate on mount
onMounted(() => {
  generate()
})
</script>

<style scoped>
.generator-content {
  @apply space-y-6;
}

.result-display {
  @apply text-center p-8 bg-gray-50 rounded-lg min-h-[120px] flex items-center justify-center;
}

.generating-text {
  @apply text-lg text-gray-500 animate-pulse;
}

.result-text {
  @apply text-2xl font-bold text-gray-800;
}

.controls {
  @apply flex gap-3 justify-center;
}

.history-section {
  @apply space-y-3;
}

.history-title {
  @apply text-sm font-semibold text-gray-700;
}

.history-list {
  @apply space-y-2 max-h-48 overflow-y-auto;
}

.history-item {
  @apply p-2 bg-gray-100 rounded cursor-pointer transition-colors hover:bg-gray-200;
}
</style>
