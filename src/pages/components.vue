<template>
  <div class="components-showcase">
    <div class="page-header">
      <h1 class="page-title">Component Library</h1>
      <p class="page-description">Explore our collection of reusable Vue.js components</p>
      <div class="breadcrumb">
        <NuxtLink to="/" class="breadcrumb-link">Home</NuxtLink>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">Components</span>
      </div>
    </div>

    <div class="showcase-sections">
      <!-- Base Components -->
      <section class="showcase-section">
        <h2 class="section-title">Base Components</h2>

        <div class="component-grid">
          <!-- Button Showcase -->
          <div class="component-demo">
            <h3 class="component-title">Buttons</h3>
            <div class="demo-content">
              <div class="button-variants">
                <BaseButton variant="primary">Primary</BaseButton>
                <BaseButton variant="secondary">Secondary</BaseButton>
                <BaseButton variant="success">Success</BaseButton>
                <BaseButton variant="danger">Danger</BaseButton>
              </div>

              <div class="button-sizes">
                <BaseButton size="small">Small</BaseButton>
                <BaseButton size="medium">Medium</BaseButton>
                <BaseButton size="large">Large</BaseButton>
              </div>

              <div class="button-states">
                <BaseButton :loading="loadingStates.demo1" @click="simulateLoading('demo1')">
                  {{ loadingStates.demo1 ? 'Loading...' : 'Click to Load' }}
                </BaseButton>
                <BaseButton disabled>Disabled</BaseButton>
              </div>
            </div>
          </div>

          <!-- Card Showcase -->
          <div class="component-demo">
            <h3 class="component-title">Cards</h3>
            <div class="demo-content">
              <div class="card-variants">
                <BaseCard variant="default" class="demo-card">
                  <template #header>
                    <span class="text-sm font-medium">Default Card</span>
                  </template>
                  <p class="text-xs">Subtle shadow styling</p>
                </BaseCard>

                <BaseCard variant="elevated" class="demo-card">
                  <template #header>
                    <span class="text-sm font-medium">Elevated Card</span>
                  </template>
                  <p class="text-xs">Prominent shadow styling</p>
                </BaseCard>

                <BaseCard variant="bordered" class="demo-card">
                  <template #header>
                    <span class="text-sm font-medium">Bordered Card</span>
                  </template>
                  <p class="text-xs">Border styling instead of shadow</p>
                </BaseCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- RimWorld Components -->
      <section class="showcase-section">
        <h2 class="section-title">RimWorld Components</h2>

        <div class="component-grid">
          <!-- Colonist Card Showcase -->
          <div class="component-demo large">
            <h3 class="component-title">Colonist Cards</h3>
            <div class="demo-content">
              <div class="colonist-showcase">
                <RimWorldColonistCard
                  v-for="colonist in sampleColonists"
                  :key="colonist.id"
                  :colonist="colonist"
                  @assign-task="handleAssignTask"
                  @view-details="handleViewDetails"
                />
              </div>
            </div>
          </div>

          <!-- Random Generator Showcase -->
          <div class="component-demo">
            <h3 class="component-title">Random Generator</h3>
            <div class="demo-content">
              <DemoRandomGenerator
                title="Sample Generator"
                type="Item"
                :items="['Steel', 'Wood', 'Stone', 'Gold', 'Silver', 'Plasteel']"
                :generate-delay="500"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Interactive Components -->
      <section class="showcase-section">
        <h2 class="section-title">Interactive Examples</h2>

        <div class="component-grid">
          <!-- Form Example -->
          <div class="component-demo">
            <h3 class="component-title">Form Components</h3>
            <div class="demo-content">
              <form class="demo-form" @submit.prevent="submitForm">
                <BaseInput
                  v-model="form.name"
                  label="Colonist Name"
                  placeholder="Enter name"
                  :error-message="errors.name"
                />

                <BaseInput
                  v-model="form.skill"
                  label="Primary Skill"
                  placeholder="Enter skill"
                  :error-message="errors.skill"
                />

                <BaseButton
                  type="submit"
                  :loading="isSubmitting"
                  :disabled="!isFormValid"
                  size="small"
                >
                  {{ isSubmitting ? 'Adding...' : 'Add Colonist' }}
                </BaseButton>
              </form>
            </div>
          </div>

          <!-- Counter Example -->
          <div class="component-demo">
            <h3 class="component-title">Interactive Counter</h3>
            <div class="demo-content">
              <div class="counter-demo">
                <div class="counter-display">
                  <span class="counter-value">{{ counter }}</span>
                  <span class="counter-label">Colony Size</span>
                </div>

                <div class="counter-controls">
                  <BaseButton size="small" :disabled="counter <= 0" @click="counter--">
                    -
                  </BaseButton>
                  <BaseButton size="small" variant="secondary" @click="counter = 0">
                    Reset
                  </BaseButton>
                  <BaseButton size="small" @click="counter++"> + </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal for colonist details -->
    <div v-if="selectedColonist" class="modal-overlay" @click="selectedColonist = null">
      <div class="modal-content" @click.stop>
        <BaseCard variant="elevated">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold">{{ selectedColonist.name }}</h3>
              <button class="close-btn" @click="selectedColonist = null">&times;</button>
            </div>
          </template>

          <div class="colonist-details">
            <p><strong>Age:</strong> {{ selectedColonist.age }}</p>
            <p><strong>Health:</strong> {{ selectedColonist.health }}%</p>
            <p><strong>Mood:</strong> {{ selectedColonist.mood }}</p>
            <p><strong>Skills:</strong> {{ selectedColonist.skills.length }}</p>
            <p><strong>Traits:</strong> {{ selectedColonist.traits.join(', ') }}</p>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { generateMultipleColonists } = useRimWorldData()

