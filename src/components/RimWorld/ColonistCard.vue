<template>
  <BaseCard variant="elevated" class="max-w-sm">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold">{{ colonist.name }}</h3>
        <span :class="moodClass" class="px-2 py-1 rounded-full text-xs font-semibold">
          {{ colonist.mood }}
        </span>
      </div>
    </template>

    <div class="colonist-info">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="flex flex-col">
          <span class="text-xs text-gray-500 font-medium">Age</span>
          <span class="text-lg font-bold">{{ colonist.age }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-gray-500 font-medium">Health</span>
          <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-300"
              :style="{ width: `${colonist.health}%` }"
              :class="healthBarClass"
            />
          </div>
        </div>
      </div>

      <div class="mb-4">
        <h4 class="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
        <div class="space-y-1">
          <div
            v-for="skill in topSkills"
            :key="skill.name"
            class="flex items-center justify-between"
          >
            <span class="text-sm">{{ skill.name }}</span>
            <div class="flex items-center gap-2">
              <div class="flex gap-1">
                <span
                  v-for="star in 10"
                  :key="star"
                  :class="['text-xs', star <= skill.level ? 'text-yellow-400' : 'text-gray-300']"
                >
                  ★
                </span>
              </div>
              <span class="text-xs font-mono text-gray-600">{{ skill.level }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-4">
        <h4 class="text-sm font-semibold text-gray-700 mb-2">Traits</h4>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="trait in colonist.traits"
            :key="trait"
            class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
          >
            {{ trait }}
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-2">
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
