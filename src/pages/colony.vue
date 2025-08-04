<template>
  <div class="colony-page">
    <div class="page-header">
      <div class="header-content">
        <div class="breadcrumb">
          <NuxtLink to="/" class="breadcrumb-link">Home</NuxtLink>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">Colony Simulator</span>
        </div>

        <h1 class="page-title">Colony Management</h1>
        <p class="page-description">Generate and manage your virtual RimWorld colony</p>

        <div class="colony-controls">
          <BaseButton @click="generateNewColonists" :loading="isGenerating">
            Generate New Colony
          </BaseButton>

          <BaseButton
            variant="secondary"
            @click="addRandomColonist"
            :disabled="colonists.length >= 12"
          >
            Add Colonist ({{ colonists.length }}/12)
          </BaseButton>

          <BaseButton variant="danger" @click="clearColony" :disabled="colonists.length === 0">
            Clear Colony
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="colony-content">
      <!-- Colony Statistics -->
      <section class="stats-section">
        <h2 class="section-title">Colony Overview</h2>

        <div class="stats-grid">
          <BaseCard variant="bordered" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ colonists.length }}</div>
              <div class="stat-label">Total Colonists</div>
            </div>
          </BaseCard>

          <BaseCard variant="bordered" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ averageHealth }}%</div>
              <div class="stat-label">Average Health</div>
            </div>
          </BaseCard>

          <BaseCard variant="bordered" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ happyColonists }}</div>
              <div class="stat-label">Happy Colonists</div>
            </div>
          </BaseCard>

          <BaseCard variant="bordered" class="stat-card">
            <div class="stat-content">
              <div class="stat-value">{{ topSkill || 'N/A' }}</div>
              <div class="stat-label">Top Colony Skill</div>
            </div>
          </BaseCard>
        </div>
      </section>

      <!-- Mood Distribution -->
      <section class="mood-section" v-if="colonists.length > 0">
        <h2 class="section-title">Mood Distribution</h2>

        <BaseCard variant="elevated">
          <div class="mood-chart">
            <div v-for="mood in moodDistribution" :key="mood.name" class="mood-bar">
              <span class="mood-name">{{ mood.name }}</span>
              <div class="mood-bar-container">
                <div
                  class="mood-bar-fill"
                  :style="{ width: `${mood.percentage}%` }"
                  :class="getMoodBarClass(mood.name)"
                ></div>
              </div>
              <span class="mood-count">{{ mood.count }}</span>
            </div>
          </div>
        </BaseCard>
      </section>

      <!-- Colonists Grid -->
      <section class="colonists-section">
        <h2 class="section-title">
          Colonists
          <span v-if="colonists.length > 0" class="colonist-count">({{ colonists.length }})</span>
        </h2>

        <div v-if="colonists.length === 0" class="empty-state">
          <div class="empty-content">
            <h3 class="empty-title">No Colonists Yet</h3>
            <p class="empty-description">
              Generate a new colony to get started with your RimWorld simulation
            </p>
            <BaseButton @click="generateNewColonists" :loading="isGenerating">
              Generate Colony
            </BaseButton>
          </div>
        </div>

        <div v-else class="colonists-grid">
          <RimWorldColonistCard
            v-for="colonist in colonists"
            :key="colonist.id"
            :colonist="colonist"
            @assign-task="handleAssignTask"
            @view-details="handleViewDetails"
          />
        </div>
      </section>
    </div>

    <!-- Modal for colonist details -->
    <div v-if="selectedColonist" class="modal-overlay" @click="selectedColonist = null">
      <div class="modal-content" @click.stop>
        <BaseCard variant="elevated">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold">{{ selectedColonist.name }} Details</h3>
              <button @click="selectedColonist = null" class="close-btn">&times;</button>
            </div>
          </template>

          <div class="colonist-details">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Age:</span>
                <span class="detail-value">{{ selectedColonist.age }} years</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Health:</span>
                <span class="detail-value">{{ selectedColonist.health }}%</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Mood:</span>
                <span class="detail-value" :class="getMoodTextClass(selectedColonist.mood)">
                  {{ selectedColonist.mood }}
                </span>
              </div>
            </div>

            <div class="skills-section">
              <h4 class="subsection-title">Skills</h4>
              <div class="skills-grid">
                <div v-for="skill in selectedColonist.skills" :key="skill.name" class="skill-item">
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="skill-level">{{ skill.level }}</span>
                </div>
              </div>
            </div>

            <div class="traits-section">
              <h4 class="subsection-title">Traits</h4>
              <div class="traits-list">
                <span v-for="trait in selectedColonist.traits" :key="trait" class="trait-tag">
                  {{ trait }}
                </span>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="modal-actions">
              <BaseButton @click="handleAssignTask(selectedColonist)" size="small">
                Assign Task
              </BaseButton>
              <BaseButton variant="secondary" @click="selectedColonist = null" size="small">
                Close
              </BaseButton>
            </div>
          </template>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { generateMultipleColonists, generateColonist } = useRimWorldData()

