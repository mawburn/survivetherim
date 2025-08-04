<template>
  <div class="guides-page">
    <div class="page-header">
      <div class="header-content">
        <div class="breadcrumb">
          <NuxtLink to="/" class="breadcrumb-link">Home</NuxtLink>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">Guides</span>
        </div>

        <h1 class="page-title">Survival Guides</h1>
        <p class="page-description">Comprehensive RimWorld survival guides and tips</p>

        <div class="search-section">
          <div class="search-bar">
            <BaseInput
              v-model="searchQuery"
              placeholder="Search guides..."
              @input="performSearch"
            />
          </div>

          <div class="filters">
            <select v-model="selectedDifficulty" class="filter-select" @change="loadGuides">
              <option value="">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select v-model="selectedCategory" class="filter-select" @change="loadGuides">
              <option value="">All Categories</option>
              <option value="Basics">Basics</option>
              <option value="Combat">Combat</option>
              <option value="Production">Production</option>
              <option value="Research">Research</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="guides-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner" />
        <p>Loading guides...</p>
      </div>

      <!-- Guides Grid -->
      <div v-else-if="guides.length > 0" class="guides-grid">
        <BaseCard v-for="guide in guides" :key="guide.id" variant="elevated" class="guide-card">
          <template #header>
            <div class="guide-header">
              <h3 class="guide-title">{{ guide.title }}</h3>
              <div class="guide-meta">
                <span :class="getDifficultyClass(guide.difficulty)" class="difficulty-badge">
                  {{ guide.difficulty }}
                </span>
                <span class="category-badge">{{ guide.category }}</span>
              </div>
            </div>
          </template>

          <div class="guide-content">
            <p class="guide-description">{{ guide.description }}</p>

            <div v-if="guide.tags && guide.tags.length > 0" class="guide-tags">
              <span v-for="tag in guide.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>

          <template #footer>
            <div class="guide-actions">
              <NuxtLink :to="`/guides/${guide.slug}`" class="btn btn--primary btn--small">
                Read Guide
              </NuxtLink>
              <button class="btn btn--secondary btn--small" @click="toggleFavorite(guide)">
                {{ favorites.includes(guide.id) ? '★' : '☆' }}
                {{ favorites.includes(guide.id) ? 'Favorited' : 'Favorite' }}
              </button>
            </div>
          </template>
        </BaseCard>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-content">
          <h3 class="empty-title">No Guides Found</h3>
          <p class="empty-description">
            {{
              searchQuery
                ? 'Try adjusting your search terms or filters'
                : 'No guides available at the moment'
            }}
          </p>
          <BaseButton
            v-if="searchQuery || selectedDifficulty || selectedCategory"
            @click="clearFilters"
          >
            Clear Filters
          </BaseButton>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > pagination.limit" class="pagination">
        <BaseButton
          :disabled="pagination.offset === 0"
          variant="secondary"
          size="small"
          @click="loadPreviousPage"
        >
          Previous
        </BaseButton>

        <span class="pagination-info">
          {{ Math.floor(pagination.offset / pagination.limit) + 1 }} /
          {{ Math.ceil(pagination.total / pagination.limit) }}
        </span>

        <BaseButton
          :disabled="!pagination.hasMore"
          variant="secondary"
          size="small"
          @click="loadNextPage"
        >
          Next
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page metadata
useHead({
  title: 'Survival Guides - SurviveTheRim',
  meta: [{ name: 'description', content: 'Comprehensive RimWorld survival guides and tips' }],
})

interface Guide {
  id: number
  title: string
  slug: string
  description: string
  difficulty: string
  category: string
  tags: string[]
}

