<template>
  <BaseCard variant="elevated" class="colonist-card">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold">{{ colonist.name }}</h3>
        <span :class="moodClass" class="mood-indicator">
          {{ colonist.mood }}
        </span>
      </div>
    </template>

    <div class="colonist-info">
      <div class="stats-grid">
        <div class="stat">
          <span class="stat-label">Age</span>
          <span class="stat-value">{{ colonist.age }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Health</span>
          <div class="health-bar">
            <div
              class="health-fill"
              :style="{ width: `${colonist.health}%` }"
              :class="healthBarClass"
            />
          </div>
        </div>
      </div>

      <div class="skills-section">
        <h4 class="skills-title">Skills</h4>
        <div class="skills-list">
          <div v-for="skill in topSkills" :key="skill.name" class="skill-item">
            <span class="skill-name">{{ skill.name }}</span>
            <div class="skill-level">
              <div class="skill-stars">
                <span
                  v-for="star in 10"
                  :key="star"
                  :class="['star', { 'star--filled': star <= skill.level }]"
                >
                  ★
                </span>
              </div>
              <span class="skill-number">{{ skill.level }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="traits-section">
        <h4 class="traits-title">Traits</h4>
        <div class="traits-list">
          <span v-for="trait in colonist.traits" :key="trait" class="trait-tag">
            {{ trait }}
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="actions">
        <BaseButton size="small" @click="assignTask"> Assign Task </BaseButton>
        <BaseButton size="small" variant="secondary" @click="viewDetails">
          View Details
        </BaseButton>
      </div>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
interface Skill {
  name: string
  level: number
}

interface Colonist {
  id: number
  name: string
  age: number
  health: number
  mood: string
  skills: Skill[]
  traits: string[]
}

interface Props {
  colonist: Colonist
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'assign-task': [colonist: Colonist]
  'view-details': [colonist: Colonist]
}>()

const moodClass = computed(() => ({
  'text-green-600': props.colonist.mood === 'Happy',
  'text-yellow-600': props.colonist.mood === 'Content',
  'text-orange-600': props.colonist.mood === 'Stressed',
  'text-red-600': props.colonist.mood === 'Breaking',
}))

const healthBarClass = computed(() => {
  const health = props.colonist.health
  if (health > 80) return 'bg-green-500'
  if (health > 60) return 'bg-yellow-500'
  if (health > 30) return 'bg-orange-500'
  return 'bg-red-500'
})

const topSkills = computed(() =>
  props.colonist.skills
    .slice()
    .sort((a, b) => b.level - a.level)
    .slice(0, 3)
)

const assignTask = () => {
  emit('assign-task', props.colonist)
}

const viewDetails = () => {
  emit('view-details', props.colonist)
}
</script>

<style scoped>
.colonist-card {
  @apply max-w-sm;
}

.mood-indicator {
  @apply px-2 py-1 rounded-full text-xs font-semibold;
}

.stats-grid {
  @apply grid grid-cols-2 gap-4 mb-4;
}

.stat {
  @apply flex flex-col;
}

.stat-label {
  @apply text-xs text-gray-500 font-medium;
}

.stat-value {
  @apply text-lg font-bold;
}

.health-bar {
  @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;
}

.health-fill {
  @apply h-full transition-all duration-300;
}

.skills-section,
.traits-section {
  @apply mb-4;
}

.skills-title,
.traits-title {
  @apply text-sm font-semibold text-gray-700 mb-2;
}

.skill-item {
  @apply flex items-center justify-between mb-1;
}

.skill-name {
  @apply text-sm;
}

.skill-level {
  @apply flex items-center gap-2;
}

.skill-stars {
  @apply flex gap-1;
}

.star {
  @apply text-xs text-gray-300;
}

.star--filled {
  @apply text-yellow-400;
}

.skill-number {
  @apply text-xs font-mono text-gray-600;
}

.traits-list {
  @apply flex flex-wrap gap-1;
}

.trait-tag {
  @apply px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full;
}

.actions {
  @apply flex gap-2;
}
</style>