// Page metadata
useHead({
  title: 'Colony Simulator - SurviveTheRim',
  meta: [
    {
      name: 'description',
      content: 'Manage your virtual RimWorld colony with detailed colonist simulation',
    },
  ],
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

// State
const colonists = ref<Colonist[]>([])
const isGenerating = ref(false)
const selectedColonist = ref<Colonist | null>(null)

// Computed properties
const averageHealth = computed(() => {
  if (colonists.value.length === 0) return 0
  const total = colonists.value.reduce((sum, colonist) => sum + colonist.health, 0)
  return Math.round(total / colonists.value.length)
})

const happyColonists = computed(() => colonists.value.filter(c => c.mood === 'Happy').length)

const topSkill = computed(() => {
  if (colonists.value.length === 0) return null

  const skillCounts: Record<string, number> = {}
  colonists.value.forEach(colonist => {
    colonist.skills.forEach(skill => {
      skillCounts[skill.name] = (skillCounts[skill.name] || 0) + skill.level
    })
  })

  if (Object.keys(skillCounts).length === 0) return null

  const topSkillName = Object.keys(skillCounts).reduce((a, b) =>
    skillCounts[a] > skillCounts[b] ? a : b
  )

  return topSkillName
})

const moodDistribution = computed(() => {
  const moods = ['Happy', 'Content', 'Stressed', 'Breaking']
  const total = colonists.value.length

  return moods.map(mood => {
    const count = colonists.value.filter(c => c.mood === mood).length
    const percentage = total > 0 ? (count / total) * 100 : 0

    return { name: mood, count, percentage }
  })
})

// Methods
const generateNewColonists = async () => {
  isGenerating.value = true

  await new Promise(resolve => setTimeout(resolve, 1500))

  const count = Math.floor(Math.random() * 4) + 3 // 3-6 colonists
  colonists.value = generateMultipleColonists(count)

  isGenerating.value = false
}

const addRandomColonist = () => {
  if (colonists.value.length < 12) {
    colonists.value.push(generateColonist())
  }
}

const clearColony = () => {
  colonists.value = []
  selectedColonist.value = null
}

const handleAssignTask = (colonist: Colonist) => {
  console.log('Assigning task to:', colonist.name)
  // Could implement task assignment logic here
}

const handleViewDetails = (colonist: Colonist) => {
  selectedColonist.value = colonist
}

const getMoodBarClass = (mood: string) => {
  switch (mood) {
    case 'Happy':
      return 'bg-green-500'
    case 'Content':
      return 'bg-blue-500'
    case 'Stressed':
      return 'bg-yellow-500'
    case 'Breaking':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

const getMoodTextClass = (mood: string) => {
  switch (mood) {
    case 'Happy':
      return 'text-green-600'
    case 'Content':
      return 'text-blue-600'
    case 'Stressed':
      return 'text-yellow-600'
    case 'Breaking':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

// Initialize with some colonists
onMounted(() => {
  generateNewColonists()
})
</script>

<style scoped>
.colony-page {
  @apply min-h-screen bg-gray-50;
}

.page-header {
  @apply bg-white border-b border-gray-200 py-8;
}

.header-content {
  @apply max-w-7xl mx-auto px-4 text-center;
}

.breadcrumb {
  @apply flex items-center justify-center gap-2 text-sm mb-4;
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

.page-title {
  @apply text-3xl font-bold text-gray-900 mb-4;
}

.page-description {
  @apply text-lg text-gray-600 mb-8;
}

.colony-controls {
  @apply flex gap-4 justify-center flex-wrap;
}

.colony-content {
  @apply max-w-7xl mx-auto p-8 space-y-12;
}

.section-title {
  @apply text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2;
}

.colonist-count {
  @apply text-lg font-normal text-gray-600;
}

.stats-section,
.mood-section {
  @apply space-y-6;
}

.stats-grid {
  @apply grid grid-cols-2 md:grid-cols-4 gap-6;
}

.stat-card {
  @apply text-center;
}

.stat-content {
  @apply py-4;
}

.stat-value {
  @apply text-3xl font-bold text-blue-600 mb-2;
}

.stat-label {
  @apply text-gray-600 font-medium;
}

.mood-chart {
  @apply p-6 space-y-4;
}

.mood-bar {
  @apply flex items-center gap-4;
}

.mood-name {
  @apply w-20 text-sm font-medium;
}

.mood-bar-container {
  @apply flex-1 h-6 bg-gray-200 rounded-full overflow-hidden;
}

.mood-bar-fill {
  @apply h-full transition-all duration-500;
}

.mood-count {
  @apply w-8 text-right text-sm font-mono;
}

.colonists-section {
  @apply space-y-6;
}

.empty-state {
  @apply flex items-center justify-center py-16;
}

.empty-content {
  @apply text-center space-y-4;
}

.empty-title {
  @apply text-xl font-semibold text-gray-700;
}

.empty-description {
  @apply text-gray-600 max-w-md;
}

.colonists-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
}

.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
}

.modal-content {
  @apply max-w-lg w-full max-h-screen overflow-y-auto;
}

.close-btn {
  @apply text-gray-500 hover:text-gray-700 text-2xl font-bold;
}

.colonist-details {
  @apply space-y-6;
}

.detail-grid {
  @apply grid grid-cols-1 sm:grid-cols-3 gap-4;
}

.detail-item {
  @apply space-y-1;
}

.detail-label {
  @apply block text-sm font-medium text-gray-600;
}

.detail-value {
  @apply block font-semibold;
}

.subsection-title {
  @apply text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2;
}

.skills-section,
.traits-section {
  @apply space-y-3;
}

.skills-grid {
  @apply grid grid-cols-2 gap-2;
}

.skill-item {
  @apply flex justify-between items-center bg-gray-50 rounded px-3 py-2;
}

.skill-name {
  @apply text-sm font-medium;
}

.skill-level {
  @apply text-sm font-mono text-blue-600;
}

.traits-list {
  @apply flex flex-wrap gap-2;
}

.trait-tag {
  @apply px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full;
}

.modal-actions {
  @apply flex gap-2 justify-end;
}
</style>
