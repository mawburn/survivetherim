<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white border-b border-gray-200 py-8">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <div class="flex items-center justify-center gap-2 text-sm mb-4">
          <NuxtLink to="/" class="text-blue-600 hover:text-blue-800">Home</NuxtLink>
          <span class="text-gray-400">/</span>
          <span class="text-gray-600">Colony Simulator</span>
        </div>

        <h1 class="text-3xl font-bold text-gray-900 mb-4">Colony Management</h1>
        <p class="text-lg text-gray-600 mb-8">Generate and manage your virtual RimWorld colony</p>

        <div class="flex gap-4 justify-center flex-wrap">
          <BaseButton :loading="isGenerating" @click="generateNewColonists">
            Generate New Colony
          </BaseButton>

          <BaseButton
            variant="secondary"
            :disabled="colonists.length >= 12"
            @click="addRandomColonist"
          >
            Add Colonist ({{ colonists.length }}/12)
          </BaseButton>

          <BaseButton variant="danger" :disabled="colonists.length === 0" @click="clearColony">
            Clear Colony
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto p-8 space-y-12">
      <!-- Colony Statistics -->
      <section class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Colony Overview
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <BaseCard variant="bordered" class="text-center">
            <div class="py-4">
              <div class="text-3xl font-bold text-blue-600 mb-2">{{ colonists.length }}</div>
              <div class="text-gray-600 font-medium">Total Colonists</div>
            </div>
          </BaseCard>

          <BaseCard variant="bordered" class="text-center">
            <div class="py-4">
              <div class="text-3xl font-bold text-blue-600 mb-2">{{ averageHealth }}%</div>
              <div class="text-gray-600 font-medium">Average Health</div>
            </div>
          </BaseCard>

          <BaseCard variant="bordered" class="text-center">
            <div class="py-4">
              <div class="text-3xl font-bold text-blue-600 mb-2">{{ happyColonists }}</div>
              <div class="text-gray-600 font-medium">Happy Colonists</div>
            </div>
          </BaseCard>

          <BaseCard variant="bordered" class="text-center">
            <div class="py-4">
              <div class="text-3xl font-bold text-blue-600 mb-2">{{ topSkill || 'N/A' }}</div>
              <div class="text-gray-600 font-medium">Top Colony Skill</div>
            </div>
          </BaseCard>
        </div>
      </section>

      <!-- Mood Distribution -->
      <section v-if="colonists.length > 0" class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Mood Distribution
        </h2>

        <BaseCard variant="elevated">
          <div class="p-6 space-y-4">
            <div v-for="mood in moodDistribution" :key="mood.name" class="flex items-center gap-4">
              <span class="w-20 text-sm font-medium">{{ mood.name }}</span>
              <div class="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full transition-all duration-500"
                  :style="{ width: `${mood.percentage}%` }"
                  :class="getMoodBarClass(mood.name)"
                />
              </div>
              <span class="w-8 text-right text-sm font-mono">{{ mood.count }}</span>
            </div>
          </div>
        </BaseCard>
      </section>

      <!-- Colonists Grid -->
      <section class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Colonists
          <span v-if="colonists.length > 0" class="text-lg font-normal text-gray-600"
            >({{ colonists.length }})</span
          >
        </h2>

        <div v-if="colonists.length === 0" class="flex items-center justify-center py-16">
          <div class="text-center space-y-4">
            <h3 class="text-xl font-semibold text-gray-700">No Colonists Yet</h3>
            <p class="text-gray-600 max-w-md">
              Generate a new colony to get started with your RimWorld simulation
            </p>
            <BaseButton :loading="isGenerating" @click="generateNewColonists">
              Generate Colony
            </BaseButton>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    <div
      v-if="selectedColonist"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="selectedColonist = null"
    >
      <div class="max-w-lg w-full max-h-screen overflow-y-auto" @click.stop>
        <BaseCard variant="elevated">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold">{{ selectedColonist.name }} Details</h3>
              <button
                class="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                @click="selectedColonist = null"
              >
                &times;
              </button>
            </div>
          </template>

          <div class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="space-y-1">
                <span class="block text-sm font-medium text-gray-600">Age:</span>
                <span class="block font-semibold">{{ selectedColonist.age }} years</span>
              </div>

              <div class="space-y-1">
                <span class="block text-sm font-medium text-gray-600">Health:</span>
                <span class="block font-semibold">{{ selectedColonist.health }}%</span>
              </div>

              <div class="space-y-1">
                <span class="block text-sm font-medium text-gray-600">Mood:</span>
                <span class="block font-semibold" :class="getMoodTextClass(selectedColonist.mood)">
                  {{ selectedColonist.mood }}
                </span>
              </div>
            </div>

            <div class="space-y-3">
              <h4 class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Skills
              </h4>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="skill in selectedColonist.skills"
                  :key="skill.name"
                  class="flex justify-between items-center bg-gray-50 rounded-sm px-3 py-2"
                >
                  <span class="text-sm font-medium">{{ skill.name }}</span>
                  <span class="text-sm font-mono text-blue-600">{{ skill.level }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <h4 class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Traits
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="trait in selectedColonist.traits"
                  :key="trait"
                  class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {{ trait }}
                </span>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex gap-2 justify-end">
              <BaseButton size="small" @click="handleAssignTask(selectedColonist)">
                Assign Task
              </BaseButton>
              <BaseButton variant="secondary" size="small" @click="selectedColonist = null">
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
