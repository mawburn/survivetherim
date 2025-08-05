<template>
  <BaseCard variant="bordered">
    <template #header>
      <h3 class="text-xl font-bold">{{ title }}</h3>
    </template>

    <div class="space-y-6">
      <div class="current-result">
        <div
          class="text-center p-8 bg-gray-50 rounded-lg min-h-[120px] flex items-center justify-center"
        >
          <span v-if="isGenerating" class="text-lg text-gray-500 animate-pulse">
            Generating...
          </span>
          <span v-else class="text-2xl font-bold text-gray-800">
            {{ currentResult || 'Click generate to start!' }}
          </span>
        </div>
      </div>

      <div class="flex gap-3 justify-center">
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

      <div v-if="history.length > 0" class="space-y-3">
        <h4 class="text-sm font-semibold text-gray-700">Previous Results</h4>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <div
            v-for="(item, index) in history"
            :key="index"
            class="p-2 bg-gray-100 rounded cursor-pointer transition-colors hover:bg-gray-200"
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