// Page metadata
useHead({
  title: 'Components - SurviveTheRim',
  meta: [{ name: 'description', content: 'Component library showcase for SurviveTheRim' }],
})

interface Colonist {
  id: number
  name: string
  age: number
  health: number
  mood: string
  skills: Array<{ name: string; level: number }>
  traits: string[]
}

// Component state
const loadingStates = reactive<Record<string, boolean>>({
  demo1: false,
})

const counter = ref(3)
const selectedColonist = ref<Colonist | null>(null)

// Sample colonists for showcase
const sampleColonists = ref<Colonist[]>([])

// Form state
const form = reactive({
  name: '',
  skill: '',
})

const errors = reactive({
  name: '',
  skill: '',
})

const isSubmitting = ref(false)

// Computed
const isFormValid = computed(() => {
  return form.name.trim() && form.skill.trim() && !errors.name && !errors.skill
})

// Methods
const simulateLoading = async (key: string) => {
  loadingStates[key] = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  loadingStates[key] = false
}

const handleAssignTask = (colonist: Colonist) => {
  console.log('Assigning task to:', colonist.name)
}

const handleViewDetails = (colonist: Colonist) => {
  selectedColonist.value = colonist
}

const validateForm = () => {
  errors.name = form.name.trim() ? '' : 'Name is required'
  errors.skill = form.skill.trim() ? '' : 'Skill is required'
}

const submitForm = async () => {
  validateForm()
  if (!isFormValid.value) return

  isSubmitting.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  console.log('Form submitted:', form)

  // Reset form
  form.name = ''
  form.skill = ''
  errors.name = ''
  errors.skill = ''

  isSubmitting.value = false
}

// Watch form for validation
watch(() => form.name, validateForm)
watch(() => form.skill, validateForm)

// Initialize sample data
onMounted(() => {
  sampleColonists.value = generateMultipleColonists(2)
})
</script>

<style scoped>
.components-showcase {
  @apply min-h-screen bg-gray-50;
}

.page-header {
  @apply bg-white border-b border-gray-200 py-8;
}

.page-title {
  @apply text-3xl font-bold text-gray-900 text-center mb-4;
}

.page-description {
  @apply text-lg text-gray-600 text-center mb-6;
}

.breadcrumb {
  @apply flex items-center justify-center gap-2 text-sm;
}

.breadcrumb-link {
  @apply text-blue-600 hover:text-blue-800;
}

.breadcrumb-separator {
  @apply text-gray-400;
}

.breadcrumb-current {
  @apply text-gray-600;
}

.showcase-sections {
  @apply max-w-7xl mx-auto p-8 space-y-12;
}

.showcase-section {
  @apply space-y-8;
}

.section-title {
  @apply text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4;
}

.component-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-8;
}

.component-demo {
  @apply bg-white rounded-lg p-6 shadow-sm border border-gray-200;
}

.component-demo.large {
  @apply lg:col-span-2;
}

.component-title {
  @apply text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100;
}

.demo-content {
  @apply space-y-4;
}

.button-variants,
.button-sizes,
.button-states {
  @apply flex flex-wrap gap-2;
}

.card-variants {
  @apply grid grid-cols-1 sm:grid-cols-3 gap-3;
}

.demo-card {
  @apply text-center;
}

.colonist-showcase {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.demo-form {
  @apply space-y-3;
}

.counter-demo {
  @apply text-center space-y-4;
}

.counter-display {
  @apply space-y-2;
}

.counter-value {
  @apply block text-3xl font-bold text-blue-600;
}

.counter-label {
  @apply block text-sm text-gray-600;
}

.counter-controls {
  @apply flex justify-center gap-2;
}

.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
}

.modal-content {
  @apply max-w-md w-full;
}

.close-btn {
  @apply text-gray-500 hover:text-gray-700 text-2xl font-bold;
}

.colonist-details {
  @apply space-y-2 text-sm;
}
</style>
