<template>
  <div class="landing-page">
    <div class="page-header">
      <h1 class="page-title">SurviveTheRim</h1>
      <p class="page-description">
        Interactive RimWorld survival guides and tools to help you master life on the rim
      </p>
      <div class="page-actions">
        <NuxtLink to="/components" class="btn btn--primary btn--large"> View Components </NuxtLink>
        <NuxtLink to="/colony" class="btn btn--secondary btn--large"> Colony Simulator </NuxtLink>
      </div>
    </div>

    <div class="demo-sections">
      <!-- Random Generators Section -->
      <section class="demo-section">
        <h2 class="section-title">Random Generators</h2>
        <div class="generators-grid">
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
      <section class="demo-section">
        <h2 class="section-title">Features</h2>

        <div class="features-grid">
          <BaseCard variant="elevated" class="feature-card">
            <template #header>
              <h3 class="feature-title">Colony Management</h3>
            </template>

            <p class="feature-description">
              Generate and manage virtual RimWorld colonies with detailed colonist information,
              skills, traits, and mood tracking.
            </p>

            <template #footer>
              <NuxtLink to="/colony" class="btn btn--primary btn--small">
                Try Colony Simulator
              </NuxtLink>
            </template>
          </BaseCard>

          <BaseCard variant="elevated" class="feature-card">
            <template #header>
              <h3 class="feature-title">Component Library</h3>
            </template>

            <p class="feature-description">
              Explore a comprehensive set of Vue.js components built with TypeScript, featuring
              buttons, forms, cards, and interactive elements.
            </p>

            <template #footer>
              <NuxtLink to="/components" class="btn btn--primary btn--small">
                View Components
              </NuxtLink>
            </template>
          </BaseCard>

          <BaseCard variant="elevated" class="feature-card">
            <template #header>
              <h3 class="feature-title">Survival Guides</h3>
            </template>

            <p class="feature-description">
              Access detailed survival guides and tips for RimWorld, from beginner basics to
              advanced colony strategies.
            </p>

            <template #footer>
              <NuxtLink to="/guides" class="btn btn--primary btn--small"> Read Guides </NuxtLink>
            </template>
          </BaseCard>
        </div>
      </section>

      <!-- Quick Stats Section -->
      <section class="demo-section">
        <h2 class="section-title">Quick Colony Stats</h2>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ totalColonists }}</div>
            <div class="stat-label">Total Colonists Generated</div>
          </div>

          <div class="stat-card">
            <div class="stat-value">{{ availableSkills.length }}</div>
            <div class="stat-label">Available Skills</div>
          </div>

          <div class="stat-card">
            <div class="stat-value">{{ availableTraits.length }}</div>
            <div class="stat-label">Possible Traits</div>
          </div>

          <div class="stat-card">
            <div class="stat-value">∞</div>
            <div class="stat-label">Possible Combinations</div>
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

<style scoped>
.landing-page {
  @apply min-h-screen bg-gray-50;
}

.page-header {
  @apply text-center py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white;
}

.page-title {
  @apply text-5xl font-bold mb-6;
}

.page-description {
  @apply text-xl mb-8 max-w-3xl mx-auto px-4;
}

.page-actions {
  @apply flex gap-4 justify-center flex-wrap px-4;
}

.btn {
  @apply px-6 py-3 rounded-lg font-medium transition-all duration-200 no-underline inline-block;
}

.btn--primary {
  @apply bg-white text-blue-600 hover:bg-gray-100;
}

.btn--secondary {
  @apply bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600;
}

.btn--large {
  @apply px-8 py-4 text-lg;
}

.btn--small {
  @apply px-4 py-2 text-sm;
}

.demo-sections {
  @apply max-w-7xl mx-auto px-4 py-16 space-y-16;
}

.demo-section {
  @apply space-y-8;
}

.section-title {
  @apply text-3xl font-bold text-gray-800 text-center;
}

.generators-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6;
}

.features-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-8;
}

.feature-card {
  @apply h-full;
}

.feature-title {
  @apply text-xl font-bold text-gray-800;
}

.feature-description {
  @apply text-gray-600 leading-relaxed;
}

.stats-grid {
  @apply grid grid-cols-2 md:grid-cols-4 gap-6;
}

.stat-card {
  @apply bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200;
}

.stat-value {
  @apply text-3xl font-bold text-blue-600 mb-2;
}

.stat-label {
  @apply text-gray-600 text-sm font-medium;
}
</style>
