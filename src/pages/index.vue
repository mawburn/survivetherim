<template>
  <div class="min-h-screen bg-gray-50">
    <div class="text-center py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <h1 class="text-5xl font-bold mb-6">SurviveTheRim</h1>
      <p class="text-xl mb-8 max-w-3xl mx-auto px-4">
        Interactive RimWorld survival guides and tools to help you master life on the rim
      </p>
      <div class="flex gap-4 justify-center flex-wrap px-4">
        <NuxtLink
          to="/components"
          class="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100 rounded-sm font-medium transition-all duration-200 no-underline inline-block"
        >
          View Components
        </NuxtLink>
        <NuxtLink
          to="/colony"
          class="px-8 py-4 text-lg bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600 rounded-sm font-medium transition-all duration-200 no-underline inline-block"
        >
          Colony Simulator
        </NuxtLink>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-16 space-y-16">
      <!-- Random Generators Section -->
      <section class="space-y-8">
        <h2 class="text-3xl font-bold text-gray-800 text-center">Random Generators</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DemoRandomGenerator
            title="Colonist Name"
            type="Name"
            :items="colonistNames"
            :generate-delay="800"
          />

          <DemoRandomGenerator
            title="Random Incident"
            type="Incident"
            :items="incidents"
            :generate-delay="1200"
          />

          <DemoRandomGenerator
            title="Base Name"
            type="Base Name"
            :items="baseNames"
            :generate-delay="600"
          />
        </div>
      </section>

      <!-- Features Preview Section -->
      <section class="space-y-8">
        <h2 class="text-3xl font-bold text-gray-800 text-center">Features</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BaseCard variant="elevated" class="h-full">
            <template #header>
              <h3 class="text-xl font-bold text-gray-800">Colony Management</h3>
            </template>

            <p class="text-gray-600 leading-relaxed">
              Generate and manage virtual RimWorld colonies with detailed colonist information,
              skills, traits, and mood tracking.
            </p>

            <template #footer>
              <NuxtLink
                to="/colony"
                class="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-sm font-medium transition-all duration-200 no-underline inline-block"
              >
                Try Colony Simulator
              </NuxtLink>
            </template>
          </BaseCard>

          <BaseCard variant="elevated" class="h-full">
            <template #header>
              <h3 class="text-xl font-bold text-gray-800">Component Library</h3>
            </template>

            <p class="text-gray-600 leading-relaxed">
              Explore a comprehensive set of Vue.js components built with TypeScript, featuring
              buttons, forms, cards, and interactive elements.
            </p>

            <template #footer>
              <NuxtLink
                to="/components"
                class="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-sm font-medium transition-all duration-200 no-underline inline-block"
              >
                View Components
              </NuxtLink>
            </template>
          </BaseCard>

          <BaseCard variant="elevated" class="h-full">
            <template #header>
              <h3 class="text-xl font-bold text-gray-800">Survival Guides</h3>
            </template>

            <p class="text-gray-600 leading-relaxed">
              Access detailed survival guides and tips for RimWorld, from beginner basics to
              advanced colony strategies.
            </p>

            <template #footer>
              <NuxtLink
                to="/guides"
                class="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-sm font-medium transition-all duration-200 no-underline inline-block"
              >
                Read Guides
              </NuxtLink>
            </template>
          </BaseCard>
        </div>
      </section>

      <!-- Quick Stats Section -->
      <section class="space-y-8">
        <h2 class="text-3xl font-bold text-gray-800 text-center">Quick Colony Stats</h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-sm p-6 text-center shadow-xs border border-gray-200">
            <div class="text-3xl font-bold text-blue-600 mb-2">{{ totalColonists }}</div>
            <div class="text-gray-600 text-sm font-medium">Total Colonists Generated</div>
          </div>

          <div class="bg-white rounded-sm p-6 text-center shadow-xs border border-gray-200">
            <div class="text-3xl font-bold text-blue-600 mb-2">{{ availableSkills.length }}</div>
            <div class="text-gray-600 text-sm font-medium">Available Skills</div>
          </div>

          <div class="bg-white rounded-sm p-6 text-center shadow-xs border border-gray-200">
            <div class="text-3xl font-bold text-blue-600 mb-2">{{ availableTraits.length }}</div>
            <div class="text-gray-600 text-sm font-medium">Possible Traits</div>
          </div>

          <div class="bg-white rounded-sm p-6 text-center shadow-xs border border-gray-200">
            <div class="text-3xl font-bold text-blue-600 mb-2">∞</div>
            <div class="text-gray-600 text-sm font-medium">Possible Combinations</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { colonistNames, incidents, baseNames, skills, traits } = useRimWorldData()

// Page metadata
useHead({
  title: 'SurviveTheRim - RimWorld Survival Tools & Guides',
  meta: [
    {
      name: 'description',
      content: 'Interactive RimWorld survival guides and tools to help you master life on the rim',
    },
    { property: 'og:title', content: 'SurviveTheRim - RimWorld Survival Tools' },
    { property: 'og:description', content: 'Interactive RimWorld survival guides and tools' },
  ],
})

// Reactive stats
const totalColonists = ref(42) // Mock data - could be real from database
const availableSkills = computed(() => skills)
const availableTraits = computed(() => traits)

// Increment colonist count when generators are used
onMounted(() => {
  // Could track actual usage statistics
  const interval = setInterval(() => {
    totalColonists.value += Math.floor(Math.random() * 3)
  }, 5000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>