interface Pagination {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

// State
const guides = ref<Guide[]>([])
const loading = ref(false)
const searchQuery = ref('')
const selectedDifficulty = ref('')
const selectedCategory = ref('')
const favorites = ref<number[]>([])

const pagination = ref<Pagination>({
  total: 0,
  limit: 9,
  offset: 0,
  hasMore: false,
})

// Methods
const loadGuides = async () => {
  loading.value = true

  try {
    // Simulate API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock data for demonstration
    const mockGuides: Guide[] = [
      {
        id: 1,
        title: 'Getting Started in RimWorld',
        slug: 'getting-started',
        description: "A comprehensive beginner's guide to surviving your first colony.",
        difficulty: 'Beginner',
        category: 'Basics',
        tags: ['survival', 'basics', 'tutorial'],
      },
      {
        id: 2,
        title: 'Advanced Base Defense',
        slug: 'base-defense',
        description: 'Learn how to protect your colony from raids and threats.',
        difficulty: 'Advanced',
        category: 'Combat',
        tags: ['defense', 'combat', 'strategy'],
      },
      {
        id: 3,
        title: 'Food Production and Storage',
        slug: 'food-production',
        description: 'Master the art of keeping your colonists fed.',
        difficulty: 'Intermediate',
        category: 'Production',
        tags: ['food', 'farming', 'storage'],
      },
      {
        id: 4,
        title: 'Research Priorities',
        slug: 'research-priorities',
        description: 'Optimize your research path for maximum efficiency.',
        difficulty: 'Intermediate',
        category: 'Research',
        tags: ['research', 'technology', 'strategy'],
      },
      {
        id: 5,
        title: 'Managing Colonist Mood',
        slug: 'managing-mood',
        description: 'Keep your colonists happy and productive.',
        difficulty: 'Beginner',
        category: 'Basics',
        tags: ['mood', 'happiness', 'management'],
      },
      {
        id: 6,
        title: 'Advanced Combat Tactics',
        slug: 'combat-tactics',
        description: 'Master advanced combat strategies and formations.',
        difficulty: 'Advanced',
        category: 'Combat',
        tags: ['combat', 'tactics', 'warfare'],
      },
    ]

    // Apply filters
    let filteredGuides = mockGuides

    if (selectedDifficulty.value) {
      filteredGuides = filteredGuides.filter(g => g.difficulty === selectedDifficulty.value)
    }

    if (selectedCategory.value) {
      filteredGuides = filteredGuides.filter(g => g.category === selectedCategory.value)
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filteredGuides = filteredGuides.filter(
        g =>
          g.title.toLowerCase().includes(query) ||
          g.description.toLowerCase().includes(query) ||
          g.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    guides.value = filteredGuides
    pagination.value = {
      total: filteredGuides.length,
      limit: 9,
      offset: 0,
      hasMore: false,
    }
  } catch (error) {
    console.error('Failed to load guides:', error)
  } finally {
    loading.value = false
  }
}

const performSearch = (() => {
  let timeoutId: NodeJS.Timeout
  return () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      loadGuides()
    }, 300)
  }
})()

const clearFilters = () => {
  searchQuery.value = ''
  selectedDifficulty.value = ''
  selectedCategory.value = ''
  loadGuides()
}

const loadPreviousPage = () => {
  if (pagination.value.offset > 0) {
    pagination.value.offset -= pagination.value.limit
    loadGuides()
  }
}

const loadNextPage = () => {
  if (pagination.value.hasMore) {
    pagination.value.offset += pagination.value.limit
    loadGuides()
  }
}

const toggleFavorite = (guide: Guide) => {
  const index = favorites.value.indexOf(guide.id)
  if (index > -1) {
    favorites.value.splice(index, 1)
  } else {
    favorites.value.push(guide.id)
  }

  // Persist to localStorage
  localStorage.setItem('guide-favorites', JSON.stringify(favorites.value))
}

const getDifficultyClass = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'difficulty-beginner'
    case 'Intermediate':
      return 'difficulty-intermediate'
    case 'Advanced':
      return 'difficulty-advanced'
    default:
      return 'difficulty-default'
  }
}

// Load favorites from localStorage
onMounted(() => {
  const savedFavorites = localStorage.getItem('guide-favorites')
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites)
  }

  loadGuides()
})
</script>

<style scoped>
.guides-page {
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

.search-section {
  @apply max-w-2xl mx-auto space-y-4;
}

.search-bar {
  @apply w-full;
}

.filters {
  @apply flex gap-4 justify-center flex-wrap;
}

.filter-select {
  @apply px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500;
}

.guides-content {
  @apply max-w-7xl mx-auto p-8;
}

.loading-state {
  @apply text-center py-16;
}

.loading-spinner {
  @apply w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4;
}

.guides-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8;
}

.guide-card {
  @apply h-full flex flex-col;
}

.guide-header {
  @apply space-y-2;
}

.guide-title {
  @apply text-lg font-semibold text-gray-900;
}

.guide-meta {
  @apply flex items-center gap-2;
}

.difficulty-badge {
  @apply px-2 py-1 text-xs font-medium rounded-full;
}

.difficulty-beginner {
  @apply bg-green-100 text-green-800;
}

.difficulty-intermediate {
  @apply bg-yellow-100 text-yellow-800;
}

.difficulty-advanced {
  @apply bg-red-100 text-red-800;
}

.category-badge {
  @apply px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full;
}

.guide-content {
  @apply flex-1 space-y-3;
}

.guide-description {
  @apply text-gray-600 text-sm leading-relaxed;
}

.guide-tags {
  @apply flex flex-wrap gap-1;
}

.tag {
  @apply px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded;
}

.guide-actions {
  @apply flex gap-2;
}

.btn {
  @apply px-3 py-2 rounded font-medium transition-colors no-underline text-center;
}

.btn--primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.btn--secondary {
  @apply bg-gray-200 text-gray-800 hover:bg-gray-300;
}

.btn--small {
  @apply text-sm px-3 py-1;
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

.pagination {
  @apply flex items-center justify-center gap-4;
}

.pagination-info {
  @apply text-sm text-gray-600;
}
</style>
